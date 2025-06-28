#!/bin/bash

# Script para migrar a estrutura atual para monorepo
echo "🚀 Migrando para estrutura de monorepo..."

# Criar estrutura de diretórios
mkdir -p packages/server/src
mkdir -p packages/client/src
mkdir -p packages/shared/src
mkdir -p packages/sdk/src

# Mover arquivos do servidor
echo "📦 Movendo arquivos do servidor..."
cp -r src/server/* packages/server/src/ 2>/dev/null || true
cp -r src/types.ts packages/server/src/ 2>/dev/null || true

# Mover arquivos do cliente
echo "📦 Movendo arquivos do cliente..."
cp -r src/client/* packages/client/ 2>/dev/null || true

# Mover tipos para shared
echo "📦 Movendo tipos para shared..."
cp src/types.ts packages/shared/src/ 2>/dev/null || true

# Mover componentes de tema para SDK
echo "📦 Movendo componentes de tema para SDK..."
mkdir -p packages/sdk/src/components
mkdir -p packages/sdk/src/hooks
mkdir -p packages/sdk/src/utils
mkdir -p packages/sdk/src/hocs
mkdir -p packages/sdk/src/constants

# Copiar componentes de tema
cp src/client/src/components/advanced-theme-provider.tsx packages/sdk/src/components/ThemeProvider.tsx 2>/dev/null || true
cp src/client/src/components/theme-customizer.tsx packages/sdk/src/components/ThemeCustomizer.tsx 2>/dev/null || true
cp src/client/src/components/theme-preview.tsx packages/sdk/src/components/ThemePreview.tsx 2>/dev/null || true

# Copiar hooks
cp src/client/src/hooks/useCommandTheme.ts packages/sdk/src/hooks/useCommandTheme.ts 2>/dev/null || true

# Copiar utilitários
cp src/client/src/lib/themes.ts packages/sdk/src/utils/themes.ts 2>/dev/null || true

# Copiar tipos de tema
cp src/client/src/types/theme.ts packages/shared/src/theme.ts 2>/dev/null || true

# Criar package.json para server
echo "📝 Criando package.json para server..."
cat > packages/server/package.json << 'EOF'
{
  "name": "@shellui/server",
  "version": "1.0.0",
  "description": "ShellUI Backend Server",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "build": "bun build src/index.ts --outdir dist --target node",
    "start": "NODE_ENV=production bun run dist/index.js",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@shellui/shared": "workspace:*",
    "@elysiajs/cors": "^1.3.3",
    "@elysiajs/jwt": "^1.3.1",
    "@elysiajs/static": "^1.3.0",
    "@elysiajs/websocket": "^0.2.8",
    "@types/ws": "^8.18.1",
    "elysia": "^1.3.5",
    "js-yaml": "^4.1.0",
    "ws": "^8.18.3",
    "zod": "^3.25.67"
  },
  "devDependencies": {
    "@types/bun": "^1.2.17",
    "@types/js-yaml": "^4.0.9",
    "@types/node": "22",
    "typescript": "5"
  },
  "keywords": ["shellui", "backend", "elysia", "bun"],
  "author": "Your Name",
  "license": "MIT"
}
EOF

# Criar package.json para client
echo "📝 Criando package.json para client..."
cat > packages/client/package.json << 'EOF'
{
  "name": "@shellui/client",
  "version": "1.0.0",
  "description": "ShellUI Frontend Client",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@shellui/shared": "workspace:*",
    "@shellui/sdk": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "lucide-react": "^0.263.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  },
  "keywords": ["shellui", "frontend", "react", "vite"],
  "author": "Your Name",
  "license": "MIT"
}
EOF

# Criar tsconfig para server
echo "📝 Criando tsconfig para server..."
cat > packages/server/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Criar tsconfig para client
echo "📝 Criando tsconfig para client..."
cat > packages/client/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Criar tsconfig.node.json para client
echo "📝 Criando tsconfig.node.json para client..."
cat > packages/client/tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# Copiar configurações do cliente
cp src/client/vite.config.ts packages/client/ 2>/dev/null || true
cp src/client/tailwind.config.js packages/client/ 2>/dev/null || true
cp src/client/postcss.config.js packages/client/ 2>/dev/null || true
cp src/client/components.json packages/client/ 2>/dev/null || true
cp src/client/index.html packages/client/ 2>/dev/null || true

echo "✅ Migração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. cd packages/shared && bun install && bun run build"
echo "2. cd packages/sdk && bun install && bun run build"
echo "3. cd packages/server && bun install"
echo "4. cd packages/client && bun install"
echo "5. Na raiz: bun run dev"
echo ""
echo "🔧 Estrutura criada:"
echo "packages/"
echo "├── shared/     # Tipos compartilhados"
echo "├── sdk/        # SDK para customização"
echo "├── server/     # Backend Bun/ElysiaJS"
echo "└── client/     # Frontend React/Vite" 
