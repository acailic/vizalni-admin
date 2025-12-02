import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import {
  DataGovRsClient,
  DatasetMetadata,
} from "@/domain/data-gov-rs";

type UseDataGovSearchResult = {
  results: DatasetMetadata[];
  fetching: boolean;
  error?: Error;
};

export const useDataGovSearch = (query: string): UseDataGovSearchResult => {
  const [debouncedQuery] = useDebounce(query, 400);
  const client = useMemo(
    () =>
      // Empty apiUrl falls back to the default data.gov.rs endpoint or proxy.
      new DataGovRsClient({ apiUrl: "" }),
    []
  );
  const [state, setState] = useState<UseDataGovSearchResult>({
    results: [],
    fetching: false,
    error: undefined,
  });

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, fetching: true, error: undefined }));

    client
      .searchDatasets({
        q: debouncedQuery || undefined,
        page: 1,
        page_size: 20,
      })
      .then((res) => {
        if (cancelled) return;
        setState({ results: res.data, fetching: false });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const error =
          err instanceof Error
            ? err
            : new Error("Greška pri učitavanju podataka");
        setState({ results: [], fetching: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [client, debouncedQuery]);

  return state;
};
