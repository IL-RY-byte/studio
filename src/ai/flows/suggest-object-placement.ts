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
      "A floor plan image of a restaurant or venue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  objectType: z.string().describe('The type of object to place (e.g., table, sunbed).'),
  exampleLayouts: z.array(z.string()).optional().describe('An array of data URIs of example layouts to guide the object placement.'),
});
export type SuggestObjectPlacementInput = z.infer<typeof SuggestObjectPlacementInputSchema>;

const SuggestObjectPlacementOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      x: z.number().describe('The x-coordinate of the suggested placement (percentage).'),
      y: z.number().describe('The y-coordinate of the suggested placement (percentage).'),
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
  prompt: `You are an expert AI interior designer and space planner. Your task is to suggest optimal placements for objects within a given floor plan.

You must analyze the provided floor plan image, considering factors like walkways, entrances, exits, and potential high-traffic areas. The placements should ensure comfortable customer flow, maximize capacity without feeling cramped, and create an aesthetically pleasing and functional layout.

Object type to place: {{{objectType}}}

Floor plan to analyze:
{{media url=floorPlanDataUri}}

{{#if exampleLayouts}}
Use the following images as inspiration for the layout style. Try to match the density, spacing, and overall aesthetic of these examples.
{{#each exampleLayouts}}
Example Layout Image:
{{media url=this}}
{{/each}}
{{/if}}

Based on your analysis, provide a list of suggested placements. Each suggestion must include x and y coordinates (as percentages of the total width and height) and a confidence score indicating how certain you are about the placement.
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
