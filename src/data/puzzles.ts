// src/data/puzzles.ts

export type Puzzle = {
  id: string;
  title: string;
  surface: string;   // what the player sees first
  hint: string;
  solution: string;  // the “汤底” full story
};

export const puzzles: Puzzle[] = [
  {
    id: "voice_recording_mystery",
    title: "The Recording",
    surface:
      "A man hears a recording of his own voice and immediately calls the police. Why?",
    hint: "The recording was not made by him, but someone used his voice.",
    solution:
      "The man is a famous radio host. Criminals used old recordings of his voice to fake a ransom message, making it sound like he was reading the demands himself. When he heard the ransom message and recognized his own voice saying things he had never said, he realized his identity was being used by criminals, so he called the police."
  },
  {
    id: "silent_concert",
    title: "The Silent Concert",
    surface:
      "A singer finishes a concert. The audience gives a standing ovation, but nobody heard her sing. How is that possible?",
    hint: "People were listening through something.",
    solution:
      "It was a silent concert where everyone wore wireless headphones. The singer’s microphone was connected only to the headphones, not to any speakers. A person outside the venue would hear nothing, but the audience enjoyed the full performance."
  },
  {
    id: "wrong_voicemail",
    title: "The Voicemail",
    surface:
      "A man listens to a voicemail and instantly knows the caller is lying, even though he recognizes the voice. Why?",
    hint: "Think about when the voicemail was recorded.",
    solution:
      "The voicemail claims it was recorded at a certain place and time, but the man knows that at that exact time, the caller was on a long flight with no signal. Because he knows the real schedule, he realizes the voicemail must be pre-recorded or manipulated and therefore a lie."
  }
];
