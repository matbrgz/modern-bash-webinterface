# Sistema de Temas Avançado - ShellUI

O ShellUI agora possui um sistema de temas avançado que permite aos usuários customizar completamente a aparência da interface, desde cores até animações e efeitos visuais.

## 🎨 Temas Disponíveis

### Temas Predefinidos

1. **Default** - Tema padrão limpo e minimalista
2. **Ocean** - Inspirado no oceano profundo (tons azuis)
3. **Forest** - Inspirado na natureza (tons verdes)
4. **Sunset** - Cores quentes do pôr do sol (tons laranja/vermelho)
5. **Midnight** - Tema escuro elegante para uso noturno
6. **Candy** - Tema colorido e divertido (tons rosa/roxo)
7. **Corporate** - Tema profissional para ambientes corporativos
8. **Terminal** - Inspirado em terminais clássicos (verde sobre preto)

## 🛠️ Como Usar

### Interface Visual

1. Clique no botão **"Customizar Tema"** no canto inferior direito da tela
2. Escolha um tema predefinido ou customize as cores manualmente
3. Use a visualização em tempo real para ver as mudanças
4. Exporte seu tema personalizado para compartilhar com outros

### Configuração via YAML

```yaml
# config.yaml
title: "ShellUI - Modern Shell Interface"
theme: ocean # Tema padrão

# Configuração avançada de tema
theme_config:
  # Tema padrão
  default_preset: "ocean"
  
  # Tema personalizado
  custom_theme:
    name: "Meu Tema Personalizado"
    description: "Tema customizado para minha organização"
    mode: "system" # light, dark, system
    
    # Cores personalizadas (formato HSL)
    colors:
      primary: "220 90% 30%"
      accent: "220 90% 25%"
      background: "220 20% 98%"
      foreground: "220 90% 10%"
      commandSuccess: "142 76% 36%"
      commandError: "0 84% 60%"
      commandWarning: "38 92% 50%"
      commandInfo: "217 91% 60%"
    
    # Tipografia
    fontFamily: "Inter, system-ui, sans-serif"
    borderRadius: "0.5rem"
    
    # Animações
    animation:
      duration: "0.2s"
      easing: "ease-out"
    
    # Efeitos visuais
    effects:
      blur: "8px"
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      glow: "0 0 20px rgba(59, 130, 246, 0.5)"

  # Temas específicos por comando
  command_themes:
    - id: "system-info"
      theme:
        colors:
          primary: "142 76% 36%"
          accent: "142 76% 30%"
    
    - id: "docker-ps"
      theme:
        colors:
          primary: "200 100% 50%"
          accent: "200 100% 40%"
    
    - id: "restart-service"
      theme:
        colors:
          primary: "0 84% 60%"
          accent: "0 84% 50%"
```

## 🎯 Temas Contextuais

O sistema suporta temas que mudam automaticamente baseado no contexto:

### Por Comando
```yaml
command_themes:
  - id: "docker-ps"
    theme:
      colors:
        primary: "200 100% 50%"
```

### Por Categoria
```yaml
command_themes:
  - id: "system-commands"
    conditions:
      category: "Sistema"
    theme:
      colors:
        primary: "142 76% 36%"
```

### Por Tags
```yaml
command_themes:
  - id: "dangerous-commands"
    conditions:
      tags: ["dangerous", "system"]
    theme:
      colors:
        primary: "0 84% 60%"
```

### Por Status
```yaml
command_themes:
  - id: "error-state"
    conditions:
      status: "error"
    theme:
      colors:
        primary: "0 84% 60%"
```

## 🎨 Customização de Cores

### Formato HSL
As cores são definidas no formato HSL (Hue, Saturation, Lightness):
- **Hue**: 0-360 (matiz)
- **Saturation**: 0-100% (saturação)
- **Lightness**: 0-100% (luminosidade)

Exemplo: `"220 90% 30%"` = Azul escuro

### Cores Disponíveis

#### Cores Principais
- `primary` - Cor principal dos botões e elementos de destaque
- `primaryForeground` - Cor do texto sobre fundo primário
- `secondary` - Cor secundária
- `secondaryForeground` - Cor do texto sobre fundo secundário
- `accent` - Cor de destaque
- `accentForeground` - Cor do texto sobre fundo de destaque

#### Cores de Fundo
- `background` - Cor de fundo principal
- `foreground` - Cor do texto principal
- `card` - Cor de fundo dos cards
- `cardForeground` - Cor do texto nos cards
- `popover` - Cor de fundo dos popovers
- `popoverForeground` - Cor do texto nos popovers

#### Cores de Status
- `commandSuccess` - Cor para comandos bem-sucedidos
- `commandError` - Cor para erros
- `commandWarning` - Cor para avisos
- `commandInfo` - Cor para informações

#### Cores de Interface
- `muted` - Cor para elementos suaves
- `mutedForeground` - Cor do texto suave
- `destructive` - Cor para ações destrutivas
- `destructiveForeground` - Cor do texto sobre fundo destrutivo
- `border` - Cor das bordas
- `input` - Cor de fundo dos inputs
- `ring` - Cor do foco

## 🔧 Customização Avançada

### Tipografia
```yaml
fontFamily: "Inter, system-ui, sans-serif"
fontSize:
  xs: "0.75rem"
  sm: "0.875rem"
  base: "1rem"
  lg: "1.125rem"
  xl: "1.25rem"
  "2xl": "1.5rem"
  "3xl": "1.875rem"
```

### Layout
```yaml
borderRadius: "0.5rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  "2xl": "3rem"
```

### Animações
```yaml
animation:
  duration: "0.2s"
  easing: "ease-out" # ease-in, ease-in-out, linear, cubic-bezier()
```

### Efeitos Visuais
```yaml
effects:
  blur: "8px"
  shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  glow: "0 0 20px rgba(59, 130, 246, 0.5)"
```

## 📤 Exportação e Importação

### Exportar Tema
1. Abra o customizador de temas
2. Clique em "Exportar"
3. O arquivo JSON será baixado automaticamente

### Importar Tema
1. Abra o customizador de temas
2. Cole o JSON do tema na área de importação
3. Clique em "Importar"

### Formato JSON
```json
{
  "name": "Meu Tema",
  "description": "Descrição do tema",
  "mode": "system",
  "colors": {
    "primary": "220 90% 30%",
    "accent": "220 90% 25%",
    // ... outras cores
  },
  "fontFamily": "Inter, system-ui, sans-serif",
  "borderRadius": "0.5rem",
  "animation": {
    "duration": "0.2s",
    "easing": "ease-out"
  },
  "effects": {
    "blur": "8px",
    "shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "glow": "0 0 20px rgba(59, 130, 246, 0.5)"
  }
}
```

## 🎯 Casos de Uso

### Ambiente Corporativo
```yaml
theme: corporate
theme_config:
  custom_theme:
    colors:
      primary: "220 90% 30%"
      accent: "220 90% 25%"
    fontFamily: "Inter, system-ui, sans-serif"
    borderRadius: "0.25rem"
```

### Ambiente de Desenvolvimento
```yaml
theme: terminal
theme_config:
  custom_theme:
    fontFamily: "JetBrains Mono, Consolas, monospace"
    colors:
      primary: "120 100% 50%"
      background: "0 0% 0%"
      foreground: "120 100% 50%"
```

### Ambiente de Produção
```yaml
theme: midnight
theme_config:
  custom_theme:
    colors:
      commandSuccess: "142 76% 36%"
      commandError: "0 84% 60%"
      commandWarning: "38 92% 50%"
```

## 🔄 Programação

### Hook useAdvancedTheme
```typescript
import { useAdvancedTheme } from '@/components/advanced-theme-provider'

function MyComponent() {
  const { 
    currentTheme, 
    setTheme, 
    customizeTheme, 
    exportTheme, 
    importTheme 
  } = useAdvancedTheme()

  // Mudar para um tema predefinido
  setTheme('ocean')

  // Customizar tema atual
  customizeTheme({
    colors: {
      primary: '200 100% 50%'
    }
  })

  // Exportar tema
  const themeJSON = exportTheme()

  // Importar tema
  importTheme(themeJSON)
}
```

### Hook useCommandTheme
```typescript
import { useCommandTheme } from '@/hooks/useCommandTheme'

function CommandExecutor({ commandId, category }) {
  useCommandTheme({
    commandId,
    category,
    tags: ['dangerous'],
    status: 'success',
    commandThemes: [
      {
        id: 'dangerous-commands',
        conditions: { tags: ['dangerous'] },
        theme: {
          colors: { primary: '0 84% 60%' }
        }
      }
    ]
  })

  return <div>...</div>
}
```

## 🎨 Dicas de Design

### Contraste
- Mantenha contraste adequado entre texto e fundo
- Use cores de status consistentes (verde=sucesso, vermelho=erro, etc.)

### Acessibilidade
- Teste com diferentes temas de sistema (claro/escuro)
- Considere usuários com daltonismo ao escolher cores

### Performance
- Temas são aplicados via CSS custom properties
- Mudanças são instantâneas e otimizadas
- Temas são salvos no localStorage

### Compatibilidade
- Funciona em todos os navegadores modernos
- Suporte completo para modo escuro/claro
- Responsivo em todos os dispositivos

## 🚀 Próximas Funcionalidades

- [ ] Temas sazonais automáticos
- [ ] Temas baseados em horário do dia
- [ ] Temas colaborativos
- [ ] Galeria de temas da comunidade
- [ ] Temas animados
- [ ] Temas baseados em localização
- [ ] Temas para diferentes tipos de usuário (admin, user, guest) 
