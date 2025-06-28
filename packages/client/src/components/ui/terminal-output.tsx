import * as React from 'react';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export interface TerminalOutputProps {
  output: string;
  isStreaming?: boolean;
  status?: 'idle' | 'running' | 'success' | 'error';
  className?: string;
  style?: React.CSSProperties;
  error?: string;
  loadingText?: string;
  emptyText?: string;
  variant?: 'default' | 'dark' | 'light';
}

export const TerminalOutput = React.forwardRef<HTMLPreElement, TerminalOutputProps>(
  (
    {
      output,
      isStreaming = false,
      status = 'idle',
      className,
      style,
      error,
      loadingText = 'Waiting for output...',
      emptyText = 'No output yet',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const getTerminalStyles = () => {
      const baseStyles = {
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid',
        minHeight: '100%',
        transition: 'all 0.2s ease-in-out',
      };

      switch (variant) {
        case 'dark':
          return {
            ...baseStyles,
            backgroundColor: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            borderColor: 'hsl(var(--border))',
          };
        case 'light':
          return {
            ...baseStyles,
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            borderColor: 'hsl(var(--border))',
          };
        default:
          return {
            ...baseStyles,
            backgroundColor: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            borderColor: 'hsl(var(--border))',
          };
      }
    };

    const getStatusStyles = () => {
      switch (status) {
        case 'error':
          return {
            borderColor: 'hsl(var(--destructive))',
            backgroundColor: 'hsl(var(--destructive) / 0.05)',
            color: 'hsl(var(--destructive))',
          };
        case 'success':
          return {
            borderColor: 'hsl(var(--primary))',
            backgroundColor: 'hsl(var(--primary) / 0.05)',
            color: 'hsl(var(--foreground))',
          };
        case 'running':
          return {
            borderColor: 'hsl(var(--secondary))',
            backgroundColor: 'hsl(var(--secondary) / 0.05)',
            color: 'hsl(var(--foreground))',
          };
        default:
          return {};
      }
    };

    return (
      <ScrollArea className={cn('h-96 w-full', className)}>
        <pre
          ref={ref}
          className={cn(
            'text-sm font-mono whitespace-pre-wrap min-h-full transition-all duration-200',
            className
          )}
          style={{
            ...getTerminalStyles(),
            ...getStatusStyles(),
            ...style
          }}
          {...props}
        >
          {error ? (
            <span className="text-destructive font-semibold">[ERROR] {error}</span>
          ) : output ? (
            <span className="terminal-content">{output}</span>
          ) : status === 'running' ? (
            <span className="opacity-70 animate-pulse">
              {loadingText} 
              <span className="animate-pulse bg-foreground text-background px-1 ml-1 rounded">
                █
              </span>
            </span>
          ) : (
            <span className="opacity-50">{emptyText}</span>
          )}
        </pre>
      </ScrollArea>
    );
  }
);
TerminalOutput.displayName = 'TerminalOutput'; 
