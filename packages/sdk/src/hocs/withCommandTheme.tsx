import React from 'react';
import { useCommandTheme } from '../hooks/useCommandTheme';
import { Command, Theme } from '@shellui/shared';

export interface WithCommandThemeProps {
  commandTheme: Theme | null;
  isCommandThemeActive: boolean;
  applyCommandTheme: (command: Command) => void;
  clearCommandTheme: () => void;
}

export function withCommandTheme<P extends object>(
  Component: React.ComponentType<P & WithCommandThemeProps>
) {
  const WithCommandThemeComponent = (props: P) => {
    const { commandTheme, isCommandThemeActive, applyCommandTheme, clearCommandTheme } = useCommandTheme();
    
    return (
      <Component
        {...props}
        commandTheme={commandTheme}
        isCommandThemeActive={isCommandThemeActive}
        applyCommandTheme={applyCommandTheme}
        clearCommandTheme={clearCommandTheme}
      />
    );
  };

  WithCommandThemeComponent.displayName = `withCommandTheme(${Component.displayName || Component.name})`;
  
  return WithCommandThemeComponent;
} 
