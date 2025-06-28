import { Theme, ThemePreset } from '@shellui/shared';
import { DEFAULT_THEME } from '../constants';

export function createCustomTheme(
  baseTheme: Partial<Theme> = {},
  name: string = 'custom'
): ThemePreset {
  const theme: Theme = {
    ...DEFAULT_THEME,
    ...baseTheme,
    colors: {
      ...DEFAULT_THEME.colors,
      ...baseTheme.colors
    },
    typography: {
      ...DEFAULT_THEME.typography,
      ...baseTheme.typography
    },
    spacing: {
      ...DEFAULT_THEME.spacing,
      ...baseTheme.spacing
    },
    borderRadius: {
      ...DEFAULT_THEME.borderRadius,
      ...baseTheme.borderRadius
    },
    shadows: {
      ...DEFAULT_THEME.shadows,
      ...baseTheme.shadows
    },
    animations: {
      ...DEFAULT_THEME.animations,
      ...baseTheme.animations
    },
    effects: {
      ...DEFAULT_THEME.effects,
      ...baseTheme.effects
    }
  };

  return {
    name,
    label: name.charAt(0).toUpperCase() + name.slice(1),
    description: `Custom theme: ${name}`,
    category: 'custom',
    theme
  };
}

export function validateTheme(theme: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!theme) {
    errors.push('Theme is required');
    return { isValid: false, errors };
  }

  // Validate colors
  if (!theme.colors) {
    errors.push('Theme must have colors object');
  } else {
    const requiredColors = ['primary', 'background', 'text'];
    requiredColors.forEach(color => {
      if (!theme.colors[color]) {
        errors.push(`Missing required color: ${color}`);
      }
    });
  }

  // Validate typography
  if (!theme.typography) {
    errors.push('Theme must have typography object');
  } else {
    if (!theme.typography.fontFamily) {
      errors.push('Typography must have fontFamily');
    }
  }

  // Validate spacing
  if (!theme.spacing) {
    errors.push('Theme must have spacing object');
  }

  // Validate other required properties
  const requiredProps = ['borderRadius', 'shadows', 'animations', 'effects'];
  requiredProps.forEach(prop => {
    if (!theme[prop]) {
      errors.push(`Missing required property: ${prop}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function mergeThemes(baseTheme: Theme, overlayTheme: Partial<Theme>): Theme {
  return {
    ...baseTheme,
    ...overlayTheme,
    colors: {
      ...baseTheme.colors,
      ...overlayTheme.colors
    },
    typography: {
      ...baseTheme.typography,
      ...overlayTheme.typography
    },
    spacing: {
      ...baseTheme.spacing,
      ...overlayTheme.spacing
    },
    borderRadius: {
      ...baseTheme.borderRadius,
      ...overlayTheme.borderRadius
    },
    shadows: {
      ...baseTheme.shadows,
      ...overlayTheme.shadows
    },
    animations: {
      ...baseTheme.animations,
      ...overlayTheme.animations
    },
    effects: {
      ...baseTheme.effects,
      ...overlayTheme.effects
    }
  };
}

export function generateThemeVariants(baseTheme: Theme): {
  light: Theme;
  dark: Theme;
} {
  const light = { ...baseTheme };
  
  const dark: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: '#1a1a1a',
      surface: '#2a2a2a',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      border: '#404040'
    }
  };

  return { light, dark };
} 
