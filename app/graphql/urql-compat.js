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

module.exports = {
  cacheExchange,
  createClient,
  debugExchange,
  errorExchange,
  fetchExchange,
  ssrExchange,
  defaultExchanges,
};
