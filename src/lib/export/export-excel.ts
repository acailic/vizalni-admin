/**
 * Excel export utilities with styled headers and metadata
 * Uses xlsx library (lazy-loaded to reduce bundle size)
 */

import { createSafeFilename } from './filename';

export interface ExcelExportOptions {
  /** Chart title for filename and sheet name */
  title: string;
  /** Column headers (in original language) */
  headers: string[];
  /** Source attribution */
  source?: string;
  /** Applied filters description */
  filters?: string;
  /** Sheet name (defaults to title, max 31 chars) */
  sheetName?: string;
}

// Serbian government blue color
const HEADER_BG_COLOR = '0066CC'; // Blue
const HEADER_FONT_COLOR = 'FFFFFF'; // White

/**
 * Dynamically load xlsx library (lazy-loaded for bundle optimization)
 */
async function loadXLSX() {
  const XLSX = await import('xlsx');
  return XLSX;
}

/**
 * Create Excel workbook with styled headers and metadata
 * 
 * @param data - Array of objects to export
 * @param options - Export options
 * @returns Promise that resolves with download triggered
 */
export async function exportDataAsExcel<T extends Record<string, unknown>>(
  data: T[],
  options: ExcelExportOptions
): Promise<void> {
  const XLSX = await loadXLSX();

  const { title, headers, source, filters, sheetName } = options;

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([]);

  // Prepare data with header row
  const rows: (string | number | null | undefined)[][] = [];

  // Add header row
  rows.push(headers);

  // Add data rows
  data.forEach((item) => {
    const row = headers.map((header) => {
      const value = (item as Record<string, unknown>)[header];
      if (value == null) return '';
      if (typeof value === 'number') return value;
      return String(value);
    });
    rows.push(row);
  });

  // Add empty row before metadata
  rows.push([]);

  // Add metadata rows
  const exportDate = new Date().toLocaleDateString('sr-RS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (source) {
    rows.push([`Извор: ${source}`]);
  }
  rows.push([`Датум извоза: ${exportDate}`]);
  if (filters) {
    rows.push([`Примењени филтери: ${filters}`]);
  }

  // Add rows to sheet
  XLSX.utils.sheet_add_aoa(sheet, rows, { origin: 'A1' });

  // Set column widths based on header length
  const colWidths = headers.map((header) => ({
    wch: Math.max(header.length, 15),
  }));
  sheet['!cols'] = colWidths;

  // Style header row (using cell properties)
  const headerRange = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  headerRange.e.r = 0; // Only first row

  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!sheet[cellAddress]) continue;

    // Apply styling (note: xlsx library has limited styling support)
    // For full styling, we would need exceljs or a similar library
    sheet[cellAddress].s = {
      fill: {
        patternType: 'solid',
        fgColor: { rgb: HEADER_BG_COLOR },
      },
      font: {
        bold: true,
        color: { rgb: HEADER_FONT_COLOR },
        sz: 11,
      },
      alignment: {
        vertical: 'center',
        horizontal: 'left',
      },
    };
  }

  // Truncate sheet name to 31 characters (Excel limit)
  const finalSheetName = (sheetName || title).substring(0, 31);

  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, sheet, finalSheetName);

  // Generate Excel file and trigger download
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true,
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = createSafeFilename(title, 'xlsx');
  link.href = url;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Export table data with all visible columns
 * 
 * @param columns - Column definitions
 * @param data - Row data
 * @param options - Export options
 */
export async function exportTableAsExcel(
  columns: { key: string; label: string }[],
  data: Record<string, unknown>[],
  options: Omit<ExcelExportOptions, 'headers'>
): Promise<void> {
  const headers = columns.map((col) => col.label);
  const mappedData = data.map((row) => {
    const mappedRow: Record<string, unknown> = {};
    columns.forEach((col) => {
      mappedRow[col.label] = row[col.key];
    });
    return mappedRow;
  });

  await exportDataAsExcel(mappedData, {
    ...options,
    headers,
  });
}
