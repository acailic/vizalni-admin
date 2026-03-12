import { Box, Button, Card, Skeleton, Typography } from "@mui/material";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useClient } from "urql";

import { ChartPublished } from "@/components/chart-published";
import { ContentWrapper } from "@/components/content-wrapper";
import { EmbedQueryParams } from "@/components/embed-params";
import { ConfiguratorState } from "@/configurator";
import { GRAPHQL_ENDPOINT } from "@/domain/env";
import { getExampleState1, getExampleState2 } from "@/homepage/constants";
import { HomepageSectionTitle } from "@/homepage/generic";
import { ConfiguratorStateProvider } from "@/src";
import { upgradeConfiguratorState } from "@/utils/chart-config/upgrade-cube";
import { maybeWindow } from "@/utils/maybe-window";
import { useFetchData } from "@/utils/use-fetch-data";

// Detect static export mode where GraphQL API is unavailable
const isStaticExport = () => {
  const windowRef = maybeWindow();
  return (
    !!process.env.NEXT_PUBLIC_BASE_PATH ||
    (windowRef ? windowRef.location.hostname.includes("github.io") : false)
  );
};

const useStaticExportFallback = () => {
  return isStaticExport() && GRAPHQL_ENDPOINT === "/api/graphql";
};

export const Examples = ({
  headline,
  example1Headline,
  example1Description,
  example2Headline,
  example2Description,
}: {
  headline: string;
  example1Headline: string;
  example1Description: string;
  example2Headline: string;
  example2Description: string;
}) => {
  const [state1, setState1] = useState<ConfiguratorState>();
  const [state2, setState2] = useState<ConfiguratorState>();
  const useStaticFallback = useStaticExportFallback();

  useEffect(() => {
    // Skip loading example states in static export mode
    if (useStaticFallback) return;

    const run = async () => {
      (await Promise.all([getExampleState1(), getExampleState2()])).forEach(
        (state, i) => {
          i === 0 ? setState1(state) : setState2(state);
        }
      );
    };

    run();
  }, [useStaticFallback]);

  // In static export mode, show a preview placeholder instead of trying to load data
  if (useStaticFallback) {
    return (
      <Box sx={{ backgroundColor: "background.paper" }}>
        <ContentWrapper sx={{ py: 20 }}>
          <div style={{ width: "100%" }}>
            <HomepageSectionTitle>{headline}</HomepageSectionTitle>
            <Box
              sx={(t) => ({
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "subgrid",
                columnGap: 12,
                [t.breakpoints.up("md")]: {
                  gridTemplateColumns: "1fr 1fr",
                },
              })}
            >
              <StaticExampleCard
                headline={example1Headline}
                description={example1Description}
              />
              <StaticExampleCard
                headline={example2Headline}
                description={example2Description}
              />
            </Box>
          </div>
        </ContentWrapper>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "background.paper" }}>
      <ContentWrapper sx={{ py: 20 }}>
        <div style={{ width: "100%" }}>
          <HomepageSectionTitle>{headline}</HomepageSectionTitle>
          <Box
            sx={(t) => ({
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "subgrid",
              columnGap: 12,
              [t.breakpoints.up("md")]: {
                gridTemplateColumns: "1fr 1fr",
              },
            })}
          >
            <Example
              queryKey="example1"
              configuratorState={state1}
              headline={example1Headline}
              description={example1Description}
            />
            <Example
              queryKey="example2"
              configuratorState={state2}
              headline={example2Headline}
              description={example2Description}
            />
          </Box>
        </div>
      </ContentWrapper>
    </Box>
  );
};

const Example = ({
  queryKey,
  configuratorState,
  headline,
  description,
}: {
  queryKey: string;
  configuratorState?: ConfiguratorState;
  headline: string;
  description: string;
}) => {
  const client = useClient();
  const { data, error } = useFetchData({
    queryKey: [queryKey, configuratorState ? "A" : "B"],
    queryFn: () => {
      return upgradeConfiguratorState(configuratorState!, {
        client,
        dataSource: configuratorState!.dataSource,
      });
    },
    options: { pause: !configuratorState },
  });

  return data ? (
    <ConfiguratorStateProvider chartId="published" initialState={data}>
      <ExampleCard headline={headline} description={description}>
        <ChartPublished
          embedParams={{ removeBorder: true } as EmbedQueryParams}
          shouldShrink={false}
        />
      </ExampleCard>
    </ConfiguratorStateProvider>
  ) : error ? (
    <ExampleCard headline={headline} description={description}>
      <Box
        sx={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          borderRadius: 1,
        }}
      >
        <Typography color="textSecondary">
          Demo temporarily unavailable
        </Typography>
      </Box>
    </ExampleCard>
  ) : (
    <Skeleton variant="rectangular" height={400} />
  );
};

const ExampleCard = ({
  children,
  headline,
  description,
}: {
  children?: ReactNode;
  headline: string;
  description: string;
}) => {
  return (
    <Card
      sx={{
        display: "grid",
        gridTemplateRows: "subgrid",
        gridRow: "span 2",
      }}
    >
      <div>{children}</div>
      <Box sx={{ px: 7, py: 11 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          {headline}
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          {description}
        </Typography>
      </Box>
    </Card>
  );
};

/**
 * Static placeholder card for GitHub Pages deployment where GraphQL API is unavailable.
 * Shows a preview illustration with a CTA to browse real datasets.
 */
const StaticExampleCard = ({
  headline,
  description,
}: {
  headline: string;
  description: string;
}) => {
  return (
    <Card
      sx={{
        display: "grid",
        gridTemplateRows: "subgrid",
        gridRow: "span 2",
      }}
    >
      <Box
        sx={{
          height: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
          borderRadius: 1,
          p: 4,
          gap: 3,
        }}
      >
        {/* Simple chart illustration */}
        <Box
          component="svg"
          viewBox="0 0 200 120"
          sx={{ width: 200, height: 120, opacity: 0.6 }}
        >
          <rect x="20" y="80" width="25" height="30" fill="#0c4076" rx="2" />
          <rect x="55" y="50" width="25" height="60" fill="#0c4076" rx="2" />
          <rect x="90" y="30" width="25" height="80" fill="#0c4076" rx="2" />
          <rect x="125" y="60" width="25" height="50" fill="#0c4076" rx="2" />
          <rect x="160" y="40" width="25" height="70" fill="#0c4076" rx="2" />
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Interaktivni primeri zahtevaju serversku podršku.
          <br />
          Pregledajte datasete da kreirate sopstvene vizualizacije.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/browse"
          size="small"
        >
          Pregledaj datasete
        </Button>
      </Box>
      <Box sx={{ px: 7, py: 11 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          {headline}
        </Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>
          {description}
        </Typography>
      </Box>
    </Card>
  );
};
