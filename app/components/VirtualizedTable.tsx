/**
 * Virtualized Table Component
 *
 * High-performance table component for large datasets using virtual scrolling.
 */

import React from 'react';

import { useVirtualScroll } from '../hooks/use-virtual-scroll';

export interface Column<T = any> {
  key: string;
  header: string;
  width?: number;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

export interface VirtualizedTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  height?: number;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
}

export function VirtualizedTable<T = any>({
  data,
  columns,
  rowHeight = 50,
  height = 600,
  onRowClick,
  className = '',
  headerClassName = '',
  rowClassName = '',
}: VirtualizedTableProps<T>) {
  const { visibleItems, containerRef, offsetY, totalHeight } = useVirtualScroll(
    data.length,
    { itemHeight: rowHeight, viewportHeight: height }
  );

  const getRowClassName = (row: T, index: number): string => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row, index);
    }
    return rowClassName;
  };

  return (
    <div className={`virtualized-table ${className}`}>
      {/* Header */}
      <div className={`table-header ${headerClassName}`} style={{ display: 'flex' }}>
        {columns.map((col) => (
          <div
            key={col.key}
            className="table-header-cell"
            style={{
              width: col.width || `${100 / columns.length}%`,
              padding: '12px',
              fontWeight: 600,
              borderBottom: '2px solid #e0e0e0',
            }}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Scrollable body */}
      <div
        ref={containerRef}
        className="table-body"
        style={{
          height,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((index) => {
              const row = data[index];
              return (
                <div
                  key={index}
                  className={`table-row ${getRowClassName(row, index)}`}
                  style={{
                    display: 'flex',
                    height: rowHeight,
                    borderBottom: '1px solid #f0f0f0',
                    cursor: onRowClick ? 'pointer' : 'default',
                  }}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {columns.map((col) => {
                    const value = (row as any)[col.key];
                    return (
                      <div
                        key={col.key}
                        className="table-cell"
                        style={{
                          width: col.width || `${100 / columns.length}%`,
                          padding: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col.render ? col.render(value, row, index) : value}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
