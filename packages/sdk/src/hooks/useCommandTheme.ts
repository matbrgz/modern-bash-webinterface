import { useEffect } from 'react'
import { useAdvancedTheme } from '../components/advanced-theme-provider'
import { CommandTheme } from '../types/theme'

interface UseCommandThemeProps {
  commandId: string
  category?: string
  tags?: string[]
  status?: 'success' | 'error' | 'warning' | 'info'
  commandThemes?: CommandTheme[]
}

export function useCommandTheme({
  commandId,
  category,
  tags = [],
  status,
  commandThemes = []
}: UseCommandThemeProps) {
  const { currentTheme, customizeTheme } = useAdvancedTheme()

  useEffect(() => {
    // Find matching command theme
    const matchingTheme = commandThemes.find(ct => {
      // Check if command ID matches
      if (ct.id === commandId) return true
      
      // Check if category matches
      if (ct.conditions?.category && ct.conditions.category === category) return true
      
      // Check if any tags match
      if (ct.conditions?.tags && ct.conditions.tags.some(tag => tags.includes(tag))) return true
      
      // Check if status matches
      if (ct.conditions?.status && ct.conditions.status === status) return true
      
      return false
    })

    if (matchingTheme) {
      // Apply command-specific theme
      customizeTheme(matchingTheme.theme)
      
      // Return cleanup function to restore original theme
      return () => {
        // This will be handled by the theme provider when component unmounts
        // or when another command theme is applied
      }
    }
  }, [commandId, category, tags, status, commandThemes, customizeTheme])

  return {
    hasCommandTheme: commandThemes.some(ct => 
      ct.id === commandId || 
      ct.conditions?.category === category ||
      ct.conditions?.tags?.some(tag => tags.includes(tag)) ||
      ct.conditions?.status === status
    )
  }
} 
