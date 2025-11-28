/**
 * Virtual Scrolling Hook
 *
 * Implements virtual scrolling for large lists/tables to render only visible items.
 * Based on react-window principles but with custom implementation.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface VirtualScrollOptions {
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the viewport in pixels */
  viewportHeight: number;
  /** Number of items to render outside viewport (overscan) */
  overscan?: number;
  /** Enable smooth scrolling */
  smoothScroll?: boolean;
  /** Callback when scroll position changes */
  onScroll?: (scrollTop: number) => void;
}

export interface VirtualScrollState {
  /** Index of first visible item */
  startIndex: number;
  /** Index of last visible item */
  endIndex: number;
  /** Items to render (with overscan) */
  visibleItems: number[];
  /** Total height of scrollable content */
  totalHeight: number;
  /** Offset from top for visible items */
  offsetY: number;
  /** Scroll to specific index */
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end') => void;
  /** Scroll to specific offset */
  scrollToOffset: (offset: number) => void;
  /** Ref for scroll container */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Current scroll position */
  scrollTop: number;
}

/**
 * Hook for virtual scrolling
 *
 * @param itemCount - Total number of items
 * @param options - Configuration options
 * @returns Virtual scroll state and controls
 *
 * @example
 * ```tsx
 * const { visibleItems, containerRef, offsetY, totalHeight } = useVirtualScroll(
 *   data.length,
 *   { itemHeight: 50, viewportHeight: 600 }
 * );
 *
 * return (
 *   <div ref={containerRef} style={{ height: 600, overflow: 'auto' }}>
 *     <div style={{ height: totalHeight, position: 'relative' }}>
 *       <div style={{ transform: `translateY(${offsetY}px)` }}>
 *         {visibleItems.map(index => (
 *           <div key={index} style={{ height: 50 }}>
 *             {data[index].name}
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useVirtualScroll(
  itemCount: number,
  options: VirtualScrollOptions
): VirtualScrollState {
  const {
    itemHeight,
    viewportHeight,
    overscan = 3,
    smoothScroll = true,
    onScroll,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(viewportHeight / itemHeight);
    const end = Math.min(itemCount - 1, start + visibleCount);

    // Add overscan
    const overscanStart = Math.max(0, start - overscan);
    const overscanEnd = Math.min(itemCount - 1, end + overscan);

    const items = [];
    for (let i = overscanStart; i <= overscanEnd; i++) {
      items.push(i);
    }

    return {
      startIndex: start,
      endIndex: end,
      visibleItems: items,
    };
  }, [scrollTop, itemHeight, viewportHeight, itemCount, overscan]);

  // Total height of scrollable content
  const totalHeight = itemCount * itemHeight;

  // Offset for visible items
  const offsetY = visibleItems.length > 0 ? visibleItems[0] * itemHeight : 0;

  // Handle scroll
  const handleScroll = useCallback(
    (e: Event) => {
      const target = e.target as HTMLDivElement;
      const newScrollTop = target.scrollTop;

      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll]
  );

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Scroll to index
  const scrollToIndex = useCallback(
    (index: number, align: 'start' | 'center' | 'end' = 'start') => {
      const container = containerRef.current;
      if (!container) return;

      let offset = index * itemHeight;

      if (align === 'center') {
        offset -= viewportHeight / 2 - itemHeight / 2;
      } else if (align === 'end') {
        offset -= viewportHeight - itemHeight;
      }

      offset = Math.max(0, Math.min(offset, totalHeight - viewportHeight));

      container.scrollTo({
        top: offset,
        behavior: smoothScroll ? 'smooth' : 'auto',
      });
    },
    [itemHeight, viewportHeight, totalHeight, smoothScroll]
  );

  // Scroll to offset
  const scrollToOffset = useCallback(
    (offset: number) => {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTo({
        top: offset,
        behavior: smoothScroll ? 'smooth' : 'auto',
      });
    },
    [smoothScroll]
  );

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
    scrollToIndex,
    scrollToOffset,
    containerRef,
    scrollTop,
  };
}

/**
 * Hook for virtual grid (2D virtualization)
 *
 * @param rowCount - Total number of rows
 * @param columnCount - Total number of columns
 * @param options - Configuration options
 * @returns Virtual grid state and controls
 */
export interface VirtualGridOptions {
  /** Height of each row in pixels */
  rowHeight: number;
  /** Width of each column in pixels */
  columnWidth: number;
  /** Height of the viewport in pixels */
  viewportHeight: number;
  /** Width of the viewport in pixels */
  viewportWidth: number;
  /** Number of rows to render outside viewport */
  rowOverscan?: number;
  /** Number of columns to render outside viewport */
  columnOverscan?: number;
}

export interface VirtualGridState {
  /** Visible row indices */
  visibleRows: number[];
  /** Visible column indices */
  visibleColumns: number[];
  /** Total height of scrollable content */
  totalHeight: number;
  /** Total width of scrollable content */
  totalWidth: number;
  /** Vertical offset */
  offsetY: number;
  /** Horizontal offset */
  offsetX: number;
  /** Ref for scroll container */
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useVirtualGrid(
  rowCount: number,
  columnCount: number,
  options: VirtualGridOptions
): VirtualGridState {
  const {
    rowHeight,
    columnWidth,
    viewportHeight,
    viewportWidth,
    rowOverscan = 3,
    columnOverscan = 3,
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible rows
  const visibleRows = useMemo(() => {
    const startRow = Math.floor(scrollTop / rowHeight);
    const visibleRowCount = Math.ceil(viewportHeight / rowHeight);
    const endRow = Math.min(rowCount - 1, startRow + visibleRowCount);

    const overscanStart = Math.max(0, startRow - rowOverscan);
    const overscanEnd = Math.min(rowCount - 1, endRow + rowOverscan);

    const rows = [];
    for (let i = overscanStart; i <= overscanEnd; i++) {
      rows.push(i);
    }
    return rows;
  }, [scrollTop, rowHeight, viewportHeight, rowCount, rowOverscan]);

  // Calculate visible columns
  const visibleColumns = useMemo(() => {
    const startCol = Math.floor(scrollLeft / columnWidth);
    const visibleColCount = Math.ceil(viewportWidth / columnWidth);
    const endCol = Math.min(columnCount - 1, startCol + visibleColCount);

    const overscanStart = Math.max(0, startCol - columnOverscan);
    const overscanEnd = Math.min(columnCount - 1, endCol + columnOverscan);

    const cols = [];
    for (let i = overscanStart; i <= overscanEnd; i++) {
      cols.push(i);
    }
    return cols;
  }, [scrollLeft, columnWidth, viewportWidth, columnCount, columnOverscan]);

  const totalHeight = rowCount * rowHeight;
  const totalWidth = columnCount * columnWidth;
  const offsetY = visibleRows.length > 0 ? visibleRows[0] * rowHeight : 0;
  const offsetX = visibleColumns.length > 0 ? visibleColumns[0] * columnWidth : 0;

  // Handle scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
      setScrollLeft(container.scrollLeft);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    visibleRows,
    visibleColumns,
    totalHeight,
    totalWidth,
    offsetY,
    offsetX,
    containerRef,
  };
}
