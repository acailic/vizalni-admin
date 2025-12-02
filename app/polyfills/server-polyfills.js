// Server-side polyfills for browser globals
if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis;
}

if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
  global.self = global;
}

if (typeof window === 'undefined' && typeof globalThis !== 'undefined') {
  globalThis.window = globalThis;
}