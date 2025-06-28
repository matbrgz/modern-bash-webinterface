import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TerminalConverter, TerminalCommand } from '@/components/ui/terminal-converter';
import { TerminalCommandList } from '@/components/ui/terminal-command-list';
import { TerminalOutput } from '@/components/ui/terminal-output';
import { 
  History as HistoryIcon, 
  Search, 
  Download, 
  Copy, 
  Trash2, 
  RefreshCw,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || '';

interface HistoryItem {
  id: string;
  command: string;
  output: string;
  error?: string;
  status: 'success' | 'error';
  startedAt: string;
  finishedAt: string;
  duration: number;
  exitCode: number;
}

const History: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Convert HistoryItem to TerminalCommand
  const convertToTerminalCommand = (item: HistoryItem): TerminalCommand => ({
    id: item.id,
    command: item.command,
    output: item.output,
    error: item.error,
    status: item.status,
    startTime: new Date(item.startedAt),
    endTime: new Date(item.finishedAt),
    exitCode: item.exitCode
  });

  const { data: history, isLoading, error, refetch } = useQuery({
    queryKey: ['history'],
    queryFn: async (): Promise<HistoryItem[]> => {
      const response = await fetch(`${API_URL}/api/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      return response.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const filteredHistory = React.useMemo(() => {
    if (!history) return [];
    
    let filtered = history;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.output.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.error?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Sort by time (newest first)
    filtered.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    return filtered;
  }, [history, searchTerm, statusFilter]);

  const terminalCommands: TerminalCommand[] = filteredHistory.map(convertToTerminalCommand);

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

  const handleDelete = async (commandId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/history/${commandId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete history item');
      }
      
      toast.success('History item deleted');
      refetch();
    } catch (error) {
      toast.error('Failed to delete history item');
      console.error('Error deleting history item:', error);
    }
  };

  const handleExecute = (command: TerminalCommand) => {
    // Navigate to CommandExecutor with the command
    window.location.href = `/executor?command=${encodeURIComponent(command.command)}`;
  };

  const getStatusCounts = () => {
    if (!history) return { all: 0, success: 0, error: 0 };
    
    const counts = { all: history.length, success: 0, error: 0 };
    history.forEach(item => {
      counts[item.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
              <p className="text-destructive">Failed to load history</p>
              <Button onClick={() => refetch()} className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HistoryIcon className="h-8 w-8" />
            Command History
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage your command execution history
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Commands</p>
                <p className="text-2xl font-bold">{statusCounts.all}</p>
              </div>
              <HistoryIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.success}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.error}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {statusCounts.all > 0 ? Math.round((statusCounts.success / statusCounts.all) * 100) : 0}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Command List */}
      <TerminalCommandList
        commands={terminalCommands}
        onExecute={handleExecute}
        onDelete={handleDelete}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onRefresh={refetch}
        showDebug={showDebug}
        variant="default"
      />

      {/* Selected Item Details */}
      {selectedItem && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Command Details</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TerminalConverter
              command={convertToTerminalCommand(selectedItem)}
              onCopy={handleCopy}
              onDownload={handleDownload}
              showDebug={showDebug}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default History; 
