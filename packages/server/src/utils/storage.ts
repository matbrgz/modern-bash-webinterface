import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type { CommandExecution } from '../../types';

const STORAGE_DIR = join(process.cwd(), 'data');
const EXECUTIONS_FILE = join(STORAGE_DIR, 'executions.json');
const MAX_EXECUTIONS = 1000; // Keep last 1000 executions

interface StoredExecution extends Omit<CommandExecution, 'startedAt' | 'finishedAt'> {
  startedAt: string;
  finishedAt?: string;
}

export class ExecutionStorage {
  private static instance: ExecutionStorage;
  private executions: Map<string, CommandExecution> = new Map();
  private initialized = false;

  static getInstance(): ExecutionStorage {
    if (!ExecutionStorage.instance) {
      ExecutionStorage.instance = new ExecutionStorage();
    }
    return ExecutionStorage.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Ensure storage directory exists
      if (!existsSync(STORAGE_DIR)) {
        await mkdir(STORAGE_DIR, { recursive: true });
        console.log('📁 Created storage directory:', STORAGE_DIR);
      }

      // Load existing executions
      await this.loadExecutions();
      this.initialized = true;
      console.log(`📚 Loaded ${this.executions.size} execution records`);
    } catch (error) {
      console.error('Failed to initialize execution storage:', error);
    }
  }

  private async loadExecutions(): Promise<void> {
    try {
      if (existsSync(EXECUTIONS_FILE)) {
        const data = await readFile(EXECUTIONS_FILE, 'utf-8');
        const storedExecutions: StoredExecution[] = JSON.parse(data);
        
        for (const stored of storedExecutions) {
          const execution: CommandExecution = {
            ...stored,
            startedAt: new Date(stored.startedAt),
            finishedAt: stored.finishedAt ? new Date(stored.finishedAt) : undefined
          };
          this.executions.set(stored.id, execution);
        }
      }
    } catch (error) {
      console.error('Failed to load executions:', error);
      // Start with empty executions if loading fails
      this.executions.clear();
    }
  }

  async saveExecutions(): Promise<void> {
    try {
      const storedExecutions: StoredExecution[] = Array.from(this.executions.values()).map(exec => ({
        ...exec,
        startedAt: exec.startedAt.toISOString(),
        finishedAt: exec.finishedAt?.toISOString()
      }));

      // Keep only the most recent executions
      storedExecutions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
      const toSave = storedExecutions.slice(0, MAX_EXECUTIONS);

      await writeFile(EXECUTIONS_FILE, JSON.stringify(toSave, null, 2));
    } catch (error) {
      console.error('Failed to save executions:', error);
    }
  }

  addExecution(execution: CommandExecution): void {
    this.executions.set(execution.id, execution);
    
    // Auto-save after adding (debounced)
    this.debouncedSave();
  }

  updateExecution(id: string, updates: Partial<CommandExecution>): void {
    const existing = this.executions.get(id);
    if (existing) {
      const updated = { ...existing, ...updates };
      this.executions.set(id, updated);
      this.debouncedSave();
    }
  }

  getExecution(id: string): CommandExecution | undefined {
    return this.executions.get(id);
  }

  getAllExecutions(): CommandExecution[] {
    return Array.from(this.executions.values())
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, 100); // Return last 100 for API
  }

  getExecutionsByCommand(commandId: string): CommandExecution[] {
    return Array.from(this.executions.values())
      .filter(exec => exec.commandId === commandId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, 20);
  }

  private saveTimeout: NodeJS.Timeout | null = null;
  
  private debouncedSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.saveExecutions();
    }, 2000); // Save 2 seconds after last update
  }

  async cleanup(): Promise<void> {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    await this.saveExecutions();
  }

  // Statistics
  getStats() {
    const executions = Array.from(this.executions.values());
    const total = executions.length;
    const successful = executions.filter(e => e.status === 'success').length;
    const failed = executions.filter(e => e.status === 'error').length;
    const running = executions.filter(e => e.status === 'running').length;

    const byCommand = executions.reduce((acc, exec) => {
      acc[exec.commandId] = (acc[exec.commandId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      successful,
      failed,
      running,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      byCommand
    };
  }

  // History methods
  async getHistory(): Promise<CommandExecution[]> {
    return Array.from(this.executions.values())
      .filter(exec => exec.status === 'success' || exec.status === 'error')
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, 100); // Return last 100 history items
  }

  async removeFromHistory(id: string): Promise<boolean> {
    const exists = this.executions.has(id);
    if (exists) {
      this.executions.delete(id);
      this.debouncedSave();
    }
    return exists;
  }
} 
