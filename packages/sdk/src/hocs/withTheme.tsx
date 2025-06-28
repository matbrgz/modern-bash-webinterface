import React from 'react';
import { useAdvancedTheme } from '../hooks/useAdvancedTheme';
import { Theme } from '@shellui/shared';

export interface WithThemeProps {
  theme: Theme;
  updateTheme: (theme: Partial<Theme>) => void;
  resetTheme: () => void;
}

export function withTheme<P extends object>(
  Component: React.ComponentType<P & WithThemeProps>
) {
  const WithThemeComponent = (props: P) => {
    const { theme, updateTheme, resetTheme } = useAdvancedTheme();
    
    return (
      <Component
        {...props}
        theme={theme}
        updateTheme={updateTheme}
        resetTheme={resetTheme}
      />
    );
  };

  WithThemeComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  
  return WithThemeComponent;
} 
