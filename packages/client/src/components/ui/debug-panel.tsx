import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
import { RefreshCw, Bug, Wifi, WifiOff, Clock, CheckCircle, XCircle } from 'lucide-react';

interface DebugPanelProps {
  wsStatus: string;
  wsInfo?: {
    port: number;
    connected: number;
  };
  executionStatus: string;
  output: string;
  isStreaming: boolean;
  duration?: number | null;
  onRefresh?: () => void;
  className?: string;
}

export const DebugPanel = React.forwardRef<HTMLDivElement, DebugPanelProps>(
  (
    {
      wsStatus,
      wsInfo,
      executionStatus,
      output,
      isStreaming,
      duration,
      onRefresh,
      className,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'connected':
          return <Wifi className="h-4 w-4 text-green-500" />;
        case 'connecting':
          return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
        case 'disconnected':
          return <WifiOff className="h-4 w-4 text-red-500" />;
        default:
          return <WifiOff className="h-4 w-4 text-gray-500" />;
      }
    };

    const getExecutionIcon = (status: string) => {
      switch (status) {
        case 'success':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'error':
          return <XCircle className="h-4 w-4 text-red-500" />;
        case 'running':
          return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
        default:
          return <Clock className="h-4 w-4 text-gray-500" />;
      }
    };

    return (
      <Card ref={ref} className={className} {...props}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bug className="h-4 w-4" />
              Debug Panel
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Hide' : 'Show'} Details
              </Button>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(wsStatus)}
                <span className="text-sm font-medium">WebSocket</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={wsStatus === 'connected' ? 'default' : 'destructive'}>
                  {wsStatus}
                </Badge>
                {wsInfo && (
                  <Badge variant="outline">
                    Port: {wsInfo.port}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getExecutionIcon(executionStatus)}
                <span className="text-sm font-medium">Execution</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={
                  executionStatus === 'success' ? 'default' :
                  executionStatus === 'error' ? 'destructive' :
                  executionStatus === 'running' ? 'secondary' : 'outline'
                }>
                  {executionStatus}
                </Badge>
                {isStreaming && (
                  <Badge variant="secondary">
                    Streaming
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Duration */}
          {duration && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Duration: {Math.round(duration / 1000)}s
              </span>
            </div>
          )}

          {/* Expanded Details */}
          {isExpanded && (
            <>
              <Separator />
              
              <div className="space-y-4">
                {/* WebSocket Info */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">WebSocket Details</h4>
                  <div className="space-y-1 text-xs">
                    <div>Status: {wsStatus}</div>
                    {wsInfo && (
                      <>
                        <div>Port: {wsInfo.port}</div>
                        <div>Connected Clients: {wsInfo.connected}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Output Info */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Output Details</h4>
                  <div className="space-y-1 text-xs">
                    <div>Length: {output.length} characters</div>
                    <div>Lines: {output.split('\n').length}</div>
                    <div>Streaming: {isStreaming ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                {/* Raw Output Preview */}
                {output && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Output Preview</h4>
                    <ScrollArea className="h-32 w-full">
                      <pre className="text-xs bg-muted p-2 rounded border">
                        {output.length > 500 ? output.substring(0, 500) + '...' : output}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
);
DebugPanel.displayName = 'DebugPanel'; 
