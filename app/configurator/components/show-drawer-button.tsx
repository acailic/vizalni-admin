import { Button, ButtonProps, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";

import { Icon } from "@/icons";

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // WCAG minimum 44px touch target
    minWidth: 44,
    minHeight: 44,
    background: theme.palette.background.paper,
    color: theme.palette.primary.main,
    "&:hover": {
      background: theme.palette.background.paper,
    },
  },
}));

export const ShowDrawerButton = (props: ButtonProps) => {
  const { className, variant = "text", ...rest } = props;
  const classes = useStyles();

  return (
    <Button className={clsx(classes.root, className)} {...rest}>
      <Icon name="doublearrow" />
    </Button>
  );
};
