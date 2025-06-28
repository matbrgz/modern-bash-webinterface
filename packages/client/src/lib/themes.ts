import { ThemeConfig, ThemePreset, ThemeColors } from '../types/theme'

// Utility function to convert hex to HSL
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

// Base theme colors
const baseColors: ThemeColors = {
  background: '0 0% 100%',
  foreground: '224 71.4% 4.1%',
  card: '0 0% 100%',
  cardForeground: '224 71.4% 4.1%',
  popover: '0 0% 100%',
  popoverForeground: '224 71.4% 4.1%',
  primary: '220.9 39.3% 11%',
  primaryForeground: '210 20% 98%',
  secondary: '220 14.3% 95.9%',
  secondaryForeground: '220.9 39.3% 11%',
  muted: '220 14.3% 95.9%',
  mutedForeground: '220 8.9% 46.1%',
  accent: '220 14.3% 95.9%',
  accentForeground: '220.9 39.3% 11%',
  destructive: '0 84.2% 60.2%',
  destructiveForeground: '210 20% 98%',
  border: '220 13% 91%',
  input: '220 13% 91%',
  ring: '224 71.4% 4.1%',
  chart1: '12 76% 61%',
  chart2: '173 58% 39%',
  chart3: '197 37% 24%',
  chart4: '43 74% 66%',
  chart5: '27 87% 67%',
  sidebarBackground: '0 0% 98%',
  sidebarForeground: '240 5.3% 26.1%',
  sidebarPrimary: '240 5.9% 10%',
  sidebarPrimaryForeground: '0 0% 98%',
  sidebarAccent: '240 4.8% 95.9%',
  sidebarAccentForeground: '240 5.9% 10%',
  sidebarBorder: '220 13% 91%',
  sidebarRing: '217.2 91.2% 59.8%',
  commandSuccess: '142 76% 36%',
  commandError: '0 84% 60%',
  commandWarning: '38 92% 50%',
  commandInfo: '217 91% 60%',
  shadow: '0 0% 0%',
  glow: '217 91% 60%'
}

const darkBaseColors: ThemeColors = {
  background: '224 71.4% 4.1%',
  foreground: '210 20% 98%',
  card: '224 71.4% 4.1%',
  cardForeground: '210 20% 98%',
  popover: '224 71.4% 4.1%',
  popoverForeground: '210 20% 98%',
  primary: '210 20% 98%',
  primaryForeground: '220.9 39.3% 11%',
  secondary: '215 27.9% 16.9%',
  secondaryForeground: '210 20% 98%',
  muted: '215 27.9% 16.9%',
  mutedForeground: '217.9 10.6% 64.9%',
  accent: '215 27.9% 16.9%',
  accentForeground: '210 20% 98%',
  destructive: '0 62.8% 30.6%',
  destructiveForeground: '210 20% 98%',
  border: '215 27.9% 16.9%',
  input: '215 27.9% 16.9%',
  ring: '216 12.2% 83.9%',
  chart1: '220 70% 50%',
  chart2: '160 60% 45%',
  chart3: '30 80% 55%',
  chart4: '280 65% 60%',
  chart5: '340 75% 55%',
  sidebarBackground: '240 5.9% 10%',
  sidebarForeground: '240 4.8% 95.9%',
  sidebarPrimary: '224.3 76.3% 48%',
  sidebarPrimaryForeground: '0 0% 100%',
  sidebarAccent: '240 3.7% 15.9%',
  sidebarAccentForeground: '240 4.8% 95.9%',
  sidebarBorder: '240 3.7% 15.9%',
  sidebarRing: '217.2 91.2% 59.8%',
  commandSuccess: '142 76% 36%',
  commandError: '0 84% 60%',
  commandWarning: '38 92% 50%',
  commandInfo: '217 91% 60%',
  shadow: '0 0% 0%',
  glow: '217 91% 60%'
}

// Theme presets
export const themePresets: Record<ThemePreset, ThemeConfig> = {
  default: {
    name: 'Default',
    description: 'Tema padrão limpo e minimalista',
    mode: 'system',
    colors: baseColors,
    borderRadius: '0.5rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    animation: {
      duration: '0.2s',
      easing: 'ease-out'
    },
    effects: {
      blur: '8px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(59, 130, 246, 0.5)'
    }
  },

  ocean: {
    name: 'Ocean',
    description: 'Tema inspirado no oceano profundo',
    mode: 'dark',
    colors: {
      ...darkBaseColors,
      primary: '200 100% 50%',
      primaryForeground: '0 0% 100%',
      accent: '200 100% 40%',
      accentForeground: '0 0% 100%',
      background: '220 50% 8%',
      card: '220 50% 12%',
      sidebarBackground: '220 50% 6%',
      sidebarPrimary: '200 100% 50%',
      commandSuccess: '160 100% 40%',
      commandInfo: '200 100% 50%',
      glow: '200 100% 50%'
    },
    borderRadius: '0.75rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    animation: {
      duration: '0.3s',
      easing: 'ease-in-out'
    },
    effects: {
      blur: '12px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      glow: '0 0 30px rgba(59, 130, 246, 0.6)'
    }
  },

  forest: {
    name: 'Forest',
    description: 'Tema inspirado na natureza e florestas',
    mode: 'light',
    colors: {
      ...baseColors,
      primary: '142 76% 36%',
      primaryForeground: '0 0% 100%',
      accent: '142 76% 30%',
      accentForeground: '0 0% 100%',
      background: '120 20% 98%',
      card: '120 20% 96%',
      sidebarBackground: '120 20% 94%',
      sidebarPrimary: '142 76% 36%',
      commandSuccess: '142 76% 36%',
      commandInfo: '142 76% 36%',
      glow: '142 76% 36%'
    },
    borderRadius: '1rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    animation: {
      duration: '0.25s',
      easing: 'ease-out'
    },
    effects: {
      blur: '10px',
      shadow: '0 6px 20px rgba(34, 197, 94, 0.15)',
      glow: '0 0 25px rgba(34, 197, 94, 0.4)'
    }
  },

  sunset: {
    name: 'Sunset',
    description: 'Tema com cores quentes do pôr do sol',
    mode: 'dark',
    colors: {
      ...darkBaseColors,
      primary: '30 100% 50%',
      primaryForeground: '0 0% 100%',
      accent: '15 100% 60%',
      accentForeground: '0 0% 100%',
      background: '20 30% 8%',
      card: '20 30% 12%',
      sidebarBackground: '20 30% 6%',
      sidebarPrimary: '30 100% 50%',
      commandSuccess: '142 76% 36%',
      commandWarning: '30 100% 50%',
      glow: '30 100% 50%'
    },
    borderRadius: '0.5rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    animation: {
      duration: '0.4s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    effects: {
      blur: '15px',
      shadow: '0 10px 40px rgba(251, 146, 60, 0.2)',
      glow: '0 0 35px rgba(251, 146, 60, 0.5)'
    }
  },

  midnight: {
    name: 'Midnight',
    description: 'Tema escuro elegante para uso noturno',
    mode: 'dark',
    colors: {
      ...darkBaseColors,
      primary: '240 100% 60%',
      primaryForeground: '0 0% 100%',
      accent: '240 100% 50%',
      accentForeground: '0 0% 100%',
      background: '240 10% 4%',
      card: '240 10% 8%',
      sidebarBackground: '240 10% 2%',
      sidebarPrimary: '240 100% 60%',
      commandSuccess: '142 76% 36%',
      commandInfo: '240 100% 60%',
      glow: '240 100% 60%'
    },
    borderRadius: '0.25rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    animation: {
      duration: '0.15s',
      easing: 'ease-out'
    },
    effects: {
      blur: '6px',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      glow: '0 0 20px rgba(59, 130, 246, 0.4)'
    }
  },

  candy: {
    name: 'Candy',
    description: 'Tema colorido e divertido',
    mode: 'light',
    colors: {
      ...baseColors,
      primary: '320 100% 60%',
      primaryForeground: '0 0% 100%',
      accent: '280 100% 70%',
      accentForeground: '0 0% 100%',
      background: '300 20% 98%',
      card: '300 20% 96%',
      sidebarBackground: '300 20% 94%',
      sidebarPrimary: '320 100% 60%',
      commandSuccess: '142 76% 36%',
      commandInfo: '320 100% 60%',
      glow: '320 100% 60%'
    },
    borderRadius: '1.5rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    animation: {
      duration: '0.5s',
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    effects: {
      blur: '20px',
      shadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
      glow: '0 0 40px rgba(236, 72, 153, 0.6)'
    }
  },

  corporate: {
    name: 'Corporate',
    description: 'Tema profissional para ambientes corporativos',
    mode: 'light',
    colors: {
      ...baseColors,
      primary: '220 90% 30%',
      primaryForeground: '0 0% 100%',
      accent: '220 90% 25%',
      accentForeground: '0 0% 100%',
      background: '220 20% 98%',
      card: '220 20% 96%',
      sidebarBackground: '220 20% 94%',
      sidebarPrimary: '220 90% 30%',
      commandSuccess: '142 76% 36%',
      commandInfo: '220 90% 30%',
      glow: '220 90% 30%'
    },
    borderRadius: '0.25rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    animation: {
      duration: '0.2s',
      easing: 'ease-out'
    },
    effects: {
      blur: '4px',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      glow: '0 0 15px rgba(30, 64, 175, 0.3)'
    }
  },

  terminal: {
    name: 'Terminal',
    description: 'Tema inspirado em terminais clássicos',
    mode: 'dark',
    colors: {
      ...darkBaseColors,
      primary: '120 100% 50%',
      primaryForeground: '0 0% 0%',
      accent: '120 100% 40%',
      accentForeground: '0 0% 0%',
      background: '0 0% 0%',
      card: '0 0% 5%',
      foreground: '120 100% 50%',
      cardForeground: '120 100% 50%',
      popover: '0 0% 5%',
      popoverForeground: '120 100% 50%',
      sidebarBackground: '0 0% 2%',
      sidebarForeground: '120 100% 50%',
      sidebarPrimary: '120 100% 50%',
      sidebarPrimaryForeground: '0 0% 0%',
      commandSuccess: '120 100% 50%',
      commandError: '0 100% 50%',
      commandWarning: '60 100% 50%',
      commandInfo: '200 100% 50%',
      glow: '120 100% 50%'
    },
    borderRadius: '0rem',
    fontFamily: 'JetBrains Mono, Consolas, monospace',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    animation: {
      duration: '0.1s',
      easing: 'linear'
    },
    effects: {
      blur: '0px',
      shadow: 'none',
      glow: '0 0 10px rgba(0, 255, 0, 0.5)'
    }
  },

  custom: {
    name: 'Custom',
    description: 'Tema personalizado pelo usuário',
    mode: 'system',
    colors: baseColors,
    borderRadius: '0.5rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    animation: {
      duration: '0.2s',
      easing: 'ease-out'
    },
    effects: {
      blur: '8px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(59, 130, 246, 0.5)'
    }
  }
}

// Utility functions
export function applyThemeToCSS(theme: ThemeConfig): void {
  const root = document.documentElement
  
  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVar, value)
  })
  
  // Apply other properties
  root.style.setProperty('--radius', theme.borderRadius)
  root.style.setProperty('--font-family', theme.fontFamily)
  
  // Apply font sizes
  Object.entries(theme.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value)
  })
  
  // Apply spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value)
  })
  
  // Apply animation
  root.style.setProperty('--animation-duration', theme.animation.duration)
  root.style.setProperty('--animation-easing', theme.animation.easing)
  
  // Apply effects
  root.style.setProperty('--blur', theme.effects.blur)
  root.style.setProperty('--shadow', theme.effects.shadow)
  root.style.setProperty('--glow', theme.effects.glow)
}

export function exportThemeAsCSS(theme: ThemeConfig): string {
  let css = `/* ${theme.name} Theme */\n`
  css += `/* ${theme.description} */\n\n`
  
  css += `:root {\n`
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    css += `  ${cssVar}: ${value};\n`
  })
  css += `  --radius: ${theme.borderRadius};\n`
  css += `  --font-family: ${theme.fontFamily};\n`
  css += `}\n\n`
  
  return css
}

export function importThemeFromJSON(jsonString: string): ThemeConfig {
  try {
    const theme = JSON.parse(jsonString)
    return theme as ThemeConfig
  } catch (error) {
    console.error('Error importing theme:', error)
    return themePresets.default
  }
}

export function exportThemeAsJSON(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2)
} 
