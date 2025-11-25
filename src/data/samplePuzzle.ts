// src/data/samplePuzzle.ts

export type Puzzle = {
  id: string;
  title: string;
  surface: string;   // what the player sees first
  hint: string;
  solution: string;  // the “汤底” full story
};

export const samplePuzzle: Puzzle = {
  id: "voice_recording_mystery",
  title: "The Recording",
  surface:
    "A man hears a recording of his own voice and immediately calls the police. Why?",
  hint: "The recording was not made by him, but someone used his voice.",
  solution:
    "The man is a famous radio host. Criminals used old recordings of his voice to fake a ransom message, making it sound like he was reading the demands himself. When he heard the ransom message and recognized his own voice saying things he had never said, he realized his identity was being used by criminals, so he called the police."
};
