import { Elysia, t } from 'elysia';
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import { loadConfig } from '../utils/config';
import { broadcastToClients } from '../websocket';
import { CommandExecution } from '../../types';
import { ExecutionStorage } from '../utils/storage';

const storage = ExecutionStorage.getInstance();

export const commandsRoute = new Elysia({ prefix: '/api/commands' })
  .post('/:id/execute', async ({ params, body, set }) => {
    const { id } = params;
    const { args } = body as { args?: Record<string, any> };

    const config = await loadConfig();
    const command = config.commands.find(cmd => cmd.id === id);

    if (!command) {
      set.status = 404;
      return { error: 'Command not found' };
    }

    const executionId = randomUUID();
    const execution: CommandExecution = {
      id: executionId,
      commandId: id,
      status: 'running',
      output: '',
      args: args || {},
      startedAt: new Date(),
    };

    // Prepare command with argument substitution
    let processedCommand = command.command;
    if (args) {
      for (const [key, value] of Object.entries(args)) {
        const placeholder = `{{ ${key} }}`;
        processedCommand = processedCommand.replaceAll(placeholder, String(value));
      }
    }

    // Store execution
    storage.addExecution(execution);

    // Broadcast command start immediately
    broadcastToClients({
      type: 'command_started',
      executionId,
      commandId: id,
      command: processedCommand,
      timestamp: new Date().toISOString(),
    });

    try {
      const childProcess = spawn(command.shell || '/bin/bash', ['-c', processedCommand], {
        env: {
          ...process.env,
          COMMAND_ID: id,
          EXECUTION_ID: executionId,
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let output = '';
      let error = '';

      childProcess.stdout?.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        
        // Update stored execution
        storage.updateExecution(executionId, { output });

        // Broadcast to WebSocket clients
        broadcastToClients({
          type: 'output',
          executionId,
          data: chunk,
          timestamp: new Date().toISOString(),
        });
      });

      childProcess.stderr?.on('data', (data) => {
        const chunk = data.toString();
        error += chunk;
        
        // Update stored execution
        storage.updateExecution(executionId, { error });

        // Broadcast to WebSocket clients
        broadcastToClients({
          type: 'error',
          executionId,
          data: chunk,
          timestamp: new Date().toISOString(),
        });
      });

      childProcess.on('close', (code) => {
        const finishedAt = new Date();
        const duration = finishedAt.getTime() - execution.startedAt.getTime();
        const status = code === 0 ? 'success' : 'error';

        // Update stored execution
        storage.updateExecution(executionId, {
          status,
          exitCode: code || 0,
          finishedAt,
          output,
          error,
        });

        // Add a small delay to ensure clients have time to subscribe
        setTimeout(() => {
          // Broadcast completion
          broadcastToClients({
            type: 'complete',
            executionId,
            status,
            exitCode: code || 0,
            duration,
            timestamp: finishedAt.toISOString(),
          });
        }, 100); // 100ms delay

        console.log(`✅ Command ${id} completed with exit code ${code} in ${duration}ms`);
      });

      // Handle timeout
      if (command.timeout) {
        setTimeout(() => {
          if (!childProcess.killed) {
            childProcess.kill('SIGTERM');
            storage.updateExecution(executionId, {
              status: 'error',
              error: error + '\n[TIMEOUT] Command execution timed out',
              finishedAt: new Date(),
            });

            broadcastToClients({
              type: 'complete',
              executionId,
              status: 'error',
              exitCode: 124, // Standard timeout exit code
              duration: command.timeout,
              timestamp: new Date().toISOString(),
            });
          }
        }, command.timeout);
      }

      console.log(`🚀 Started command ${id} with execution ID ${executionId}`);
      
      return {
        executionId,
        status: 'started',
        message: 'Command execution started'
      };

    } catch (error) {
      console.error(`❌ Failed to execute command ${id}:`, error);
      
      storage.updateExecution(executionId, {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        finishedAt: new Date(),
      });

      set.status = 500;
      return { error: 'Failed to execute command' };
    }
  }, {
    body: t.Object({
      args: t.Optional(t.Record(t.String(), t.Any()))
    })
  })

  .get('/executions', async () => {
    const executions = storage.getAllExecutions();
    return executions;
  })

  .get('/executions/:id', async ({ params, set }) => {
    const execution = storage.getExecution(params.id);
    if (!execution) {
      set.status = 404;
      return { error: 'Execution not found' };
    }
    return execution;
  })

  .get('/executions/command/:commandId', async ({ params }) => {
    const executions = storage.getExecutionsByCommand(params.commandId);
    return executions;
  })

  .get('/stats', async () => {
    const stats = storage.getStats();
    return {
      ...stats,
      storage: {
        initialized: true,
        file: 'data/executions.json'
      }
    };
  })

  .get('/:id/help', async ({ params, set }) => {
    const { id } = params;
    const config = await loadConfig();
    const command = config.commands.find(cmd => cmd.id === id);

    if (!command) {
      set.status = 404;
      return { error: 'Command not found' };
    }

    if (!command.help_command) {
      return {
        commandId: id,
        helpOutput: 'No help available for this command',
        available: false,
        generatedAt: new Date().toISOString()
      };
    }

    try {
      const helpProcess = spawn(command.shell || '/bin/bash', ['-c', command.help_command], {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 10000, // 10 second timeout for help
      });

      let helpOutput = '';
      let helpError = '';

      helpProcess.stdout?.on('data', (data) => {
        helpOutput += data.toString();
      });

      helpProcess.stderr?.on('data', (data) => {
        helpError += data.toString();
      });

      await new Promise((resolve, reject) => {
        helpProcess.on('close', (code) => {
          if (code === 0) {
            resolve(code);
          } else {
            reject(new Error(`Help command failed with exit code ${code}`));
          }
        });

        helpProcess.on('error', reject);
      });

      return {
        commandId: id,
        helpOutput: helpOutput || helpError || 'Help command executed but produced no output',
        available: true,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Failed to get help for command ${id}:`, error);
      return {
        commandId: id,
        helpOutput: `Error generating help: ${error instanceof Error ? error.message : String(error)}`,
        available: false,
        generatedAt: new Date().toISOString()
      };
    }
  })

  .get('/validate-args/:id', async ({ params, query, set }) => {
    const { id } = params;
    const config = await loadConfig();
    const command = config.commands.find(cmd => cmd.id === id);

    if (!command) {
      set.status = 404;
      return { error: 'Command not found' };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    if (command.args) {
      for (const arg of command.args) {
        const value = query[arg.name];

        // Check required fields
        if (arg.required && (value === undefined || value === '')) {
          errors.push(`${arg.label || arg.name} is required`);
          continue;
        }

        // Skip validation if no value provided for optional field
        if (value === undefined || value === '') continue;

        // Type validation
        if (arg.type === 'number') {
          const num = Number(value);
          if (isNaN(num)) {
            errors.push(`${arg.label || arg.name} must be a number`);
          } else {
            if (arg.min !== undefined && num < arg.min) {
              errors.push(`${arg.label || arg.name} must be at least ${arg.min}`);
            }
            if (arg.max !== undefined && num > arg.max) {
              errors.push(`${arg.label || arg.name} must be at most ${arg.max}`);
            }
          }
        }

        // Pattern validation
        if (arg.pattern && typeof value === 'string') {
          const regex = new RegExp(arg.pattern);
          if (!regex.test(value)) {
            errors.push(`${arg.label || arg.name} format is invalid`);
          }
        }

        // Select validation
        if (arg.type === 'select' && arg.options) {
          const validValues = arg.options.map(opt => opt.value);
          if (!validValues.includes(value as string)) {
            errors.push(`${arg.label || arg.name} must be one of: ${validValues.join(', ')}`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  })

  .get('/bulk-help', async () => {
    const config = await loadConfig();
    const commandsWithHelp = config.commands.filter(cmd => cmd.help_command);
    
    const helpData = await Promise.allSettled(
      commandsWithHelp.map(async (command) => {
        try {
          const helpProcess = spawn(command.shell || '/bin/bash', ['-c', command.help_command!], {
            stdio: ['pipe', 'pipe', 'pipe'],
            timeout: 5000,
          });

          let helpOutput = '';

          helpProcess.stdout?.on('data', (data) => {
            helpOutput += data.toString();
          });

          await new Promise((resolve, reject) => {
            helpProcess.on('close', resolve);
            helpProcess.on('error', reject);
          });

          return {
            commandId: command.id,
            helpOutput: helpOutput || 'No output',
            available: true
          };
        } catch {
          return {
            commandId: command.id,
            helpOutput: 'Help not available',
            available: false
          };
        }
      })
    );

    return helpData.map((result, index) => ({
      ...((result.status === 'fulfilled' ? result.value : {
        commandId: commandsWithHelp[index].id,
        helpOutput: 'Failed to load help',
        available: false
      })),
      generatedAt: new Date().toISOString()
    }));
  })

  .get('/ws-status', async () => {
    const { getWebSocketStatus } = await import('../websocket');
    return getWebSocketStatus();
  }); 
