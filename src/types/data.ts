
export interface ColumnStat {
  name: string;
  type: 'numeric' | 'categorical' | 'date' | 'boolean' | 'text' | 'unknown';
  count: number;
  unique: number;
  missing: number;
  mean?: number;
  median?: number;
  min?: number | string;
  max?: number | string;
  std?: number;
  mode?: string | number;
  histogram?: number[];
  categories?: { value: string; count: number }[];
}

export interface Correlation {
  column1: string;
  column2: string;
  value: number;
}

export interface DataSummaryStats {
  rowCount: number;
  columnCount: number;
  missingCells: number;
  duplicateRows: number;
  memoryUsage: string;
}

export interface ParsedData {
  summary: DataSummaryStats;
  columns: ColumnStat[];
  correlations: Correlation[];
  rawData: any[][];
  headers: string[];
}
