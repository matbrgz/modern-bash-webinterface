import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Terminal } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Execution {
  id: string;
  commandId: string;
  status: 'pending' | 'running' | 'success' | 'error';
  output: string;
  error?: string;
  startedAt: string;
  finishedAt?: string;
  exitCode?: number;
}

export function History() {
  const { data: executions = [], isLoading } = useQuery({
    queryKey: ['executions'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/commands/executions`);
      return response.json() as Promise<Execution[]>;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusIcon = (status: Execution['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Execution History</h1>
        <p className="text-muted-foreground">
          View past command executions and their results
        </p>
      </div>

      <div className="space-y-4">
        {executions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No executions yet</p>
            </CardContent>
          </Card>
        ) : (
          executions.map((execution) => (
            <Card key={execution.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span>Command: {execution.commandId}</span>
                    {getStatusIcon(execution.status)}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(execution.startedAt), 'PPpp')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {execution.output && (
                  <div>
                    <h4 className="font-semibold mb-2">Output:</h4>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      {execution.output}
                    </pre>
                  </div>
                )}
                {execution.error && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-destructive">Error:</h4>
                    <pre className="bg-destructive/10 p-4 rounded-md overflow-x-auto text-sm text-destructive">
                      {execution.error}
                    </pre>
                  </div>
                )}
                {execution.exitCode !== undefined && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Exit code: {execution.exitCode}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 
