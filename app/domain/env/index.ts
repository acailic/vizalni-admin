export const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT ?? 'http://localhost:8870/sparql';

export const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'http://localhost:4000/graphql';

export const WHITELISTED_DATA_SOURCES = JSON.parse(
  process.env.WHITELISTED_DATA_SOURCES ?? '["Prod"]'
);

export const NODE_ENV = process.env.NODE_ENV ?? 'development';