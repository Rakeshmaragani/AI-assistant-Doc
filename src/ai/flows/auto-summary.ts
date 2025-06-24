 'use server';

/**
 * @fileOverview Provides a flow for automatically summarizing a document.
 *
 * - summarizeDocument - A function that summarizes the content of a document.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to be summarized.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the document, no more than 150 words.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(
  input: SummarizeDocumentInput
): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const summarizePrompt = ai.definePrompt({
  name: 'summarizePrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `Summarize the following document in no more than 150 words. The summary should capture the key points and main ideas of the document.\n\nDocument:\n{{{documentContent}}}`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async input => {
    const {output} = await summarizePrompt(input);
    return output!;
  }
);
