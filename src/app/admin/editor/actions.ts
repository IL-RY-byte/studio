'use server';

import { suggestObjectPlacement } from '@/ai/flows/suggest-object-placement';
import type { SuggestObjectPlacementInput } from '@/ai/flows/suggest-object-placement';

export async function getPlacementSuggestions(input: SuggestObjectPlacementInput) {
  try {
    const result = await suggestObjectPlacement(input);
    return result.suggestions;
  } catch (error) {
    console.error('Error getting placement suggestions:', error);
    return { error: 'Failed to get suggestions. Please try again.' };
  }
}
