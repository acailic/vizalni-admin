import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { DataConnector, DataSchema } from "@vizualni/connectors";
import type { Datum } from "@vizualni/core";

/**
 * State returned by the useConnector hook.
 *
 * Represents the current state of a data fetch operation.
 */
export interface ConnectorState<TMeta = unknown> {
  /**
   * Fetched data array.
   * Undefined until the initial fetch completes successfully.
   */
  data: Datum[] | undefined;

  /**
   * Data schema describing the structure of fetched data.
   * Includes field names, types, and other metadata from the data source.
   */
  schema: DataSchema | undefined;

  /**
   * Loading state indicator.
   * True while a fetch is in progress.
   */
  loading: boolean;

  /**
   * Error if the last fetch failed.
   * Null if no error or if fetch was successful.
   */
  error: Error | null;

  /**
   * Custom metadata returned by the connector.
   * Type varies based on the connector implementation.
   */
  meta: TMeta | undefined;
}

/**
 * Return type for the useConnector hook.
 *
 * Extends ConnectorState with a refetch function for manual data refreshing.
 */
export interface UseConnectorReturn<
  TMeta = unknown,
> extends ConnectorState<TMeta> {
  /**
   * Manually trigger a data refetch.
   * Useful for refresh buttons or retry scenarios.
   */
  refetch: () => void;
}

/**
 * Hook for fetching data using a connector.
 *
 * This hook provides a unified interface for fetching data from any
 * data source that implements the DataConnector interface. It handles:
 * - Async data fetching with loading states
 * - Error handling
 * - Automatic refetching when config changes
 * - Optional enable/disable control
 *
 * @typeParam TConfig - The connector's configuration type
 * @typeParam TMeta - The connector's metadata type (default: unknown)
 *
 * @param connector - The data connector instance to use for fetching
 * @param config - Configuration options for the connector
 * @param options - Hook options
 * @param options.enabled - Whether to fetch data automatically (default: true)
 *
 * @returns UseConnectorReturn with data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * import { useConnector } from "@vizualni/react";
 * import { CsvConnector } from "@vizualni/connectors";
 *
 * function MyChart() {
 *   const { data, loading, error, refetch } = useConnector(
 *     new CsvConnector(),
 *     { url: "/data/sales.csv" }
 *   );
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!data) return null;
 *
 *   return (
 *     <div>
 *       <button onClick={refetch}>Refresh</button>
 *       <LineChart data={data} config={config} width={600} height={400} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With enabled option for conditional fetching
 * const { data } = useConnector(
 *   connector,
 *   config,
 *   { enabled: isAuthenticated }
 * );
 * ```
 *
 * @remarks
 * The hook uses JSON serialization to detect config changes.
 * Complex objects in config should be stable references or JSON-serializable.
 */
export function useConnector<TConfig, TMeta = unknown>(
  connector: DataConnector<TConfig, TMeta>,
  config: TConfig,
  options: { enabled?: boolean } = {}
): UseConnectorReturn<TMeta> {
  const { enabled = true } = options;

  const [state, setState] = useState<ConnectorState<TMeta>>({
    data: undefined,
    schema: undefined,
    loading: false,
    error: null,
    meta: undefined,
  });

  // Serialize config for dependency comparison to avoid infinite loops
  const configKey = useMemo(() => JSON.stringify(config), [config]);

  // Keep track of the latest config for the refetch function
  const configRef = useRef(config);
  configRef.current = config;
  const connectorRef = useRef(connector);
  connectorRef.current = connector;

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await connectorRef.current.fetch(configRef.current);
      setState({
        data: result.data,
        schema: result.schema,
        loading: false,
        error: null,
        meta: result.meta,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, configKey, fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}
