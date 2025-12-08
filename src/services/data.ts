// src/services/data.ts

import { supabase } from '../lib/supabaseClient'; // Import the standard client
import { Puzzle } from '../data/puzzles'; // Assuming you have a Puzzle type defined

/**
 * Fetches a specific puzzle from the database using the standard client.
 * @param puzzleId The ID of the puzzle to fetch.
 */
export async function getPuzzleFromDB(puzzleId: string): Promise<Puzzle> {
  // Use the standard client (supabase), not the admin client (supabaseAdmin)
  const { data, error } = await supabase 
    .from('puzzles')
    .select('*')
    .eq('id', puzzleId)
    .single();

  if (error) {
    console.error('Error fetching puzzle:', error);
    // You should throw a more specific error or message
    throw new Error(`Failed to load puzzle ${puzzleId}: ${error.message}`);
  }

  // Ensure data exists before accessing properties
  if (!data) {
    throw new Error(`Puzzle with ID ${puzzleId} not found.`);
  }

  // Map the database columns (snake_case) to your frontend interface (camelCase)
  const formattedPuzzle: Puzzle = {
    id: data.id,
    title: data.title,
    content: data.content,
    fullAnswer: data.full_answer, 
    parts: data.parts,            
    hint: data.hint
  };

  return formattedPuzzle;
}

