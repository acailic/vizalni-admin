import { getServerSession } from 'next-auth/next';

import { nextAuthOptions as authOptions } from '../auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';

interface PerformanceMetricData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  metadata: {
    userAgent: string;
    url: string;
    connectionType?: string;
    deviceMemory?: number;
    hardwareConcurrency?: number;
    timestamp: number;
  };
}

interface StoredMetrics {
  timestamp: number;
  metrics: PerformanceMetricData[];
  sessionId?: string;
  userId?: string;
}

// In-memory storage for demo purposes
// In production, use a database like Redis, PostgreSQL, or time-series database
const metricsStore: Map<string, StoredMetrics[]> = new Map();

// Retention policy - keep metrics for 30 days
const RETENTION_DAYS = 30;
const MAX_METRICS_PER_SESSION = 1000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Optional: Authenticate user for personalized analytics
    const session = await getServerSession(req, res, authOptions);

    const metricData: PerformanceMetricData = req.body;

    // Validate required fields
    if (!metricData.name || typeof metricData.value !== 'number') {
      return res.status(400).json({
        error: 'Invalid metric data. Required: name, value'
      });
    }

    // Validate metric name
    const validMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
    if (!validMetrics.includes(metricData.name)) {
      return res.status(400).json({
        error: 'Invalid metric name. Must be one of: ' + validMetrics.join(', ')
      });
    }

    // Generate or get session identifier
    const sessionId = req.headers['x-session-id'] as string ||
                     generateSessionId(req);

    const storedMetric: StoredMetrics = {
      timestamp: Date.now(),
      metrics: [metricData],
      sessionId,
      userId: session?.user?.id,
    };

    // Store the metric
    if (!metricsStore.has(sessionId)) {
      metricsStore.set(sessionId, []);
    }

    const sessionMetrics = metricsStore.get(sessionId)!;
    sessionMetrics.push(storedMetric);

    // Limit metrics per session to prevent memory issues
    if (sessionMetrics.length > MAX_METRICS_PER_SESSION) {
      sessionMetrics.splice(0, sessionMetrics.length - MAX_METRICS_PER_SESSION);
    }

    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metric received:', {
        sessionId,
        userId: session?.user?.id,
        metric: metricData.name,
        value: metricData.value,
        rating: metricData.rating,
      });
    }

    // Trigger cleanup of old metrics
    cleanupOldMetrics();

    // Calculate and return analytics summary
    const summary = calculateAnalyticsSummary(sessionId, metricData.name);

    res.status(200).json({
      success: true,
      message: 'Performance metric recorded',
      sessionId,
      summary,
    });

  } catch (error) {
    console.error('Error processing performance metric:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}

function generateSessionId(req: NextApiRequest): string {
  // Generate a session ID based on IP and user agent
  const ip = req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection.remoteAddress ||
            'unknown';

  const userAgent = req.headers['user-agent'] || 'unknown';

  return Buffer.from(`${ip}-${userAgent}-${Date.now()}`).toString('base64');
}

function cleanupOldMetrics(): void {
  const cutoffTime = Date.now() - (RETENTION_DAYS * 24 * 60 * 60 * 1000);

  for (const [sessionId, metrics] of metricsStore.entries()) {
    const filteredMetrics = metrics.filter(
      metric => metric.timestamp > cutoffTime
    );

    if (filteredMetrics.length === 0) {
      metricsStore.delete(sessionId);
    } else {
      metricsStore.set(sessionId, filteredMetrics);
    }
  }
}

function calculateAnalyticsSummary(sessionId: string, metricName: string) {
  const allMetrics: PerformanceMetricData[] = [];

  // Collect all metrics of the same type from all sessions
  for (const metrics of metricsStore.values()) {
    for (const metric of metrics) {
      const matchingMetric = metric.metrics.find(m => m.name === metricName);
      if (matchingMetric) {
        allMetrics.push(matchingMetric);
      }
    }
  }

  if (allMetrics.length === 0) {
    return null;
  }

  // Calculate statistics
  const values = allMetrics.map(m => m.value);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;
  const sortedValues = values.sort((a, b) => a - b);
  const median = sortedValues[Math.floor(sortedValues.length / 2)];
  const p95 = sortedValues[Math.floor(sortedValues.length * 0.95)];
  const p75 = sortedValues[Math.floor(sortedValues.length * 0.75)];

  const ratingCounts = {
    good: allMetrics.filter(m => m.rating === 'good').length,
    'needs-improvement': allMetrics.filter(m => m.rating === 'needs-improvement').length,
    poor: allMetrics.filter(m => m.rating === 'poor').length,
  };

  const performanceThresholds = {
    LCP: { good: 2500, needsImprovement: 4000 },
    FID: { good: 100, needsImprovement: 300 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FCP: { good: 1800, needsImprovement: 3000 },
    TTFB: { good: 800, needsImprovement: 1800 },
  };

  const threshold = performanceThresholds[metricName as keyof typeof performanceThresholds];

  return {
    metric: metricName,
    totalSamples: allMetrics.length,
    statistics: {
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      p95: Math.round(p95 * 100) / 100,
      p75: Math.round(p75 * 100) / 100,
      min: Math.min(...values),
      max: Math.max(...values),
    },
    ratingDistribution: {
      good: Math.round((ratingCounts.good / allMetrics.length) * 100),
      'needs-improvement': Math.round((ratingCounts['needs-improvement'] / allMetrics.length) * 100),
      poor: Math.round((ratingCounts.poor / allMetrics.length) * 100),
    },
    threshold,
    recentTrend: calculateRecentTrend(allMetrics),
  };
}

function calculateRecentTrend(metrics: PerformanceMetricData[]): 'improving' | 'stable' | 'degrading' {
  if (metrics.length < 10) return 'stable';

  // Compare recent (last 25%) with earlier (first 25%)
  const quarterPoint = Math.floor(metrics.length * 0.25);
  const recentMetrics = metrics.slice(-quarterPoint);
  const earlierMetrics = metrics.slice(0, quarterPoint);

  const recentAvg = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
  const earlierAvg = earlierMetrics.reduce((sum, m) => sum + m.value, 0) / earlierMetrics.length;

  const changePercent = ((earlierAvg - recentAvg) / earlierAvg) * 100;

  if (changePercent > 5) return 'improving';
  if (changePercent < -5) return 'degrading';
  return 'stable';
}

// Helper endpoint to get analytics data
export async function getAnalyticsData(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = req.query.sessionId as string;
    const metricName = req.query.metric as string;

    if (!sessionId) {
      // Return overall analytics
      const allSessionMetrics: { sessionId: string; metrics: StoredMetrics[] }[] = [];

      for (const [sessionId, metrics] of metricsStore.entries()) {
        allSessionMetrics.push({ sessionId, metrics });
      }

      return res.status(200).json({
        totalSessions: allSessionMetrics.length,
        sessionMetrics: allSessionMetrics.slice(0, 50), // Limit results
      });
    }

    if (!metricsStore.has(sessionId)) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionMetrics = metricsStore.get(sessionId)!;
    const summary = calculateAnalyticsSummary(sessionId, metricName || 'LCP');

    res.status(200).json({
      sessionId,
      metrics: sessionMetrics,
      summary,
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}