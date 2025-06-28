export interface Config {
  title: string;
  theme: string;
  features?: {
    auto_help?: boolean;
    show_command_help?: boolean;
    visual_param_builder?: boolean;
  };
  auth?: {
    enabled: boolean;
    users?: User[];
  };
  commands: Command[];
}

export interface User {
  username: string;
  password: string;
  roles: string[];
}

export interface Command {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: string;
  shell: string;
  command: string;
  help_command?: string;
  auto_help?: boolean;
  timeout?: number;
  confirm?: boolean;
  acl?: string[];
  args?: CommandArg[];
}

export interface CommandArg {
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'textarea' | 'password';
  label: string;
  placeholder?: string;
  default?: any;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  help?: string;
  options?: { value: string; label: string }[];
}

export interface CommandExecution {
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

export interface CommandHelp {
  commandId: string;
  helpOutput: string;
  generatedAt: Date;
  available: boolean;
} 
