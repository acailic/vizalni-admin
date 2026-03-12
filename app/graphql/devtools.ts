import { gqlFlamegraphExchange } from "@/gql-flamegraph/devtool";

// Production devtools - only include flamegraph exchange
export const devtoolsExchanges = [gqlFlamegraphExchange];