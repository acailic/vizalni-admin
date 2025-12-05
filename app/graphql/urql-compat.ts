import * as Urql from "urql/dist/urql.js";

export * from "urql/dist/urql.js";

// urql v5 no longer exposes `defaultExchanges`; recreate the v4 array shape
export const defaultExchanges = [Urql.cacheExchange, Urql.fetchExchange];
