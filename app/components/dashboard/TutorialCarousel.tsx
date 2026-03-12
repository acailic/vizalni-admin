import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Button, Card, CardContent, MobileStepper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export type TutorialItem = {
  title: string;
  summary: string;
  actionLabel: string;
  href: string;
};

const AUTOPLAY_MS = 4500;

export const TutorialCarousel = ({ items }: { items: TutorialItem[] }) => {
  const [active, setActive] = useState(0);
  const total = useMemo(() => items.length, [items.length]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [total]);

  const handleStep = (direction: "next" | "back") => {
    setActive((prev) => {
      if (direction === "next") {
        return (prev + 1) % total;
      }
      return prev === 0 ? total - 1 : prev - 1;
    });
  };

  const current = items[active];

  return (
    <Card elevation={1}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Tutorials
          </Typography>
          <Stack spacing={1}>
            <Typography variant="subtitle1" fontWeight={700}>
              {current.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {current.summary}
            </Typography>
            <Button
              href={current.href}
              variant="outlined"
              size="small"
            >
              {current.actionLabel}
            </Button>
          </Stack>
          <MobileStepper
            steps={total}
            position="static"
            activeStep={active}
            backButton={
              <Button size="small" onClick={() => handleStep("back")} startIcon={<KeyboardArrowLeft />}>
                Back
              </Button>
            }
            nextButton={
              <Button size="small" onClick={() => handleStep("next")} endIcon={<KeyboardArrowRight />}>
                Next
              </Button>
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
