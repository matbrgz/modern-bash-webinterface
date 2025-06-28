export type ThemeMode = 'light' | 'dark' | 'system'

export type ThemePreset = 
  | 'default'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'midnight'
  | 'candy'
  | 'corporate'
  | 'terminal'
  | 'custom'

export interface ThemeColors {
  // Core colors
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  
  // Primary colors
  primary: string
  primaryForeground: string
  
  // Secondary colors
  secondary: string
  secondaryForeground: string
  
  // Accent colors
  accent: string
  accentForeground: string
  
  // Muted colors
  muted: string
  mutedForeground: string
  
  // Destructive colors
  destructive: string
  destructiveForeground: string
  
  // Border and input
  border: string
  input: string
  ring: string
  
  // Chart colors
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  
  // Sidebar colors
  sidebarBackground: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarAccentForeground: string
  sidebarBorder: string
  sidebarRing: string
  
  // Custom command-specific colors
  commandSuccess: string
  commandError: string
  commandWarning: string
  commandInfo: string
  
  // Animation and effects
  shadow: string
  glow: string
}

export interface ThemeConfig {
  name: string
  description: string
  mode: ThemeMode
  colors: ThemeColors
  borderRadius: string
  fontFamily: string
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
  }
  animation: {
    duration: string
    easing: string
  }
  effects: {
    blur: string
    shadow: string
    glow: string
  }
}

export interface ThemeContext {
  currentTheme: ThemeConfig
  availableThemes: ThemeConfig[]
  setTheme: (theme: ThemePreset | ThemeConfig) => void
  customizeTheme: (customizations: Partial<ThemeConfig>) => void
  resetTheme: () => void
  exportTheme: () => string
  importTheme: (themeData: string) => void
}

export interface CommandTheme {
  id: string
  theme: Partial<ThemeConfig>
  conditions?: {
    category?: string
    tags?: string[]
    status?: 'success' | 'error' | 'warning' | 'info'
  }
} 