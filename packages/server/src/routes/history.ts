import { Elysia } from 'elysia';
import { ExecutionStorage } from '../utils/storage';
import { loadConfig } from '../utils/config';

export const historyRoutes = new Elysia({ prefix: '/api/history' })
  .get('/', async () => {
    try {
      const storage = ExecutionStorage.getInstance();
      const config = await loadConfig();
      const history = await storage.getHistory();
      
      return history.map(item => {
        // Find the command configuration to get the command template
        const commandConfig = config.commands.find(cmd => cmd.id === item.commandId);
        const commandTemplate = commandConfig?.command || item.commandId;
        
        // Construct the actual command string by replacing placeholders with args
        let commandString = commandTemplate;
        if (item.args) {
          for (const [key, value] of Object.entries(item.args)) {
            const placeholder = `{{ ${key} }}`;
            commandString = commandString.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
          }
        }
        
        return {
          id: item.id,
          command: commandString,
          output: item.output,
          error: item.error,
          status: item.status,
          startedAt: item.startedAt.toISOString(),
          finishedAt: item.finishedAt?.toISOString() || null,
          duration: item.finishedAt ? Math.round((item.finishedAt.getTime() - item.startedAt.getTime()) / 1000) : 0,
          exitCode: item.exitCode
        };
      });
    } catch (error) {
      console.error('Error fetching history:', error);
      throw new Error('Failed to fetch history');
    }
  })
  .delete('/:id', async ({ params }) => {
    try {
      const storage = ExecutionStorage.getInstance();
      const success = await storage.removeFromHistory(params.id);
      
      if (!success) {
        throw new Error('History item not found');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting history item:', error);
      throw new Error('Failed to delete history item');
    }
  }); 
