const {
  cacheExchange,
  createClient,
  debugExchange,
  errorExchange,
  fetchExchange,
  ssrExchange,
} = require("urql");

// urql v5 dropped defaultExchanges; expose a compatible export for code that still expects it.
const defaultExchanges = [cacheExchange, fetchExchange];

// Create a comprehensive export object that matches urql v4 API
const urqlCompat = {
  cacheExchange,
  createClient,
  debugExchange,
  errorExchange,
  fetchExchange,
  ssrExchange,
  defaultExchanges,
};

// Export both as named exports and as default for maximum compatibility
module.exports = urqlCompat;

// Ensure default export contains all properties
module.exports.default = urqlCompat;

// Also ensure individual properties are accessible directly
Object.keys(urqlCompat).forEach(key => {
  module.exports[key] = urqlCompat[key];
});
