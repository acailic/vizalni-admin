import * as Urql from "urql/dist/urql.js";

import type { Exchange } from "urql";

// urql v5 no longer exposes `defaultExchanges`; recreate the v4 array shape
const dedupExchange = (Urql as any)["dedupExchange"] as Exchange | undefined;

export const defaultExchanges: Exchange[] = [
  dedupExchange,
  Urql.cacheExchange,
  Urql.fetchExchange,
].filter(Boolean) as Exchange[];

export * from "urql/dist/urql.js";
