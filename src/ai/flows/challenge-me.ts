'use server';

/**
 * @fileOverview Flow for generating logic-based questions from a document, evaluating user responses, and providing feedback.
 *
 * - challengeMe - A function that generates questions, evaluates answers, and provides feedback.
 * - ChallengeMeInput - The input type for the challengeMe function.
 * - ChallengeMeOutput - The return type for the challengeMe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChallengeMeInputSchema = z.object({
  documentText: z.string().describe('The text content of the document.'),
  userAnswer: z.string().describe('The user answer.'),
  question: z.string().describe('The question derived from the document.'),
});
export type ChallengeMeInput = z.infer<typeof ChallengeMeInputSchema>;

const ChallengeMeOutputSchema = z.object({
  evaluation: z.string().describe('The evaluation of the user answer.'),
  justification: z
    .string()
    .describe('The justification for the evaluation based on the document.'),
});
export type ChallengeMeOutput = z.infer<typeof ChallengeMeOutputSchema>;

export async function challengeMe(input: ChallengeMeInput): Promise<ChallengeMeOutput> {
  return challengeMeFlow(input);
}

const challengeMePrompt = ai.definePrompt({
  name: 'challengeMePrompt',
  input: {schema: ChallengeMeInputSchema},
  output: {schema: ChallengeMeOutputSchema},
  prompt: `You are an AI assistant designed to evaluate user responses to logic-based questions derived from a document.

  Document Text: {{{documentText}}}
  Question: {{{question}}}
  User Answer: {{{userAnswer}}}

  Evaluate the user's answer based on the document text. Provide a detailed evaluation and a justification for your evaluation, referencing specific parts of the document.

  Evaluation:
  Justification:`, // Make sure the AI returns evaluation and justification
});

const challengeMeFlow = ai.defineFlow(
  {
    name: 'challengeMeFlow',
    inputSchema: ChallengeMeInputSchema,
    outputSchema: ChallengeMeOutputSchema,
  },
  async input => {
    const {output} = await challengeMePrompt(input);
    return output!;
  }
);
