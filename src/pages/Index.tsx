
import { useState } from 'react';
import { CSVUploader } from '@/components/CSVUploader';
import { DataSummary } from '@/components/DataSummary';
import { ColumnAnalysis } from '@/components/ColumnAnalysis';
import { Correlations } from '@/components/Correlations';
import { ParsedData } from '@/types/data';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
              DW
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Data Wizard</h1>
              <p className="text-muted-foreground mt-1">Transform data into insights instantly</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <CSVUploader 
            onDataParsed={setParsedData} 
            setLoading={setLoading} 
          />

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-muted-foreground">Analyzing your data...</p>
            </div>
          )}

          {parsedData && !loading && (
            <div className="mt-6 space-y-8">
              <DataSummary data={parsedData} />
              <ColumnAnalysis data={parsedData} />
              <Correlations data={parsedData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
