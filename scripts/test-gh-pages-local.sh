#!/bin/bash

# Test script for GitHub Pages local development
# This script tests various routes to ensure they work correctly

echo "🧪 Testing GitHub Pages local development..."
echo

# Build for GitHub Pages
echo "1. Building for GitHub Pages..."
yarn build:gh-pages-local

# Start the server in background
echo -e "\n2. Starting server on port 3001..."
PORT=3001 yarn serve:gh-pages &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Test routes
echo -e "\n3. Testing routes..."

# Test home page
echo "   Testing: http://localhost:3001/vizualni-admin/"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/vizualni-admin/

# Test /cene/ route
echo "   Testing: http://localhost:3001/vizualni-admin/cene/"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/vizualni-admin/cene/

# Test static assets
echo "   Testing: http://localhost:3001/vizualni-admin/_next/static/"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/vizualni-admin/_next/static/

echo -e "\n4. Cleaning up..."
kill $SERVER_PID 2>/dev/null

echo -e "\n✅ Test complete!"
echo "   To manually test, run: yarn serve:gh-pages"
echo "   Then visit: http://localhost:3000/vizualni-admin/"