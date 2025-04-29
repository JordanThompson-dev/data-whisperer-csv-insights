
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Settings, Download, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';

type PredictionType = 'linear' | 'polynomial' | 'logistic';

interface ChartStyle {
  lineColor: string;
  pointColor: string;
  gridColor: string;
  backgroundColor: string;
}

interface PredictiveAnalysisProps {
  data: any; // We'll type this properly based on your data structure
}

export const PredictiveAnalysis = ({ data }: PredictiveAnalysisProps) => {
  const [predictionType, setPredictionType] = useState<PredictionType>('linear');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [chartStyle, setChartStyle] = useState<ChartStyle>({
    lineColor: '#8B5CF6',
    pointColor: '#4F46E5',
    gridColor: '#E5E7EB',
    backgroundColor: 'transparent'
  });

  // Generate some sample data for the prediction visualization
  const generatePredictionData = () => {
    const baseData = Array.from({ length: 20 }, (_, i) => ({
      x: i,
      actual: Math.random() * 10 + i * 1.5 + Math.sin(i / 3) * 2,
    }));

    // Add predicted values based on the selected model
    return baseData.map(point => {
      let predicted;
      switch (predictionType) {
        case 'linear':
          predicted = point.x * 1.5 + 2 + (Math.random() * 1 - 0.5);
          break;
        case 'polynomial':
          predicted = Math.pow(point.x / 5, 2) + point.x + 1 + (Math.random() * 2 - 1);
          break;
        case 'logistic':
          predicted = 10 / (1 + Math.exp(-0.5 * (point.x - 10))) + (Math.random() * 1 - 0.5);
          break;
        default:
          predicted = point.actual;
      }
      return { ...point, predicted };
    });
  };

  const predictionData = generatePredictionData();
  
  // Get numeric column names from the data
  const numericColumns = data?.columns?.filter(col => col.type === 'numeric').map(col => col.name) || [];

  // Export chart as image
  const exportChart = () => {
    try {
      const svg = document.querySelector('.prediction-chart svg');
      if (!svg) {
        toast.error('Chart not found.');
        return;
      }

      // Convert SVG to a canvas
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions to match the SVG
      canvas.width = svg.clientWidth;
      canvas.height = svg.clientHeight;
      
      const img = new Image();
      
      img.onload = function() {
        if (ctx) {
          // Fill with the background color
          ctx.fillStyle = chartStyle.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the image
          ctx.drawImage(img, 0, 0);
          
          // Create download link
          const a = document.createElement('a');
          a.download = `${predictionType}-prediction.png`;
          a.href = canvas.toDataURL('image/png');
          a.click();
          
          toast.success('Chart exported successfully!');
        }
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (err) {
      console.error('Error exporting chart:', err);
      toast.error('Failed to export chart.');
    }
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0">
        <CardTitle>Predictive Analysis</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prediction-type">Prediction Type</Label>
              <Select 
                value={predictionType} 
                onValueChange={(value: PredictionType) => setPredictionType(value)}
              >
                <SelectTrigger id="prediction-type" className="w-[200px]">
                  <SelectValue placeholder="Select prediction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear Regression</SelectItem>
                  <SelectItem value="polynomial">Polynomial Regression</SelectItem>
                  <SelectItem value="logistic">Logistic Regression</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="x-axis">X Axis</Label>
              <Select 
                value={xAxis} 
                onValueChange={setXAxis}
              >
                <SelectTrigger id="x-axis" className="w-[200px]">
                  <SelectValue placeholder="Select X axis" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="y-axis">Y Axis</Label>
              <Select 
                value={yAxis} 
                onValueChange={setYAxis}
              >
                <SelectTrigger id="y-axis" className="w-[200px]">
                  <SelectValue placeholder="Select Y axis" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Palette className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Chart Style</h4>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="line-color">Line color</Label>
                        <Input 
                          id="line-color"
                          type="color"
                          value={chartStyle.lineColor}
                          onChange={(e) => setChartStyle({...chartStyle, lineColor: e.target.value})}
                          className="col-span-2 h-8"
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="point-color">Point color</Label>
                        <Input 
                          id="point-color"
                          type="color"
                          value={chartStyle.pointColor}
                          onChange={(e) => setChartStyle({...chartStyle, pointColor: e.target.value})}
                          className="col-span-2 h-8"
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="grid-color">Grid color</Label>
                        <Input 
                          id="grid-color"
                          type="color"
                          value={chartStyle.gridColor}
                          onChange={(e) => setChartStyle({...chartStyle, gridColor: e.target.value})}
                          className="col-span-2 h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" onClick={exportChart}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="prediction-chart">
              <Card>
                <CardContent className="py-4">
                  <div className="h-[400px]">
                    <ChartContainer config={{ 
                      prediction: { theme: { light: chartStyle.lineColor, dark: chartStyle.lineColor } },
                      actual: { theme: { light: chartStyle.pointColor, dark: chartStyle.pointColor } }
                    }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={predictionData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} />
                          <XAxis 
                            dataKey="x" 
                            name="Data Points" 
                            label={{ value: xAxis || 'X-Axis', position: 'insideBottomRight', offset: -10 }}
                          />
                          <YAxis 
                            name="Values" 
                            label={{ value: yAxis || 'Y-Axis', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip content={(props) => <ChartTooltipContent {...props as any} />} />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="actual" 
                            name="Actual Data"
                            stroke={chartStyle.pointColor} 
                            dot={{ fill: chartStyle.pointColor }} 
                            activeDot={{ r: 8 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="predicted" 
                            name={`${predictionType.charAt(0).toUpperCase() + predictionType.slice(1)} Prediction`}
                            stroke={chartStyle.lineColor}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="scatter" className="prediction-chart">
              <Card>
                <CardContent className="py-4">
                  <div className="h-[400px]">
                    <ChartContainer config={{ 
                      scatter: { theme: { light: chartStyle.pointColor, dark: chartStyle.pointColor } }
                    }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.gridColor} />
                          <XAxis 
                            dataKey="x" 
                            name="X Axis" 
                            label={{ value: xAxis || 'X-Axis', position: 'insideBottomRight', offset: -10 }} 
                          />
                          <YAxis 
                            dataKey="actual" 
                            name="Y Axis" 
                            label={{ value: yAxis || 'Y-Axis', angle: -90, position: 'insideLeft' }}
                          />
                          <ZAxis dataKey="predicted" range={[60, 400]} name="Predicted" />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            content={(props) => <ChartTooltipContent {...props as any} />}
                          />
                          <Legend />
                          <Scatter 
                            name="Data Points" 
                            data={predictionData} 
                            fill={chartStyle.pointColor}
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 bg-muted p-4 rounded-md">
            <h4 className="font-semibold mb-2">Prediction Results</h4>
            <p className="text-muted-foreground text-sm">
              {predictionType === 'linear' && 'Linear regression finds the best fitting straight line through the points.'}
              {predictionType === 'polynomial' && 'Polynomial regression fits a curve to the data using higher-order equations.'}
              {predictionType === 'logistic' && 'Logistic regression models probability of binary outcomes with a sigmoid function.'}
            </p>
            {(xAxis && yAxis) ? (
              <p className="text-sm mt-2">
                Analyzing relationship between {xAxis} and {yAxis} using {predictionType} regression.
              </p>
            ) : (
              <p className="text-sm mt-2 text-muted-foreground">
                Select X and Y axis variables to analyze their relationship.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
