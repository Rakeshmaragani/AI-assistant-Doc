'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

interface UploadViewProps {
  onFileUpload: (name: string, content: string) => void;
}

export function UploadView({ onFileUpload }: UploadViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    
    setIsLoading(true);
    const file = acceptedFiles[0];

    if (file.type !== 'text/plain') {
      toast({
        variant: 'destructive',
        title: 'Unsupported File Type',
        description: 'Please upload a .txt file. PDF support is coming soon.',
      });
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onabort = () => {
      console.log('file reading was aborted');
      setIsLoading(false);
    }
    reader.onerror = () => {
      console.log('file reading has failed');
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'Could not read the selected file.',
      });
      setIsLoading(false);
    }
    reader.onload = () => {
      const content = reader.result as string;
      onFileUpload(file.name, content);
    }
    reader.readAsText(file);
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.txt'] },
    multiple: false,
  });

  return (
    <div className="flex items-center justify-center h-full animate-in fade-in-50 duration-500">
      <Card className="w-full max-w-2xl text-center shadow-2xl border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Upload Your Document</CardTitle>
          <CardDescription>
            Upload a .txt file to begin. The AI will summarize it and prepare for your questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
          >
            <input {...getInputProps()} />
            {isLoading ? (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg">Processing Document...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <UploadCloud className="h-12 w-12 text-primary" />
                    <p className="text-lg">
                    {isDragActive ? "Drop the file here..." : "Drag & drop a file here, or click to select"}
                    </p>
                    <p className="text-sm">.TXT files only</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
