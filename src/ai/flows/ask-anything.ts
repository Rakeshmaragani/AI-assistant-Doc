'use server';
/**
 * @fileOverview Implements the Ask Anything flow for the Document Sage application.
 *
 * - askAnything - A function that allows users to ask free-form questions about the uploaded document.
 * - AskAnythingInput - The input type for the askAnything function.
 * - AskAnythingOutput - The return type for the askAnything function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAnythingInputSchema = z.object({
  documentContent: z.string().describe('The content of the document.'),
  question: z.string().describe('The user\u2019s question about the document.'),
});
export type AskAnythingInput = z.infer<typeof AskAnythingInputSchema>;

const AskAnythingOutputSchema = z.object({
  answer: z.string().describe('The answer to the user\u2019s question, grounded in the document content.'),
  justification: z.string().describe('A brief justification for the answer, with references to the document.'),
});
export type AskAnythingOutput = z.infer<typeof AskAnythingOutputSchema>;

export async function askAnything(input: AskAnythingInput): Promise<AskAnythingOutput> {
  return askAnythingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAnythingPrompt',
  input: {schema: AskAnythingInputSchema},
  output: {schema: AskAnythingOutputSchema},
  prompt: `You are an AI assistant designed to answer questions about a document.
  You must ground your answers in the content of the document and provide a justification with references.

  Document Content:
  {{documentContent}}

  Question:
  {{question}}

  Answer:
  `,
});

const askAnythingFlow = ai.defineFlow(
  {
    name: 'askAnythingFlow',
    inputSchema: AskAnythingInputSchema,
    outputSchema: AskAnythingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
