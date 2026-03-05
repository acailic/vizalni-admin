import { Trans } from "@lingui/macro";
import { Box, Button, darken, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AnimatePresence } from "framer-motion";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  ComponentProps,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDebounce } from "use-debounce";

import { BrowseFilter, DataCubeAbout } from "@/browse/lib/filters";
import { buildURLFromBrowseParams, isOdsIframe } from "@/browse/lib/params";
import { useDataGovSearch } from "@/browse/lib/use-data-gov-search";
import { useRedirectToLatestCube } from "@/browse/lib/use-redirect-to-latest-cube";
import { BrowseStateProvider, useBrowseContext } from "@/browse/model/context";
import { DataGovDatasetResults } from "@/browse/ui/data-gov-dataset-results";
import { DatasetMetadataSingleCube } from "@/browse/ui/dataset-metadata-single-cube";
import {
  DataSetPreview,
  DataSetPreviewProps,
} from "@/browse/ui/dataset-preview";
import {
  DatasetResults,
  DatasetResultsProps,
} from "@/browse/ui/dataset-results";
import { SearchDatasetControls } from "@/browse/ui/search-dataset-controls";
import { SearchDatasetInput } from "@/browse/ui/search-dataset-input";
import { SearchFilters } from "@/browse/ui/search-filters";
import { SelectDatasetBanner } from "@/browse/ui/select-dataset-banner";
import { CHART_RESIZE_EVENT_TYPE } from "@/charts/shared/use-size";
import { ContentWrapper } from "@/components/content-wrapper";
import { Flex } from "@/components/flex";
import { Footer } from "@/components/footer";
import {
  DURATION,
  MotionBox,
  navPresenceProps,
  smoothPresenceProps,
} from "@/components/presence";
import {
  PanelBodyWrapper,
  PanelLayout,
} from "@/configurator/components/layout";
import { sourceToLabel } from "@/domain/data-source";
import { GRAPHQL_ENDPOINT } from "@/domain/env";
import { truthy } from "@/domain/types";
import {
  DataCubeOrganization,
  DataCubeTermset,
  DataCubeTheme,
  SearchCubeFilterType,
  useDataCubeMetadataQuery,
  useSearchCubesQuery,
} from "@/graphql/query-hooks";
import { Icon } from "@/icons";
import { useConfiguratorState, useLocale } from "@/src";
import { maybeWindow } from "@/utils/maybe-window";
import { softJSONParse } from "@/utils/soft-json-parse";
import { useResizeObserver } from "@/utils/use-resize-observer";

export const SelectDatasetStep = (
  props: Omit<ComponentProps<typeof SelectDatasetStepInner>, "variant"> & {
    /**
     * Is passed to the content component. At this level, it controls which whether the
     * browsing state is synced with the URL or not.
     * At the SelectDatasetStepContent level, it tweaks UI elements.
     * /!\ It should not change during the lifetime of the component.
     */
    variant: "page" | "drawer";
  }
) => {
  return (
    <BrowseStateProvider syncWithUrl={props.variant === "page"}>
      <SelectDatasetStepInner {...props} />
    </BrowseStateProvider>
  );
};

const SelectDatasetStepInner = ({
  datasetPreviewProps,
  datasetResultsProps,
  dataset: propsDataset,
  onClickBackLink,
  onCreateChartFromDataset,
  variant = "page",
}: {
  datasetPreviewProps?: Partial<DataSetPreviewProps>;
  datasetResultsProps?: Partial<DatasetResultsProps>;
  onClickBackLink?: (e: MouseEvent<HTMLButtonElement>) => void;
  onCreateChartFromDataset?: (
    e: MouseEvent<HTMLAnchorElement>,
    datasetIri: string
  ) => void;
  dataset?: string | undefined;
  variant?: "page" | "drawer";
}) => {
  const locale = useLocale();
  const [{ state, dataSource }] = useConfiguratorState() as unknown as [
    { state: any; dataSource: any },
  ];
  const browseState = useBrowseContext();
  const {
    search,
    order,
    includeDrafts,
    filters,
    dataset: browseDataset,
  } = browseState;
  const dataset = propsDataset ?? browseDataset;
  const router = useRouter();
  const odsIframe = isOdsIframe(router.query);
  const classes = useStyles({ datasetPresent: !!dataset, odsIframe });
  const windowRef = maybeWindow();
  const isStaticExport =
    !!process.env.NEXT_PUBLIC_BASE_PATH ||
    (windowRef ? windowRef.location.hostname.includes("github.io") : false);
  const useDataGovFallback =
    isStaticExport && GRAPHQL_ENDPOINT === "/api/graphql";
  const [isScrolled, setIsScrolled] = useState(false);

  const [debouncedQuery] = useDebounce(search, 500, { leading: true });
  const debouncedQueryString = debouncedQuery ?? "";
  const handleHeightChange = useCallback(
    ({ height }: { width: number; height: number }) => {
      window.parent.postMessage({ type: CHART_RESIZE_EVENT_TYPE, height }, "*");
    },
    []
  );
  const [ref] = useResizeObserver<HTMLDivElement>(handleHeightChange);
  const backLink = useMemo(() => {
    const backParameters = softJSONParse(router.query.previous as string);

    if (!backParameters) {
      return "/browse";
    }

    return buildURLFromBrowseParams(backParameters);
  }, [router.query]);

  const queryFilters = useMemo(() => {
    if (!filters) {
      return [];
    }

    return (
      filters
        // Subthemes are filtered on client side.
        .filter(
          (d): d is Exclude<BrowseFilter, DataCubeAbout> =>
            d.__typename !== SearchCubeFilterType.DataCubeAbout
        )
        .map((d) => {
          const type = SearchCubeFilterType[d.__typename];
          return {
            type,
            label: d.label,
            value: d.iri,
          };
        })
    );
  }, [filters]);

  // Use the debounced query value here only!
  const [{ data, fetching, error }] = useSearchCubesQuery({
    variables: {
      sourceType: dataSource.type,
      sourceUrl: dataSource.url,
      locale,
      query: debouncedQuery,
      order,
      includeDrafts,
      filters: queryFilters,
    },
    pause: !!dataset || useDataGovFallback,
  });
  const dataGovSearch = useDataGovFallback
    ? useDataGovSearch(debouncedQueryString)
    : undefined;

  useRedirectToLatestCube({
    dataSource,
    datasetIri: dataset,
    // Skip redirect when we fallback to the REST API because we don't have cube IRIs.
    pause: useDataGovFallback,
  });

  const { allCubes, cubes } = useMemo(() => {
    if (!data || data.searchCubes.length === 0) {
      return {
        allCubes: [],
        cubes: [],
      };
    }

    const subthemeFilters = filters.filter(
      (d) => d.__typename === "DataCubeAbout"
    );

    if (subthemeFilters.length === 0) {
      return {
        allCubes: data.searchCubes,
        cubes: data.searchCubes,
      };
    }

    const subthemes = subthemeFilters.map((d) => d.iri);

    return {
      allCubes: data.searchCubes,
      cubes: data.searchCubes.filter((d: any) => {
        return d.cube.subthemes.some((d: any) => subthemes.includes(d.iri));
      }),
    };
  }, [data, filters]);

  const themes: DataCubeTheme[] = useMemo(() => {
    return sortBy(
      uniqBy(
        cubes
          .flatMap((d: any) => d.cube.themes)
          .map((d: any) => ({ ...d, __typename: "DataCubeTheme" })),
        (d: any) => d.iri
      ),
      (d: any) => d.label
    );
  }, [cubes]);

  const orgs: DataCubeOrganization[] = useMemo(() => {
    return sortBy(
      uniqBy(
        cubes
          .map((d: any) => d.cube.creator)
          .filter((d: any) => d?.iri)
          .filter(truthy)
          .map((d: any) => ({ ...d, __typename: "DataCubeOrganization" })),
        (d: any) => d.iri
      ),
      (d: any) => d.label
    );
  }, [cubes]);

  const termsets: DataCubeTermset[] = useMemo(() => {
    return sortBy(
      uniqBy(
        cubes.flatMap((d: any) =>
          (d as any).cube.termsets.map((d: any) => ({
            ...d,
            __typename: "DataCubeTermset",
          }))
        ),
        (d: any) => d.iri
      ),
      (d: any) => d.label
    );
  }, [cubes]);

  const pageTitle = useMemo(() => {
    return queryFilters
      .map((queryFilter) => {
        const searchList = (() => {
          switch (queryFilter.type) {
            case SearchCubeFilterType.DataCubeTheme:
              return themes;
            case SearchCubeFilterType.DataCubeOrganization:
              return orgs;
            case SearchCubeFilterType.DataCubeTermset:
              return termsets;
            case SearchCubeFilterType.DataCubeAbout:
            case SearchCubeFilterType.TemporalDimension:
              return [];
            default:
              return [];
          }
        })();
        const foundQueryFilter = (
          searchList as { iri: string; label?: string }[]
        ).find(({ iri }) => iri === queryFilter.value);

        return (foundQueryFilter ?? queryFilter).label;
      })
      .join(", ");
  }, [orgs, queryFilters, termsets, themes]);

  const dataCubeMetadataQuery = useDataCubeMetadataQuery({
    variables: {
      sourceType: dataSource.type,
      sourceUrl: dataSource.url,
      locale,
      cubeFilter: {
        iri: dataset ?? "",
      },
    },
    pause: !dataset,
  });
  const [{ data: dataCubeMetadata }] = dataCubeMetadataQuery;

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (state !== "SELECTING_DATASET") {
    return null;
  }

  if (useDataGovFallback) {
    return (
      <div ref={odsIframe ? ref : null}>
        <SelectDatasetBanner dataset={undefined} variant={variant} />
        <ContentWrapper
          sx={
            odsIframe
              ? { maxWidth: "unset !important", px: "8px !important" }
              : {}
          }
        >
          <PanelLayout type="LM" className={classes.panelLayout}>
            <PanelBodyWrapper type="M" className={classes.panelMiddle}>
              <MotionBox key="filters" {...navPresenceProps}>
                <Typography variant="h2" sx={{ mb: 3 }}>
                  <Trans id="browse.dataset.find">
                    Pronađite dataset sa data.gov.rs
                  </Trans>
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }} color="grey.700">
                  <Trans id="browse.dataset.find.details">
                    Ovaj statički prikaz koristi direktan data.gov.rs API zato
                    što GitHub Pages ne hostuje /api/graphql. Pretraga podržava
                    ključne reči, a izbor dataset-a vodi direktno na portal.
                  </Trans>
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }} color="grey.700">
                  {locale === "en"
                    ? "Search below queries data.gov.rs datasets directly."
                    : "Pretraga ispod direktno pretražuje data.gov.rs datasete."}
                </Typography>
                <DataGovDatasetResults
                  results={dataGovSearch?.results ?? []}
                  fetching={dataGovSearch?.fetching ?? false}
                  error={dataGovSearch?.error}
                />
              </MotionBox>
            </PanelBodyWrapper>
          </PanelLayout>
        </ContentWrapper>
      </div>
    );
  }

  return (
    <div ref={odsIframe ? ref : null}>
      <SelectDatasetBanner dataset={dataset} variant={variant} />
      <Box
        sx={{
          borderBottom:
            odsIframe || variant === "drawer"
              ? "none"
              : (t) => `1px solid ${t.palette.cobalt[100]}`,
        }}
      >
        <ContentWrapper
          sx={
            odsIframe
              ? { maxWidth: "unset !important", px: "8px !important" }
              : {}
          }
        >
          <AnimatePresence mode="wait">
            {dataset ? (
              <MotionBox
                key="navigation"
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                // To match mode="wait" enter / exit animation duration
                transition={{ duration: odsIframe ? 0 : DURATION * 2 }}
                style={{ width: "100%" }}
              >
                <Flex
                  sx={(theme) => ({
                    justifyContent: odsIframe ? "flex-end" : "space-between",
                    alignItems: "center",
                    pt: odsIframe ? 12 : variant == "drawer" ? 10 : 6,
                    pb: 6,

                    [theme.breakpoints.down("md")]: {
                      flexWrap: "wrap",
                      gap: 2,
                    },
                  })}
                >
                  {odsIframe ? null : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <NextLink href={backLink} passHref legacyBehavior>
                        <Button
                          variant="outlined"
                          size="sm"
                          startIcon={<Icon name="arrowLeft" size={20} />}
                          onClick={onClickBackLink}
                          sx={{
                            minHeight: 48,
                            px: 3,
                            borderRadius: 2,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "translateX(-2px)",
                              boxShadow: 2,
                            },
                          }}
                        >
                          <Trans id="dataset-preview.back-to-results">
                            Back to the datasets
                          </Trans>
                        </Button>
                      </NextLink>
                      {dataset && (
                        <Typography variant="body2" color="text.secondary">
                          <Trans id="browse.breadcrumb.datasets">
                            Datasets
                          </Trans>{" "}
                          / {dataCubeMetadata?.dataCubeMetadata.title}
                        </Typography>
                      )}
                    </Box>
                  )}
                  {onCreateChartFromDataset ? (
                    <Button
                      component="a"
                      size="sm"
                      target={odsIframe ? "_blank" : undefined}
                      endIcon={
                        <Icon
                          name={odsIframe ? "legacyLinkExternal" : "arrowRight"}
                          size={20}
                        />
                      }
                      onClick={(e) => onCreateChartFromDataset?.(e, dataset)}
                    >
                      {!odsIframe ? (
                        <Trans id="browse.dataset.create-visualization">
                          Create a visualization
                        </Trans>
                      ) : (
                        <Trans id="browse.dataset.create-visualization-visualize">
                          Create with Vizualni Admin
                        </Trans>
                      )}
                    </Button>
                  ) : (
                    <NextLink
                      href={`/create/new?cube=${
                        dataCubeMetadata?.dataCubeMetadata.iri
                      }&dataSource=${sourceToLabel(dataSource)}`}
                      passHref
                      legacyBehavior={!odsIframe}
                      target={odsIframe ? "_blank" : undefined}
                    >
                      <Button
                        size="sm"
                        endIcon={
                          <Icon
                            name={
                              odsIframe ? "legacyLinkExternal" : "arrowRight"
                            }
                            size={20}
                          />
                        }
                        sx={
                          odsIframe
                            ? {
                                // Could be extracted in case we have more
                                // openData.swiss dependencies
                                backgroundColor: "#009688",

                                "&:hover": {
                                  backgroundColor: darken("#009688", 0.2),
                                },
                              }
                            : null
                        }
                      >
                        {!odsIframe ? (
                          <Trans id="browse.dataset.create-visualization">
                            Create a visualization
                          </Trans>
                        ) : (
                          <Trans id="browse.dataset.create-visualization-visualize">
                            Create with Vizualni Admin
                          </Trans>
                        )}
                      </Button>
                    </NextLink>
                  )}
                </Flex>
              </MotionBox>
            ) : null}
          </AnimatePresence>
        </ContentWrapper>
      </Box>
      <ContentWrapper
        sx={
          odsIframe
            ? { maxWidth: "unset !important", px: "8px !important" }
            : {}
        }
      >
        <PanelLayout
          type={odsIframe ? "M" : "LM"}
          className={classes.panelLayout}
        >
          {odsIframe ? null : (
            <PanelBodyWrapper type="L" className={classes.panelLeft}>
              {!dataset && (
                <Box
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "background.paper",
                    boxShadow: isScrolled
                      ? "0 2px 8px rgba(0,0,0,0.1)"
                      : "none",
                    transition: "box-shadow 0.3s ease",
                    p: 3,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    <Trans id="browse.filters.title">Filters</Trans>
                  </Typography>
                  {queryFilters.length > 0 && (
                    <Typography variant="body2" color="primary.main">
                      {queryFilters.length} active filter
                      {queryFilters.length > 1 ? "s" : ""}
                    </Typography>
                  )}
                </Box>
              )}
              <AnimatePresence mode="wait">
                {dataset ? (
                  <MotionBox key="metadata" {...navPresenceProps}>
                    <MotionBox {...smoothPresenceProps}>
                      <DatasetMetadataSingleCube
                        datasetIri={dataset}
                        dataSource={dataSource}
                      />
                    </MotionBox>
                  </MotionBox>
                ) : (
                  <MotionBox key="search-filters" {...navPresenceProps}>
                    <SearchFilters
                      cubes={allCubes}
                      themes={themes}
                      orgs={orgs}
                      termsets={termsets}
                      disableNavLinks={variant === "drawer"}
                    />
                  </MotionBox>
                )}
              </AnimatePresence>
            </PanelBodyWrapper>
          )}
          <PanelBodyWrapper type="M" className={classes.panelMiddle}>
            <AnimatePresence mode="wait">
              {dataset ? (
                <MotionBox
                  key="preview"
                  {...navPresenceProps}
                  transition={{
                    ...navPresenceProps.transition,
                    duration: odsIframe
                      ? 0
                      : navPresenceProps.transition.duration,
                  }}
                >
                  <DataSetPreview
                    dataSetIri={dataset}
                    dataSource={dataSource}
                    dataCubeMetadataQuery={dataCubeMetadataQuery}
                    odsIframe={odsIframe}
                    {...datasetPreviewProps}
                  />
                </MotionBox>
              ) : (
                <MotionBox key="filters" {...navPresenceProps}>
                  <AnimatePresence>
                    {variant === "drawer" ? (
                      <div
                        key="select-dataset"
                        style={{ marginTop: "0.125rem", marginBottom: "2rem" }}
                      >
                        <Typography variant="h2">
                          <Trans id="chart.datasets.add-dataset-drawer.title">
                            Select dataset
                          </Trans>
                        </Typography>
                        <SearchDatasetInput
                          browseState={browseState}
                          searchFieldProps={{
                            sx: {
                              "&&": {
                                maxWidth: "unset",
                              },
                            },
                          }}
                        />
                      </div>
                    ) : null}
                    {queryFilters.length > 0 && (
                      <>
                        <Head>
                          <title key="title">
                            {pageTitle} - Vizualni Admin
                          </title>
                        </Head>
                        <MotionBox
                          key="query-filters"
                          {...{
                            initial: {
                              transform: "translateY(-16px)",
                              height: 0,
                              marginBottom: 0,
                              opacity: 0,
                            },
                            animate: {
                              transform: "translateY(0px)",
                              height: "auto",
                              marginBottom: 16,
                              opacity: 1,
                            },
                            exit: {
                              transform: "translateY(-16px)",
                              height: 0,
                              marginBottom: 0,
                              opacity: 0,
                            },
                            transition: {
                              duration: DURATION,
                            },
                          }}
                        >
                          <Typography
                            key="filters"
                            className={classes.filters}
                            variant="h1"
                            sx={{
                              fontSize: { xs: "1.5rem", md: "2rem" },
                              fontWeight: 700,
                              lineHeight: 1.2,
                              mb: 2,
                            }}
                          >
                            {pageTitle}
                          </Typography>
                        </MotionBox>
                      </>
                    )}
                  </AnimatePresence>
                  <SearchDatasetControls
                    browseState={browseState}
                    cubes={cubes}
                  />
                  <DatasetResults
                    fetching={fetching}
                    error={error}
                    cubes={cubes}
                    datasetResultProps={() => ({ showDimensions: true })}
                    {...datasetResultsProps}
                  />
                </MotionBox>
              )}
            </AnimatePresence>
          </PanelBodyWrapper>
        </PanelLayout>
      </ContentWrapper>
      {variant == "page" && !odsIframe ? (
        <Box sx={{ mt: 8, borderTop: "2px solid rgba(0,0,0,0.05)" }}>
          <Footer sx={{ width: "100%", mx: "auto", borderTopWidth: 0 }} />
        </Box>
      ) : null}
    </div>
  );
};

const useStyles = makeStyles<
  Theme,
  { datasetPresent: boolean; odsIframe: boolean }
>((theme) => ({
  panelLayout: {
    position: "static",
    height: "auto",
    margin: "auto",
    marginTop: ({ odsIframe }) => (odsIframe ? 0 : theme.spacing(12)),
    backgroundColor: theme.palette.background.paper,
    transition: "margin-top 0.5s ease",
    gap: theme.spacing(4),
    px: { xs: 2, md: 4 },
    py: 4,
  },
  panelLeft: {
    marginBottom: theme.spacing(12),
    boxShadow: "none",
    outline: "none",
    transition: "padding-top 0.5s ease",
    padding: theme.spacing(3),

    [theme.breakpoints.up("md")]: {
      position: ({ datasetPresent }) => (datasetPresent ? "static" : "sticky"),
      top: ({ datasetPresent }) => (datasetPresent ? 0 : theme.spacing(8)),
      overflowY: "auto",
      minHeight: "100vh",
      maxHeight: ({ datasetPresent }) => (datasetPresent ? "none" : "100vh"),
      marginBottom: "unset",
      paddingBottom: ({ datasetPresent }) =>
        datasetPresent ? 0 : theme.spacing(16),
      width: "320px",
    },
    [theme.breakpoints.down("md")]: {
      display: ({ datasetPresent }) => (datasetPresent ? "none" : "block"),
    },
  },
  panelMiddle: {
    gridColumnStart: "middle",
    gridColumnEnd: "right",
    backgroundColor: theme.palette.background.paper,
    transition: "padding-top 0.5s ease",
    paddingTop: theme.spacing(6),

    [theme.breakpoints.up("md")]: {
      marginLeft: ({ odsIframe }) => (odsIframe ? 0 : theme.spacing(8)),
    },
    [theme.breakpoints.down("md")]: {
      paddingTop: theme.spacing(4),
    },
  },
  filters: {
    display: "block",
    color: theme.palette.grey[800],
  },
}));
