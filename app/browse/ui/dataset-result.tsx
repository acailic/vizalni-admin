import { Trans } from "@lingui/macro";
import { Box, CardProps, Stack, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import sortBy from "lodash/sortBy";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, MouseEvent, useMemo } from "react";

import { getBrowseParamsFromQuery } from "@/browse/lib/params";
import { DateFormat } from "@/browse/ui/date-format";
import { Flex } from "@/components/flex";
import { MaybeTooltip } from "@/components/maybe-tooltip";
import { MotionCard, smoothPresenceProps } from "@/components/presence";
import { Tag } from "@/components/tag";
import { PartialSearchCube } from "@/domain/data";
import { DataCubePublicationStatus } from "@/graphql/query-hooks";
import { useEvent } from "@/utils/use-event";
import { differenceInDays } from "date-fns"; // For freshness indicator

export type DatasetResultProps = ComponentProps<typeof DatasetResult>;

export const DatasetResult = ({
  dataCube: {
    iri,
    publicationStatus,
    title,
    description,
    themes,
    datePublished,
    creator,
    dimensions,
  },
  highlightedTitle,
  highlightedDescription,
  showTags = true,
  disableTitleLink,
  showDimensions,
  onClickTitle,
  ...cardProps
}: {
  dataCube: PartialSearchCube;
  highlightedTitle?: string | null;
  highlightedDescription?: string | null;
  showTags?: boolean;
  disableTitleLink?: boolean;
  showDimensions?: boolean;
  onClickTitle?: (e: MouseEvent<HTMLDivElement>, iri: string) => void;
} & CardProps) => {
  const isDraft = publicationStatus === DataCubePublicationStatus.Draft;
  const router = useRouter();
  const classes = useStyles();

  // Calculate freshness indicator (recently updated if within 7 days)
  const isRecentlyUpdated = useMemo(() => {
    if (!datePublished) return false;
    const daysDiff = differenceInDays(new Date(), new Date(datePublished));
    return daysDiff <= 7;
  }, [datePublished]);

  // Metadata: Dimension count
  const dimensionCount = dimensions?.length || 0;

  const handleTitleClick = useEvent((e: MouseEvent<HTMLDivElement>) => {
    onClickTitle?.(e, iri);

    if (e.defaultPrevented) {
      return;
    }

    const browseParams = getBrowseParamsFromQuery(router.query);
    const query = {
      previous: JSON.stringify(browseParams),
      dataset: iri,
    };
    router.push({ pathname: "/browse", query }, undefined, {
      shallow: true,
      scroll: false,
    });
  });

  return (
    <MotionCard
      elevation={1}
      {...smoothPresenceProps}
      {...cardProps}
      className={clsx(classes.root, cardProps.className)}
    >
      <Stack spacing={3}>
        <Flex justifyContent="space-between" width="100%" alignItems="center">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="monochrome.700" fontWeight={500}>
              {datePublished && <DateFormat date={datePublished} />}
            </Typography>
            {isRecentlyUpdated && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="caption" color="success.main">
                  <Trans id="dataset.freshness.recent">Recently updated</Trans>
                </Typography>
              </Box>
            )}
          </Box>
          {isDraft ? (
            <Tag
              type="draft"
              sx={{ fontWeight: 600, backgroundColor: "warning.light" }}
            >
              <Trans id="dataset.tag.draft">Draft</Trans>
            </Tag>
          ) : null}
        </Flex>
        <Typography
          className={disableTitleLink ? undefined : classes.titleClickable}
          variant="h6"
          fontWeight={700}
          onClick={disableTitleLink ? undefined : handleTitleClick}
          sx={{ color: "text.primary" }}
        >
          {highlightedTitle ? (
            <Box
              className={classes.textWrapper}
              component="span"
              fontWeight={highlightedTitle === title ? 700 : 400}
              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
            />
          ) : (
            title
          )}
        </Typography>
        <Typography
          className={classes.description}
          variant="body2"
          title={description ?? ""}
          sx={{ lineHeight: 1.6, color: "text.secondary" }}
        >
          {highlightedDescription ? (
            <Box
              className={classes.textWrapper}
              component="span"
              dangerouslySetInnerHTML={{ __html: highlightedDescription }}
            />
          ) : (
            description
          )}
        </Typography>
        {/* Metadata Preview */}
        <Flex sx={{ gap: 2, alignItems: "center" }}>
          <Typography variant="caption" color="monochrome.600">
            <Trans id="dataset.metadata.dimensions">
              Dimensions: {dimensionCount}
            </Trans>
          </Typography>
          {/* Add more metadata if available, e.g., data points or file size */}
        </Flex>
      </Stack>
      {/* Improved Tag Layout with Grouping */}
      <Stack spacing={2}>
        {themes && showTags && themes.length > 0 && (
          <Box>
            <Typography variant="caption" color="monochrome.500" sx={{ mb: 1 }}>
              <Trans id="dataset.tags.themes">Themes</Trans>
            </Typography>
            <Flex sx={{ flexWrap: "wrap", gap: 1 }}>
              {sortBy(themes.slice(0, 3), (t) => t.label).map(
                // Limit to 3, add show more if needed
                (t) =>
                  t.iri &&
                  t.label && (
                    <NextLink
                      key={t.iri}
                      href={`/browse/theme/${encodeURIComponent(t.iri)}`}
                      passHref
                      legacyBehavior
                      scroll={false}
                    >
                      <Tag type="theme">{t.label}</Tag>
                    </NextLink>
                  )
              )}
              {themes.length > 3 && (
                <Tag type="theme" sx={{ cursor: "pointer" }}>
                  <Trans id="dataset.tags.show-more">
                    +{themes.length - 3} more
                  </Trans>
                </Tag>
              )}
            </Flex>
          </Box>
        )}
        {(creator?.label || (showDimensions && dimensions?.length)) && (
          <Box>
            <Typography variant="caption" color="monochrome.500" sx={{ mb: 1 }}>
              <Trans id="dataset.tags.details">Details</Trans>
            </Typography>
            <Flex sx={{ flexWrap: "wrap", gap: 1 }}>
              {creator?.label ? (
                <NextLink
                  key={creator.iri}
                  href={`/browse/organization/${encodeURIComponent(creator.iri)}`}
                  passHref
                  legacyBehavior
                  scroll={false}
                >
                  <Tag type="organization">{creator.label}</Tag>
                </NextLink>
              ) : null}
              {showDimensions &&
                dimensions?.length !== undefined &&
                dimensions.length > 0 && (
                  <>
                    {sortBy(
                      dimensions.slice(0, 2),
                      (dimension) => dimension.label
                    ).map(
                      // Limit to 2
                      (dimension) => {
                        return (
                          <MaybeTooltip
                            key={dimension.id}
                            title={
                              dimension.termsets.length > 0 ? (
                                <>
                                  <Typography variant="caption">
                                    <Trans id="dataset-result.dimension-joined-by">
                                      Contains values of
                                    </Trans>
                                    <Stack flexDirection="row" gap={1} mt={1}>
                                      {dimension.termsets.map((termset) => {
                                        return (
                                          <Tag
                                            key={termset.iri}
                                            type="termset"
                                            style={{ flexShrink: 0 }}
                                          >
                                            {termset.label}
                                          </Tag>
                                        );
                                      })}
                                    </Stack>
                                  </Typography>
                                </>
                              ) : null
                            }
                          >
                            <Tag style={{ cursor: "default" }} type="dimension">
                              {dimension.label}
                            </Tag>
                          </MaybeTooltip>
                        );
                      }
                    )}
                    {dimensions.length > 2 && (
                      <Tag type="dimension" sx={{ cursor: "pointer" }}>
                        <Trans id="dataset.tags.show-more">
                          +{dimensions.length - 2} more
                        </Trans>
                      </Tag>
                    )}
                  </>
                )}
            </Flex>
          </Box>
        )}
      </Stack>
    </MotionCard>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(4),
    padding: theme.spacing(6),
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.monochrome[200]}`,
    borderRadius: theme.spacing(2),
    textAlign: "left",
    boxShadow: theme.shadows[1],
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    "&:hover": {
      boxShadow: theme.shadows[4],
      transform: "scale(1.02)",
    },
  },
  textWrapper: {
    "& > b": {
      fontWeight: 700,
    },
  },
  titleClickable: {
    display: "inline-block",
    cursor: "pointer",
    transition: "color 0.2s ease",

    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  description: {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    lineHeight: 1.6,
  },
}));
