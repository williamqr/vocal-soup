export type Puzzle = { 
  id: string;
  title: string;
  content: string;
  fullAnswer: string;
  parts: any; // Use the correct type if known (e.g., string[] or object)
  hint: string;
};
