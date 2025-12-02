import {
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  CheckCircle as GoodIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { getPerformanceMonitor } from '../../lib/performance/monitor';

interface MetricData {
  name: string;
  value: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; needsImprovement: number };
  description: string;
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const monitor = getPerformanceMonitor();

    const updateMetrics = () => {
      const latest = monitor.getLatestMetrics();
      const newMetrics: MetricData[] = [];

      // LCP - Largest Contentful Paint
      if (latest.LCP) {
        newMetrics.push({
          name: 'Largest Contentful Paint (LCP)',
          value: latest.LCP.value,
          unit: 'ms',
          rating: getLCPRating(latest.LCP.value),
          threshold: { good: 2500, needsImprovement: 4000 },
          description: 'Time until the largest content element appears',
        });
      }

      // FID - First Input Delay
      if (latest.FID) {
        newMetrics.push({
          name: 'First Input Delay (FID)',
          value: latest.FID.value,
          unit: 'ms',
          rating: getFIDRating(latest.FID.value),
          threshold: { good: 100, needsImprovement: 300 },
          description: 'Time from user interaction to browser response',
        });
      }

      // CLS - Cumulative Layout Shift
      if (latest.CLS) {
        newMetrics.push({
          name: 'Cumulative Layout Shift (CLS)',
          value: latest.CLS.value,
          unit: '',
          rating: getCLSRating(latest.CLS.value),
          threshold: { good: 0.1, needsImprovement: 0.25 },
          description: 'Visual stability score (lower is better)',
        });
      }

      // FCP - First Contentful Paint
      if (latest.FCP) {
        newMetrics.push({
          name: 'First Contentful Paint (FCP)',
          value: latest.FCP.value,
          unit: 'ms',
          rating: getFCPRating(latest.FCP.value),
          threshold: { good: 1800, needsImprovement: 3000 },
          description: 'Time until first content appears',
        });
      }

      // TTFB - Time to First Byte
      if (latest.TTFB) {
        newMetrics.push({
          name: 'Time to First Byte (TTFB)',
          value: latest.TTFB.value,
          unit: 'ms',
          rating: getTTFBRating(latest.TTFB.value),
          threshold: { good: 800, needsImprovement: 1800 },
          description: 'Time to receive first byte of data',
        });
      }

      setMetrics(newMetrics);
      setOverallScore(monitor.getPerformanceScore());
      setIsLoading(false);
    };

    // Initial load
    updateMetrics();

    // Listen for performance metric events
    const handlePerformanceMetric = () => {
      updateMetrics();
    };

    window.addEventListener('performance-metric', handlePerformanceMetric);

    // Periodic updates
    const interval = setInterval(updateMetrics, 5000);

    return () => {
      window.removeEventListener('performance-metric', handlePerformanceMetric);
      clearInterval(interval);
    };
  }, []);

  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'good': return '#4caf50';
      case 'needs-improvement': return '#ff9800';
      case 'poor': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good': return <GoodIcon sx={{ color: '#4caf50' }} />;
      case 'needs-improvement': return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'poor': return <ErrorIcon sx={{ color: '#f44336' }} />;
      default: return null;
    }
  };

  const getOverallScoreColor = (score: number): string => {
    if (score >= 90) return '#4caf50';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Loading performance metrics...</Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Overall Performance Score */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <SpeedIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" component="div">
              Performance Score: <span style={{ color: getOverallScoreColor(overallScore) }}>{overallScore}/100</span>
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallScore}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getOverallScoreColor(overallScore),
              },
            }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {overallScore >= 90 ? 'Excellent performance!' :
             overallScore >= 70 ? 'Good performance with room for improvement.' :
             'Performance needs significant improvement.'}
          </Typography>
        </CardContent>
      </Card>

      {/* Individual Metrics */}
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <AssessmentIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    {metric.name}
                  </Typography>
                  {getRatingIcon(metric.rating)}
                </Box>

                <Typography variant="h4" color={getRatingColor(metric.rating)}>
                  {metric.value.toFixed(metric.name.includes('CLS') ? 3 : 0)}{metric.unit}
                </Typography>

                <Box mt={2}>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressPercentage(metric.value, metric.threshold)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getRatingColor(metric.rating),
                      },
                    }}
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Target: &lt;{metric.threshold.good}{metric.unit}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  {metric.description}
                </Typography>

                <Chip
                  label={metric.rating.replace('-', ' ').toUpperCase()}
                  size="small"
                  sx={{
                    mt: 2,
                    backgroundColor: getRatingColor(metric.rating),
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance Recommendations */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Recommendations
          </Typography>
          <List dense>
            {getPerformanceRecommendations(metrics).map((recommendation, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={recommendation.title}
                    secondary={recommendation.description}
                  />
                </ListItem>
                {index < getPerformanceRecommendations(metrics).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Development Notice */}
      {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Performance metrics are being tracked in development mode. In production,
            these metrics will be automatically sent to analytics for monitoring.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

// Helper functions
const getLCPRating = (value: number): 'good' | 'needs-improvement' | 'poor' => {
  if (value <= 2500) return 'good';
  if (value <= 4000) return 'needs-improvement';
  return 'poor';
};

const getFIDRating = (value: number): 'good' | 'needs-improvement' | 'poor' => {
  if (value <= 100) return 'good';
  if (value <= 300) return 'needs-improvement';
  return 'poor';
};

const getCLSRating = (value: number): 'good' | 'needs-improvement' | 'poor' => {
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
};

const getFCPRating = (value: number): 'good' | 'needs-improvement' | 'poor' => {
  if (value <= 1800) return 'good';
  if (value <= 3000) return 'needs-improvement';
  return 'poor';
};

const getTTFBRating = (value: number): 'good' | 'needs-improvement' | 'poor' => {
  if (value <= 800) return 'good';
  if (value <= 1800) return 'needs-improvement';
  return 'poor';
};

const getProgressPercentage = (value: number, threshold: { good: number; needsImprovement: number }): number => {
  if (value <= threshold.good) return 100;
  if (value <= threshold.needsImprovement) return 50;
  return Math.max(0, 25 - ((value - threshold.needsImprovement) / threshold.needsImprovement) * 25);
};

const getPerformanceRecommendations = (metrics: MetricData[]) => {
  const recommendations = [];

  metrics.forEach(metric => {
    if (metric.rating === 'poor') {
      switch (metric.name) {
        case 'Largest Contentful Paint (LCP)':
          recommendations.push({
            title: 'Optimize Largest Contentful Paint',
            description: 'Compress images, use modern formats (WebP, AVIF), implement lazy loading, and optimize server response times.',
          });
          break;
        case 'First Input Delay (FID)':
          recommendations.push({
            title: 'Reduce JavaScript Execution Time',
            description: 'Split code into smaller chunks, remove unused JavaScript, and defer non-critical scripts.',
          });
          break;
        case 'Cumulative Layout Shift (CLS)':
          recommendations.push({
            title: 'Improve Visual Stability',
            description: 'Include size attributes for images and embeds, avoid inserting content above existing content.',
          });
          break;
        case 'First Contentful Paint (FCP)':
          recommendations.push({
            title: 'Speed up Initial Content Loading',
            description: 'Reduce server response time, eliminate render-blocking resources, and optimize critical CSS.',
          });
          break;
        case 'Time to First Byte (TTFB)':
          recommendations.push({
            title: 'Optimize Server Response Time',
            description: 'Use CDN, implement server-side caching, optimize database queries, and use HTTP/2 or HTTP/3.',
          });
          break;
      }
    }
  });

  return recommendations;
};

export default PerformanceDashboard;