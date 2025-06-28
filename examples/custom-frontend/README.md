# ShellUI Custom Frontend Example

Este é um exemplo de como criar um frontend customizado usando o SDK do ShellUI.

## Características

- **Tema Avançado**: Sistema completo de temas com customização em tempo real
- **Temas Contextuais**: Temas que mudam baseados no comando executado
- **HOCs**: Higher-Order Components para aplicar temas facilmente
- **Hooks**: Hooks personalizados para gerenciar estado dos temas
- **Componentes Reutilizáveis**: Componentes que se adaptam automaticamente ao tema

## Como usar

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra http://localhost:3001 no seu navegador

## Estrutura do Projeto

```
src/
├── App.tsx              # Componente principal
├── main.tsx             # Ponto de entrada
└── index.css            # Estilos base
```

## Funcionalidades Demonstradas

### 1. ThemeProvider
```tsx
<ThemeProvider 
  initialTheme={customTheme.theme}
  storageKey="custom-frontend-theme"
>
  {/* Seu app aqui */}
</ThemeProvider>
```

### 2. CommandThemeProvider
```tsx
<CommandThemeProvider config={commandThemeConfig}>
  {/* Componentes que usam temas contextuais */}
</CommandThemeProvider>
```

### 3. HOC withTheme
```tsx
const CustomButton = withTheme<{ children: React.ReactNode }>(
  ({ children, theme }) => (
    <button style={{ backgroundColor: theme.colors.primary }}>
      {children}
    </button>
  )
);
```

### 4. Hook useCommandTheme
```tsx
const { applyCommandTheme, clearCommandTheme } = useCommandTheme();

// Aplicar tema baseado no comando
applyCommandTheme(mockCommand);
```

### 5. ThemeCustomizer
```tsx
<ThemeCustomizer />
```

## Configuração de Temas Contextuais

```tsx
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
```

## Criando Temas Customizados

```tsx
import { createCustomTheme } from '@shellui/sdk';

const customTheme = createCustomTheme({
  colors: {
    primary: '#8b5cf6',
    secondary: '#a855f7'
  },
  typography: {
    fontFamily: 'JetBrains Mono, monospace'
  }
}, 'custom-purple');
```

## Próximos Passos

1. Conecte com o backend ShellUI
2. Adicione mais componentes customizados
3. Implemente autenticação
4. Adicione mais funcionalidades específicas do seu caso de uso 