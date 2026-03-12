import * as UrqlCore from "@urql/core";

import type { Exchange } from "@urql/core";

export * from "@urql/core";

// urql v5/v6 dropped the `defaultExchanges` helper; recreate a compatible array.
const dedupExchange = (UrqlCore as any)["dedupExchange"] as
  | Exchange
  | undefined;

export const defaultExchanges: Exchange[] = [
  dedupExchange,
  UrqlCore.cacheExchange,
  UrqlCore.fetchExchange,
].filter(Boolean) as Exchange[];
