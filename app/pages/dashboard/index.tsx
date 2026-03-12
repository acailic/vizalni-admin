import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";

import {
  CategoryOverview,
  CategoryStatus,
} from "@/components/dashboard/CategoryOverview";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  DatasetHealth,
  DatasetStatus,
} from "@/components/dashboard/DatasetHealth";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { QuickStats, StatItem } from "@/components/dashboard/QuickStats";
import {
  RecentVisualization,
  RecentVisualizations,
} from "@/components/dashboard/RecentVisualizations";
import {
  TutorialCarousel,
  TutorialItem,
} from "@/components/dashboard/TutorialCarousel";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";

const LOCAL_STORAGE_KEY = "vizualni-admin/recent-visualizations";

const defaultRecent: RecentVisualization[] = [
  {
    id: "budget-trends",
    title: "Budget Trends 2024",
    dataset: "Ministry of Finance",
    updatedAt: "2d ago",
    href: "/demos/budget",
  },
  {
    id: "air-quality-belgrade",
    title: "Air Quality • Belgrade",
    dataset: "data.gov.rs/air-quality",
    updatedAt: "5d ago",
    href: "/demos/air-quality",
  },
  {
    id: "education-map",
    title: "Education Coverage Map",
    dataset: "Ministry of Education",
    updatedAt: "1w ago",
    href: "/demos/education",
  },
];

const categories: CategoryStatus[] = [
  { name: "Air quality", enabled: true, health: "good", coverage: 82 },
  { name: "Budget", enabled: true, health: "warning", coverage: 64 },
  { name: "Education", enabled: true, health: "good", coverage: 78 },
  { name: "Healthcare", enabled: false, health: "critical", coverage: 32 },
  { name: "Transport", enabled: true, health: "warning", coverage: 55 },
  { name: "Economy", enabled: true, health: "good", coverage: 71 },
];

const datasets: DatasetStatus[] = [
  { name: "Air quality (PM10/PM2.5)", status: "healthy" },
  {
    name: "Budget execution 2024",
    status: "warning",
    issues: "Missing Q4 update",
  },
  { name: "Employment rates", status: "healthy" },
  {
    name: "Healthcare facilities",
    status: "offline",
    issues: "API unreachable",
  },
];

const tutorials: TutorialItem[] = [
  {
    title: "Create your first visualization",
    summary:
      "Import a dataset, pick a chart type, and customize the axes and legend.",
    actionLabel: "Open tutorial",
    href: "/tutorials/your-first-visualization",
  },
  {
    title: "Connect to data.gov.rs",
    summary:
      "Use dataset discovery to pull official sources with tags and search filters.",
    actionLabel: "View guide",
    href: "/tutorials/using-data-gov-rs-api",
  },
  {
    title: "Embed dashboards anywhere",
    summary:
      "Generate embed codes with responsive sizing and language options.",
    actionLabel: "See how",
    href: "/tutorials/basic-embedding",
  },
];

const DashboardPage: NextPage = () => {
  const [recent, setRecent] = useState<RecentVisualization[]>(defaultRecent);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as RecentVisualization[];
        setRecent(parsed);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultRecent));
      }
    } catch {
      // keep defaults on parse failure
    }
  }, []);

  const stats: StatItem[] = useMemo(
    () => [
      { label: "Visualizations", value: 18, delta: "+2 this week" },
      {
        label: "Datasets connected",
        value: 12,
        delta: "3 pending",
        color: "warning",
      },
      {
        label: "Auto updates",
        value: "9 active",
        delta: "All healthy",
        color: "success",
      },
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        label: "Create",
        description: "Start a new chart or dashboard with guided steps.",
        href: "/create",
        variant: "contained" as const,
      },
      {
        label: "Explore",
        description: "Browse datasets and demos to reuse configurations.",
        href: "/demos",
      },
      {
        label: "Customize",
        description: "Adjust themes, labels, and interactive filters.",
        href: "/configurator",
      },
    ],
    []
  );

  return (
    <DashboardLayout>
      <WelcomeCard
        headline="Client dashboard overview"
        subhead="Track dataset health, recent work, and quick actions to publish new visualizations."
      />
      <QuickStats title="Quick stats" stats={stats} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <CategoryOverview categories={categories} />
        </Grid>
        <Grid item xs={12} md={4}>
          <DatasetHealth datasets={datasets} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <RecentVisualizations items={recent} />
        </Grid>
        <Grid item xs={12} md={4}>
          <QuickActions actions={actions} />
        </Grid>
      </Grid>

      <TutorialCarousel items={tutorials} />
    </DashboardLayout>
  );
};

export default DashboardPage;
