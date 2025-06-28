import * as React from 'react';
import { TerminalConverter, TerminalCommand } from './terminal-converter';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { 
  Plus, 
  Search, 
  Play, 
  Square, 
  Trash2, 
  Copy, 
  Download,
  RefreshCw,
  Cog,
  Terminal
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

export interface TerminalCommandListProps {
  commands: TerminalCommand[];
  onExecute?: (command: TerminalCommand) => void;
  onStop?: (commandId: string) => void;
  onDelete?: (commandId: string) => void;
  onCopy?: (text: string) => void;
  onDownload?: (text: string, filename: string) => void;
  onRefresh?: () => void;
  className?: string;
  showDebug?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const TerminalCommandList = React.forwardRef<HTMLDivElement, TerminalCommandListProps>(
  (
    {
      commands,
      onExecute,
      onStop,
      onDelete,
      onCopy,
      onDownload,
      onRefresh,
      className,
      showDebug = false,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<string>('all');
    const [sortBy, setSortBy] = React.useState<'time' | 'status' | 'command'>('time');

    const filteredCommands = React.useMemo(() => {
      let filtered = commands;

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(cmd => 
          cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.output?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.error?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by status
      if (statusFilter !== 'all') {
        filtered = filtered.filter(cmd => cmd.status === statusFilter);
      }

      // Sort commands
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'time':
            const timeA = a.startTime?.getTime() || 0;
            const timeB = b.startTime?.getTime() || 0;
            return timeB - timeA;
          case 'status':
            const statusOrder = { running: 0, error: 1, success: 2, idle: 3 };
            return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
          case 'command':
            return a.command.localeCompare(b.command);
          default:
            return 0;
        }
      });

      return filtered;
    }, [commands, searchTerm, statusFilter, sortBy]);

    const getStatusCounts = () => {
      const counts = { all: commands.length, idle: 0, running: 0, success: 0, error: 0 };
      commands.forEach(cmd => {
        counts[cmd.status as keyof typeof counts]++;
      });
      return counts;
    };

    const statusCounts = getStatusCounts();

    const handleCopyAll = () => {
      const allOutput = filteredCommands
        .map(cmd => `${cmd.command}\n${cmd.output || ''}\n${cmd.error || ''}`)
        .join('\n\n---\n\n');
      onCopy?.(allOutput);
    };

    const handleDownloadAll = () => {
      const allOutput = filteredCommands
        .map(cmd => `${cmd.command}\n${cmd.output || ''}\n${cmd.error || ''}`)
        .join('\n\n---\n\n');
      const filename = `terminal-commands-${Date.now()}.txt`;
      onDownload?.(allOutput, filename);
    };

    if (variant === 'compact') {
      return (
        <div ref={ref} className={className} {...props}>
          <div className="space-y-2">
            {filteredCommands.map((command) => (
              <Card key={command.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{command.command}</span>
                    <Badge variant={command.status === 'error' ? 'destructive' : 'default'}>
                      {command.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {command.status === 'idle' && onExecute && (
                      <Button size="sm" onClick={() => onExecute(command)}>
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                    {command.status === 'running' && onStop && (
                      <Button size="sm" variant="destructive" onClick={() => onStop(command.id)}>
                        <Square className="h-3 w-3" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button size="sm" variant="outline" onClick={() => onDelete(command.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...props}>
        {/* Header with controls */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Terminal Commands ({filteredCommands.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                {onRefresh && (
                  <Button size="sm" variant="outline" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
                {filteredCommands.length > 0 && (
                  <>
                    <Button size="sm" variant="outline" onClick={handleCopyAll}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy All
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleDownloadAll}>
                      <Download className="h-4 w-4 mr-1" />
                      Download All
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search commands or output..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                    <SelectItem value="idle">Idle ({statusCounts.idle})</SelectItem>
                    <SelectItem value="running">Running ({statusCounts.running})</SelectItem>
                    <SelectItem value="success">Success ({statusCounts.success})</SelectItem>
                    <SelectItem value="error">Error ({statusCounts.error})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sort-by">Sort By</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Time (Newest)</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="command">Command</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Status summary */}
            <div className="flex items-center gap-4">
              <Badge variant="outline">Total: {statusCounts.all}</Badge>
              <Badge variant="secondary">Running: {statusCounts.running}</Badge>
              <Badge variant="default">Success: {statusCounts.success}</Badge>
              <Badge variant="destructive">Error: {statusCounts.error}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Commands list */}
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {filteredCommands.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
                  <div className="text-center">
                    <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No commands found</p>
                    {searchTerm && <p className="text-sm">Try adjusting your search criteria</p>}
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredCommands.map((command) => (
                <TerminalConverter
                  key={command.id}
                  command={command}
                  onExecute={onExecute}
                  onStop={onStop}
                  onCopy={onCopy}
                  onDownload={onDownload}
                  showDebug={showDebug}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }
);
TerminalCommandList.displayName = 'TerminalCommandList'; 
