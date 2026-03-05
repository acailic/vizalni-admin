import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { DataGovRsClient, DatasetMetadata } from "@/domain/data-gov-rs";

type UseDataGovSearchResult = {
  results: DatasetMetadata[];
  fetching: boolean;
  error?: Error;
};

const QUERY_EXPANSIONS: Record<string, string[]> = {
  obrazovanje: ["obrazovanje", "skola", "skole", "ucenici", "studenti"],
  zdravstvo: ["zdravstvo", "zdravlje", "bolnica", "bolnice"],
  saobracaj: ["saobracaj", "transport", "nezgode"],
  budzet: ["budzet", "finansije", "javne-finansije"],
  energija: ["energija", "energetika", "elektricna-energija"],
};

const toAscii = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[čć]/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "dj");

const tokenize = (query: string) =>
  toAscii(query)
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);

const getTagCandidates = (query: string): string[] => {
  const tokens = tokenize(query);
  const candidates = new Set<string>();

  for (const token of tokens) {
    candidates.add(token);
    if (QUERY_EXPANSIONS[token]) {
      QUERY_EXPANSIONS[token].forEach((expanded) => candidates.add(expanded));
    }
  }

  const normalizedPhrase = toAscii(query).replace(/\s+/g, "-");
  if (normalizedPhrase.length > 2) {
    candidates.add(normalizedPhrase);
  }

  return Array.from(candidates).slice(0, 6);
};

const rankByQuery = (datasets: DatasetMetadata[], query: string) => {
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    return datasets;
  }

  const scored = datasets
    .map((dataset) => {
      const haystack = [
        dataset.title,
        dataset.description,
        dataset.organization?.name,
        ...(dataset.tags ?? []),
      ]
        .filter(Boolean)
        .map((value) => toAscii(String(value)))
        .join(" ");

      let score = 0;
      for (const token of tokens) {
        if (haystack.includes(token)) {
          score += 1;
        }
      }

      return { dataset, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((item) => item.dataset);
};

const dedupeById = (datasets: DatasetMetadata[]) => {
  const seen = new Set<string>();
  return datasets.filter((dataset) => {
    if (seen.has(dataset.id)) {
      return false;
    }
    seen.add(dataset.id);
    return true;
  });
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

    const runSearch = async () => {
      setState((prev) => ({ ...prev, fetching: true, error: undefined }));

      try {
        const trimmedQuery = debouncedQuery.trim();

        const primary = await client.searchDatasets({
          q: trimmedQuery || undefined,
          page: 1,
          page_size: 20,
        });

        let results = primary.data;

        // data.gov.rs often returns empty results for q-search in Serbian;
        // retry with tag-based searches when q gives nothing.
        if (trimmedQuery && results.length === 0) {
          const tagCandidates = getTagCandidates(trimmedQuery);

          const tagResponses = await Promise.all(
            tagCandidates.map((tag) =>
              client
                .searchDatasets({
                  tag,
                  page: 1,
                  page_size: 10,
                })
                .catch(() => null)
            )
          );

          results = dedupeById(
            tagResponses.flatMap((response) => response?.data ?? [])
          );
        }

        // Last fallback: rank a broader sample locally using token matches.
        if (trimmedQuery && results.length === 0) {
          const broadSample = await client.searchDatasets({
            page: 1,
            page_size: 100,
          });
          results = rankByQuery(broadSample.data, trimmedQuery).slice(0, 20);
        }

        if (cancelled) return;
        setState({ results, fetching: false });
      } catch (err: unknown) {
        if (cancelled) return;
        const error =
          err instanceof Error
            ? err
            : new Error("Greška pri učitavanju podataka");
        setState({ results: [], fetching: false, error });
      }
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [client, debouncedQuery]);

  return state;
};
