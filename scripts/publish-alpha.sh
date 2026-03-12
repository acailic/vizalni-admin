#!/bin/bash

# Interactive script to login and publish @vizualni packages to npm
# Usage: ./scripts/publish-alpha.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  @vizualni Alpha Release Publisher${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

# Check current npm login status
echo -e "${YELLOW}Checking npm authentication...${NC}"
if npm whoami &>/dev/null; then
    CURRENT_USER=$(npm whoami)
    echo -e "${GREEN}✓ Already logged in as: $CURRENT_USER${NC}"
else
    echo -e "${YELLOW}Not logged in to npm. Starting login process...${NC}"
    echo ""
    npm login
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Login failed. Aborting.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Successfully logged in!${NC}"
fi

echo ""
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${BLUE}  Package Information${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Show package versions
CORE_VERSION=$(cat packages/core/package.json | grep '"version"' | head -1 | cut -d'"' -f4)
CONNECTORS_VERSION=$(cat packages/connectors/package.json | grep '"version"' | head -1 | cut -d'"' -f4)
REACT_VERSION=$(cat packages/react/package.json | grep '"version"' | head -1 | cut -d'"' -f4)

echo -e "  @vizualni/core:        ${GREEN}v$CORE_VERSION${NC}"
echo -e "  @vizualni/connectors:  ${GREEN}v$CONNECTORS_VERSION${NC}"
echo -e "  @vizualni/react:       ${GREEN}v$REACT_VERSION${NC}"
echo ""

# Confirm publication
echo -e "${YELLOW}This will publish all 3 packages to npm with tag 'alpha'.${NC}"
echo -e "${YELLOW}Packages will be installable via:${NC}"
echo -e "  npm install @vizualni/core@alpha"
echo -e "  npm install @vizualni/connectors@alpha"
echo -e "  npm install @vizualni/react@alpha"
echo ""

read -p "Continue with publication? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Publication cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${BLUE}  Building Packages${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Build all packages
echo -e "${YELLOW}Building @vizualni/core...${NC}"
cd packages/core && npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed for @vizualni/core${NC}"
    exit 1
fi
echo -e "${GREEN}✓ @vizualni/core built${NC}"

echo -e "${YELLOW}Building @vizualni/connectors...${NC}"
cd "$ROOT_DIR/packages/connectors" && npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed for @vizualni/connectors${NC}"
    exit 1
fi
echo -e "${GREEN}✓ @vizualni/connectors built${NC}"

echo -e "${YELLOW}Building @vizualni/react...${NC}"
cd "$ROOT_DIR/packages/react" && npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed for @vizualni/react${NC}"
    exit 1
fi
echo -e "${GREEN}✓ @vizualni/react built${NC}"

cd "$ROOT_DIR"

echo ""
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${BLUE}  Running Tests${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Run tests for all packages
echo -e "${YELLOW}Testing packages...${NC}"
cd packages/core && npm test -- --run
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Tests failed for @vizualni/core${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

cd "$ROOT_DIR/packages/connectors" && npm test -- --run
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Tests failed for @vizualni/connectors${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

cd "$ROOT_DIR/packages/react" && npm test -- --run
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Tests failed for @vizualni/react${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

cd "$ROOT_DIR"

echo ""
echo -e "${GREEN}✓ All tests passed!${NC}"

echo ""
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${BLUE}  Publishing to npm${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Publish packages in dependency order: core -> connectors -> react

echo -e "${YELLOW}Publishing @vizualni/core...${NC}"
cd packages/core && npm publish --tag alpha --access public
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to publish @vizualni/core${NC}"
    exit 1
fi
echo -e "${GREEN}✓ @vizualni/core published!${NC}"

echo -e "${YELLOW}Publishing @vizualni/connectors...${NC}"
cd "$ROOT_DIR/packages/connectors" && npm publish --tag alpha --access public
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to publish @vizualni/connectors${NC}"
    exit 1
fi
echo -e "${GREEN}✓ @vizualni/connectors published!${NC}"

echo -e "${YELLOW}Publishing @vizualni/react...${NC}"
cd "$ROOT_DIR/packages/react" && npm publish --tag alpha --access public
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to publish @vizualni/react${NC}"
    exit 1
fi
echo -e "${GREEN}✓ @vizualni/react published!${NC}"

cd "$ROOT_DIR"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  🎉 Publication Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Packages are now available on npm:"
echo -e "  ${BLUE}https://www.npmjs.com/package/@vizualni/core${NC}"
echo -e "  ${BLUE}https://www.npmjs.com/package/@vizualni/connectors${NC}"
echo -e "  ${BLUE}https://www.npmjs.com/package/@vizualni/react${NC}"
echo ""
echo -e "Install with:"
echo -e "  ${YELLOW}npm install @vizualni/core@alpha @vizualni/connectors@alpha @vizualni/react@alpha${NC}"
echo ""
