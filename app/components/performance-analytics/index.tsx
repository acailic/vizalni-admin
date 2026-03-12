/**
 * Performance Analytics Component
 * Displays real-time performance metrics and Core Web Vitals
 */

import {
  ExpandMore as ExpandMoreIcon,
  Speed as SpeedIcon,
  Timer as TimerIcon,
  Visibility as EyeIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  LinearProgress,
  Alert,
  Collapse,
  IconButton,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

import {
  PERFORMANCE_THRESHOLDS,
  usePerformanceMonitor,
} from "@/lib/performance-monitor";

interface MetricDisplay {
  label: string;
  value: number | undefined;
  unit: string;
  target: number;
  good: (value: number, target: number) => boolean;
  color: "success" | "warning" | "error";
  icon: React.ReactNode;
}

export const PerformanceAnalytics = () => {
  const theme = useTheme();
  const { getMetrics, evaluatePerformance } = usePerformanceMonitor();
  const [metrics, setMetrics] = useState(getMetrics());
  const [evaluation, setEvaluation] = useState(evaluatePerformance());
  const [expanded, setExpanded] = useState(
    process.env.NODE_ENV === "development"
  );

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(getMetrics());
      setEvaluation(evaluatePerformance());
    };

    // Update metrics every 2 seconds in development, every 5 seconds in production
    const interval = setInterval(
      updateMetrics,
      process.env.NODE_ENV === "development" ? 2000 : 5000
    );

    // Initial update
    updateMetrics();

    // Cleanup
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps: only set up interval once on mount

  const getMetricColor = (
    value: number | undefined,
    target: number
  ): "success" | "warning" | "error" => {
    if (value === undefined) return "warning";
    if (value <= target * 0.8) return "success"; // Excellent
    if (value <= target) return "warning"; // Good
    return "error"; // Poor
  };

  const metricDisplays: MetricDisplay[] = [
    {
      label: "Largest Contentful Paint",
      value: metrics.lcp,
      unit: "ms",
      target: PERFORMANCE_THRESHOLDS.lcp,
      good: (v, t) => v <= t,
      color: getMetricColor(metrics.lcp, PERFORMANCE_THRESHOLDS.lcp),
      icon: <TimerIcon />,
    },
    {
      label: "First Input Delay",
      value: metrics.fid,
      unit: "ms",
      target: PERFORMANCE_THRESHOLDS.fid,
      good: (v, t) => v <= t,
      color: getMetricColor(metrics.fid, PERFORMANCE_THRESHOLDS.fid),
      icon: <SpeedIcon />,
    },
    {
      label: "Cumulative Layout Shift",
      value: metrics.cls,
      unit: "",
      target: PERFORMANCE_THRESHOLDS.cls,
      good: (v, t) => v <= t,
      color: getMetricColor(metrics.cls, PERFORMANCE_THRESHOLDS.cls),
      icon: <EyeIcon />,
    },
    {
      label: "First Contentful Paint",
      value: metrics.fcp,
      unit: "ms",
      target: PERFORMANCE_THRESHOLDS.fcp,
      good: (v, t) => v <= t,
      color: getMetricColor(metrics.fcp, PERFORMANCE_THRESHOLDS.fcp),
      icon: <TrendingUpIcon />,
    },
  ];

  const getProgressValue = (
    value: number | undefined,
    target: number
  ): number => {
    if (value === undefined) return 0;
    return Math.min(100, (value / target) * 100);
  };

  const formatValue = (value: number | undefined, unit: string): string => {
    if (value === undefined) return "--";
    if (unit === "") return value.toFixed(3);
    return Math.round(value).toString();
  };

  const getOverallStatus = () => {
    if (evaluation.score >= 90) return { color: "success", label: "Excellent" };
    if (evaluation.score >= 70) return { color: "warning", label: "Good" };
    return { color: "error", label: "Needs Improvement" };
  };

  const overallStatus = getOverallStatus();

  return (
    <Card
      elevation={0}
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        minWidth: 320,
        maxWidth: 400,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        zIndex: 1000,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SpeedIcon color="primary" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Performance
            </Typography>
            <Chip
              label={overallStatus.label}
              color={overallStatus.color as any}
              size="small"
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          </Box>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <ExpandMoreIcon
              sx={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </IconButton>
        </Box>

        {/* Score */}
        <Box sx={{ mt: 2, mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Overall Score
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {evaluation.score}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={evaluation.score}
            color={overallStatus.color as any}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "grey.200",
            }}
          />
        </Box>

        {/* Metrics */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {metricDisplays.map((metric, index) => (
                <Grid item xs={12} key={index}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box sx={{ fontSize: 16, color: "text.secondary" }}>
                          {metric.icon}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {metric.label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatValue(metric.value, metric.unit)}
                        {metric.unit && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {" "}
                            {metric.unit}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getProgressValue(metric.value, metric.target)}
                      color={metric.color}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: "grey.200",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Target: &lt;{metric.target}
                      {metric.unit}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Issues */}
            {evaluation.issues.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  <strong>Performance Issues:</strong>
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                    {evaluation.issues.slice(0, 3).map((issue, index) => (
                      <li key={index} style={{ margin: "2px 0" }}>
                        {issue}
                      </li>
                    ))}
                  </ul>
                  {evaluation.issues.length > 3 && (
                    <Typography variant="caption">
                      ...and {evaluation.issues.length - 3} more
                    </Typography>
                  )}
                </Typography>
              </Alert>
            )}

            {/* Last Updated */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2, textAlign: "center" }}
            >
              Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PerformanceAnalytics;
