
import { ColumnStat } from '@/types/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ColumnChartsProps {
  column: ColumnStat;
}

export const ColumnCharts = ({ column }: ColumnChartsProps) => {
  if (column.type === 'numeric' && column.histogram) {
    // Prepare histogram data
    const histogramData = column.histogram.map((count, index) => ({
      bin: index,
      count: count,
    }));

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Distribution: {column.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ChartContainer config={{ data: { theme: { light: '#8B5CF6', dark: '#9b87f5' } } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="bin" />
                  <YAxis />
                  <Tooltip content={props => <ChartTooltipContent {...props} />} />
                  <Bar dataKey="count" fill="var(--color-data)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (column.type === 'categorical' && column.categories) {
    // Prepare categorical data
    const categoryData = column.categories.map(cat => ({
      category: cat.value,
      count: cat.count,
    }));

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Category Distribution: {column.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ChartContainer config={{ data: { theme: { light: '#8B5CF6', dark: '#9b87f5' } } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip content={props => <ChartTooltipContent {...props} />} />
                  <Bar dataKey="count" fill="var(--color-data)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
