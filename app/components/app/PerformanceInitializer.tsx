'use client';

import { useEffect } from 'react';

import { getPerformanceMonitor } from '../../lib/performance/monitor';

interface PerformanceInitializerProps {
  children: React.ReactNode;
}

const PerformanceInitializer: React.FC<PerformanceInitializerProps> = ({ children }) => {
  useEffect(() => {
    // Initialize performance monitoring only in browser
    if (typeof window !== 'undefined') {
      // Initialize the performance monitor
      const monitor = getPerformanceMonitor();

      // Add global error handling for performance tracking
      const handleError = (event: ErrorEvent) => {
        if (monitor && process.env.NODE_ENV === 'production') {
          // Send error events to analytics
          console.warn('Performance-related error detected:', event.message);
        }
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        if (monitor && process.env.NODE_ENV === 'production') {
          console.warn('Unhandled promise rejection (may affect performance):', event.reason);
        }
      };

      // Add event listeners for performance-related errors
      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      // Monitor long tasks that can block the main thread
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.duration > 50) { // Tasks taking longer than 50ms
                console.warn('Long task detected:', {
                  duration: entry.duration,
                  startTime: entry.startTime,
                  name: (entry as any).name || 'unknown',
                });
              }
            });
          });

          const entryTypes = ['longtask'].filter(type => 
            PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes(type)
          );

          if (entryTypes.length > 0) {
            observer.observe({ entryTypes });
          }
        } catch (error) {
          // Long task observation might not be supported
          console.debug('Long task monitoring not supported');
        }
      }

      // Cleanup function
      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  return <>{children}</>;
};

export default PerformanceInitializer;