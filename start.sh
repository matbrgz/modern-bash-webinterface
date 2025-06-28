#!/bin/bash

echo "🚀 Starting ShellUI..."

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install it first:"
    echo "curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    bun install
fi

if [ ! -d "src/client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd src/client && bun install && cd ../..
fi

# Check if config exists
if [ ! -f "config.yaml" ]; then
    echo "📝 Creating config.yaml from example..."
    cp config.example.yaml config.yaml
fi

# Start the application
echo "✨ ShellUI is starting..."
echo "📍 Server: http://localhost:3000"
echo "📍 Client: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"

bun run dev 
