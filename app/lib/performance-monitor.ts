/**
 * Performance Monitoring Utility
 * Tracks Core Web Vitals and custom performance metrics
 */

// Types for performance monitoring
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint (target: <1200ms)
  fid?: number; // First Input Delay (target: <50ms)
  cls?: number; // Cumulative Layout Shift (target: <0.05)
  fcp?: number; // First Contentful Paint (target: <1800ms)
  ttfb?: number; // Time to First Byte (target: <600ms)

  // Custom metrics
  bundleSize?: number;
  apiResponseTime?: number;
  renderTime?: number;

  // Metadata
  url: string;
  timestamp: number;
  userAgent: string;
}

export interface PerformanceThresholds {
  lcp: number; // 1200ms
  fid: number; // 50ms
  cls: number; // 0.05
  fcp: number; // 1800ms
  ttfb: number; // 600ms
}

export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lcp: 1200,
  fid: 50,
  cls: 0.05,
  fcp: 1800,
  ttfb: 600,
};

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private isSupported = typeof window !== 'undefined' && 'performance' in window;

  constructor() {
    if (this.isSupported) {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported:', e);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (entry.name === 'first-input') {
              this.metrics.fid = entry.processingStart - entry.startTime;
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported:', e);
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.cls = clsValue;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported:', e);
      }

      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.metrics.fcp = fcpEntry.startTime;
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (e) {
        console.warn('FCP observer not supported:', e);
      }

      // Time to First Byte (TTFB)
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        }
      } catch (e) {
        console.warn('TTFB calculation failed:', e);
      }
    }
  }

  /**
   * Record a custom metric
   */
  public recordCustomMetric(name: keyof PerformanceMetrics, value: number) {
    this.metrics[name] = value;
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return {
      ...this.metrics,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    } as PerformanceMetrics;
  }

  /**
   * Check if metrics meet performance targets
   */
  public evaluatePerformance(metrics?: Partial<PerformanceMetrics>): {
    score: number;
    passed: boolean;
    issues: string[];
  } {
    const currentMetrics = metrics || this.metrics;
    const issues: string[] = [];
    let totalScore = 0;
    let metricsCount = 0;

    // LCP
    if (currentMetrics.lcp !== undefined) {
      metricsCount++;
      const lcpScore = Math.max(0, 100 - (currentMetrics.lcp / PERFORMANCE_THRESHOLDS.lcp) * 100);
      totalScore += lcpScore;
      if (currentMetrics.lcp > PERFORMANCE_THRESHOLDS.lcp) {
        issues.push(`LCP too slow: ${currentMetrics.lcp.toFixed(0)}ms (target: <${PERFORMANCE_THRESHOLDS.lcp}ms)`);
      }
    }

    // FID
    if (currentMetrics.fid !== undefined) {
      metricsCount++;
      const fidScore = Math.max(0, 100 - (currentMetrics.fid / PERFORMANCE_THRESHOLDS.fid) * 100);
      totalScore += fidScore;
      if (currentMetrics.fid > PERFORMANCE_THRESHOLDS.fid) {
        issues.push(`FID too high: ${currentMetrics.fid.toFixed(0)}ms (target: <${PERFORMANCE_THRESHOLDS.fid}ms)`);
      }
    }

    // CLS
    if (currentMetrics.cls !== undefined) {
      metricsCount++;
      const clsScore = Math.max(0, 100 - (currentMetrics.cls / PERFORMANCE_THRESHOLDS.cls) * 100);
      totalScore += clsScore;
      if (currentMetrics.cls > PERFORMANCE_THRESHOLDS.cls) {
        issues.push(`CLS too high: ${currentMetrics.cls.toFixed(3)} (target: <${PERFORMANCE_THRESHOLDS.cls})`);
      }
    }

    // FCP
    if (currentMetrics.fcp !== undefined) {
      metricsCount++;
      const fcpScore = Math.max(0, 100 - (currentMetrics.fcp / PERFORMANCE_THRESHOLDS.fcp) * 100);
      totalScore += fcpScore;
      if (currentMetrics.fcp > PERFORMANCE_THRESHOLDS.fcp) {
        issues.push(`FCP too slow: ${currentMetrics.fcp.toFixed(0)}ms (target: <${PERFORMANCE_THRESHOLDS.fcp}ms)`);
      }
    }

    // TTFB
    if (currentMetrics.ttfb !== undefined) {
      metricsCount++;
      const ttfbScore = Math.max(0, 100 - (currentMetrics.ttfb / PERFORMANCE_THRESHOLDS.ttfb) * 100);
      totalScore += ttfbScore;
      if (currentMetrics.ttfb > PERFORMANCE_THRESHOLDS.ttfb) {
        issues.push(`TTFB too high: ${currentMetrics.ttfb.toFixed(0)}ms (target: <${PERFORMANCE_THRESHOLDS.ttfb}ms)`);
      }
    }

    const averageScore = metricsCount > 0 ? totalScore / metricsCount : 0;
    const passed = issues.length === 0;

    return {
      score: Math.round(averageScore),
      passed,
      issues,
    };
  }

  /**
   * Send metrics to analytics (placeholder for real implementation)
   */
  public async sendMetrics(endpoint?: string) {
    if (!this.metrics.lcp && !this.metrics.fid && !this.metrics.cls) {
      console.warn('No performance metrics collected yet');
      return;
    }

    const metrics = this.getMetrics();
    const evaluation = this.evaluatePerformance();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      console.log('Metrics:', metrics);
      console.log('Score:', evaluation.score);
      console.log('Passed:', evaluation.passed);
      if (evaluation.issues.length > 0) {
        console.warn('Issues:', evaluation.issues);
      }
      console.groupEnd();
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metrics,
            evaluation,
            timestamp: Date.now(),
          }),
        });
      } catch (error) {
        console.error('Failed to send performance metrics:', error);
      }
    }
  }

  /**
   * Clean up observers
   */
  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  /**
   * Measure bundle size (client-side approximation)
   */
  public measureBundleSize() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(resource => resource.name.includes('.js'));
      const totalSize = jsResources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);

      this.metrics.bundleSize = totalSize;
      return totalSize;
    }
    return 0;
  }

  /**
   * Measure API response time
   */
  public measureApiResponseTime(apiUrl: string, startTime: number) {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    this.metrics.apiResponseTime = responseTime;
    return responseTime;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const recordMetric = (name: keyof PerformanceMetrics, value: number) => {
    performanceMonitor.recordCustomMetric(name, value);
  };

  const getMetrics = () => performanceMonitor.getMetrics();
  const evaluatePerformance = (metrics?: Partial<PerformanceMetrics>) =>
    performanceMonitor.evaluatePerformance(metrics);
  const sendMetrics = (endpoint?: string) => performanceMonitor.sendMetrics(endpoint);

  return {
    recordMetric,
    getMetrics,
    evaluatePerformance,
    sendMetrics,
  };
};



export default performanceMonitor;