import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Command, Theme } from '@shellui/shared';
import { useAdvancedTheme } from '../hooks/useAdvancedTheme';
import { mergeThemes } from '../utils/themeUtils';

interface CommandThemeContextType {
  commandTheme: Theme | null;
  isCommandThemeActive: boolean;
  applyCommandTheme: (command: Command) => void;
  clearCommandTheme: () => void;
  currentCommand: Command | null;
}

const CommandThemeContext = createContext<CommandThemeContextType | undefined>(undefined);

interface CommandThemeProviderProps {
  children: ReactNode;
  config?: {
    commandThemes?: Record<string, Partial<Theme>>;
    categoryThemes?: Record<string, Partial<Theme>>;
    tagThemes?: Record<string, Partial<Theme>>;
    statusThemes?: Record<string, Partial<Theme>>;
  };
}

export function CommandThemeProvider({ children, config = {} }: CommandThemeProviderProps) {
  const { theme: baseTheme } = useAdvancedTheme();
  const [commandTheme, setCommandTheme] = useState<Theme | null>(null);
  const [currentCommand, setCurrentCommand] = useState<Command | null>(null);

  const applyCommandTheme = (command: Command) => {
    setCurrentCommand(command);
    
    // Check for command-specific theme
    if (config.commandThemes?.[command.id]) {
      const mergedTheme = mergeThemes(baseTheme, config.commandThemes[command.id]);
      setCommandTheme(mergedTheme);
      return;
    }

    // Check for category theme
    if (command.category && config.categoryThemes?.[command.category]) {
      const mergedTheme = mergeThemes(baseTheme, config.categoryThemes[command.category]);
      setCommandTheme(mergedTheme);
      return;
    }

    // Check for tag themes
    if (command.tags && command.tags.length > 0) {
      for (const tag of command.tags) {
        if (config.tagThemes?.[tag]) {
          const mergedTheme = mergeThemes(baseTheme, config.tagThemes[tag]);
          setCommandTheme(mergedTheme);
          return;
        }
      }
    }

    // Check for status theme
    if (command.status && config.statusThemes?.[command.status]) {
      const mergedTheme = mergeThemes(baseTheme, config.statusThemes[command.status]);
      setCommandTheme(mergedTheme);
      return;
    }

    // No specific theme found, clear command theme
    setCommandTheme(null);
  };

  const clearCommandTheme = () => {
    setCommandTheme(null);
    setCurrentCommand(null);
  };

  // Update command theme when base theme changes
  useEffect(() => {
    if (currentCommand && commandTheme) {
      applyCommandTheme(currentCommand);
    }
  }, [baseTheme]);

  const value: CommandThemeContextType = {
    commandTheme,
    isCommandThemeActive: commandTheme !== null,
    applyCommandTheme,
    clearCommandTheme,
    currentCommand
  };

  return (
    <CommandThemeContext.Provider value={value}>
      {children}
    </CommandThemeContext.Provider>
  );
}

export function useCommandThemeContext() {
  const context = useContext(CommandThemeContext);
  if (context === undefined) {
    throw new Error('useCommandThemeContext must be used within a CommandThemeProvider');
  }
  return context;
} 
