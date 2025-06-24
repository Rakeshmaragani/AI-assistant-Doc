'use client';

import { challengeMe, type ChallengeMeInput } from '@/ai/flows/challenge-me';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Loader2, ArrowRight, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const hardcodedQuestions = [
  "What is the primary thesis or main argument of this document?",
  "Identify one key piece of evidence the author uses to support their main argument and explain its significance.",
  "What is a potential limitation or counter-argument to the conclusions presented in this document?"
];

interface Evaluation {
  evaluation: string;
  justification: string;
}

interface ChallengeMeViewProps {
  documentContent: string;
}

export function ChallengeMeView({ documentContent }: ChallengeMeViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluations, setEvaluations] = useState<(Evaluation | null)[]>(Array(hardcodedQuestions.length).fill(null));
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isFinished = currentQuestionIndex >= hardcodedQuestions.length;
  const progress = isFinished ? 100 : ((currentQuestionIndex) / hardcodedQuestions.length) * 100;

  const handleSubmit = async () => {
    if (!userAnswer.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const aiInput: ChallengeMeInput = {
        documentText: documentContent,
        question: hardcodedQuestions[currentQuestionIndex],
        userAnswer: userAnswer,
      };
      const result = await challengeMe(aiInput);
      const newEvaluations = [...evaluations];
      newEvaluations[currentQuestionIndex] = result;
      setEvaluations(newEvaluations);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to evaluate your answer. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < hardcodedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
    } else {
       setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setEvaluations(Array(hardcodedQuestions.length).fill(null));
  }

  const currentEvaluation = evaluations[currentQuestionIndex];

  return (
    <Card className="w-full shadow-lg border-accent/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
            <span className="flex items-center gap-2">
                <BrainCircuit className="text-accent"/>
                Challenge Me
            </span>
            <Badge variant="outline" className="font-mono text-sm">
                {currentQuestionIndex + 1 > hardcodedQuestions.length ? hardcodedQuestions.length : currentQuestionIndex + 1} / {hardcodedQuestions.length}
            </Badge>
        </CardTitle>
        <Progress value={progress} className="w-full mt-2" />
      </CardHeader>
      <CardContent className="min-h-[20rem]">
        {isFinished ? (
             <div className="text-center flex flex-col items-center justify-center h-full">
                <Sparkles className="h-12 w-12 text-accent mb-4"/>
                <h3 className="text-xl font-bold font-headline">Challenge Complete!</h3>
                <p className="text-muted-foreground mt-2">You've successfully answered all the questions.</p>
                <Button onClick={handleRestart} className="mt-6">Try Again</Button>
            </div>
        ) : (
        <>
          <p className="font-semibold text-lg mb-4">{hardcodedQuestions[currentQuestionIndex]}</p>
          <Textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Your answer here..."
            className="flex-grow"
            rows={5}
            disabled={isLoading || !!currentEvaluation}
          />
          {currentEvaluation && (
            <Alert className="mt-4 bg-accent/5 border-accent/20">
              <AlertTitle className="font-headline text-accent flex items-center gap-2">
                <Sparkles size={16}/>AI Evaluation
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-2 text-foreground">
                <p>{currentEvaluation.evaluation}</p>
                <p className="text-muted-foreground italic border-l-2 pl-3 border-accent/50">{currentEvaluation.justification}</p>
              </AlertDescription>
            </Alert>
          )}
        </>
        )}
      </CardContent>
      <CardFooter>
        {!isFinished && (
            currentEvaluation ? (
                 <Button onClick={handleNextQuestion} className="w-full" variant="secondary">
                   Next Question <ArrowRight className="ml-2 h-4 w-4"/>
                 </Button>
            ) : (
                <Button onClick={handleSubmit} disabled={isLoading || !userAnswer.trim()} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Answer
                </Button>
            )
        )}
      </CardFooter>
    </Card>
  );
}
