import { useEffect, useState } from 'react';

interface FontMetrics {
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  fontsLoaded: number;
  fontLoadTime: number;
  cumulativeLayoutShift: number;
}

interface FontPerformanceState {
  isLoading: boolean;
  metrics: FontMetrics | null;
  error: string | null;
}

/**
 * Hook to monitor font loading performance
 * Provides real-time metrics for font optimization
 */
export const useFontPerformance = () => {
  const [state, setState] = useState<FontPerformanceState>({
    isLoading: true,
    metrics: null,
    error: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('fonts' in document)) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Font loading API not supported',
      }));
      return;
    }

    const startTime = performance.now();
    let fontsLoaded = 0;
    const totalFonts = document.fonts.size;

    // Monitor font loading
    const fontLoadPromise = document.fonts.ready.then(() => {
      const loadTime = performance.now() - startTime;
      fontsLoaded = document.fonts.size;

      return {
        fontsLoaded,
        fontLoadTime: Math.round(loadTime),
      };
    });

    // Get Web Vitals metrics
    const getPerformanceMetrics = async () => {
      try {
        // First Paint and First Contentful Paint
        const navigationEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0;
        const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;

        // Largest Contentful Paint
        let largestContentfulPaint = 0;
        if ('PerformanceObserver' in window) {
          try {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              if (lastEntry) {
                largestContentfulPaint = lastEntry.startTime;
              }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
          } catch (e) {
            console.warn('LCP observation failed:', e);
          }
        }

        // Cumulative Layout Shift
        let cumulativeLayoutShift = 0;
        if ('PerformanceObserver' in window) {
          try {
            const observer = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                if (!(entry as any).hadRecentInput) {
                  cumulativeLayoutShift += (entry as any).value;
                }
              });
            });
            observer.observe({ entryTypes: ['layout-shift'] });
          } catch (e) {
            console.warn('CLS observation failed:', e);
          }
        }

        return {
          firstPaint: Math.round(firstPaint),
          firstContentfulPaint: Math.round(firstContentfulPaint),
          largestContentfulPaint: Math.round(largestContentfulPaint),
          cumulativeLayoutShift: Math.round(cumulativeLayoutShift * 1000) / 1000,
        };
      } catch (error) {
        console.warn('Performance metrics collection failed:', error);
        return {
          firstPaint: 0,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
        };
      }
    };

    // Combine font and performance metrics
    Promise.all([fontLoadPromise, getPerformanceMetrics()])
      .then(([fontMetrics, performanceMetrics]) => {
        const metrics: FontMetrics = {
          ...performanceMetrics,
          ...fontMetrics,
        };

        setState({
          isLoading: false,
          metrics,
          error: null,
        });

        // Log performance for debugging
        console.log('Font Performance Metrics:', metrics);

        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
          gtag('event', 'font_performance', {
            font_load_time: metrics.fontLoadTime,
            fcp: metrics.firstContentfulPaint,
            lcp: metrics.largestContentfulPaint,
            cls: metrics.cumulativeLayoutShift,
          });
        }
      })
      .catch((error) => {
        console.error('Font performance monitoring failed:', error);
        setState({
          isLoading: false,
          metrics: null,
          error: error.message,
        });
      });

    // Monitor font loading changes
    const handleFontLoading = () => {
      const currentFonts = document.fonts.size;
      if (currentFonts !== fontsLoaded) {
        fontsLoaded = currentFonts;
        setState(prev => ({
          ...prev,
          metrics: prev.metrics ? {
            ...prev.metrics,
            fontsLoaded,
          } : null,
        }));
      }
    };

    document.fonts.addEventListener('loadingdone', handleFontLoading);

    return () => {
      document.fonts.removeEventListener('loadingdone', handleFontLoading);
    };
  }, []);

  // Function to manually load optional fonts
  const loadOptionalFont = async (fontUrl: string) => {
    try {
      const startTime = performance.now();
      const fontFace = new FontFace('NotoSans', `url(${fontUrl}) format('woff2')`);
      await fontFace.load();
      (document.fonts as any).add(fontFace);

      const loadTime = performance.now() - startTime;
      console.log(`Optional font loaded in ${Math.round(loadTime)}ms: ${fontUrl}`);

      return loadTime;
    } catch (error) {
      console.error(`Failed to load optional font ${fontUrl}:`, error);
      throw error;
    }
  };

  return {
    ...state,
    loadOptionalFont,
  };
};

/**
 * Hook to optimize font loading based on user interaction
 */
export const useLazyFontLoading = () => {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const interactions = ['click', 'scroll', 'keydown', 'touchstart'];

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);

        // Load secondary fonts after first interaction
        const secondaryFonts = [
          '/static/fonts/NotoSans-Italic.woff2',
          '/static/fonts/NotoSans-BoldItalic.woff2',
        ];

        secondaryFonts.forEach(fontUrl => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = fontUrl;
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        });
      }
    };

    interactions.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      interactions.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [hasInteracted]);

  return hasInteracted;
};