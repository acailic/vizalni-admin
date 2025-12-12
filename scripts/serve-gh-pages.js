#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const BASE_PATH = '/vizualni-admin';
const OUT_DIR = path.join(__dirname, '..', 'app', 'out');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle base path - strip it if present
  if (pathname.startsWith(BASE_PATH)) {
    pathname = pathname.slice(BASE_PATH.length) || '/';
  }

  // Handle trailing slash - normalize
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Handle SPA routing - serve index.html for non-existent files (except static assets)
  const ext = path.extname(pathname);
  const isStaticAsset = ext in MIME_TYPES;

  // Create file path
  const filePath = path.join(OUT_DIR, pathname);

  // Check if file exists
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT' && !isStaticAsset) {
        // File not found and it's not a static asset, serve index.html (SPA routing)
        fs.readFile(path.join(OUT_DIR, 'index.html'), (indexErr, indexData) => {
          if (indexErr) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Not Found</h1>');
            return;
          }

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexData);
        });
      } else {
        // File not found or other error
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404 - File Not Found</h1><p>URL: ${pathname}</p><p>File: ${filePath}</p>`);
      }
      return;
    }

    // Determine content type
    const contentType = MIME_TYPES[ext] || 'text/plain';

    // Set security headers
    const headers = {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    };

    // Add cache control for static assets
    if (isStaticAsset) {
      headers['Cache-Control'] = 'public, max-age=31536000'; // 1 year
    }

    res.writeHead(200, headers);
    res.end(data);
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 GitHub Pages Preview Server running at:`);
  console.log(`   Local:   http://localhost:${PORT}${BASE_PATH}/`);
  console.log(`   Network: http://localhost:${PORT}${BASE_PATH}/`);
  console.log(`\n💡 This simulates GitHub Pages deployment locally`);
  console.log(`\nPress Ctrl+C to stop\n`);
});