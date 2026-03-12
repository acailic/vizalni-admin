// import { devtoolsExchange } from "@urql/devtools";
// Temporarily disabled for static export compatibility

import { gqlFlamegraphExchange } from "@/gql-flamegraph/devtool";

export const devtoolsExchanges = [gqlFlamegraphExchange];
