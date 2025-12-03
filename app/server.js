const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const compression = require('compression');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Create the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Compression middleware
const compress = compression({
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Don't compress compressed responses
    return !res.getHeader('content-encoding');
  }
});

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);

      // Apply compression to all requests
      compress(req, res, () => {
        handle(req, res, parsedUrl);
      });

    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});