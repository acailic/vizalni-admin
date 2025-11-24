import { Trans } from "@lingui/macro";
import { Box, Button } from "@mui/material";
import { Reorder } from "framer-motion";
import orderBy from "lodash/orderBy";
import sortBy from "lodash/sortBy";
import { ReactNode, useMemo } from "react";

import { BrowseFilter } from "@/browse/lib/filters";
import { NavigationItem } from "@/browse/ui/navigation-item";
import { NavigationSectionTitle } from "@/browse/ui/navigation-section-title";
import { useDisclosure } from "@/components/use-disclosure";
import {
  DataCubeOrganization,
  DataCubeTermset,
  DataCubeTheme,
} from "@/graphql/query-hooks";
import { Icon } from "@/icons";

const getIconName = (
  item: DataCubeTheme | DataCubeOrganization | DataCubeTermset
): string | undefined => {
  if ("__typename" in item) {
    switch (item.__typename) {
      case "DataCubeTheme":
        return "folder";
      case "DataCubeOrganization":
        return "building";
      case "DataCubeTermset":
        return "tag";
      default:
        return undefined;
    }
  }
  return undefined;
};

export const NavigationSection = ({
  label,
  items,
  backgroundColor,
  currentFilter,
  filters,
  counts,
  extra,
  disableLinks,
}: {
  label: ReactNode;
  items: (DataCubeTheme | DataCubeOrganization | DataCubeTermset)[];
  backgroundColor: string;
  currentFilter?: DataCubeTheme | DataCubeOrganization | DataCubeTermset;
  filters: BrowseFilter[];
  counts: Record<string, number>;
  extra?: ReactNode;
  disableLinks?: boolean;
}) => {
  const { isOpen, open, close } = useDisclosure(!!currentFilter);
  const topItems = useMemo(() => {
    return sortBy(
      orderBy(items, (item) => counts[item.iri], "desc").slice(0, 7),
      (item) => item.label
    );
  }, [counts, items]);
  const hiddenCount = Math.max(0, items.length - 7);
  const icon =
    items.length > 0 ? (
      <Icon name={getIconName(items[0])} size={20} />
    ) : undefined;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        boxShadow: 1,
        borderRadius: 2,
        mb: 2,
      }}
    >
      <NavigationSectionTitle
        label={label}
        backgroundColor="white"
        icon={icon}
      />
      <Box sx={{ px: 2, pb: 2 }}>
        <Reorder.Group
          axis="y"
          as="div"
          onReorder={() => {}}
          values={isOpen ? items : topItems}
          sx={{
            "& > div": {
              borderBottom: "1px solid",
              borderColor: "divider",
              transition: "background-color 0.2s",
            },
            "& > div:last-child": { borderBottom: 0 },
            "& > div:hover": { backgroundColor: "action.hover" },
          }}
        >
          {(isOpen ? items : topItems).map((item) => {
            return (
              <Reorder.Item key={item.iri} as="div" value={item}>
                <NavigationItem
                  active={currentFilter?.iri === item.iri}
                  filters={filters}
                  next={item}
                  count={counts[item.iri]}
                  disableLink={disableLinks}
                  countBg="white"
                >
                  {item.label}
                </NavigationItem>
              </Reorder.Item>
            );
          })}
          {topItems.length !== items.length ? (
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              onClick={isOpen ? close : open}
              endIcon={
                <Icon name={isOpen ? "arrowUp" : "arrowDown"} size={20} />
              }
              sx={{ width: "100%", mt: 1, transition: "all 0.2s" }}
            >
              {isOpen ? (
                <Trans id="show.less">Show less</Trans>
              ) : (
                <Trans id="show.all">Show all ({hiddenCount})</Trans>
              )}
            </Button>
          ) : null}
        </Reorder.Group>
        {extra}
      </Box>
    </Box>
  );
};
