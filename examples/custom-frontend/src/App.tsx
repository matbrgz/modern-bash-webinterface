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

// Componente customizado usando o HOC withTheme
const CustomButton = withTheme<{ children: React.ReactNode; onClick?: () => void }>(
  ({ children, onClick, theme }) => (
    <button
      onClick={onClick}
      style={{
        backgroundColor: theme.colors.primary,
        color: '#ffffff',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        border: 'none',
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
        cursor: 'pointer',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.easeInOut}`,
        boxShadow: theme.shadows.md
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = theme.effects.opacity.hover;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = theme.shadows.lg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }}
    >
      {children}
    </button>
  )
);

// Componente que usa o hook useCommandTheme
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
      
      <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
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

// Componente principal da aplicação
const App = () => {
  // Configuração de temas contextuais para comandos
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
      }
    },
    tagThemes: {
      'admin': {
        colors: {
          primary: '#dc2626',
          accent: '#b91c1c'
        }
      }
    }
  };

  // Criar um tema customizado
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
