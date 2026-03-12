import "urql";

declare module "urql" {
  import { Exchange } from "@urql/core";

  // Added for compatibility with code that still expects this helper
  export const defaultExchanges: Exchange[];
}
