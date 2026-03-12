import { Box, Typography } from "@mui/material";

import { BrowseFilter } from "@/browse/lib/filters";
import { NavigationItem } from "@/browse/ui/navigation-item";
import { SearchCube } from "@/domain/data";
import SvgIcArrowRight from "@/icons/components/IcArrowRight";

export const SubthemeFilters = ({
  subthemes,
  filters,
  counts,
  disableLinks,
  countBg,
}: {
  subthemes: SearchCube["subthemes"];
  filters: BrowseFilter[];
  counts: Record<string, number>;
  disableLinks?: boolean;
  countBg: string;
}) => {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Subthemes
      </Typography>
      <Box
        sx={{
          backgroundColor: "grey.50",
          p: 1,
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap", // Ensures wrapping on smaller screens
        }}
      >
        {subthemes.map((d: any) => {
          const count = counts[d.iri];

          if (!count) {
            return null;
          }

          return (
            <Box key={d.iri} sx={{ pl: 2, mb: 0.5 }}>
              {" "}
              {/* Indentation and spacing */}
              <NavigationItem
                next={{ __typename: "DataCubeAbout", ...d }}
                filters={filters}
                active={filters[filters.length - 1]?.iri === d.iri}
                level={2}
                count={count}
                disableLink={disableLinks}
                countBg={countBg}
                sx={{
                  "&:hover": {
                    backgroundColor: "cobalt.50", // Enhanced hover effect for consistency
                    borderLeftColor: "cobalt.200",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <SvgIcArrowRight width={16} height={16} />{" "}
                  {/* Visual indicator for hierarchy */}
                  {d.label}
                </Box>
              </NavigationItem>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
