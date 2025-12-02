declare module "@/graphql/urql-compat" {
  import { Exchange } from "urql";

  export const cacheExchange: Exchange;
  export const fetchExchange: Exchange;
  export const debugExchange: Exchange;
  export const errorExchange: Exchange;
  export const ssrExchange: (params?: { initialState?: any; isClient?: boolean; }) => Exchange;
  export const defaultExchanges: Exchange[];
  export const createClient: typeof import("urql").createClient;

  // Default export for compatibility
  const urqlCompat: {
    cacheExchange: Exchange;
    fetchExchange: Exchange;
    debugExchange: Exchange;
    errorExchange: Exchange;
    ssrExchange: (params?: { initialState?: any; isClient?: boolean; }) => Exchange;
    defaultExchanges: Exchange[];
    createClient: typeof import("urql").createClient;
  };

  export default urqlCompat;
}
