import * as Urql from "@urql/core";
import type { Exchange } from "@urql/core";

export * from "urql";

// urql v5 no longer exposes `defaultExchanges`; recreate the v4 array shape
const dedupExchange = (Urql as Record<string, Exchange | undefined>)[
  "dedupExchange"
] as Exchange | undefined;

export const defaultExchanges: Exchange[] = [
  dedupExchange,
  Urql.cacheExchange,
  Urql.fetchExchange,
].filter(Boolean) as Exchange[];
