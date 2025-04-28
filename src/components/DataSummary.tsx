
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, FileSpreadsheet, AlertTriangle, Copy } from 'lucide-react';
import { ParsedData } from '@/types/data';

interface DataSummaryProps {
  data: ParsedData;
}

export const DataSummary = ({ data }: DataSummaryProps) => {
  const { summary } = data;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dataset Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{summary.rowCount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Database className="h-5 w-5 text-teal-500 mr-2" />
              <span className="text-2xl font-bold">{summary.columnCount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Missing Cells</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">{summary.missingCells.toLocaleString()}</span>
              <span className="text-gray-500 ml-2 text-sm">
                ({((summary.missingCells / (summary.rowCount * summary.columnCount)) * 100).toFixed(2)}%)
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Duplicate Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Copy className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{summary.duplicateRows.toLocaleString()}</span>
              <span className="text-gray-500 ml-2 text-sm">
                ({((summary.duplicateRows / summary.rowCount) * 100).toFixed(2)}%)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
