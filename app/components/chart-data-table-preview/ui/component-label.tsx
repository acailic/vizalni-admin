import { TooltipProps, Typography } from "@mui/material";

import { getLabelWithUnit } from "@/charts/shared/chart-helpers";
import { OpenMetadataPanelWrapper } from "@/components/metadata-panel";
import { Tooltip } from "@/components/ui/tooltips";
import { Component } from "@/domain/data";

export const ComponentLabel = ({
  component,
  tooltipProps,
  linkToMetadataPanel,
}: {
  component: Component;
  tooltipProps?: Omit<TooltipProps, "title" | "children">;
  linkToMetadataPanel: boolean;
}) => {
  return linkToMetadataPanel ? (
    <OpenMetadataPanelWrapper component={component}>
      <ComponentLabelInner component={component} />
    </OpenMetadataPanelWrapper>
  ) : component.description ? (
    <Tooltip
      variant="conditional"
      title={component.description}
      {...tooltipProps}
    >
      <div>
        <ComponentLabelInner component={component} />
      </div>
    </Tooltip>
  ) : (
    <ComponentLabelInner component={component} />
  );
};

const ComponentLabelInner = ({ component }: { component: Component }) => {
  const label = getLabelWithUnit(component);

  return (
    <Typography
      variant="h6"
      component="span"
      color="monochrome.500"
      textTransform="uppercase"
    >
      {label}
    </Typography>
  );
};
