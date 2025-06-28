import { useAdvancedTheme } from './advanced-theme-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { 
  Terminal, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Play,
  Settings
} from 'lucide-react'

interface ThemePreviewProps {
  theme: any
  className?: string
}

export function ThemePreview({ theme, className = '' }: ThemePreviewProps) {
  const { currentTheme } = useAdvancedTheme()

  return (
    <Card className={`w-full max-w-md ${className}`} style={{ 
      backgroundColor: `hsl(${theme.colors?.card || currentTheme.colors.card})`,
      color: `hsl(${theme.colors?.cardForeground || currentTheme.colors.cardForeground})`,
      borderRadius: theme.borderRadius || currentTheme.borderRadius
    }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Preview do Tema
        </CardTitle>
        <CardDescription>
          Visualização em tempo real das mudanças
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Buttons */}
        <div className="space-y-2">
          <Label>Botões</Label>
          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm"
              style={{ 
                backgroundColor: `hsl(${theme.colors?.primary || currentTheme.colors.primary})`,
                color: `hsl(${theme.colors?.primaryForeground || currentTheme.colors.primaryForeground})`
              }}
            >
              <Play className="w-4 h-4 mr-1" />
              Executar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              style={{ 
                borderColor: `hsl(${theme.colors?.border || currentTheme.colors.border})`,
                color: `hsl(${theme.colors?.foreground || currentTheme.colors.foreground})`
              }}
            >
              <Settings className="w-4 h-4 mr-1" />
              Configurar
            </Button>
          </div>
        </div>

        {/* Status badges */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant="default"
              style={{ 
                backgroundColor: `hsl(${theme.colors?.commandSuccess || currentTheme.colors.commandSuccess})`,
                color: 'white'
              }}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Sucesso
            </Badge>
            <Badge 
              variant="destructive"
              style={{ 
                backgroundColor: `hsl(${theme.colors?.commandError || currentTheme.colors.commandError})`,
                color: 'white'
              }}
            >
              <XCircle className="w-3 h-3 mr-1" />
              Erro
            </Badge>
            <Badge 
              variant="secondary"
              style={{ 
                backgroundColor: `hsl(${theme.colors?.commandWarning || currentTheme.colors.commandWarning})`,
                color: 'white'
              }}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Aviso
            </Badge>
            <Badge 
              variant="outline"
              style={{ 
                backgroundColor: `hsl(${theme.colors?.commandInfo || currentTheme.colors.commandInfo})`,
                color: 'white'
              }}
            >
              <Info className="w-3 h-3 mr-1" />
              Info
            </Badge>
          </div>
        </div>

        {/* Input field */}
        <div className="space-y-2">
          <Label>Campo de Entrada</Label>
          <Input 
            placeholder="Digite algo..."
            style={{ 
              backgroundColor: `hsl(${theme.colors?.input || currentTheme.colors.input})`,
              borderColor: `hsl(${theme.colors?.border || currentTheme.colors.border})`,
              color: `hsl(${theme.colors?.foreground || currentTheme.colors.foreground})`
            }}
          />
        </div>

        {/* Color palette */}
        <div className="space-y-2">
          <Label>Paleta de Cores</Label>
          <div className="grid grid-cols-4 gap-2">
            <div 
              className="w-8 h-8 rounded border"
              style={{ 
                backgroundColor: `hsl(${theme.colors?.primary || currentTheme.colors.primary})`,
                borderColor: `hsl(${theme.colors?.border || currentTheme.colors.border})`
              }}
              title="Primária"
            />
            <div 
              className="w-8 h-8 rounded border"
              style={{ 
                backgroundColor: `hsl(${theme.colors?.accent || currentTheme.colors.accent})`,
                borderColor: `hsl(${theme.colors?.border || currentTheme.colors.border})`
              }}
              title="Destaque"
            />
            <div 
              className="w-8 h-8 rounded border"
              style={{ 
                backgroundColor: `hsl(${theme.colors?.secondary || currentTheme.colors.secondary})`,
                borderColor: `hsl(${theme.colors?.border || currentTheme.colors.border})`
              }}
              title="Secundária"
            />
            <div 
              className="w-8 h-8 rounded border"
              style={{ 
                backgroundColor: `hsl(${theme.colors?.muted || currentTheme.colors.muted})`,
                borderColor: `hsl(${theme.colors?.border || currentTheme.colors.border})`
              }}
              title="Muted"
            />
          </div>
        </div>

        {/* Font preview */}
        <div className="space-y-2">
          <Label>Tipografia</Label>
          <div 
            className="text-sm"
            style={{ 
              fontFamily: theme.fontFamily || currentTheme.fontFamily,
              color: `hsl(${theme.colors?.foreground || currentTheme.colors.foreground})`
            }}
          >
            <div className="text-xs">Texto pequeno (xs)</div>
            <div className="text-sm">Texto normal (sm)</div>
            <div className="text-base font-medium">Texto médio (base)</div>
            <div className="text-lg font-semibold">Texto grande (lg)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
