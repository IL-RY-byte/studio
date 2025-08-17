'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting object placements on a floor plan.
 *
 * - suggestObjectPlacement - A function that takes a floor plan image and returns suggested object placements.
 * - SuggestObjectPlacementInput - The input type for the suggestObjectPlacement function.
 * - SuggestObjectPlacementOutput - The return type for the suggestObjectPlacement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestObjectPlacementInputSchema = z.object({
  floorPlanDataUri: z
    .string()
    .describe(
      "A floor plan image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  objectType: z.string().describe('The type of object to place (e.g., table, sunbed).'),
  exampleLayouts: z.array(z.string()).optional().describe('Data URIs of example layouts to guide object placement'),
});
export type SuggestObjectPlacementInput = z.infer<typeof SuggestObjectPlacementInputSchema>;

const SuggestObjectPlacementOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      x: z.number().describe('The x-coordinate of the suggested placement.'),
      y: z.number().describe('The y-coordinate of the suggested placement.'),
      confidence: z.number().describe('The confidence level of the suggestion (0-1).'),
    })
  ).describe('An array of suggested object placements with x, y coordinates, and confidence levels.'),
});
export type SuggestObjectPlacementOutput = z.infer<typeof SuggestObjectPlacementOutputSchema>;

export async function suggestObjectPlacement(
  input: SuggestObjectPlacementInput
): Promise<SuggestObjectPlacementOutput> {
  return suggestObjectPlacementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestObjectPlacementPrompt',
  input: {schema: SuggestObjectPlacementInputSchema},
  output: {schema: SuggestObjectPlacementOutputSchema},
  prompt: `You are an AI assistant that suggests optimal placements for objects on a floor plan.

  You are given a floor plan image and the type of object to place. You should analyze the floor plan and suggest placements that are practical, aesthetically pleasing, and maximize space utilization.

  Here are some example layouts, if provided:
  {{#each exampleLayouts}}
  {{media url=this}}
  {{/each}}

  Floor plan:
  {{media url=floorPlanDataUri}}

  Object type: {{{objectType}}}

  Provide the suggestions as a JSON array of objects, where each object has x, y, and confidence fields.
`,
});

const suggestObjectPlacementFlow = ai.defineFlow(
  {
    name: 'suggestObjectPlacementFlow',
    inputSchema: SuggestObjectPlacementInputSchema,
    outputSchema: SuggestObjectPlacementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
