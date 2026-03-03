import { BrowseParams } from "@/browse/lib/params";

// Note: SearchCubeFilterType is defined locally due to GraphQL codegen limitations
// with enum re-exports. This is intentional, not a workaround.
enum SearchCubeFilterType {
  TemporalDimension = "TemporalDimension",
  DataCubeTheme = "DataCubeTheme",
  DataCubeOrganization = "DataCubeOrganization",
  DataCubeAbout = "DataCubeAbout",
  DataCubeTermset = "DataCubeTermset",
}

export type DataCubeAbout = {
  __typename: "DataCubeAbout";
  iri: string;
};

// Temporary type definitions until GraphQL export issue is fixed
type DataCubeOrganization = {
  __typename: "DataCubeOrganization";
  iri: string;
  label?: string | null;
};

type DataCubeTermset = {
  __typename: "DataCubeTermset";
  iri: string;
  label?: string | null;
};

type DataCubeTheme = {
  __typename: "DataCubeTheme";
  iri: string;
  label?: string | null;
};

export type BrowseFilter =
  | DataCubeTheme
  | DataCubeOrganization
  | DataCubeAbout
  | DataCubeTermset;

/** Builds the state search filters from query params */
export const getFiltersFromParams = ({
  type,
  subtype,
  subsubtype,
  iri,
  subiri,
  subsubiri,
  topic,
}: BrowseParams) => {
  const filters: BrowseFilter[] = [];

  for (const [t, i] of [
    [type, iri],
    [subtype, subiri],
    [subsubtype, subsubiri],
  ]) {
    if (t && i && (t === "theme" || t === "organization" || t === "termset")) {
      const __typename = (() => {
        switch (t) {
          case "theme":
            return SearchCubeFilterType.DataCubeTheme;
          case "organization":
            return SearchCubeFilterType.DataCubeOrganization;
          case "termset":
            return SearchCubeFilterType.DataCubeTermset;
        }
      })();
      filters.push({
        __typename,
        iri: i,
      });
    }
  }

  if (topic) {
    filters.push({
      __typename: SearchCubeFilterType.DataCubeAbout,
      iri: topic,
    });
  }

  return filters;
};

export const getParamsFromFilters = (filters: BrowseFilter[]) => {
  const params: BrowseParams = {
    type: undefined,
    subtype: undefined,
    subsubtype: undefined,
    iri: undefined,
    subiri: undefined,
    subsubiri: undefined,
    topic: undefined,
  };
  let i = 0;

  for (const filter of filters) {
    const typeAttr = i === 0 ? "type" : i === 1 ? "subtype" : "subsubtype";
    const iriAttr = i === 0 ? "iri" : i === 1 ? "subiri" : "subsubiri";

    switch (filter.__typename) {
      case "DataCubeTheme":
        params[typeAttr] = "theme";
        params[iriAttr] = filter.iri;
        break;
      case "DataCubeOrganization":
        params[typeAttr] = "organization";
        params[iriAttr] = filter.iri;
        break;
      case "DataCubeAbout":
        params.topic = filter.iri;
        break;
      case "DataCubeTermset":
        params[typeAttr] = "termset";
        params[iriAttr] = filter.iri;
        break;
      default:
        // @ts-ignore - exhaustive check
        const _exhaustiveCheck: never = filter;
        throw new Error(`Unknown filter type: ${filter}`);
    }

    i++;
  }

  return params;
};

export const encodeFilter = ({ __typename, iri }: BrowseFilter) => {
  const folder = (() => {
    switch (__typename) {
      case "DataCubeTheme":
        return "theme";
      case "DataCubeOrganization":
        return "organization";
      case "DataCubeAbout":
        return "topic";
      case "DataCubeTermset":
        return "termset";
      default:
        // @ts-ignore - exhaustive check
        const _exhaustiveCheck: never = __typename;
        throw new Error(`Unknown type: ${__typename}`);
    }
  })();

  return `${folder}/${encodeURIComponent(iri)}`;
};
