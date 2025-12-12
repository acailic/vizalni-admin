#!/bin/bash

# Start GitHub Pages locally
# This script builds and serves the GitHub Pages version locally

echo "🚀 Starting GitHub Pages local development..."

# Build for GitHub Pages
echo "📦 Building for GitHub Pages..."
yarn build:gh-pages-local

# Start the server
echo "🌐 Starting local server..."
echo "Visit http://localhost:3000/vizualni-admin/ to preview"
echo "Press Ctrl+C to stop"
yarn serve:gh-pages