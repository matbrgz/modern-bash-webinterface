// Re-export shared types
export * from '@shellui/shared';

// Theme system hooks
export { useAdvancedTheme } from './hooks/useAdvancedTheme';
export { useCommandTheme } from './hooks/useCommandTheme';
export { useThemeCustomizer } from './hooks/useThemeCustomizer';

// Components
export { ThemeProvider } from './components/ThemeProvider';
export { ThemeCustomizer } from './components/ThemeCustomizer';
export { ThemePreview } from './components/ThemePreview';
export { CommandThemeProvider, useCommandThemeContext } from './components/CommandThemeProvider';

// Utilities
export { themePresets, applyThemeToCSS, exportThemeAsJSON, importThemeFromJSON } from './utils/themes';
export { 
  createCustomTheme, 
  validateTheme, 
  mergeThemes, 
  generateThemeVariants 
} from './utils/themeUtils';

// HOCs
export { withTheme, WithThemeProps } from './hocs/withTheme';
export { withCommandTheme, WithCommandThemeProps } from './hocs/withCommandTheme';

// Constants
export { 
  THEME_PRESETS, 
  DEFAULT_THEME, 
  THEME_CATEGORIES, 
  THEME_TABS 
} from './constants'; 
