import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Command {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
}

export function Dashboard() {
  const { data: commands = [], isLoading } = useQuery({
    queryKey: ['commands'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/config/commands`);
      return response.json() as Promise<Command[]>;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Group commands by category
  const groupedCommands = commands.reduce((acc, command) => {
    const category = command.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commands</h1>
        <p className="text-muted-foreground">
          Select a command to execute
        </p>
      </div>

      {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryCommands.map((command) => {
              const IconComponent = command.icon && Icons[command.icon as keyof typeof Icons] 
                ? Icons[command.icon as keyof typeof Icons] 
                : Icons.Terminal;
              
              return (
                <Link key={command.id} to={`/command/${command.id}`}>
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{command.title}</CardTitle>
                      {command.description && (
                        <CardDescription>{command.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Execute
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 
