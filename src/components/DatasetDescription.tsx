
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParsedData } from '@/types/data';
import { FileText } from 'lucide-react';

interface DatasetDescriptionProps {
  data: ParsedData;
}

export const DatasetDescription = ({ data }: DatasetDescriptionProps) => {
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    // Generate a description based on the data
    if (!data) return;

    const columnTypes = data.columns.map(col => col.type);
    const numericColumns = data.columns.filter(col => col.type === 'numeric').map(col => col.name);
    const categoricalColumns = data.columns.filter(col => col.type === 'categorical').map(col => col.name);
    
    let desc = `This dataset contains ${data.summary.rowCount} records with ${data.summary.columnCount} columns. `;
    
    if (numericColumns.length > 0) {
      desc += `It includes numeric data for ${numericColumns.join(', ')}. `;
    }
    
    if (categoricalColumns.length > 0) {
      desc += `It contains categorical variables such as ${categoricalColumns.join(', ')}. `;
    }
    
    if (data.correlations.length > 0) {
      const topCorrelation = [...data.correlations].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0];
      desc += `The strongest relationship appears to be between ${topCorrelation.column1} and ${topCorrelation.column2} `;
      desc += `(correlation: ${topCorrelation.value.toFixed(3)}). `;
    }

    if (data.summary.missingCells > 0) {
      const missingPercent = ((data.summary.missingCells / (data.summary.rowCount * data.summary.columnCount)) * 100).toFixed(2);
      desc += `There are some missing values (${missingPercent}% of cells). `;
    }

    setDescription(desc);
  }, [data]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dataset Overview</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Dataset Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </section>
  );
};
