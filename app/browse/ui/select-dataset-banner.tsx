import { Trans } from "@lingui/macro";
import { Theme, Typography } from "@mui/material";
import {
  DataObject as DataObjectIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { AnimatePresence } from "framer-motion";

import { useBrowseContext } from "@/browse/model/context";
import { SearchDatasetInput } from "@/browse/ui/search-dataset-input";
import { ContentWrapper } from "@/components/content-wrapper";
import {
  __BANNER_MARGIN_CSS_VAR,
  bannerPresenceProps,
  MotionBox,
} from "@/components/presence";
import { useResizeObserver } from "@/utils/use-resize-observer";

export const SelectDatasetBanner = ({
  dataset,
  variant,
}: {
  dataset: string | undefined;
  variant: "page" | "drawer";
}) => {
  const [ref] = useResizeObserver<HTMLDivElement>(({ height }) => {
    if (height) {
      document.documentElement.style.setProperty(
        __BANNER_MARGIN_CSS_VAR,
        `-${height}px`
      );
    }
  });
  const classes = useStyles();
  const show = !dataset && variant === "page";
  const browseState = useBrowseContext();

  return (
    <AnimatePresence>
      {show ? (
        <MotionBox key="banner" ref={ref} {...bannerPresenceProps}>
          <section className={classes.outerWrapper} role="banner">
            <ContentWrapper className={classes.innerWrapper}>
              <div className={classes.content}>
                <DataObjectIcon className={classes.icon} />
                <Typography className={classes.title} variant="h1">
                  Otvoreni podaci Republike Srbije
                </Typography>
                <Typography className={classes.subtitle} variant="h2">
                  <Trans id="browse.datasets.subtitle">
                    Discover and visualize open data
                  </Trans>
                </Typography>
                <Typography className={classes.description} variant="body2">
                  <Trans id="browse.datasets.description">
                    Pregledajte skupove podataka portala data.gov.rs,
                    filtrirajte po kategorijama ili organizacijama ili odmah
                    potražite ključne pojmove. Izaberite dataset da vidite
                    detalje i napravite vizualizaciju.
                  </Trans>
                </Typography>
                <SearchDatasetInput
                  browseState={browseState}
                  searchFieldProps={{
                    InputProps: { startAdornment: <SearchIcon /> },
                  }}
                />
                <div className={classes.suggestions}>
                  <Typography variant="body2">
                    <Trans id="browse.datasets.suggestions">
                      Popular searches: economy, health, education
                    </Trans>
                  </Typography>
                </div>
              </div>
            </ContentWrapper>
          </section>
        </MotionBox>
      ) : null}
    </AnimatePresence>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  outerWrapper: {
    background: `linear-gradient(to bottom, ${theme.palette.monochrome[50]}, ${theme.palette.monochrome[100]})`,
    borderBottom: `1px solid ${theme.palette.monochrome[200]}`,
  },
  innerWrapper: {
    paddingTop: theme.spacing(30),
    paddingBottom: theme.spacing(30),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 940,
  },
  icon: {
    fontSize: 48,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    alignSelf: "center",
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: 800,
    fontSize: "3rem",
    lineHeight: 1.2,
  },
  subtitle: {
    marginBottom: theme.spacing(4),
    fontWeight: 500,
    color: theme.palette.monochrome[700],
  },
  description: {
    marginBottom: theme.spacing(10),
    lineHeight: 1.6,
  },
  suggestions: {
    marginTop: theme.spacing(2),
    color: theme.palette.monochrome[600],
  },
}));
