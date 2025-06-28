import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { TerminalCommand } from '@/components/ui/terminal-converter';

interface UseTerminalCommandsOptions {
  onCommandStart?: (command: TerminalCommand) => void;
  onCommandOutput?: (commandId: string, output: string) => void;
  onCommandError?: (commandId: string, error: string) => void;
  onCommandComplete?: (command: TerminalCommand) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export const useTerminalCommands = (options: UseTerminalCommandsOptions = {}) => {
  const {
    onCommandStart,
    onCommandOutput,
    onCommandError,
    onCommandComplete,
    autoReconnect = true,
    reconnectInterval = 5000
  } = options;

  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [wsPort, setWsPort] = useState<number>(0);
  const [wsClients, setWsClients] = useState<number>(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setWsStatus('connecting');
    
    // Get WebSocket port from server first
    fetch('/api/commands/ws-status')
      .then(response => response.json())
      .then(wsInfo => {
        if (!wsInfo.port) {
          throw new Error('WebSocket server not available');
        }
        
        const ws = new WebSocket(`ws://localhost:${wsInfo.port}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected successfully');
          setWsStatus('connected');
          setWsPort(wsInfo.port);
          
          // Clear any pending reconnect
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('[WS] Received message:', data);
            
            handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setWsStatus('disconnected');
          
          // Auto-reconnect if enabled
          if (autoReconnect && !reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('Attempting to reconnect...');
              connectWebSocket();
            }, reconnectInterval);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsStatus('disconnected');
        };
      })
      .catch(error => {
        console.error('Failed to get WebSocket port:', error);
        setWsStatus('disconnected');
        
        // Retry after delay
        if (autoReconnect && !reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Retrying WebSocket connection...');
            connectWebSocket();
          }, reconnectInterval);
        }
      });
  }, [autoReconnect, reconnectInterval]);

  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'welcome':
        setWsPort(data.serverPort || 0);
        setWsClients(1);
        break;
        
      case 'subscribed':
        console.log('Subscribed to execution:', data.executionId);
        break;
        
      case 'output':
        setCommands(prev => prev.map(cmd => 
          cmd.id === data.executionId 
            ? { ...cmd, output: (cmd.output || '') + (data.data || '') }
            : cmd
        ));
        onCommandOutput?.(data.executionId, data.data || '');
        break;
        
      case 'error':
        setCommands(prev => prev.map(cmd => 
          cmd.id === data.executionId 
            ? { ...cmd, error: (cmd.error || '') + (data.data || '') }
            : cmd
        ));
        onCommandError?.(data.executionId, data.data || '');
        break;
        
      case 'complete':
        setCommands(prev => prev.map(cmd => 
          cmd.id === data.executionId 
            ? {
                ...cmd,
                status: data.status === 'success' ? 'success' : 'error',
                endTime: new Date(),
                exitCode: data.exitCode
              }
            : cmd
        ));
        
        const completedCommand = commands.find(cmd => cmd.id === data.executionId);
        if (completedCommand) {
          const updatedCommand = {
            ...completedCommand,
            status: data.status === 'success' ? 'success' : 'error',
            endTime: new Date(),
            exitCode: data.exitCode
          };
          onCommandComplete?.(updatedCommand);
        }
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  }, [commands, onCommandStart, onCommandOutput, onCommandError, onCommandComplete]);

  const executeCommand = useCallback(async (commandStr: string, args?: Record<string, any>) => {
    try {
      // For now, we'll use a simple approach - you might want to enhance this
      // to work with the actual command configuration
      const response = await fetch('/api/commands/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command: commandStr,
          args: args || {}
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute command');
      }
      
      const result = await response.json();
      toast.info('Executing command...');
      return result.executionId;
    } catch (error) {
      console.error('Error executing command:', error);
      toast.error('Failed to execute command');
      return null;
    }
  }, []);

  const stopCommand = useCallback((commandId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = {
        type: 'stop_command',
        commandId: commandId
      };
      wsRef.current.send(JSON.stringify(message));
      
      setCommands(prev => prev.map(cmd => 
        cmd.id === commandId 
          ? { ...cmd, status: 'error', endTime: new Date() }
          : cmd
      ));
      
      toast.warning('Command stopped');
    }
  }, []);

  const clearCommands = useCallback(() => {
    setCommands([]);
  }, []);

  const removeCommand = useCallback((commandId: string) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== commandId));
  }, []);

  const getCommand = useCallback((commandId: string) => {
    return commands.find(cmd => cmd.id === commandId);
  }, [commands]);

  const getRunningCommands = useCallback(() => {
    return commands.filter(cmd => cmd.status === 'running');
  }, [commands]);

  const getCompletedCommands = useCallback(() => {
    return commands.filter(cmd => cmd.status === 'success' || cmd.status === 'error');
  }, [commands]);

  const getSuccessRate = useCallback(() => {
    const completed = getCompletedCommands();
    if (completed.length === 0) return 0;
    
    const successful = completed.filter(cmd => cmd.status === 'success').length;
    return Math.round((successful / completed.length) * 100);
  }, [getCompletedCommands]);

  // Connect on mount
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  return {
    // State
    commands,
    wsStatus,
    wsPort,
    wsClients,
    
    // Actions
    executeCommand,
    stopCommand,
    clearCommands,
    removeCommand,
    connectWebSocket,
    
    // Queries
    getCommand,
    getRunningCommands,
    getCompletedCommands,
    getSuccessRate,
    
    // Computed
    isConnected: wsStatus === 'connected',
    hasRunningCommands: commands.some(cmd => cmd.status === 'running'),
    totalCommands: commands.length,
    successfulCommands: commands.filter(cmd => cmd.status === 'success').length,
    failedCommands: commands.filter(cmd => cmd.status === 'error').length
  };
}; 
