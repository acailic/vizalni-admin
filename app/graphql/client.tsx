import { cacheExchange, createClient, fetchExchange } from "@urql/core";

import { GRAPHQL_ENDPOINT } from "@/domain/env";
import { flag } from "@/flags/flag";

import { devtoolsExchanges } from "./devtools";

export const client = createClient({
  url: GRAPHQL_ENDPOINT,
  exchanges: [...devtoolsExchanges, cacheExchange, fetchExchange],
  fetchOptions: {
    headers: getHeaders(),
  },
});

function getHeaders() {
  const debug = flag("debug");
  const disableCache = flag("server-side-cache.disable");

  return {
    "x-visualize-debug": debug ? "true" : "",
    "x-visualize-cache-control": disableCache ? "no-cache" : "",
  };
}
