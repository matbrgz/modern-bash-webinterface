import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
import { TerminalOutput } from './terminal-output';
import { 
  Terminal, 
  Play, 
  Square, 
  Copy, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  HelpCircle,
  File,
  Cog,
  User,
  Lock,
  BarChart3
} from 'lucide-react';

export interface TerminalCommand {
  id: string;
  command: string;
  args?: Record<string, any>;
  output?: string;
  error?: string;
  status: 'idle' | 'running' | 'success' | 'error';
  startTime?: Date;
  endTime?: Date;
  exitCode?: number;
}

export interface TerminalConverterProps {
  command: TerminalCommand;
  onExecute?: (command: TerminalCommand) => void;
  onStop?: (commandId: string) => void;
  onCopy?: (text: string) => void;
  onDownload?: (text: string, filename: string) => void;
  className?: string;
  showDebug?: boolean;
}

export const TerminalConverter = React.forwardRef<HTMLDivElement, TerminalConverterProps>(
  (
    {
      command,
      onExecute,
      onStop,
      onCopy,
      onDownload,
      className,
      showDebug = false,
      ...props
    },
    ref
  ) => {
    const getCommandIcon = (commandStr: string) => {
      const cmd = commandStr.toLowerCase();
      
      if (cmd.includes('docker')) return <Terminal className="h-4 w-4" />;
      if (cmd.includes('ping') || cmd.includes('curl') || cmd.includes('wget')) return <Terminal className="h-4 w-4" />;
      if (cmd.includes('systemctl') || cmd.includes('service')) return <Cog className="h-4 w-4" />;
      if (cmd.includes('user') || cmd.includes('passwd')) return <User className="h-4 w-4" />;
      if (cmd.includes('sudo') || cmd.includes('chmod')) return <Lock className="h-4 w-4" />;
      if (cmd.includes('top') || cmd.includes('htop') || cmd.includes('ps')) return <BarChart3 className="h-4 w-4" />;
      if (cmd.includes('echo') || cmd.includes('print')) return <File className="h-4 w-4" />;
      
      return <Terminal className="h-4 w-4" />;
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'success':
          return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'error':
          return <XCircle className="h-5 w-5 text-red-500" />;
        case 'running':
          return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
        default:
          return <Play className="h-5 w-5 text-blue-500" />;
      }
    };

    const getStatusBadge = (status: string) => {
      const variants = {
        success: 'default',
        error: 'destructive',
        running: 'secondary',
        idle: 'outline'
      } as const;

      return (
        <Badge variant={variants[status as keyof typeof variants]}>
          {status}
        </Badge>
      );
    };

    const getDuration = () => {
      if (!command.startTime || !command.endTime) return null;
      return Math.round((command.endTime.getTime() - command.startTime.getTime()) / 1000);
    };

    const handleCopy = () => {
      const textToCopy = command.output || command.error || command.command;
      onCopy?.(textToCopy);
    };

    const handleDownload = () => {
      const textToDownload = command.output || command.error || command.command;
      const filename = `${command.id}-${Date.now()}.txt`;
      onDownload?.(textToDownload, filename);
    };

    const formatCommand = (cmd: string, args?: Record<string, any>) => {
      if (!args) return cmd;
      
      let formatted = cmd;
      for (const [key, value] of Object.entries(args)) {
        const placeholder = `{{ ${key} }}`;
        formatted = formatted.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
      }
      return formatted;
    };

    return (
      <Card ref={ref} className={className} {...props}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getCommandIcon(command.command)}
              <div>
                <CardTitle className="text-lg font-mono">
                  {formatCommand(command.command, command.args)}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(command.status)}
                  {command.exitCode !== undefined && (
                    <Badge variant="outline">
                      Exit: {command.exitCode}
                    </Badge>
                  )}
                  {getDuration() && (
                    <Badge variant="outline">
                      {getDuration()}s
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusIcon(command.status)}
              
              <div className="flex items-center gap-1">
                {command.status === 'idle' && onExecute && (
                  <Button
                    size="sm"
                    onClick={() => onExecute(command)}
                    className="h-8 px-3"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Run
                  </Button>
                )}
                
                {command.status === 'running' && onStop && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onStop(command.id)}
                    className="h-8 px-3"
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                )}
                
                {(command.output || command.error) && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="h-8 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                      className="h-8 px-2"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-4">
          {command.output && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Output:</h4>
              </div>
              <TerminalOutput
                output={command.output}
                status={command.status as any}
                className="h-48"
                variant="default"
              />
            </div>
          )}
          
          {command.error && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <h4 className="font-semibold text-sm text-destructive">Error:</h4>
              </div>
              <TerminalOutput
                output={command.error}
                status="error"
                className="h-32"
                variant="default"
                loadingText=""
                emptyText=""
              />
            </div>
          )}
          
          {!command.output && !command.error && command.status !== 'idle' && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <HelpCircle className="h-8 w-8 mr-2" />
              No output available
            </div>
          )}
          
          {showDebug && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h4 className="font-semibold text-sm mb-2">Debug Info</h4>
              <div className="space-y-1 text-xs">
                <div>Command ID: {command.id}</div>
                <div>Status: {command.status}</div>
                {command.startTime && (
                  <div>Started: {command.startTime.toLocaleString()}</div>
                )}
                {command.endTime && (
                  <div>Finished: {command.endTime.toLocaleString()}</div>
                )}
                {command.exitCode !== undefined && (
                  <div>Exit Code: {command.exitCode}</div>
                )}
                <div>Output Length: {command.output?.length || 0} chars</div>
                <div>Error Length: {command.error?.length || 0} chars</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
TerminalConverter.displayName = 'TerminalConverter'; 
