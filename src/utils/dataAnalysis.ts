
import { ParsedData, ColumnStat, Correlation } from '@/types/data';
import Papa from 'papaparse';

// Function to detect column type
const detectType = (values: any[]): ColumnStat['type'] => {
  // Remove empty/null values for detection
  const cleanValues = values.filter(v => v !== null && v !== undefined && v !== '');
  if (cleanValues.length === 0) return 'unknown';

  // Check if boolean
  if (cleanValues.every(v => v === 'true' || v === 'false' || v === true || v === false)) {
    return 'boolean';
  }

  // Check if numeric
  if (cleanValues.every(v => !isNaN(Number(v)))) {
    return 'numeric';
  }

  // Check if date
  const dateRegex = /^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}(?: \d{1,2}:\d{1,2}(?::\d{1,2})?)?$/;
  if (cleanValues.every(v => dateRegex.test(String(v)) || !isNaN(Date.parse(String(v))))) {
    return 'date';
  }

  // Check if categorical (fewer than 10 unique values and less than 20% of row count)
  const uniqueValues = new Set(cleanValues);
  if (uniqueValues.size <= 10 && uniqueValues.size <= values.length * 0.2) {
    return 'categorical';
  }

  // Default to text
  return 'text';
};

// Calculate basic statistics for a column
const calculateColumnStats = (
  name: string, 
  values: any[], 
  type: ColumnStat['type']
): ColumnStat => {
  const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '');
  const countMap: Record<string, number> = {};
  
  // Count occurrences for mode and categories
  nonEmptyValues.forEach(value => {
    const strValue = String(value);
    countMap[strValue] = (countMap[strValue] || 0) + 1;
  });

  // Find the mode (most common value)
  let mode: string | number | undefined = undefined;
  let maxCount = 0;
  Object.entries(countMap).forEach(([value, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mode = type === 'numeric' ? Number(value) : value;
    }
  });

  const stat: ColumnStat = {
    name,
    type,
    count: values.length,
    missing: values.length - nonEmptyValues.length,
    unique: Object.keys(countMap).length,
    mode,
  };

  // Add numeric-specific stats
  if (type === 'numeric') {
    const numericValues = nonEmptyValues.map(Number);
    stat.mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
    stat.std = Math.sqrt(
      numericValues.reduce((sum, val) => sum + Math.pow(val - (stat.mean || 0), 2), 0) / numericValues.length
    );
    
    // Sort for median, min, max
    numericValues.sort((a, b) => a - b);
    stat.min = numericValues[0];
    stat.max = numericValues[numericValues.length - 1];
    stat.median = numericValues.length % 2 === 0
      ? (numericValues[numericValues.length / 2 - 1] + numericValues[numericValues.length / 2]) / 2
      : numericValues[Math.floor(numericValues.length / 2)];
    
    // Create histogram
    const bins = 10;
    const binSize = ((stat.max as number) - (stat.min as number)) / bins;
    stat.histogram = Array(bins).fill(0);
    
    numericValues.forEach(val => {
      const binIndex = Math.min(
        Math.floor((val - (stat.min as number)) / binSize),
        bins - 1
      );
      stat.histogram![binIndex]++;
    });
  } else if (type === 'categorical' || type === 'boolean') {
    // For categorical, collect categories and their counts
    stat.categories = Object.entries(countMap)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
    stat.min = nonEmptyValues[0];
    stat.max = nonEmptyValues[nonEmptyValues.length - 1];
  }

  return stat;
};

// Calculate correlation between two numeric columns
const calculateCorrelation = (column1: number[], column2: number[]): number => {
  if (column1.length !== column2.length || column1.length === 0) {
    return 0;
  }
  
  const n = column1.length;
  const mean1 = column1.reduce((sum, val) => sum + val, 0) / n;
  const mean2 = column2.reduce((sum, val) => sum + val, 0) / n;
  
  let num = 0;
  let denom1 = 0;
  let denom2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = column1[i] - mean1;
    const diff2 = column2[i] - mean2;
    num += diff1 * diff2;
    denom1 += diff1 * diff1;
    denom2 += diff2 * diff2;
  }
  
  if (denom1 === 0 || denom2 === 0) {
    return 0;
  }
  
  return num / Math.sqrt(denom1 * denom2);
};

// Main function to analyze CSV data
export const analyzeCSV = async (csvText: string): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const data = results.data as Record<string, any>[];
          if (data.length === 0) {
            throw new Error('CSV file is empty');
          }
          
          const headers = Object.keys(data[0]);
          if (headers.length === 0) {
            throw new Error('CSV file has no columns');
          }
          
          // Extract columns
          const columns: Record<string, any[]> = {};
          headers.forEach(header => {
            columns[header] = data.map(row => row[header]);
          });
          
          // Calculate column statistics
          const columnStats: ColumnStat[] = headers.map(header => {
            const values = columns[header];
            const type = detectType(values);
            return calculateColumnStats(header, values, type);
          });
          
          // Calculate correlations between numeric columns
          const correlations: Correlation[] = [];
          const numericColumns = columnStats
            .filter(col => col.type === 'numeric')
            .map(col => col.name);
          
          for (let i = 0; i < numericColumns.length; i++) {
            for (let j = i + 1; j < numericColumns.length; j++) {
              const col1 = numericColumns[i];
              const col2 = numericColumns[j];
              const values1 = columns[col1].filter((_, idx) => 
                columns[col1][idx] !== null && columns[col2][idx] !== null
              );
              const values2 = columns[col2].filter((_, idx) => 
                columns[col1][idx] !== null && columns[col2][idx] !== null
              );
              
              const correlation = calculateCorrelation(values1, values2);
              correlations.push({
                column1: col1,
                column2: col2,
                value: parseFloat(correlation.toFixed(3))
              });
            }
          }
          
          // Count duplicate rows
          const stringifiedRows = data.map(row => JSON.stringify(row));
          const uniqueRows = new Set(stringifiedRows);
          const duplicateRows = data.length - uniqueRows.size;
          
          // Calculate missing cells
          const missingCells = columnStats.reduce(
            (sum, col) => sum + col.missing, 
            0
          );
          
          // Prepare raw data for display (first 100 rows)
          const rawData = data.slice(0, 100).map(row => 
            headers.map(header => row[header])
          );
          
          // Approximate memory usage
          const jsonSize = JSON.stringify(data).length;
          const memoryUsage = jsonSize < 1024 
            ? `${jsonSize} bytes`
            : jsonSize < 1024 * 1024
            ? `${(jsonSize / 1024).toFixed(2)} KB`
            : `${(jsonSize / (1024 * 1024)).toFixed(2)} MB`;
          
          // Finalize the result
          const result: ParsedData = {
            summary: {
              rowCount: data.length,
              columnCount: headers.length,
              missingCells,
              duplicateRows,
              memoryUsage
            },
            columns: columnStats,
            correlations,
            rawData,
            headers
          };
          
          resolve(result);
        } catch (error) {
          console.error('Error analyzing data:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      }
    });
  });
};
