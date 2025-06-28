import { Elysia } from 'elysia';
import type { Config } from '../../types';

export const configRoutes = new Elysia({ prefix: '/api/config' })
  .derive(({ store }) => ({
    config: store.config as Config,
  }))
  .get('/', ({ config }) => {
    return {
      title: config.title,
      theme: config.theme,
      features: config.features || {
        auto_help: false,
        show_command_help: false,
        visual_param_builder: false
      },
      authEnabled: config.auth?.enabled || false,
      commands: config.commands.map(cmd => ({
        ...cmd,
        // Remove sensitive info from public API
        acl: undefined,
      })),
    };
  })
  .get('/commands', ({ config }) => {
    return config.commands.map(cmd => ({
      id: cmd.id,
      title: cmd.title,
      description: cmd.description,
      icon: cmd.icon,
      category: cmd.category,
      args: cmd.args,
      confirm: cmd.confirm,
      help_command: cmd.help_command,
      auto_help: cmd.auto_help,
      timeout: cmd.timeout,
      hasHelp: !!(cmd.help_command || cmd.auto_help)
    }));
  })
  .get('/commands/by-category', ({ config }) => {
    const categorized: Record<string, any[]> = {};
    
    config.commands.forEach(cmd => {
      const category = cmd.category || 'Other';
      if (!categorized[category]) {
        categorized[category] = [];
      }
      
      categorized[category].push({
        id: cmd.id,
        title: cmd.title,
        description: cmd.description,
        icon: cmd.icon,
        args: cmd.args,
        confirm: cmd.confirm,
        hasHelp: !!(cmd.help_command || cmd.auto_help),
        timeout: cmd.timeout
      });
    });
    
    return categorized;
  })
  .get('/features', ({ config }) => {
    return {
      features: config.features || {
        auto_help: false,
        show_command_help: false,
        visual_param_builder: false
      },
      capabilities: {
        websocket: true,
        real_time_output: true,
        command_validation: true,
        auto_help: true,
        visual_param_builder: true
      }
    };
  }); 
