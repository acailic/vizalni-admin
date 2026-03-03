import { ArrowForward } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";

interface WelcomeCardProps {
  userName?: string;
  headline: string;
  subhead: string;
}

export const WelcomeCard = ({
  userName = "Welcome back",
  headline,
  subhead,
}: WelcomeCardProps) => {
  const theme = useTheme();

  return (
    <Card
      elevation={2}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.grey[900]}, ${theme.palette.teal?.[700] || theme.palette.success.dark})`,
        color: "common.white",
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Stack spacing={1}>
            <Typography variant="overline" sx={{ letterSpacing: 1.2 }}>
              {userName}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {headline}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {subhead}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              component={Link}
              href="/create"
              variant="contained"
              color="secondary"
              endIcon={<ArrowForward />}
              sx={{ color: "common.white" }}
            >
              Create visualization
            </Button>
            <Button
              component={Link}
              href="/demos"
              variant="outlined"
              sx={{
                borderColor: "rgba(255,255,255,0.4)",
                color: "common.white",
                "&:hover": { borderColor: "common.white" },
              }}
            >
              Browse demos
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
