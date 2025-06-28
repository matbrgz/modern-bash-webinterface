# ShellUI SDK - Guia Completo

O ShellUI SDK fornece uma solução completa para criar frontends customizados com sistema de temas avançado.

## 📦 Instalação

```bash
npm install @shellui/sdk @shellui/shared
```

## 🚀 Início Rápido

```tsx
import React from 'react';
import {
  ThemeProvider,
  CommandThemeProvider,
  useAdvancedTheme,
  createCustomTheme
} from '@shellui/sdk';

// Criar tema customizado
const customTheme = createCustomTheme({
  colors: {
    primary: '#8b5cf6',
    secondary: '#a855f7'
  },
  typography: {
    fontFamily: 'JetBrains Mono, monospace'
  }
}, 'my-theme');

function App() {
  return (
    <ThemeProvider 
      initialTheme={customTheme.theme}
      storageKey="my-app-theme"
    >
      <CommandThemeProvider>
        <div>
          <h1>Meu Frontend Customizado</h1>
          {/* Seus componentes aqui */}
        </div>
      </CommandThemeProvider>
    </ThemeProvider>
  );
}
```

## 🎨 Sistema de Temas

### ThemeProvider

O componente principal para gerenciar temas:

```tsx
import { ThemeProvider } from '@shellui/sdk';

<ThemeProvider
  initialTheme={customTheme}
  storageKey="app-theme"
  onThemeChange={(theme) => console.log('Tema mudou:', theme)}
>
  {/* Seu app aqui */}
</ThemeProvider>
```

**Props:**
- `initialTheme`: Tema inicial
- `storageKey`: Chave para salvar no localStorage
- `onThemeChange`: Callback quando o tema muda

### useAdvancedTheme Hook

Hook para acessar e modificar o tema atual:

```tsx
import { useAdvancedTheme } from '@shellui/sdk';

function MyComponent() {
  const { 
    theme, 
    updateTheme, 
    resetTheme, 
    exportTheme, 
    importTheme 
  } = useAdvancedTheme();

  const changeColor = () => {
    updateTheme({
      colors: {
        ...theme.colors,
        primary: '#ff0000'
      }
    });
  };

  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      <button onClick={changeColor}>Mudar Cor</button>
      <button onClick={resetTheme}>Resetar Tema</button>
    </div>
  );
}
```

### Criando Temas Customizados

```tsx
import { createCustomTheme, validateTheme } from '@shellui/sdk';

// Criar tema do zero
const myTheme = createCustomTheme({
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    text: '#1e293b',
    // ... outras cores
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  effects: {
    blur: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px'
    },
    opacity: {
      disabled: '0.5',
      hover: '0.8',
      active: '0.9'
    }
  }
}, 'my-custom-theme');

// Validar tema
const validation = validateTheme(myTheme);
if (!validation.isValid) {
  console.error('Erros no tema:', validation.errors);
}
```

## 🎯 Temas Contextuais

### CommandThemeProvider

Para temas que mudam baseados em comandos:

```tsx
import { CommandThemeProvider } from '@shellui/sdk';

const commandThemeConfig = {
  commandThemes: {
    'ls': {
      colors: {
        primary: '#10b981',
        accent: '#059669'
      }
    },
    'ps': {
      colors: {
        primary: '#f59e0b',
        accent: '#d97706'
      }
    }
  },
  categoryThemes: {
    'system': {
      colors: {
        primary: '#3b82f6',
        background: '#f0f9ff'
      }
    },
    'network': {
      colors: {
        primary: '#8b5cf6',
        background: '#faf5ff'
      }
    }
  },
  tagThemes: {
    'admin': {
      colors: {
        primary: '#dc2626',
        accent: '#b91c1c'
      }
    },
    'dangerous': {
      colors: {
        primary: '#ef4444',
        background: '#fef2f2'
      }
    }
  },
  statusThemes: {
    'running': {
      colors: {
        primary: '#10b981',
        accent: '#059669'
      }
    },
    'error': {
      colors: {
        primary: '#ef4444',
        accent: '#dc2626'
      }
    }
  }
};

<CommandThemeProvider config={commandThemeConfig}>
  {/* Seus componentes aqui */}
</CommandThemeProvider>
```

### useCommandTheme Hook

```tsx
import { useCommandTheme } from '@shellui/sdk';

function CommandExecutor() {
  const { 
    applyCommandTheme, 
    clearCommandTheme, 
    isCommandThemeActive,
    commandTheme 
  } = useCommandTheme();

  const executeCommand = (command) => {
    // Aplicar tema baseado no comando
    applyCommandTheme(command);
    
    // Executar comando...
  };

  const finishCommand = () => {
    // Limpar tema contextual
    clearCommandTheme();
  };

  return (
    <div>
      <button onClick={() => executeCommand({ id: 'ls', category: 'system' })}>
        Execute ls
      </button>
      {isCommandThemeActive && (
        <div>Comando ativo com tema contextual!</div>
      )}
    </div>
  );
}
```

## 🧩 Higher-Order Components (HOCs)

### withTheme

Aplica o tema atual como props ao componente:

```tsx
import { withTheme, WithThemeProps } from '@shellui/sdk';

interface ButtonProps extends WithThemeProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ThemedButton = withTheme<Omit<ButtonProps, keyof WithThemeProps>>(
  ({ children, onClick, theme, updateTheme }) => (
    <button
      onClick={onClick}
      style={{
        backgroundColor: theme.colors.primary,
        color: '#ffffff',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
        border: 'none',
        cursor: 'pointer',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.easeInOut}`,
        boxShadow: theme.shadows.md
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = theme.shadows.lg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }}
    >
      {children}
    </button>
  )
);

// Uso
<ThemedButton onClick={() => console.log('clicked')}>
  Clique aqui
</ThemedButton>
```

### withCommandTheme

Aplica funcionalidades de tema contextual:

```tsx
import { withCommandTheme, WithCommandThemeProps } from '@shellui/sdk';

interface CommandButtonProps extends WithCommandThemeProps {
  command: Command;
  children: React.ReactNode;
}

const CommandButton = withCommandTheme<Omit<CommandButtonProps, keyof WithCommandThemeProps>>(
  ({ command, children, applyCommandTheme, clearCommandTheme, isCommandThemeActive }) => (
    <button
      onClick={() => applyCommandTheme(command)}
      style={{
        backgroundColor: isCommandThemeActive ? '#10b981' : '#3b82f6',
        color: '#ffffff',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  )
);
```

## 🎛️ Componentes de UI

### ThemeCustomizer

Interface para customizar temas:

```tsx
import { ThemeCustomizer } from '@shellui/sdk';

function App() {
  return (
    <div>
      <h1>Meu App</h1>
      <ThemeCustomizer />
    </div>
  );
}
```

### ThemePreview

Preview do tema em tempo real:

```tsx
import { ThemePreview } from '@shellui/sdk';

function App() {
  return (
    <div>
      <h1>Meu App</h1>
      <ThemePreview />
    </div>
  );
}
```

## 🔧 Utilitários

### Manipulação de Temas

```tsx
import { 
  mergeThemes, 
  generateThemeVariants, 
  exportThemeAsJSON, 
  importThemeFromJSON 
} from '@shellui/sdk';

// Mesclar temas
const mergedTheme = mergeThemes(baseTheme, overlayTheme);

// Gerar variantes (light/dark)
const { light, dark } = generateThemeVariants(baseTheme);

// Exportar tema como JSON
const themeJSON = exportThemeAsJSON(theme);

// Importar tema de JSON
const importedTheme = importThemeFromJSON(themeJSON);
```

### Aplicar CSS Variables

```tsx
import { applyThemeToCSS } from '@shellui/sdk';

// Aplicar tema ao CSS
applyThemeToCSS(theme, document.documentElement);
```

## 📱 Exemplo Completo

```tsx
import React from 'react';
import {
  ThemeProvider,
  CommandThemeProvider,
  ThemeCustomizer,
  useAdvancedTheme,
  useCommandTheme,
  createCustomTheme,
  withTheme,
  WithThemeProps
} from '@shellui/sdk';

// Componente customizado com tema
const CustomButton = withTheme<{ children: React.ReactNode; onClick?: () => void }>(
  ({ children, onClick, theme }) => (
    <button
      onClick={onClick}
      style={{
        backgroundColor: theme.colors.primary,
        color: '#ffffff',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
        border: 'none',
        cursor: 'pointer',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.easeInOut}`,
        boxShadow: theme.shadows.md
      }}
    >
      {children}
    </button>
  )
);

// Componente que usa tema contextual
const CommandExecutor = () => {
  const { applyCommandTheme, clearCommandTheme, isCommandThemeActive } = useCommandTheme();
  const { theme } = useAdvancedTheme();

  const handleCommand = (commandId: string) => {
    const mockCommand = {
      id: commandId,
      name: `Command ${commandId}`,
      category: 'system',
      tags: ['admin'],
      status: 'running'
    };
    applyCommandTheme(mockCommand);
  };

  return (
    <div style={{ padding: theme.spacing.lg }}>
      <h2 style={{ 
        color: theme.colors.text, 
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize.xl,
        marginBottom: theme.spacing.md
      }}>
        Command Executor {isCommandThemeActive && '(Theme Active)'}
      </h2>
      
      <div style={{ display: 'flex', gap: theme.spacing.md }}>
        <CustomButton onClick={() => handleCommand('ls')}>
          Execute ls
        </CustomButton>
        <CustomButton onClick={() => handleCommand('ps')}>
          Execute ps
        </CustomButton>
        <CustomButton onClick={clearCommandTheme}>
          Clear Theme
        </CustomButton>
      </div>
    </div>
  );
};

// App principal
const App = () => {
  // Configuração de temas contextuais
  const commandThemeConfig = {
    commandThemes: {
      'ls': { colors: { primary: '#10b981' } },
      'ps': { colors: { primary: '#f59e0b' } }
    },
    categoryThemes: {
      'system': { colors: { primary: '#3b82f6' } }
    },
    tagThemes: {
      'admin': { colors: { primary: '#dc2626' } }
    }
  };

  // Criar tema customizado
  const customTheme = createCustomTheme({
    colors: {
      primary: '#8b5cf6',
      secondary: '#a855f7',
      accent: '#7c3aed'
    },
    typography: {
      fontFamily: 'JetBrains Mono, monospace'
    }
  }, 'custom-purple');

  return (
    <ThemeProvider 
      initialTheme={customTheme.theme}
      storageKey="custom-frontend-theme"
    >
      <CommandThemeProvider config={commandThemeConfig}>
        <div style={{ minHeight: '100vh', backgroundColor: customTheme.theme.colors.background }}>
          <header style={{ 
            padding: '1rem', 
            backgroundColor: customTheme.theme.colors.surface,
            borderBottom: `1px solid ${customTheme.theme.colors.border}`
          }}>
            <h1 style={{ 
              color: customTheme.theme.colors.text,
              fontFamily: customTheme.theme.typography.fontFamily,
              fontSize: customTheme.theme.typography.fontSize['2xl'],
              margin: 0
            }}>
              Custom ShellUI Frontend
            </h1>
          </header>

          <main style={{ padding: '2rem' }}>
            <CommandExecutor />
            
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ 
                color: customTheme.theme.colors.text,
                fontFamily: customTheme.theme.typography.fontFamily,
                marginBottom: '1rem'
              }}>
                Theme Customizer
              </h3>
              <ThemeCustomizer />
            </div>
          </main>
        </div>
      </CommandThemeProvider>
    </ThemeProvider>
  );
};

export default App;
```

## 🎨 Temas Predefinidos

O SDK inclui vários temas predefinidos:

```tsx
import { THEME_PRESETS, DEFAULT_THEME } from '@shellui/sdk';

// Temas disponíveis
const themes = {
  default: THEME_PRESETS.default,
  ocean: THEME_PRESETS.ocean,
  forest: THEME_PRESETS.forest,
  sunset: THEME_PRESETS.sunset,
  midnight: THEME_PRESETS.midnight,
  candy: THEME_PRESETS.candy,
  corporate: THEME_PRESETS.corporate,
  terminal: THEME_PRESETS.terminal
};
```

## 🔍 Debugging

Para debuggar temas:

```tsx
import { useAdvancedTheme } from '@shellui/sdk';

function DebugTheme() {
  const { theme } = useAdvancedTheme();
  
  console.log('Tema atual:', theme);
  
  return (
    <pre style={{ fontSize: '12px', overflow: 'auto' }}>
      {JSON.stringify(theme, null, 2)}
    </pre>
  );
}
```

## 📚 Próximos Passos

1. **Conectar com Backend**: Integre com a API do ShellUI
2. **Componentes Customizados**: Crie componentes específicos para seu caso de uso
3. **Autenticação**: Implemente sistema de autenticação
4. **Persistência**: Salve configurações de tema no backend
5. **Performance**: Otimize para grandes volumes de dados

## 🤝 Suporte

- **Documentação**: Veja os exemplos em `examples/`
- **Issues**: Reporte bugs no GitHub
- **Discussions**: Participe das discussões da comunidade
