export interface Command {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  shell: string;
  command: string;
  args?: CommandArgument[];
  timeout?: number;
  confirm?: boolean;
  category?: string;
  hidden?: boolean;
  acl?: string[];
}

export interface CommandArgument {
  name: string;
  type: 'text' | 'select' | 'number' | 'boolean' | 'password' | 'datetime' | 'textarea';
  label?: string;
  placeholder?: string;
  required?: boolean;
  default?: any;
  options?: Array<{ value: string; label: string }>;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface CommandExecution {
  id: string;
  commandId: string;
  status: 'pending' | 'running' | 'success' | 'error';
  output: string;
  error?: string;
  startedAt: Date;
  finishedAt?: Date;
  exitCode?: number;
  args?: Record<string, any>;
}

export interface Config {
  title?: string;
  theme?: 'light' | 'dark' | 'system';
  auth?: {
    enabled: boolean;
    users?: Array<{
      username: string;
      password: string;
      roles?: string[];
    }>;
  };
  commands: Command[];
}

export interface User {
  username: string;
  roles: string[];
} 
