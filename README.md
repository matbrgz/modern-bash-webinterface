# ShellUI - Modern Web Interface for Shell Commands

Uma interface web moderna para executar comandos shell com sistema de temas avançado e SDK para customização.

## 🚀 Características

- **Interface Web Moderna**: Interface limpa e responsiva para executar comandos shell
- **Sistema de Temas Avançado**: Temas completamente customizáveis com preview em tempo real
- **Temas Contextuais**: Temas que mudam baseados no comando, categoria, tags ou status
- **SDK Completo**: SDK para criar frontends customizados
- **Monorepo**: Estrutura organizada com workspaces
- **TypeScript**: Totalmente tipado para melhor desenvolvimento

## 📦 Estrutura do Projeto

```
shellui/
├── packages/
│   ├── client/          # Frontend principal
│   ├── server/          # Backend API
│   ├── sdk/             # SDK para customização
│   └── shared/          # Tipos e utilitários compartilhados
├── examples/
│   └── custom-frontend/ # Exemplo de frontend customizado
├── scripts/             # Scripts de utilidade
└── docs/               # Documentação
```

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/your-username/shellui.git
cd shellui
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo de configuração:
```bash
cp config.example.yaml config.yaml
# Edite config.yaml conforme necessário
```

## 🚀 Uso

### Desenvolvimento

```bash
# Frontend
npm run dev

# Backend
npm run dev:server

# Exemplo customizado
npm run example:custom
```

### Produção

```bash
# Build completo
npm run build

# Iniciar
npm start
```

## 🎨 SDK para Frontends Customizados

O ShellUI fornece um SDK completo para criar frontends customizados:

```tsx
import {
  ThemeProvider,
  CommandThemeProvider,
  ThemeCustomizer,
  useAdvancedTheme,
  withTheme
} from '@shellui/sdk';

// Seu frontend customizado aqui
```

### Exemplo Rápido

```bash
# Criar novo frontend
mkdir my-shellui-frontend
cd my-shellui-frontend
npm init -y
npm install @shellui/sdk @shellui/shared react react-dom
```

Veja o exemplo completo em `examples/custom-frontend/`.

## 🎨 Sistema de Temas

### Temas Predefinidos

- **Default**: Tema limpo e moderno
- **Ocean**: Tons de azul e verde
- **Forest**: Tons de verde e marrom
- **Sunset**: Tons de laranja e rosa
- **Midnight**: Tema escuro elegante
- **Candy**: Cores vibrantes e divertidas
- **Corporate**: Tema profissional
- **Terminal**: Estilo terminal clássico

### Temas Contextuais

Configure temas que mudam baseados em:

- **Comando específico**: `ls`, `ps`, `git`, etc.
- **Categoria**: `system`, `network`, `database`, etc.
- **Tags**: `admin`, `dangerous`, `monitoring`, etc.
- **Status**: `running`, `success`, `error`, etc.

### Customização

```yaml
# config.yaml
themes:
  commandThemes:
    ls:
      colors:
        primary: "#10b981"
    ps:
      colors:
        primary: "#f59e0b"
  
  categoryThemes:
    system:
      colors:
        primary: "#3b82f6"
  
  tagThemes:
    admin:
      colors:
        primary: "#dc2626"
```

## 📚 Documentação

- [Guia de Temas](docs/THEMES.md)
- [SDK Documentation](docs/SDK.md)
- [API Reference](docs/API.md)
- [Examples](examples/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ElysiaJS](https://elysiajs.com/)
