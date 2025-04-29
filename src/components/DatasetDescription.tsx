
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParsedData } from '@/types/data';
import { FileText, List } from 'lucide-react';

interface DatasetDescriptionProps {
  data: ParsedData;
}

export const DatasetDescription = ({ data }: DatasetDescriptionProps) => {
  const [description, setDescription] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string[]>([]);

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

    // Generate analysis recommendations
    const recommendationsList = [];
    
    // Check for missing data recommendations
    if (data.summary.missingCells > 0) {
      recommendationsList.push("Consider handling missing values through imputation or filtering.");
    }
    
    // Check for outlier recommendations
    const numericCols = data.columns.filter(col => col.type === 'numeric');
    if (numericCols.length > 0) {
      const outlierCandidates = numericCols.filter(col => 
        col.mean && col.std && (col.max as number - col.mean) > 3 * col.std
      );
      
      if (outlierCandidates.length > 0) {
        recommendationsList.push(`Check ${outlierCandidates.map(c => c.name).join(', ')} for potential outliers.`);
      }
    }
    
    // Correlation recommendations
    if (data.correlations.length > 0) {
      const highCorrelations = data.correlations.filter(c => Math.abs(c.value) > 0.8);
      if (highCorrelations.length > 0) {
        recommendationsList.push("High correlations detected. Consider feature selection or dimensionality reduction.");
      }
    }
    
    // Prediction recommendations
    if (numericColumns.length > 1) {
      const potentialTargets = numericColumns.slice(0, 3);
      recommendationsList.push(`Try predictive modeling with ${potentialTargets.join(' or ')} as target variables.`);
    }
    
    // Categorical recommendations
    if (categoricalColumns.length > 0) {
      recommendationsList.push("Consider encoding categorical variables for machine learning tasks.");
    }
    
    setRecommendations(recommendationsList);
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
          
          {recommendations.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold flex items-center gap-2 mb-2">
                <List className="h-4 w-4 text-primary" />
                Recommendations
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-muted-foreground">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
