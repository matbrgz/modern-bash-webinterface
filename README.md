# ShellUI

Um interface web moderno para executar comandos shell, inspirado no OliveTin mas construído com tecnologias modernas.

![ShellUI](https://img.shields.io/badge/ShellUI-Modern%20Shell%20Interface-blue)

## Características

- 🚀 **Interface Moderna** - Construído com React, Tailwind CSS e shadcn/ui
- ⚡ **Rápido** - Backend em Bun/ElysiaJS para máxima performance  
- 🔒 **Seguro** - Suporte para autenticação e controle de acesso
- 📱 **Responsivo** - Funciona perfeitamente em desktop, tablet e mobile
- 🌙 **Dark Mode** - Suporte nativo para tema claro/escuro
- 🔄 **Tempo Real** - Logs em tempo real via WebSocket
- 📝 **Configurável** - Simples configuração em YAML

## Instalação

```bash
# Clone o repositório
git clone https://github.com/yourusername/shellui.git
cd shellui

# Instale as dependências
bun install

# Instale as dependências do cliente
cd src/client && bun install && cd ../..
```

## Configuração

Crie um arquivo `config.yaml` na raiz do projeto:

```yaml
title: "Meu ShellUI"
theme: system # light, dark ou system

auth:
  enabled: false
  users:
    - username: admin
      password: admin123
      roles: [admin]

commands:
  - id: hello-world
    title: "Hello World"
    description: "Um simples comando de teste"
    icon: Terminal
    shell: /bin/bash
    command: echo "Hello, World!"
    
  - id: list-files
    title: "Listar Arquivos"
    description: "Lista arquivos em um diretório"
    icon: Folder
    shell: /bin/bash
    command: ls -la {{ directory }}
    args:
      - name: directory
        type: text
        label: "Diretório"
        placeholder: "/home/user"
        default: "."
        required: true
        
  - id: system-info
    title: "Informações do Sistema"
    description: "Mostra informações sobre o sistema"
    icon: Info
    category: "Sistema"
    shell: /bin/bash
    command: |
      echo "=== SISTEMA ==="
      uname -a
      echo ""
      echo "=== CPU ==="
      lscpu | grep "Model name"
      echo ""
      echo "=== MEMÓRIA ==="
      free -h
    timeout: 5000
    
  - id: restart-service
    title: "Reiniciar Serviço"
    description: "Reinicia um serviço do sistema"
    icon: RefreshCw
    category: "Sistema"
    shell: /bin/bash
    command: sudo systemctl restart {{ service }}
    confirm: true
    args:
      - name: service
        type: select
        label: "Serviço"
        required: true
        options:
          - value: nginx
            label: "Nginx"
          - value: mysql
            label: "MySQL"
          - value: docker
            label: "Docker"
```

## Uso

### Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento
bun run dev
```

O servidor estará disponível em http://localhost:3000 e o cliente em http://localhost:5173

### Produção

```bash
# Compila o projeto
bun run build

# Inicia o servidor de produção
bun run start
```

## Tipos de Argumentos

ShellUI suporta vários tipos de argumentos para seus comandos:

- **text** - Campo de texto simples
- **textarea** - Campo de texto multi-linha
- **password** - Campo de senha (oculto)
- **number** - Campo numérico
- **boolean** - Checkbox
- **select** - Lista dropdown
- **datetime** - Seletor de data e hora

## API

ShellUI expõe uma API REST completa:

- `GET /api/config` - Retorna a configuração pública
- `GET /api/commands` - Lista todos os comandos disponíveis
- `POST /api/commands/:id/execute` - Executa um comando
- `GET /api/commands/executions` - Lista histórico de execuções
- `WS /api/commands/ws` - WebSocket para logs em tempo real

## Variáveis de Ambiente

- `PORT` - Porta do servidor (padrão: 3000)
- `SHELLUI_CONFIG` - Caminho para o arquivo de configuração (padrão: ./config.yaml)
- `JWT_SECRET` - Secret para tokens JWT

## Segurança

- Todos os argumentos são escapados antes da execução
- Suporte para autenticação JWT
- Controle de acesso por comando (ACL)
- Timeout configurável por comando
- Confirmação antes de executar comandos perigosos

## Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## Licença

MIT

## Inspiração

Este projeto foi inspirado no [OliveTin](https://www.olivetin.app/) mas reescrito do zero com tecnologias modernas.
