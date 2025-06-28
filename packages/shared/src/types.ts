export interface ThemeColors {
  primary?: string;
  accent?: string;
  background?: string;
  foreground?: string;
  commandSuccess?: string;
  commandError?: string;
  commandWarning?: string;
  commandInfo?: string;
}

export interface CustomTheme {
  name: string;
  description: string;
  mode: 'light' | 'dark' | 'system';
  colors?: ThemeColors;
  fontFamily?: string;
  borderRadius?: string;
  animation?: {
    duration: string;
    easing: string;
  };
  effects?: {
    blur: string;
    shadow: string;
    glow: string;
  };
}

export interface CommandTheme {
  id: string;
  theme: {
    colors?: ThemeColors;
  };
  conditions?: {
    category?: string;
    tags?: string[];
    status?: 'success' | 'error' | 'warning' | 'info';
  };
}

export interface ThemeConfig {
  default_preset?: 'default' | 'ocean' | 'forest' | 'sunset' | 'midnight' | 'candy' | 'corporate' | 'terminal' | 'custom';
  custom_theme?: CustomTheme;
  command_themes?: CommandTheme[];
}

export interface Config {
  title: string;
  theme: 'default' | 'ocean' | 'forest' | 'sunset' | 'midnight' | 'candy' | 'corporate' | 'terminal' | 'custom' | 'light' | 'dark' | 'system';
  theme_config?: ThemeConfig;
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
  tags?: string[];
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
  type: 'text' | 'number' | 'select' | 'boolean' | 'textarea' | 'password' | 'datetime';
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
