
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColumnStat, ParsedData } from '@/types/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface ColumnAnalysisProps {
  data: ParsedData;
}

export const ColumnAnalysis = ({ data }: ColumnAnalysisProps) => {
  const [activeTab, setActiveTab] = useState('all');

  const getColumnsByType = (type: ColumnStat['type']) => {
    return data.columns.filter(col => col.type === type);
  };

  const renderColumnStats = (columns: ColumnStat[]) => {
    if (columns.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No columns of this type found
        </div>
      );
    }
    
    return (
      <ScrollArea className="h-[450px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column Name</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Missing</TableHead>
              <TableHead>Unique</TableHead>
              <TableHead>Statistics</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map(column => (
              <TableRow key={column.name}>
                <TableCell className="font-medium">{column.name}</TableCell>
                <TableCell>{column.count.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{column.missing.toLocaleString()}</span>
                    <Progress 
                      value={(column.missing / column.count) * 100} 
                      className="h-2 w-20"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{column.unique.toLocaleString()}</span>
                    <Progress 
                      value={(column.unique / column.count) * 100} 
                      className="h-2 w-20"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {column.type === 'numeric' && (
                    <div className="text-sm">
                      <div>Mean: {column.mean?.toFixed(2)}</div>
                      <div>Median: {column.median?.toFixed(2)}</div>
                      <div>Std: {column.std?.toFixed(2)}</div>
                      <div>Min: {column.min?.toFixed(2)}</div>
                      <div>Max: {column.max?.toFixed(2)}</div>
                    </div>
                  )}
                  {column.type === 'categorical' && column.categories && (
                    <div className="text-sm">
                      <div>Mode: {column.mode}</div>
                      <div className="mt-1">
                        {column.categories.slice(0, 3).map(cat => (
                          <div key={cat.value} className="flex items-center space-x-2">
                            <span className="truncate max-w-[100px]">{cat.value}</span>
                            <Progress 
                              value={(cat.count / column.count) * 100} 
                              className="h-1.5 w-16"
                            />
                            <span className="text-xs text-gray-500">
                              {((cat.count / column.count) * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                        {column.categories.length > 3 && (
                          <div className="text-xs text-gray-500 mt-1">
                            +{column.categories.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {column.type === 'date' && (
                    <div className="text-sm">
                      <div>Min: {String(column.min)}</div>
                      <div>Max: {String(column.max)}</div>
                    </div>
                  )}
                  {(column.type === 'text' || column.type === 'unknown') && (
                    <div className="text-sm text-gray-500">
                      No specific statistics available
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Column Analysis</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Column Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="all">All ({data.columns.length})</TabsTrigger>
              <TabsTrigger value="numeric">Numeric ({getColumnsByType('numeric').length})</TabsTrigger>
              <TabsTrigger value="categorical">Categorical ({getColumnsByType('categorical').length})</TabsTrigger>
              <TabsTrigger value="date">Date ({getColumnsByType('date').length})</TabsTrigger>
              <TabsTrigger value="text">Text ({getColumnsByType('text').length})</TabsTrigger>
              <TabsTrigger value="boolean">Boolean ({getColumnsByType('boolean').length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderColumnStats(data.columns)}
            </TabsContent>
            
            <TabsContent value="numeric">
              {renderColumnStats(getColumnsByType('numeric'))}
            </TabsContent>
            
            <TabsContent value="categorical">
              {renderColumnStats(getColumnsByType('categorical'))}
            </TabsContent>
            
            <TabsContent value="date">
              {renderColumnStats(getColumnsByType('date'))}
            </TabsContent>
            
            <TabsContent value="text">
              {renderColumnStats(getColumnsByType('text'))}
            </TabsContent>
            
            <TabsContent value="boolean">
              {renderColumnStats(getColumnsByType('boolean'))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};
