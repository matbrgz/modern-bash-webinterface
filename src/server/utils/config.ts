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
  hidden: z.boolean().optional(),
  acl: z.array(z.string()).optional(),
});

const ConfigSchema = z.object({
  title: z.string().optional().default('ShellUI'),
  theme: z.enum(['light', 'dark', 'system']).optional().default('system'),
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
    theme: 'system',
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
