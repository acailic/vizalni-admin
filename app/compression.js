const compression = require('compression');

/**
 * Compression middleware for Next.js
 * Implements Brotli and Gzip compression for optimal performance
 */
const compressionMiddleware = compression({
  // Brotli compression level (1-11, where 11 is best compression but slowest)
  level: 6,
  // Use Brotli compression if available
  brotliEnabled: true,
  // Minimum response size to compress (in bytes)
  threshold: 1024,
  // Content types to compress
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }

    // Don't compress responses with these content-types
    const shouldCompressType = !(
      res.getHeader('Content-Type') || ''
    ).includes('image') &&
    !(
      res.getHeader('Content-Type') || ''
    ).includes('video') &&
    !(
      res.getHeader('Content-Type') || ''
    ).includes('audio');

    return shouldCompressType;
  },
});

module.exports = compressionMiddleware;