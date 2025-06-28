import { useState, useCallback } from 'react';
import { useAdvancedTheme } from './useAdvancedTheme';
import { Theme, ThemePreset } from '@shellui/shared';

export interface ThemeCustomizerState {
  isOpen: boolean;
  activeTab: 'presets' | 'colors' | 'typography' | 'layout' | 'effects';
  selectedPreset: string;
  customTheme: Partial<Theme>;
}

export const useThemeCustomizer = () => {
  const { theme, updateTheme, resetTheme } = useAdvancedTheme();
  const [state, setState] = useState<ThemeCustomizerState>({
    isOpen: false,
    activeTab: 'presets',
    selectedPreset: 'default',
    customTheme: {}
  });

  const openCustomizer = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const closeCustomizer = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const setActiveTab = useCallback((tab: ThemeCustomizerState['activeTab']) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const selectPreset = useCallback((presetName: string) => {
    setState(prev => ({ ...prev, selectedPreset: presetName }));
  }, []);

  const updateCustomTheme = useCallback((updates: Partial<Theme>) => {
    setState(prev => ({
      ...prev,
      customTheme: { ...prev.customTheme, ...updates }
    }));
  }, []);

  const applyCustomTheme = useCallback(() => {
    const newTheme = { ...theme, ...state.customTheme };
    updateTheme(newTheme);
  }, [theme, state.customTheme, updateTheme]);

  const applyPreset = useCallback((preset: ThemePreset) => {
    updateTheme(preset.theme);
    setState(prev => ({ ...prev, selectedPreset: preset.name }));
  }, [updateTheme]);

  const resetToDefault = useCallback(() => {
    resetTheme();
    setState(prev => ({
      ...prev,
      selectedPreset: 'default',
      customTheme: {}
    }));
  }, [resetTheme]);

  return {
    state,
    openCustomizer,
    closeCustomizer,
    setActiveTab,
    selectPreset,
    updateCustomTheme,
    applyCustomTheme,
    applyPreset,
    resetToDefault
  };
}; 
