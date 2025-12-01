declare module "@/graphql/urql-compat" {
  import { Client, Exchange, ExchangeIO } from "urql";

  export const cacheExchange: Exchange;
  export const fetchExchange: Exchange;
  export const debugExchange: Exchange;
  export const errorExchange: Exchange;
  export const ssrExchange: (params?: { initialState?: any; isClient?: boolean; }) => Exchange;
  export const defaultExchanges: Exchange[];
  export const createClient: (options: any) => Client;
}