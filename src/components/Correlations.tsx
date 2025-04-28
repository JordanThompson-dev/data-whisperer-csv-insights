
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ParsedData } from '@/types/data';

interface CorrelationsProps {
  data: ParsedData;
}

export const Correlations = ({ data }: CorrelationsProps) => {
  const { correlations } = data;
  
  // Sort correlations by absolute value (strongest first)
  const sortedCorrelations = [...correlations].sort(
    (a, b) => Math.abs(b.value) - Math.abs(a.value)
  );

  // Function to get color based on correlation value
  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.8) return value > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50';
    if (absValue >= 0.6) return value > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
    if (absValue >= 0.4) return value > 0 ? 'text-green-500' : 'text-red-500';
    if (absValue >= 0.2) return value > 0 ? 'text-green-400' : 'text-red-400';
    return 'text-gray-500';
  };
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Correlations</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Correlation Analysis (Pearson's r)</CardTitle>
        </CardHeader>
        <CardContent>
          {correlations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No correlations available. Need at least two numeric columns.
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column 1</TableHead>
                    <TableHead>Column 2</TableHead>
                    <TableHead>Correlation (r)</TableHead>
                    <TableHead>Strength</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCorrelations.map((corr, index) => (
                    <TableRow key={`${corr.column1}-${corr.column2}`}>
                      <TableCell className="font-medium">{corr.column1}</TableCell>
                      <TableCell>{corr.column2}</TableCell>
                      <TableCell>
                        <span className={`font-medium px-2 py-1 rounded ${getCorrelationColor(corr.value)}`}>
                          {corr.value.toFixed(3)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {Math.abs(corr.value) >= 0.8 && 'Very Strong'} 
                        {Math.abs(corr.value) >= 0.6 && Math.abs(corr.value) < 0.8 && 'Strong'}
                        {Math.abs(corr.value) >= 0.4 && Math.abs(corr.value) < 0.6 && 'Moderate'}
                        {Math.abs(corr.value) >= 0.2 && Math.abs(corr.value) < 0.4 && 'Weak'}
                        {Math.abs(corr.value) < 0.2 && 'Very Weak / None'}
                        {corr.value > 0 ? ' Positive' : ' Negative'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
