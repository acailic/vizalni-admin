/**
 * Performance Optimization React Components
 * Memoized components and performance utilities
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { dynamic } from 'next/dynamic';

// Performance monitoring decorator
export const withPerformanceTracking = <P extends object>(
  componentName: string,
  Component: React.ComponentType<P>
) => {
  const TrackedComponent = memo(Component);

  return (props: P) => {
    const renderStart = useRef<number>();

    useEffect(() => {
      renderStart.current = performance.now();

      return () => {
        if (renderStart.current) {
          const renderTime = performance.now() - renderStart.current;
          if (renderTime > 16) { // Alert if render takes more than one frame
            console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
          }
        }
      };
    });

    return <TrackedComponent {...props} />;
  };
};

// Lazy loading wrapper with performance tracking
export const createLazyComponent = <P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  componentName: string,
  fallback?: React.ReactNode
) => {
  const LazyComponent = dynamic(importFn, {
    loading: fallback ? () => <>{fallback}</> : () => <div>Loading {componentName}...</div>,
    ssr: false, // Disable SSR for better performance
  });

  return withPerformanceTracking(componentName, LazyComponent);
};

// Virtualized list component for large datasets
interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export const VirtualizedList = memo(<T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
}: VirtualizedListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
    }));
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}) as typeof VirtualizedList;

// Debounced input component for search/filter
interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
}

export const DebouncedInput = memo(({ value, onChange, debounceMs = 300, ...props }: DebouncedInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      {...props}
      value={inputValue}
      onChange={handleChange}
    />
  );
});

// Image optimization component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  className?: string;
}

export const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  priority = false,
  loading = 'lazy',
  placeholder = 'empty',
  className,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div
        className={`image-error-placeholder ${className || ''}`}
        style={{ width, height }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div className={`optimized-image-container ${className || ''}`}>
      {!isLoaded && placeholder === 'blur' && (
        <div className="image-placeholder-blur" />
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
});

// Chart container with resize optimization
interface ChartContainerProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

export const ChartContainer = memo(({ children, width, height, maintainAspectRatio = true }: ChartContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;

        if (width && height) {
          setDimensions({ width, height });
        } else if (maintainAspectRatio && width) {
          setDimensions({ width, height: width * 0.6 }); // Default aspect ratio
        } else {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [width, height, maintainAspectRatio]);

  return (
    <div ref={containerRef} className="chart-container" style={{ width, height }}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <div style={{ width: dimensions.width, height: dimensions.height }}>
          {children}
        </div>
      )}
    </div>
  );
});

// Cache for expensive computations
class ComputationCache {
  private cache = new Map<string, { result: any; timestamp: number }>();
  private ttl: number;

  constructor(ttl = 5000) { // 5 seconds default TTL
    this.ttl = ttl;
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.result;
  }

  set(key: string, result: any): void {
    this.cache.set(key, { result, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const computationCache = new ComputationCache();

// Hook for expensive computations
export const useComputation = <T>(
  key: string,
  compute: () => T,
  dependencies: React.DependencyList
): T => {
  return useMemo(() => {
    // Try to get from cache first
    const cached = computationCache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Compute and cache result
    const result = compute();
    computationCache.set(key, result);
    return result;
  }, dependencies);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();

    if (lastRenderTime.current > 0) {
      const timeSinceLastRender = now - lastRenderTime.current;
      if (renderCount.current > 1 && timeSinceLastRender < 16) {
        console.warn(`🔄 Frequent re-renders detected: ${componentName} (${timeSinceLastRender.toFixed(2)}ms apart)`);
      }
    }

    lastRenderTime.current = now;
  });

  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current,
  };
};

// Lazy loading heavy components
export const LazyMapVisualization = createLazyComponent(
  () => import('../components/MapVisualization'),
  'MapVisualization',
  <div>Loading map...</div>
);

export const LazyAdvancedCharts = createLazyComponent(
  () => import('../components/AdvancedCharts'),
  'AdvancedCharts',
  <div>Loading charts...</div>
);

export const LazyDataTable = createLazyComponent(
  () => import('../components/DataTable'),
  'DataTable',
  <div>Loading table...</div>
);