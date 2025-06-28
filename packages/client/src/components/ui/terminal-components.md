# Terminal Components

Este documento descreve os componentes de terminal criados para o ShellUI, que fornecem uma interface moderna e responsiva para execução e visualização de comandos de terminal.

## Componentes Disponíveis

### 1. TerminalOutput

Componente para exibir saída de terminal com suporte a streaming e temas.

```tsx
import { TerminalOutput } from '@/components/ui/terminal-output';

<TerminalOutput
  output="Hello World"
  error="Error message"
  status="success"
  isStreaming={false}
  variant="default"
  className="h-96"
/>
```

**Props:**
- `output`: string - Saída do comando
- `error`: string - Mensagem de erro
- `status`: 'idle' | 'running' | 'success' | 'error' - Status da execução
- `isStreaming`: boolean - Se está recebendo dados em tempo real
- `variant`: 'default' | 'dark' | 'light' - Variante de tema
- `className`: string - Classes CSS adicionais

### 2. TerminalConverter

Componente que converte comandos de terminal em cards interativos com shadcn.

```tsx
import { TerminalConverter, TerminalCommand } from '@/components/ui/terminal-converter';

const command: TerminalCommand = {
  id: 'cmd_123',
  command: 'echo "Hello World"',
  output: 'Hello World',
  status: 'success',
  startTime: new Date(),
  endTime: new Date(),
  exitCode: 0
};

<TerminalConverter
  command={command}
  onExecute={(cmd) => console.log('Execute:', cmd)}
  onStop={(id) => console.log('Stop:', id)}
  onCopy={(text) => navigator.clipboard.writeText(text)}
  onDownload={(text, filename) => downloadFile(text, filename)}
  showDebug={false}
/>
```

**Props:**
- `command`: TerminalCommand - Comando a ser exibido
- `onExecute`: (command: TerminalCommand) => void - Callback para executar
- `onStop`: (commandId: string) => void - Callback para parar
- `onCopy`: (text: string) => void - Callback para copiar
- `onDownload`: (text: string, filename: string) => void - Callback para download
- `showDebug`: boolean - Mostrar informações de debug

### 3. TerminalCommandList

Lista de comandos com filtros, busca e diferentes visualizações.

```tsx
import { TerminalCommandList } from '@/components/ui/terminal-command-list';

<TerminalCommandList
  commands={commands}
  onExecute={handleExecute}
  onStop={handleStop}
  onDelete={handleDelete}
  onCopy={handleCopy}
  onDownload={handleDownload}
  onRefresh={handleRefresh}
  showDebug={false}
  variant="default"
/>
```

**Props:**
- `commands`: TerminalCommand[] - Lista de comandos
- `onExecute`: (command: TerminalCommand) => void - Callback para executar
- `onStop`: (commandId: string) => void - Callback para parar
- `onDelete`: (commandId: string) => void - Callback para deletar
- `onCopy`: (text: string) => void - Callback para copiar
- `onDownload`: (text: string, filename: string) => void - Callback para download
- `onRefresh`: () => void - Callback para atualizar
- `showDebug`: boolean - Mostrar informações de debug
- `variant`: 'default' | 'compact' | 'detailed' - Tipo de visualização

## Hook: useTerminalCommands

Hook personalizado para gerenciar comandos de terminal com WebSocket.

```tsx
import { useTerminalCommands } from '@/hooks/use-terminal-commands';

const {
  commands,
  wsStatus,
  executeCommand,
  stopCommand,
  clearCommands,
  isConnected,
  hasRunningCommands,
  totalCommands,
  successfulCommands,
  failedCommands
} = useTerminalCommands({
  onCommandStart: (command) => console.log('Started:', command),
  onCommandComplete: (command) => console.log('Completed:', command),
  autoReconnect: true,
  reconnectInterval: 5000
});
```

**Retorna:**
- `commands`: TerminalCommand[] - Lista de comandos
- `wsStatus`: 'connecting' | 'connected' | 'disconnected' - Status do WebSocket
- `executeCommand`: (command: string, args?: Record<string, any>) => string | null - Executar comando
- `stopCommand`: (commandId: string) => void - Parar comando
- `clearCommands`: () => void - Limpar todos os comandos
- `isConnected`: boolean - Se está conectado
- `hasRunningCommands`: boolean - Se há comandos rodando
- `totalCommands`: number - Total de comandos
- `successfulCommands`: number - Comandos bem-sucedidos
- `failedCommands`: number - Comandos falharam

## Tipos

### TerminalCommand

```tsx
interface TerminalCommand {
  id: string;
  command: string;
  args?: Record<string, any>;
  output?: string;
  error?: string;
  status: 'idle' | 'running' | 'success' | 'error';
  startTime?: Date;
  endTime?: Date;
  exitCode?: number;
}
```

## Exemplo de Uso Completo

```tsx
import React, { useState } from 'react';
import { TerminalCommandList } from '@/components/ui/terminal-command-list';
import { useTerminalCommands } from '@/hooks/use-terminal-commands';
import { toast } from 'sonner';

const TerminalApp: React.FC = () => {
  const {
    commands,
    executeCommand,
    stopCommand,
    removeCommand,
    isConnected
  } = useTerminalCommands();

  const handleExecute = (command: TerminalCommand) => {
    executeCommand(command.command);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  return (
    <div className="container mx-auto p-6">
      <TerminalCommandList
        commands={commands}
        onExecute={handleExecute}
        onStop={stopCommand}
        onDelete={removeCommand}
        onCopy={handleCopy}
        onDownload={handleDownload}
        variant="default"
      />
    </div>
  );
};
```

## Características

### ✅ Suporte a Dark/Light Mode
Todos os componentes usam variáveis CSS do tema e se adaptam automaticamente.

### ✅ Streaming em Tempo Real
Suporte a atualização de saída em tempo real via WebSocket.

### ✅ Filtros e Busca
Busca por comando, saída ou erro, filtros por status.

### ✅ Ações de Comando
- Executar comandos
- Parar execução
- Copiar saída
- Download de arquivos
- Deletar do histórico

### ✅ Debug e Monitoramento
Painel de debug com informações de WebSocket e execução.

### ✅ Responsivo
Interface adaptável para diferentes tamanhos de tela.

### ✅ Acessibilidade
Componentes seguem as melhores práticas de acessibilidade.

## Integração com Backend

Os componentes esperam mensagens WebSocket no formato:

```json
{
  "type": "command_started",
  "commandId": "cmd_123",
  "command": "echo hello"
}

{
  "type": "command_output",
  "commandId": "cmd_123",
  "output": "hello\n"
}

{
  "type": "command_completed",
  "commandId": "cmd_123",
  "exitCode": 0
}
``` 
