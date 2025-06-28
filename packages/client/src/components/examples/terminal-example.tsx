import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TerminalOutput } from '@/components/ui/terminal-output';
import { TerminalConverter, TerminalCommand } from '@/components/ui/terminal-converter';
import { TerminalCommandList } from '@/components/ui/terminal-command-list';
import { useTerminalCommands } from '@/hooks/use-terminal-commands';
import { 
  Play, 
  Square, 
  Copy, 
  Download, 
  RefreshCw, 
  Settings,
  Terminal,
  History,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const TerminalExample: React.FC = () => {
  const [selectedCommand, setSelectedCommand] = useState<string>('');
  const [customCommand, setCustomCommand] = useState<string>('');
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'executor' | 'history' | 'list'>('executor');

  const {
    commands,
    wsStatus,
    wsPort,
    wsClients,
    executeCommand,
    stopCommand,
    clearCommands,
    removeCommand,
    connectWebSocket,
    getSuccessRate,
    isConnected,
    hasRunningCommands,
    totalCommands,
    successfulCommands,
    failedCommands
  } = useTerminalCommands({
    onCommandStart: (command) => {
      console.log('Command started:', command);
    },
    onCommandComplete: (command) => {
      console.log('Command completed:', command);
    }
  });

  const sampleCommands = [
    { name: 'hello', command: 'echo "Hello from ShellUI!"', description: 'Simple hello command' },
    { name: 'date', command: 'date', description: 'Show current date and time' },
    { name: 'pwd', command: 'pwd', description: 'Show current working directory' },
    { name: 'ls', command: 'ls -la', description: 'List files in current directory' },
    { name: 'system-info', command: 'uname -a', description: 'Show system information' },
    { name: 'disk-usage', command: 'df -h', description: 'Show disk usage' },
    { name: 'memory-usage', command: 'free -h', description: 'Show memory usage' },
    { name: 'processes', command: 'ps aux | head -10', description: 'Show top 10 processes' }
  ];

  const handleExecute = () => {
    const commandToExecute = selectedCommand || customCommand;
    if (!commandToExecute.trim()) {
      toast.error('Please select a command or enter a custom command');
      return;
    }
    
    executeCommand(commandToExecute);
    setSelectedCommand('');
    setCustomCommand('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  const handleHistoryExecute = (command: TerminalCommand) => {
    executeCommand(command.command);
  };

  const handleHistoryStop = (commandId: string) => {
    stopCommand(commandId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Terminal className="h-8 w-8" />
            Terminal Example
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced terminal interface with shadcn components
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            <Settings className="h-4 w-4 mr-1" />
            Debug
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={connectWebSocket}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reconnect
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center gap-2 border-b">
        <Button
          variant={viewMode === 'executor' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('executor')}
        >
          <Play className="h-4 w-4 mr-1" />
          Executor
        </Button>
        
        <Button
          variant={viewMode === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('history')}
        >
          <History className="h-4 w-4 mr-1" />
          History ({totalCommands})
        </Button>
        
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <Terminal className="h-4 w-4 mr-1" />
          List View
        </Button>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>WebSocket Status</Label>
                <p className="font-mono">{wsStatus}</p>
              </div>
              <div>
                <Label>Port</Label>
                <p className="font-mono">{wsPort}</p>
              </div>
              <div>
                <Label>Clients</Label>
                <p className="font-mono">{wsClients}</p>
              </div>
              <div>
                <Label>Success Rate</Label>
                <p className="font-mono">{getSuccessRate()}%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Total Commands</Label>
                <p className="font-mono">{totalCommands}</p>
              </div>
              <div>
                <Label>Successful</Label>
                <p className="font-mono text-green-600">{successfulCommands}</p>
              </div>
              <div>
                <Label>Failed</Label>
                <p className="font-mono text-red-600">{failedCommands}</p>
              </div>
              <div>
                <Label>Running</Label>
                <p className="font-mono text-yellow-600">{hasRunningCommands ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Executor View */}
      {viewMode === 'executor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Command Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Command Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Command</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedCommand}
                  onChange={(e) => setSelectedCommand(e.target.value)}
                >
                  <option value="">Choose a command...</option>
                  {sampleCommands.map((cmd) => (
                    <option key={cmd.name} value={cmd.command}>
                      {cmd.name} - {cmd.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Or Enter Custom Command</Label>
                <Input
                  placeholder="Enter custom command..."
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleExecute()}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleExecute}
                  disabled={!isConnected || (!selectedCommand && !customCommand.trim())}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Execute
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCommand('');
                    setCustomCommand('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {selectedCommand && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono">{selectedCommand}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Output */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Live Output
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commands.length > 0 ? (
                <TerminalOutput
                  output={commands[0].output || ''}
                  error={commands[0].error || ''}
                  status={commands[0].status}
                  isStreaming={commands[0].status === 'running'}
                  className="h-96"
                  variant="default"
                />
              ) : (
                <div className="h-96 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No commands executed yet</p>
                    <p className="text-sm">Select a command and click Execute</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* History View */}
      {viewMode === 'history' && (
        <TerminalCommandList
          commands={commands}
          onExecute={handleHistoryExecute}
          onStop={handleHistoryStop}
          onDelete={removeCommand}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onRefresh={connectWebSocket}
          showDebug={showDebug}
          variant="default"
        />
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <TerminalCommandList
          commands={commands}
          onExecute={handleHistoryExecute}
          onStop={handleHistoryStop}
          onDelete={removeCommand}
          onCopy={handleCopy}
          onDownload={handleDownload}
          showDebug={showDebug}
          variant="compact"
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={clearCommands}
            disabled={commands.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {totalCommands} commands • {successfulCommands} successful • {failedCommands} failed
        </div>
      </div>
    </div>
  );
};

export default TerminalExample; 
