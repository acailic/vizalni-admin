#!/bin/bash

# Local Development Script for vizualni-admin
# This script sets up and runs the development environment

echo "🚀 Starting vizualni-admin local development..."
echo "📁 Working directory: $(pwd)"

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "next dev" || true
pkill -f "next build" || true

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
fi

# Build the library first
echo "🔨 Building library..."
yarn build:lib

# Start development server
echo "🌟 Starting development server..."
echo "📝 The app will be available at: http://localhost:3000"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

yarn dev
