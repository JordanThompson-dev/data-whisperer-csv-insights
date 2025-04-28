
import { Correlation } from '@/types/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface CorrelationChartProps {
  correlations: Correlation[];
}

export const CorrelationChart = ({ correlations }: CorrelationChartProps) => {
  if (correlations.length === 0) return null;

  // Transform correlations data for visualization
  const correlationData = correlations.map(corr => ({
    name: `${corr.column1} vs ${corr.column2}`,
    x: corr.column1,
    y: corr.column2,
    value: corr.value
  }));

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Correlation Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={{ correlations: { theme: { light: '#8B5CF6' } } }}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis dataKey="x" name="Column 1" />
              <YAxis dataKey="y" name="Column 2" />
              <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
              <Scatter
                name="Correlations"
                data={correlationData}
                fill="var(--color-correlations)"
              />
            </ScatterChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

