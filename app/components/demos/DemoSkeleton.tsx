/**
 * Demo Skeleton Components
 *
 * Reusable loading skeleton components for demo pages.
 * Provides consistent loading states across all demos.
 */

import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";

interface DemoSkeletonProps {
  /** Number of skeleton cards to show */
  cards?: number;
  /** Show hero section skeleton */
  showHero?: boolean;
  /** Show chart skeleton */
  showChart?: boolean;
  /** Chart height in pixels */
  chartHeight?: number;
  /** Variant style */
  variant?: "cards" | "chart" | "full";
}

export function DemoSkeleton({
  cards = 3,
  showHero = true,
  showChart = true,
  chartHeight = 400,
  variant = "full",
}: DemoSkeletonProps) {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Hero Section Skeleton */}
      {showHero && variant !== "chart" && (
        <Box
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 3,
            bgcolor: "action.hover",
          }}
        >
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
      )}

      {/* Stats Cards Skeleton */}
      {variant === "full" && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Array.from({ length: cards }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </Box>
                  <Skeleton variant="text" width="40%" height={40} />
                  <Skeleton variant="text" width="80%" height={16} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Chart Skeleton */}
      {showChart && (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
            >
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="30%" height={28} />
            </Box>
            <Skeleton variant="text" width="100%" height={16} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={16} sx={{ mb: 3 }} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={chartHeight}
              sx={{ borderRadius: 2 }}
            />
          </CardContent>
        </Card>
      )}

      {/* Demo Cards Grid Skeleton */}
      {variant === "cards" && (
        <Grid container spacing={3}>
          {Array.from({ length: cards }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%", borderRadius: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={80}
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={24}
                    sx={{ mx: "auto" }}
                  />
                  <Skeleton variant="text" width="100%" height={16} />
                  <Skeleton variant="text" width="90%" height={16} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

/** Skeleton for chart preview cards */
export function ChartCardSkeleton() {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Skeleton variant="rectangular" width="100%" height={200} />
      <CardContent sx={{ flex: 1 }}>
        <Skeleton variant="text" width="70%" height={24} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
      </CardContent>
    </Card>
  );
}

/** Skeleton for featured chart showcase */
export function FeaturedChartSkeleton() {
  return (
    <Box sx={{ width: "100%" }}>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ChartCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/** Loading overlay for async operations */
export function LoadingOverlay({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(255, 255, 255, 0.8)",
        zIndex: 10,
        borderRadius: 2,
      }}
    >
      <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default DemoSkeleton;
