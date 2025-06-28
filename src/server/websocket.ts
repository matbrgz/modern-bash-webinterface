// Enhanced WebSocket implementation for Bun with error handling
export class WSServer {
  private clients = new Set<any>();
  private port: number;
  private server: any;
  private isRunning = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(port: number = 3001) {
    this.port = port;
    this.startWebSocketServer();
  }

  private startWebSocketServer() {
    try {
      this.server = Bun.serve({
        port: this.port,
        fetch: (req, server) => {
          const success = server.upgrade(req, {
            data: { 
              connectedAt: Date.now(),
              id: Math.random().toString(36).substr(2, 9)
            }
          });
          
          if (success) {
            return; // Successfully upgraded to WebSocket
          }
          
          // Handle HTTP requests
          const url = new URL(req.url);
          if (url.pathname === '/status') {
            return new Response(JSON.stringify({
              status: 'running',
              clients: this.clients.size,
              port: this.port,
              uptime: Date.now() - (this.server?.startTime || Date.now())
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response("ShellUI WebSocket Server Ready", { 
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
          });
        },
        websocket: {
          message: (ws, message) => {
            try {
              const data = JSON.parse(message as string);
              console.log(`[WS] Message from client ${ws.data?.id}:`, data.type || 'unknown');
              
              // Handle ping/pong for connection health
              if (data.type === 'ping') {
                this.sendToClient(ws, { type: 'pong', timestamp: Date.now() });
              }
              
            } catch (error) {
              console.error('[WS] Invalid message format:', error);
              this.sendToClient(ws, { 
                type: 'error', 
                message: 'Invalid message format' 
              });
            }
          },
          
          open: (ws) => {
            console.log(`[WS] Client connected: ${ws.data?.id} (total: ${this.clients.size + 1})`);
            this.clients.add(ws);
            
            // Send welcome message with server info
            this.sendToClient(ws, {
              type: 'welcome',
              message: 'Connected to ShellUI WebSocket server',
              clientId: ws.data?.id,
              serverPort: this.port,
              timestamp: Date.now()
            });
          },
          
          close: (ws, code, message) => {
            console.log(`[WS] Client disconnected: ${ws.data?.id} (code: ${code})`);
            this.clients.delete(ws);
          },
          
          error: (ws, error) => {
            console.error(`[WS] Client error ${ws.data?.id}:`, error);
            this.clients.delete(ws);
          }
        }
      });
      
      this.server.startTime = Date.now();
      this.isRunning = true;
      this.reconnectAttempts = 0;
      
      console.log(`🔌 WebSocket server started on port ${this.port}`);
      
    } catch (error) {
      console.error(`[WS] Failed to start on port ${this.port}:`, error);
      this.isRunning = false;
      
      // Try next port if current one is in use
      if (error.code === 'EADDRINUSE' && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.port++;
        this.reconnectAttempts++;
        console.log(`[WS] Trying port ${this.port}... (attempt ${this.reconnectAttempts})`);
        setTimeout(() => this.startWebSocketServer(), 1000);
      } else {
        console.error('[WS] Max reconnection attempts reached or unrecoverable error');
      }
    }
  }

  private sendToClient(ws: any, data: any): boolean {
    try {
      ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`[WS] Failed to send to client ${ws.data?.id}:`, error);
      this.clients.delete(ws);
      return false;
    }
  }

  broadcast(data: any): number {
    if (!this.isRunning || this.clients.size === 0) {
      return 0;
    }

    const message = JSON.stringify(data);
    let successCount = 0;
    const deadClients = new Set();

    this.clients.forEach(ws => {
      try {
        ws.send(message);
        successCount++;
      } catch (error) {
        console.error(`[WS] Broadcast failed to client ${ws.data?.id}:`, error);
        deadClients.add(ws);
      }
    });

    // Clean up dead connections
    deadClients.forEach(ws => this.clients.delete(ws));

    if (data.type !== 'output') { // Avoid spam for output messages
      console.log(`[WS] Broadcast '${data.type}' to ${successCount} clients`);
    }

    return successCount;
  }

  getClientsCount(): number {
    return this.clients.size;
  }
  
  getPort(): number {
    return this.port;
  }

  isServerRunning(): boolean {
    return this.isRunning;
  }

  getServerInfo() {
    return {
      port: this.port,
      clients: this.clients.size,
      isRunning: this.isRunning,
      uptime: this.server?.startTime ? Date.now() - this.server.startTime : 0
    };
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:${this.port}/status`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Graceful shutdown
  stop() {
    if (this.server) {
      console.log('[WS] Shutting down WebSocket server...');
      
      // Notify all clients
      this.broadcast({
        type: 'server_shutdown',
        message: 'Server is shutting down',
        timestamp: Date.now()
      });

      // Close all client connections
      this.clients.forEach(ws => {
        try {
          ws.close();
        } catch (error) {
          console.error('[WS] Error closing client connection:', error);
        }
      });

      this.clients.clear();
      this.server.stop();
      this.isRunning = false;
      console.log('[WS] WebSocket server stopped');
    }
  }
}

// Singleton instance for global access
let wsSingleton: WSServer | null = null;

/**
 * Start (or retrieve) the global WebSocket server.
 * Returns the port the server is listening on.
 */
export async function setupWebSocketServer(startPort: number = 3001): Promise<number> {
  if (!wsSingleton) {
    wsSingleton = new WSServer(startPort);
  }
  return wsSingleton.getPort();
}

/**
 * Broadcast a message to all connected WebSocket clients.
 * Used by other server modules (e.g., command execution) to push real-time updates.
 */
export function broadcastToClients(data: any): number {
  if (!wsSingleton) {
    console.warn('[WS] broadcastToClients called before server initialization');
    return 0;
  }
  return wsSingleton.broadcast(data);
}

/**
 * Get current WebSocket status info for API exposure.
 */
export function getWebSocketStatus() {
  if (!wsSingleton) {
    return {
      connected: 0,
      available: false,
      port: null
    };
  }
  return {
    connected: wsSingleton.getClientsCount(),
    available: wsSingleton.isServerRunning(),
    port: wsSingleton.getPort(),
  };
} 
