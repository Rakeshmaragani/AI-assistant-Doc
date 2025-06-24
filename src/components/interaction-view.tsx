'use client';

import { summarizeDocument, type SummarizeDocumentInput } from '@/ai/flows/auto-summary';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Loader2, BrainCircuit, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AskAnythingView } from './ask-anything-view';
import { ChallengeMeView } from './challenge-me-view';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface InteractionViewProps {
  document: { name: string; content: string };
  onNewUpload: () => void;
}

export function InteractionView({ document, onNewUpload }: InteractionViewProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [interactionMode, setInteractionMode] = useState<'ask' | 'challenge' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getSummary = async () => {
      setIsLoadingSummary(true);
      try {
        const input: SummarizeDocumentInput = { documentContent: document.content };
        const result = await summarizeDocument(input);
        setSummary(result.summary);
      } catch (error) {
        console.error("Error generating summary:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate document summary. Please try again.",
        });
        setSummary("Could not generate summary.");
      } finally {
        setIsLoadingSummary(false);
      }
    };
    getSummary();
  }, [document.content, toast]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-medium text-lg">{document.name}</span>
        </div>
        <Button variant="outline" onClick={onNewUpload}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Upload New Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Auto-Summary</CardTitle>
          <CardDescription>A concise overview of your document.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSummary ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-muted-foreground">{summary}</p>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button
            size="lg"
            variant={interactionMode === 'ask' ? 'default' : 'outline'}
            className="p-6 text-left flex justify-start items-center gap-4"
            onClick={() => setInteractionMode('ask')}
        >
            <HelpCircle className="h-8 w-8 text-primary"/>
            <div>
                <p className="font-bold text-lg font-headline">Ask Anything</p>
                <p className="font-normal text-muted-foreground">Ask free-form questions about the document.</p>
            </div>
        </Button>
        <Button
            size="lg"
            variant={interactionMode === 'challenge' ? 'default' : 'outline'}
            className="p-6 text-left flex justify-start items-center gap-4"
            onClick={() => setInteractionMode('challenge')}
        >
            <BrainCircuit className="h-8 w-8 text-accent"/>
            <div>
                <p className="font-bold text-lg font-headline">Challenge Me</p>
                <p className="font-normal text-muted-foreground">Test your comprehension with AI challenges.</p>
            </div>
        </Button>
      </div>

      {interactionMode && (
        <div className="mt-8">
            {interactionMode === 'ask' ? (
                <AskAnythingView documentContent={document.content} />
            ) : (
                <ChallengeMeView documentContent={document.content} />
            )}
        </div>
      )}
    </div>
  );
}
