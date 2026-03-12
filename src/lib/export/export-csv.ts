/**
 * CSV export utilities with UTF-8 BOM and semicolon delimiter
 * Ensures proper display in Excel on Windows with Cyrillic characters
 */

import Papa from 'papaparse';

import { createSafeFilename } from './filename';

export interface CSVExportOptions {
  /** Chart title for filename */
  title: string;
  /** Column headers (in original language) */
  headers?: string[];
  /** Delimiter (default: semicolon for Serbian locale) */
  delimiter?: string;
  /** Include UTF-8 BOM (default: true for Excel compatibility) */
  includeBOM?: boolean;
}

/**
 * Export data as CSV with UTF-8 BOM and semicolon delimiter
 * 
 * @param data - Array of objects to export
 * @param options - Export options
 * @returns Blob with CSV data
 */
export function createCSVBlob<T extends Record<string, unknown>>(
  data: T[],
  options: CSVExportOptions
): Blob {
  const { delimiter = ';', includeBOM = true } = options;

  // Use papaparse to generate CSV
  const csv = Papa.unparse(data, {
    delimiter,
    header: true,
    newline: '\r\n', // Windows line endings for better Excel compatibility
  });

  // Add UTF-8 BOM if requested
  const bom = includeBOM ? '\uFEFF' : '';
  const csvWithBOM = bom + csv;

  return new Blob([csvWithBOM], {
    type: 'text/csv;charset=utf-8',
  });
}

/**
 * Export data as CSV file download
 * 
 * @param data - Array of objects to export
 * @param options - Export options
 */
export function exportDataAsCSV<T extends Record<string, unknown>>(
  data: T[],
  options: CSVExportOptions
): void {
  const blob = createCSVBlob(data, options);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = createSafeFilename(options.title, 'csv');
  link.href = url;
  link.click();

  // Clean up object URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Export array data with custom headers
 * 
 * @param rows - 2D array of data (first row = headers)
 * @param options - Export options
 */
export function exportArrayAsCSV(
  rows: (string | number | null | undefined)[][],
  options: CSVExportOptions
): void {
  const { delimiter = ';', includeBOM = true } = options;

  // Convert array to CSV string
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          if (cell == null) return '';
          const cellStr = String(cell);
          // Escape quotes and wrap in quotes if contains delimiter, quotes, or newlines
          if (
            cellStr.includes(delimiter) ||
            cellStr.includes('"') ||
            cellStr.includes('\n') ||
            cellStr.includes('\r')
          ) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(delimiter)
    )
    .join('\r\n');

  const bom = includeBOM ? '\uFEFF' : '';
  const csvWithBOM = bom + csv;

  const blob = new Blob([csvWithBOM], {
    type: 'text/csv;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = createSafeFilename(options.title, 'csv');
  link.href = url;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Format number for Serbian locale (comma as decimal separator)
 */
export function formatNumberForSerbianLocale(value: number | null | undefined): string {
  if (value == null) return '';
  return value.toString().replace(/\./g, ',');
}
