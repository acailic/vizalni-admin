import "@urql/core";

declare module "@urql/core" {
  import type { Exchange } from "@urql/core";

  // Added for compatibility with code that still expects this helper
  export const defaultExchanges: Exchange[];
}
