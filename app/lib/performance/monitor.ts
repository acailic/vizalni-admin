import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from 'web-vitals';

// Type declaration for gtag (Google Analytics)
declare global {
  interface Window {
    gtag?: (command: string, action: string, options?: Record<string, any>) => void;
  }
}

interface PerformanceMetric extends Metric {
  timestamp: number;
  userAgent: string;
  url: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

interface PerformanceThresholds {
  LCP: { good: 2500, needsImprovement: 4000 }; // Largest Contentful Paint
  INP: { good: 200, needsImprovement: 500 };   // Interaction to Next Paint (replaces FID)
  CLS: { good: 0.1, needsImprovement: 0.25 };   // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 };  // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 };  // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private thresholds: PerformanceThresholds = {
    LCP: { good: 2500, needsImprovement: 4000 },
    INP: { good: 200, needsImprovement: 500 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    FCP: { good: 1800, needsImprovement: 3000 },
    TTFB: { good: 800, needsImprovement: 1800 },
  };

  private isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;

    // Monitor all Core Web Vitals
    this.observeLCP();
    this.observeINP();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();

    // Monitor additional performance metrics
    this.monitorResourceTiming();
    this.monitorNavigationTiming();
    this.observeNetworkInformation();
  }

  private observeLCP(): void {
    onLCP((metric) => this.handleMetric('LCP', metric));
  }

  private observeINP(): void {
    onINP((metric) => this.handleMetric('INP', metric));
  }

  private observeCLS(): void {
    onCLS((metric) => this.handleMetric('CLS', metric));
  }

  private observeFCP(): void {
    onFCP((metric) => this.handleMetric('FCP', metric));
  }

  private observeTTFB(): void {
    onTTFB((metric) => this.handleMetric('TTFB', metric));
  }

  private handleMetric(name: string, metric: Metric): void {
    const enhancedMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      connectionType: this.getConnectionType(),
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
    };

    this.metrics.push(enhancedMetric);
    this.evaluatePerformance(name, enhancedMetric);
    this.reportToAnalytics(name, enhancedMetric);
  }

  private getConnectionType(): string | undefined {
    const connection = (navigator as any).connection ||
                     (navigator as any).mozConnection ||
                     (navigator as any).webkitConnection;
    return connection?.effectiveType;
  }

  private evaluatePerformance(name: string, metric: PerformanceMetric): void {
    const threshold = this.thresholds[name as keyof PerformanceThresholds];
    let rating: 'good' | 'needs-improvement' | 'poor';

    if (metric.value <= threshold.good) {
      rating = 'good';
    } else if (metric.value <= threshold.needsImprovement) {
      rating = 'needs-improvement';
    } else {
      rating = 'poor';
    }

    // Log performance issues in development
    if (!this.isProduction && rating !== 'good') {
      console.warn(`⚠️ ${name} performance issue detected:`, {
        value: metric.value,
        rating,
        threshold,
        url: metric.url,
      });
    }

    // Dispatch custom event for UI components to listen
    window.dispatchEvent(new CustomEvent('performance-metric', {
      detail: { name, metric, rating, threshold }
    }));
  }

  private reportToAnalytics(name: string, metric: PerformanceMetric): void {
    // Send to analytics service (Google Analytics, Sentry, etc.)
    if (this.isProduction) {
      // Example: Send to Google Analytics 4
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'core_web_vitals', {
          event_category: 'Performance',
          event_label: name.toLowerCase(),
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          custom_map: { custom_parameter_1: name },
        });
      }

      // Example: Send to Sentry
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.addBreadcrumb({
          category: 'performance',
          message: `${name}: ${metric.value}`,
          level: metric.value > this.thresholds[name as keyof PerformanceThresholds].needsImprovement ? 'warning' : 'info',
          data: metric,
        });
      }

      // Send to custom analytics endpoint
      this.sendToCustomAnalytics(name, metric);
    }
  }

  private async sendToCustomAnalytics(name: string, metric: PerformanceMetric): Promise<void> {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          value: metric.value,
          rating: this.getRating(name, metric.value),
          metadata: {
            userAgent: metric.userAgent,
            url: metric.url,
            connectionType: metric.connectionType,
            deviceMemory: metric.deviceMemory,
            hardwareConcurrency: metric.hardwareConcurrency,
            timestamp: metric.timestamp,
          },
        }),
      });
    } catch (error) {
      // Silently fail to avoid affecting user experience
      console.debug('Failed to send performance metrics:', error);
    }
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[name as keyof PerformanceThresholds];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  private monitorResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;

          // Flag slow resources
          if (resource.duration > 1000) {
            console.warn(`Slow resource detected: ${resource.name}`, {
              duration: resource.duration,
              size: resource.transferSize,
            });
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // Resource timing might not be supported in all browsers
      console.debug('Resource timing observation not supported');
    }
  }

  private monitorNavigationTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;

          // Monitor DOM loading performance
          const domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
          if (domContentLoaded > 1000) {
            console.warn('Slow DOM content loading detected:', {
              duration: domContentLoaded,
              domInteractive: nav.domInteractive - nav.fetchStart,
            });
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
    } catch (e) {
      console.debug('Navigation timing observation not supported');
    }
  }

  private observeNetworkInformation(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;

      // Monitor network changes
      connection.addEventListener('change', () => {
        this.sendToCustomAnalytics('network-change', {
          name: 'network-change' as any,
          value: 0,
          id: 'network-change',
          delta: 0,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          connectionType: connection.effectiveType,
        } as PerformanceMetric);
      });
    }
  }

  // Public API methods
  public getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  public getLatestMetrics(): Partial<Record<string, PerformanceMetric>> {
    const latest: Partial<Record<string, PerformanceMetric>> = {};

    this.metrics.forEach(metric => {
      if (!latest[metric.name] || metric.timestamp > latest[metric.name]!.timestamp) {
        latest[metric.name] = metric;
      }
    });

    return latest;
  }

  public getPerformanceScore(): number {
    const latest = this.getLatestMetrics();
    const metrics = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'] as const;
    let totalScore = 0;
    let count = 0;

    metrics.forEach(metricName => {
      const metric = latest[metricName];
      if (metric) {
        const rating = this.getRating(metricName, metric.value);
        if (rating === 'good') totalScore += 100;
        else if (rating === 'needs-improvement') totalScore += 50;
        else totalScore += 0;
        count++;
      }
    });

    return count > 0 ? Math.round(totalScore / count) : 0;
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export const getPerformanceMonitor = (): PerformanceMonitor => {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor!;
};

// Export types for use in components
export type { PerformanceMetric, PerformanceThresholds };
export { PerformanceMonitor };