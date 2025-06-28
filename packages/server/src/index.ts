import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { jwt } from '@elysiajs/jwt';
import { loadConfig } from './utils/config';
import { configRoutes } from './routes/config';
import { commandsRoute } from './routes/commands';
import { authRoutes } from './routes/auth';
import { historyRoutes } from './routes/history';
import { setupWebSocketServer } from './websocket';
import { ExecutionStorage } from './utils/storage';
import { existsSync } from 'fs';
import { join } from 'path';

const PORT = process.env.PORT || 3000;

async function startServer() {
  console.log('🚀 Starting ShellUI Server...');
  
  // Initialize execution storage
  const storage = ExecutionStorage.getInstance();
  await storage.initialize();

  // Load configuration
  const config = await loadConfig();
  console.log(`📋 Loaded ${config.commands.length} commands`);

  // Setup WebSocket server first
  const wsPort = await setupWebSocketServer();
  console.log(`🔌 WebSocket server started on port ${wsPort}`);

  // Create main server
  const app = new Elysia()
    .use(cors({
      origin: true,
      credentials: true,
    }))
    // Serve frontend only if the build folder exists (production)
    .use((() => {
      const distPath = join(process.cwd(), 'src', 'client', 'dist');
      if (existsSync(distPath)) {
        return staticPlugin({
          assets: distPath,
          prefix: '/',
        });
      }
      return (app: any) => app; // no-op plugin in dev mode
    })())
    .use(jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'super-secret-key-change-in-production',
    }))
    .state('config', config)
    .get('/health', () => ({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0'
    }))
    .use(configRoutes)
    .use(authRoutes)
    .use(commandsRoute)
    .use(historyRoutes)
    .onError(({ error, code, set }) => {
      console.error('Server error:', error);
      
      if (code === 'NOT_FOUND') {
        set.status = 404;
        return { error: 'Not found' };
      }
      
      if (code === 'VALIDATION') {
        set.status = 400;
        return { error: 'Validation error', details: error.message };
      }
      
      set.status = 500;
      return { error: 'Internal server error' };
    })
    .listen(PORT);

  console.log(`🌟 ShellUI Server running on http://localhost:${PORT}`);
  console.log('📱 Frontend available at the same URL');
  console.log('🔗 API available at /api/*');

  // Graceful shutdown handling
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}, gracefully shutting down...`);
    
    try {
      // Save execution history
      console.log('💾 Saving execution history...');
      await storage.cleanup();
      
      // Close the server
      console.log('🔒 Closing server...');
      app.stop();
      
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
  });

  return app;
}

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export type App = typeof app; 
