import { createClient, cacheExchange, fetchExchange } from "urql";

import { GRAPHQL_ENDPOINT } from "@/domain/env";
import { flag } from "@/flags/flag";

// Conditional import based on NODE_ENV to avoid webpack alias issues
let devtoolsExchanges = [];
if (process.env.NODE_ENV === "development") {
  try {
    const devtools = require("./devtools.dev");
    devtoolsExchanges = devtools.devtoolsExchanges || [];
  } catch (e) {
    console.warn("Devtools not available in production build");
  }
}

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
