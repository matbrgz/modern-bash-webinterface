import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { ThemeConfig, ThemePreset, ThemeContext as IThemeContext } from '@shellui/shared'
import { themePresets, applyThemeToCSS, importThemeFromJSON, exportThemeAsJSON } from '../utils/themes'

interface AdvancedThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemePreset
  storageKey?: string
}

const initialState: IThemeContext = {
  currentTheme: themePresets.default,
  availableThemes: Object.values(themePresets),
  setTheme: () => null,
  customizeTheme: () => null,
  resetTheme: () => null,
  exportTheme: () => '',
  importTheme: () => null,
}

const AdvancedThemeProviderContext = createContext<IThemeContext>(initialState)

export function AdvancedThemeProvider({
  children,
  defaultTheme = 'default',
  storageKey = 'shellui-advanced-theme',
}: AdvancedThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        return importThemeFromJSON(saved)
      } catch {
        return themePresets[defaultTheme]
      }
    }
    return themePresets[defaultTheme]
  })

  const [availableThemes] = useState<ThemeConfig[]>(Object.values(themePresets))

  // Apply theme to CSS when theme changes
  useEffect(() => {
    applyThemeToCSS(currentTheme)
    
    // Save to localStorage
    localStorage.setItem(storageKey, exportThemeAsJSON(currentTheme))
    
    // Apply dark/light mode class
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (currentTheme.mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(currentTheme.mode)
    }
  }, [currentTheme, storageKey])

  // Listen for system theme changes
  useEffect(() => {
    if (currentTheme.mode === 'system') {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        const systemTheme = mediaQuery.matches ? "dark" : "light"
        root.classList.add(systemTheme)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [currentTheme.mode])

  const setTheme = (theme: ThemePreset | ThemeConfig) => {
    if (typeof theme === 'string') {
      setCurrentTheme(themePresets[theme])
    } else {
      setCurrentTheme(theme)
    }
  }

  const customizeTheme = (customizations: Partial<ThemeConfig>) => {
    setCurrentTheme(prev => ({
      ...prev,
      ...customizations,
      colors: {
        ...prev.colors,
        ...customizations.colors,
      },
      fontSize: {
        ...prev.fontSize,
        ...customizations.fontSize,
      },
      spacing: {
        ...prev.spacing,
        ...customizations.spacing,
      },
      animation: {
        ...prev.animation,
        ...customizations.animation,
      },
      effects: {
        ...prev.effects,
        ...customizations.effects,
      },
    }))
  }

  const resetTheme = () => {
    setCurrentTheme(themePresets.default)
  }

  const exportTheme = (): string => {
    return exportThemeAsJSON(currentTheme)
  }

  const importTheme = (themeData: string) => {
    try {
      const theme = importThemeFromJSON(themeData)
      setCurrentTheme(theme)
    } catch (error) {
      console.error('Failed to import theme:', error)
    }
  }

  const value: IThemeContext = {
    currentTheme,
    availableThemes,
    setTheme,
    customizeTheme,
    resetTheme,
    exportTheme,
    importTheme,
  }

  return (
    <AdvancedThemeProviderContext.Provider value={value}>
      {children}
    </AdvancedThemeProviderContext.Provider>
  )
}

export const useAdvancedTheme = () => {
  const context = useContext(AdvancedThemeProviderContext)

  if (context === undefined)
    throw new Error("useAdvancedTheme must be used within an AdvancedThemeProvider")

  return context
} 
