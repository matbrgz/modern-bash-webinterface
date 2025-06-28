import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Play, Loader2, RefreshCw, HelpCircle, Copy, Download, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Command {
  id: string;
  title: string;
  description?: string;
  args?: Array<{
    name: string;
    type: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    default?: any;
    options?: Array<{ value: string; label: string }>;
    pattern?: string;
    min?: number;
    max?: number;
    help?: string;
  }>;
  confirm?: boolean;
  hasHelp?: boolean;
  help_command?: string;
  timeout?: number;
}

interface ExecutionResult {
  executionId: string;
  status: string;
}

interface ExecutionHistory {
  id: string;
  commandId: string;
  status: 'running' | 'success' | 'error';
  output: string;
  error?: string;
  startedAt: Date;
  finishedAt?: Date;
  exitCode?: number;
  args: Record<string, any>;
}

interface CommandHelp {
  commandId: string;
  helpOutput: string;
  available: boolean;
}

export function CommandExecutor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [helpData, setHelpData] = useState<CommandHelp | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Get WebSocket port from server
  const { data: wsInfo } = useQuery({
    queryKey: ['ws-status'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/commands/ws-status`);
      return response.json();
    },
    refetchInterval: 5000,
  });

  const { data: commands = [] } = useQuery({
    queryKey: ['commands'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/config/commands`);
      return response.json() as Promise<Command[]>;
    },
  });

  const { data: history = [], refetch: refetchHistory } = useQuery({
    queryKey: ['executions'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/commands/executions`);
      return response.json() as Promise<ExecutionHistory[]>;
    },
    refetchInterval: 2000,
  });

  // Find command after commands are loaded
  const command = commands.find(cmd => cmd.id === id);

  // Load command help - only when command is available
  const { data: commandHelp } = useQuery({
    queryKey: ['command-help', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`${API_URL}/api/commands/${id}/help`);
      return response.json() as Promise<CommandHelp>;
    },
    enabled: !!id && !!command?.hasHelp,
  });

  const executeMutation = useMutation({
    mutationFn: async (args: Record<string, any>) => {
      const response = await fetch(`${API_URL}/api/commands/${id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ args }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute command');
      }
      
      return response.json() as Promise<ExecutionResult>;
    },
    onSuccess: (data) => {
      setExecutionId(data.executionId);
      setIsStreaming(true);
      setExecutionStatus('running');
      setStartTime(Date.now());
      setOutput('');
      connectWebSocket(data.executionId);
      toast({
        title: 'Command Started',
        description: `Executing "${command?.title}"...`,
      });
    },
    onError: (error) => {
      setExecutionStatus('error');
      toast({
        title: 'Execution Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const connectWebSocket = (execId: string) => {
    if (!wsInfo?.port) {
      toast({
        title: 'WebSocket Error',
        description: 'WebSocket server not available',
        variant: 'destructive',
      });
      return;
    }

    setWsStatus('connecting');
    const ws = new WebSocket(`ws://localhost:${wsInfo.port}`);
    wsRef.current = ws;
    
    ws.onopen = () => {
      setWsStatus('connected');
      ws.send(JSON.stringify({ type: 'subscribe', executionId: execId }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'welcome') {
        console.log('WebSocket connected successfully');
        return;
      }
      
      if (data.executionId === execId || data.type === 'output' || data.type === 'error') {
        if (data.type === 'output') {
          setOutput(prev => prev + data.data);
          setTimeout(() => {
            if (outputRef.current) {
              outputRef.current.scrollTop = outputRef.current.scrollHeight;
            }
          }, 10);
        } else if (data.type === 'error') {
          setOutput(prev => prev + `[ERROR] ${data.data}`);
        } else if (data.type === 'complete') {
          setIsStreaming(false);
          setExecutionStatus(data.status === 'success' ? 'success' : 'error');
          setDuration(data.duration || (Date.now() - (startTime || Date.now())));
          ws.close();
          
          toast({
            title: data.status === 'success' ? 'Success' : 'Failed',
            description: `Command completed in ${Math.round((data.duration || 0) / 1000)}s with exit code ${data.exitCode}`,
            variant: data.status === 'success' ? 'default' : 'destructive',
          });
          
          // Refresh history
          refetchHistory();
        }
      }
    };
    
    ws.onerror = () => {
      setWsStatus('disconnected');
      setIsStreaming(false);
      toast({
        title: 'Connection Error',
        description: 'Lost connection to WebSocket server',
        variant: 'destructive',
      });
    };

    ws.onclose = () => {
      setWsStatus('disconnected');
    };
  };

  useEffect(() => {
    if (command?.args) {
      const defaults: Record<string, any> = {};
      command.args.forEach(arg => {
        if (arg.default !== undefined) {
          defaults[arg.name] = arg.default;
        }
      });
      setFormData(defaults);
    }
  }, [command]);

  useEffect(() => {
    if (commandHelp) {
      setHelpData(commandHelp);
    }
  }, [commandHelp]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (command?.confirm && !window.confirm(`Are you sure you want to run "${command.title}"?`)) {
      return;
    }
    
    executeMutation.mutate(formData);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: 'Copied',
      description: 'Output copied to clipboard',
    });
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${command?.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearOutput = () => {
    setOutput('');
    setExecutionStatus('idle');
    setDuration(null);
  };

  if (!command) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Command not found</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const currentExecution = history.find(h => h.commandId === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant={wsStatus === 'connected' ? 'default' : wsStatus === 'connecting' ? 'secondary' : 'destructive'}>
              WebSocket: {wsStatus}
            </Badge>
            {wsInfo && (
              <Badge variant="outline">
                Port: {wsInfo.port} | Clients: {wsInfo.connected}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetchHistory()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh History
          </Button>
          {command.hasHelp && (
            <Button variant="outline" size="sm" onClick={() => setShowHelp(!showHelp)}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
          )}
        </div>
      </div>

      {showHelp && helpData && (
        <Card>
          <CardHeader>
            <CardTitle>Command Help</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {helpData.helpOutput}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{command.title}</span>
            <div className="flex items-center gap-2">
              {executionStatus !== 'idle' && (
                <Badge variant={
                  executionStatus === 'running' ? 'secondary' :
                  executionStatus === 'success' ? 'default' : 'destructive'
                }>
                  {executionStatus}
                </Badge>
              )}
              {duration && (
                <Badge variant="outline">
                  {Math.round(duration / 1000)}s
                </Badge>
              )}
            </div>
          </CardTitle>
          {command.description && (
            <CardDescription>{command.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {command.args?.map((arg) => (
              <div key={arg.name} className="space-y-2">
                <Label htmlFor={arg.name}>
                  {arg.label || arg.name}
                  {arg.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {arg.help && (
                  <p className="text-xs text-muted-foreground">{arg.help}</p>
                )}
                {arg.type === 'select' ? (
                  <select
                    id={arg.name}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData[arg.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [arg.name]: e.target.value })}
                    required={arg.required}
                  >
                    <option value="">Select...</option>
                    {arg.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : arg.type === 'boolean' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={arg.name}
                      checked={formData[arg.name] || false}
                      onChange={(e) => setFormData({ ...formData, [arg.name]: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>
                ) : arg.type === 'textarea' ? (
                  <textarea
                    id={arg.name}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder={arg.placeholder}
                    value={formData[arg.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [arg.name]: e.target.value })}
                    required={arg.required}
                  />
                ) : (
                  <Input
                    id={arg.name}
                    type={arg.type === 'password' ? 'password' : arg.type === 'number' ? 'number' : 'text'}
                    placeholder={arg.placeholder}
                    value={formData[arg.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [arg.name]: e.target.value })}
                    required={arg.required}
                    pattern={arg.pattern}
                    min={arg.min}
                    max={arg.max}
                  />
                )}
              </div>
            ))}
            
            <Button 
              type="submit" 
              disabled={executeMutation.isPending || isStreaming}
              className="w-full"
            >
              {executeMutation.isPending || isStreaming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isStreaming ? 'Running...' : 'Executing...'}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Execute Command
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {(output || executionStatus !== 'idle') && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Terminal Output</CardTitle>
              <div className="flex items-center gap-2">
                {output && (
                  <>
                    <Button variant="outline" size="sm" onClick={copyOutput}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadOutput}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={clearOutput}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full">
              <pre 
                ref={outputRef}
                className="bg-black text-green-400 p-4 rounded-md text-sm font-mono whitespace-pre-wrap min-h-full"
                style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}
              >
                {output || (executionStatus === 'running' ? 'Waiting for output...' : 'No output yet')}
                {isStreaming && (
                  <span className="animate-pulse bg-green-400 text-black px-1">█</span>
                )}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {currentExecution && (
        <Card>
          <CardHeader>
            <CardTitle>Last Execution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={currentExecution.status === 'success' ? 'default' : 'destructive'}>
                  {currentExecution.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Started:</span>
                <span>{new Date(currentExecution.startedAt).toLocaleString()}</span>
              </div>
              {currentExecution.finishedAt && (
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{Math.round((new Date(currentExecution.finishedAt).getTime() - new Date(currentExecution.startedAt).getTime()) / 1000)}s</span>
                </div>
              )}
              {currentExecution.exitCode !== undefined && (
                <div className="flex justify-between">
                  <span>Exit Code:</span>
                  <span>{currentExecution.exitCode}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
