
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { analyzeCSV } from '@/utils/dataAnalysis';
import { ParsedData } from '@/types/data';

interface CSVUploaderProps {
  onDataParsed: (data: ParsedData) => void;
  setLoading: (loading: boolean) => void;
}

export const CSVUploader = ({ onDataParsed, setLoading }: CSVUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        try {
          const analyzed = await analyzeCSV(text);
          onDataParsed(analyzed);
          toast.success('CSV file analyzed successfully');
        } catch (error) {
          console.error('Error analyzing CSV:', error);
          toast.error('Error analyzing CSV file. Please check the format.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setLoading(false);
      toast.error('Error reading file');
      console.error('Error reading file:', error);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileSpreadsheet className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-medium">Drag and drop your CSV file here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
            </div>
            <Button 
              onClick={onButtonClick}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload CSV</span>
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={handleChange}
              className="hidden"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
