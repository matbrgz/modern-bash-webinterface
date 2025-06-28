import { useState } from 'react'
import { useAdvancedTheme } from './advanced-theme-provider'
import { ThemeConfig, ThemePreset } from '../types/theme'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { 
  Palette, 
  Download, 
  Upload, 
  RotateCcw, 
  Eye, 
  Settings,
  Type,
  Layout,
  Zap
} from 'lucide-react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="HSL value (e.g., 200 100% 50%)"
          className="flex-1"
        />
        <div 
          className="w-10 h-10 rounded border"
          style={{ 
            backgroundColor: `hsl(${value})`,
            borderColor: 'hsl(var(--border))'
          }}
        />
      </div>
    </div>
  )
}

export function ThemeCustomizer() {
  const { currentTheme, availableThemes, setTheme, customizeTheme, resetTheme, exportTheme, importTheme } = useAdvancedTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [customTheme, setCustomTheme] = useState<Partial<ThemeConfig>>({})
  const [importData, setImportData] = useState('')

  const handlePresetChange = (preset: ThemePreset) => {
    setTheme(preset)
  }

  const handleColorChange = (key: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }))
  }

  const handleFontSizeChange = (key: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      fontSize: {
        ...prev.fontSize,
        [key]: value
      }
    }))
  }

  const handleSpacingChange = (key: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [key]: value
      }
    }))
  }

  const handleAnimationChange = (key: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      animation: {
        ...prev.animation,
        [key]: value
      }
    }))
  }

  const handleEffectsChange = (key: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [key]: value
      }
    }))
  }

  const applyCustomizations = () => {
    customizeTheme(customTheme)
    setCustomTheme({})
  }

  const handleExport = () => {
    const themeData = exportTheme()
    const blob = new Blob([themeData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (importData.trim()) {
      importTheme(importData)
      setImportData('')
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Palette className="w-4 h-4 mr-2" />
        Customizar Tema
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Personalização de Tema</CardTitle>
            <CardDescription>
              Customize completamente a aparência da interface
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {availableThemes.map((theme) => (
              <Card 
                key={theme.name}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  currentTheme.name === theme.name ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handlePresetChange(theme.name.toLowerCase() as ThemePreset)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{theme.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {theme.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                    />
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                    />
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: `hsl(${theme.colors.background})` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Cores Principais</h3>
              <ColorPicker
                label="Primária"
                value={currentTheme.colors.primary}
                onChange={(value) => handleColorChange('primary', value)}
              />
              <ColorPicker
                label="Secundária"
                value={currentTheme.colors.secondary}
                onChange={(value) => handleColorChange('secondary', value)}
              />
              <ColorPicker
                label="Destaque"
                value={currentTheme.colors.accent}
                onChange={(value) => handleColorChange('accent', value)}
              />
              <ColorPicker
                label="Fundo"
                value={currentTheme.colors.background}
                onChange={(value) => handleColorChange('background', value)}
              />
              <ColorPicker
                label="Texto"
                value={currentTheme.colors.foreground}
                onChange={(value) => handleColorChange('foreground', value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Cores de Comandos</h3>
              <ColorPicker
                label="Sucesso"
                value={currentTheme.colors.commandSuccess}
                onChange={(value) => handleColorChange('commandSuccess', value)}
              />
              <ColorPicker
                label="Erro"
                value={currentTheme.colors.commandError}
                onChange={(value) => handleColorChange('commandError', value)}
              />
              <ColorPicker
                label="Aviso"
                value={currentTheme.colors.commandWarning}
                onChange={(value) => handleColorChange('commandWarning', value)}
              />
              <ColorPicker
                label="Informação"
                value={currentTheme.colors.commandInfo}
                onChange={(value) => handleColorChange('commandInfo', value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t mt-6">
            <Button onClick={applyCustomizations} className="flex-1">
              Aplicar Mudanças
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={resetTheme} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
          </div>

          <div className="space-y-2 pt-4 border-t mt-4">
            <Label>Importar Tema (JSON)</Label>
            <div className="flex gap-2">
              <Textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Cole o JSON do tema aqui..."
                className="flex-1"
                rows={3}
              />
              <Button onClick={handleImport}>
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
