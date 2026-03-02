// app/components/topics/TopicCard.tsx
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import NatureIcon from "@mui/icons-material/Nature";
import SchoolIcon from "@mui/icons-material/School";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Link from "next/link";

import type { Topic, LocalizedString } from "@/types/topics";

import type { SvgIconProps } from "@mui/material/SvgIcon";

const iconMap: Record<string, React.ComponentType<SvgIconProps>> = {
  AttachMoney: AttachMoneyIcon,
  LocalHospital: LocalHospitalIcon,
  School: SchoolIcon,
  Groups: GroupsIcon,
  Nature: NatureIcon,
  DirectionsCar: DirectionsCarIcon,
};

function getLocalizedText(text: LocalizedString, locale: string): string {
  if (locale === "sr") return text.sr;
  if (locale === "sr-Latn") return text["sr-Latn"] || text.sr;
  return text.en;
}

interface TopicCardProps {
  topic: Topic;
  locale: string;
}

export function TopicCard({ topic, locale }: TopicCardProps) {
  const IconComponent = iconMap[topic.icon] || AttachMoneyIcon;
  const title = getLocalizedText(topic.title, locale);
  const description = getLocalizedText(topic.description, locale);
  const datasetLabel =
    locale === "sr" || locale === "sr-Latn" ? "скупова података" : "datasets";

  return (
    <Link href={`/topics/${topic.id}`} passHref legacyBehavior>
      <Card
        component="a"
        sx={{
          cursor: "pointer",
          textDecoration: "none",
          height: "100%",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(16, 185, 129, 0.25)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
            opacity: 1,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconComponent
              sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
            />
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, minHeight: 40 }}
          >
            {description}
          </Typography>
          <Typography variant="caption" color="primary">
            {topic.datasetCount} {datasetLabel}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
