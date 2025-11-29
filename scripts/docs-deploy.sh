#!/bin/bash

# Vizualni Admin Documentation Deployment Script
# This script builds and deploys the VitePress documentation

set -e

echo "🚀 Starting Vizualni Admin documentation deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📁 Checking current directory...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the vizualni-admin root directory.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Package.json found${NC}"

# Check if VitePress is installed
echo -e "${BLUE}📦 Checking VitePress installation...${NC}"
if ! yarn list --pattern "vitepress" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  VitePress not found, installing...${NC}"
    yarn add --dev -W vitepress@latest vue@latest
fi

echo -e "${GREEN}✅ VitePress is ready${NC}"

# Clean previous build
echo -e "${BLUE}🧹 Cleaning previous build...${NC}"
rm -rf .vitepress/dist
echo -e "${GREEN}✅ Previous build cleaned${NC}"

# Build the documentation
echo -e "${BLUE}🏗️  Building documentation...${NC}"
yarn docs:build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Documentation built successfully${NC}"
else
    echo -e "${RED}❌ Error: Documentation build failed${NC}"
    exit 1
fi

# Build summary
echo -e "${BLUE}📊 Build summary:${NC}"
BUILD_SIZE=$(du -sh .vitepress/dist | cut -f1)
PAGE_COUNT=$(find .vitepress/dist -name "*.html" | wc -l)
ASSET_SIZE=$(du -sh .vitepress/dist/assets | cut -f1)

echo -e "   Total size: ${GREEN}${BUILD_SIZE}${NC}"
echo -e "   HTML pages: ${GREEN}${PAGE_COUNT}${NC}"
echo -e "   Assets: ${GREEN}${ASSET_SIZE}${NC}"

# Start preview server if requested
if [ "$1" == "--preview" ]; then
    echo -e "${BLUE}🌐 Starting preview server...${NC}"
    echo -e "${GREEN}📖 Documentation will be available at: http://localhost:4173/vizualni-admin/${NC}"
    echo -e "${YELLOW}💡 Press Ctrl+C to stop the server${NC}"
    yarn docs:preview
else
    echo -e "${GREEN}🎉 Documentation deployment complete!${NC}"
    echo -e "${BLUE}📁 Build output: .vitepress/dist/${NC}"
    echo -e "${YELLOW}💡 Run './scripts/docs-deploy.sh --preview' to start preview server${NC}"
fi

# Instructions for GitHub Pages deployment
echo -e "${BLUE}📋 For GitHub Pages deployment:${NC}"
echo -e "   1. Run: ${GREEN}yarn docs:build${NC}"
echo -e "   2. Push to GitHub"
echo -e "   3. Enable GitHub Pages in repository settings"
echo -e "   4. Select source: 'Deploy from a branch'"
echo -e "   5. Select branch: 'main' and folder: '/docs' or '/(.vitepress/dist)'"

echo -e "${GREEN}✨ All done! Your Vizualni Admin documentation is ready! 🚀${NC}"