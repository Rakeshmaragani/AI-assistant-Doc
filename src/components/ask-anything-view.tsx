'use client';

import { askAnything, type AskAnythingInput } from '@/ai/flows/ask-anything';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, Bot, Loader2, Quote } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  justification?: string;
}

interface AskAnythingViewProps {
  documentContent: string;
}

export function AskAnythingView({ documentContent }: AskAnythingViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiInput: AskAnythingInput = {
        documentContent,
        question: input,
      };
      const result = await askAnything(aiInput);
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.answer,
        justification: result.justification,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get an answer. Please try again.',
      });
       setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">Ask Anything</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'assistant' && (
                   <div className="bg-primary rounded-full p-2 text-primary-foreground">
                    <Bot size={20} />
                  </div>
                )}
                <div className={cn('max-w-[75%] rounded-lg p-4', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.justification && (
                    <div className="mt-3 pt-3 border-t border-muted-foreground/20 text-xs text-muted-foreground italic flex items-start gap-2">
                       <Quote className="h-4 w-4 shrink-0 mt-0.5" />
                       <span>{message.justification}</span>
                    </div>
                  )}
                </div>
                 {message.role === 'user' && (
                   <div className="bg-muted rounded-full p-2 text-muted-foreground">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4 justify-start">
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <Bot size={20} />
                </div>
                <div className="bg-muted rounded-lg p-4 flex items-center space-x-2">
                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
                   <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-6">
        <div className="flex w-full items-center gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the document..."
            className="flex-grow resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
