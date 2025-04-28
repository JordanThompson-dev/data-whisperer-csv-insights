
import { useState } from 'react';
import { CSVUploader } from '@/components/CSVUploader';
import { DataSummary } from '@/components/DataSummary';
import { ColumnAnalysis } from '@/components/ColumnAnalysis';
import { Correlations } from '@/components/Correlations';
import { ParsedData } from '@/types/data';

const Index = () => {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Whisperer</h1>
          <p className="text-gray-500 mt-1">Upload a CSV file to uncover insights instantly</p>
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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Analyzing your data...</p>
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
