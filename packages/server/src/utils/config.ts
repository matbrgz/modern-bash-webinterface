import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import yaml from 'js-yaml';
import { z } from 'zod';
import type { Config } from '../../types';

const CommandArgumentSchema = z.object({
  name: z.string(),
  type: z.enum(['text', 'select', 'number', 'boolean', 'password', 'datetime', 'textarea']),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  default: z.any().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional(),
  pattern: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

const CommandSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  shell: z.string().default('/bin/bash'),
  command: z.string(),
  args: z.array(CommandArgumentSchema).optional(),
  timeout: z.number().optional(),
  confirm: z.boolean().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  hidden: z.boolean().optional(),
  acl: z.array(z.string()).optional(),
});

const ThemeColorsSchema = z.object({
  primary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  foreground: z.string().optional(),
  commandSuccess: z.string().optional(),
  commandError: z.string().optional(),
  commandWarning: z.string().optional(),
  commandInfo: z.string().optional(),
}).optional();

const CustomThemeSchema = z.object({
  name: z.string(),
  description: z.string(),
  mode: z.enum(['light', 'dark', 'system']),
  colors: ThemeColorsSchema,
  fontFamily: z.string().optional(),
  borderRadius: z.string().optional(),
  animation: z.object({
    duration: z.string(),
    easing: z.string(),
  }).optional(),
  effects: z.object({
    blur: z.string(),
    shadow: z.string(),
    glow: z.string(),
  }).optional(),
}).optional();

const CommandThemeSchema = z.object({
  id: z.string(),
  theme: z.object({
    colors: ThemeColorsSchema,
  }),
  conditions: z.object({
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['success', 'error', 'warning', 'info']).optional(),
  }).optional(),
}).optional();

const ThemeConfigSchema = z.object({
  default_preset: z.enum(['default', 'ocean', 'forest', 'sunset', 'midnight', 'candy', 'corporate', 'terminal', 'custom']).optional(),
  custom_theme: CustomThemeSchema,
  command_themes: z.array(CommandThemeSchema).optional(),
}).optional();

const ConfigSchema = z.object({
  title: z.string().optional().default('ShellUI'),
  theme: z.enum(['default', 'ocean', 'forest', 'sunset', 'midnight', 'candy', 'corporate', 'terminal', 'custom', 'light', 'dark', 'system']).optional().default('default'),
  theme_config: ThemeConfigSchema,
  auth: z.object({
    enabled: z.boolean().default(false),
    users: z.array(z.object({
      username: z.string(),
      password: z.string(),
      roles: z.array(z.string()).optional().default([]),
    })).optional(),
  }).optional(),
  commands: z.array(CommandSchema),
});

export async function loadConfig(): Promise<Config> {
  const configPath = process.env.SHELLUI_CONFIG || resolve(process.cwd(), 'config.yaml');
  
  if (!existsSync(configPath)) {
    console.warn(`Config file not found at ${configPath}, using default configuration`);
    return getDefaultConfig();
  }
  
  try {
    const fileContent = readFileSync(configPath, 'utf8');
    const rawConfig = yaml.load(fileContent);
    const config = ConfigSchema.parse(rawConfig);
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    throw new Error(`Failed to load configuration: ${error}`);
  }
}

function getDefaultConfig(): Config {
  return {
    title: 'ShellUI',
    theme: 'default',
    auth: {
      enabled: false,
    },
    commands: [
      {
        id: 'echo-hello',
        title: 'Echo Hello',
        description: 'A simple echo command',
        icon: 'Terminal',
        shell: '/bin/bash',
        command: 'echo "Hello from ShellUI!"',
      },
      {
        id: 'list-files',
        title: 'List Files',
        description: 'List files in a directory',
        icon: 'Folder',
        shell: '/bin/bash',
        command: 'ls -la {{ directory }}',
        args: [
          {
            name: 'directory',
            type: 'text',
            label: 'Directory',
            placeholder: '/home/user',
            default: '.',
            required: true,
          }
        ]
      }
    ]
  };
} 
