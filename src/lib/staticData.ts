// src/lib/staticData.ts
// Static game catalog and puzzle content — no network fetch needed.

import type { Game, PuzzleDetail } from "./api/storyApi";

export const STATIC_GAMES: Game[] = [
  {
    id: "g_threeBrothers_01",
    status: "available",
    level: 1,
    genre: "Horror",
    genreZh: "恐怖",
    shortIntro: "Horror story about three brothers",
    shortIntroZh: "三兄弟之间的恐怖故事",
    puzzleId: "three_brother",
  },
  {
    id: "g_celebrityHats_02",
    status: "available",
    level: 1,
    genre: "Horror",
    genreZh: "恐怖",
    shortIntro: "A dark secret behind a mother's gift",
    shortIntroZh: "母亲的礼物背后，藏着一个黑暗的秘密",
    puzzleId: "celebrity_daughter_hat",
  },
  {
    id: "g_blind_06",
    status: "locked",
    level: 6,
    genre: "Dark Thriller",
    genreZh: "黑暗惊悚",
    shortIntro:
      "A birthday song followed by a round of applause. To anyone else, it's a celebration. To him, it's the sound of a deadly betrayal.",
    shortIntroZh:
      "生日歌响起，掌声随之而来。对旁人而言，这是欢庆；对他而言，这是背叛的回声。",
    puzzleId: "blind_man",
  },
  {
    id: "game_1777786702699",
    genre: "Suspense",
    genreZh: "悬疑",
    level: 2,
    status: "available",
    shortIntro: "A simple choice of clothing leads to a bloody crime scene.",
    shortIntroZh: "一件随手挑选的裙子，却引发了一场血案。",
    puzzleId: "puzzle_1777786702699",
  },
];

// STATIC_PUZZLES is kept as an offline reference only.
// At runtime, puzzle content (including translations) is always fetched from
// the backend via storyApi.getPuzzle(puzzleId, language).
export const STATIC_PUZZLES: Record<string, PuzzleDetail> = {
  three_brother: {
    id: "three_brother",
    title: "Three Brothers",
    content:
      "There were three brothers, the eldest and the second were twins. The three brothers had a very good relationship and often slept together. After the eldest brother died of illness, the youngest brother killed the second brother. Why.",
    fullAnswer:
      "The third brother had a mental illness. After the eldest brother died of illness, the younger brother dismembered the second brother into two halves, sleeping on the right half of the second brother on the left side and the left half of the second brother on the right side, making it look as if the eldest brother had not died.",
    parts: [
      "mental illness",
      "dismemberment",
      "recreating the twins",
      "visual symmetry",
      "illusion of the eldest brother",
    ],
    hint: "",
  },
  celebrity_daughter_hat: {
    id: "celebrity_daughter_hat",
    title: "The Celebrity's Daughter",
    content:
      "A female celebrity has a daughter. Since childhood, she would often put a hat on her daughter. One day, she took her daughter to the hospital. After learning the truth in the hospital, her daughter committed suicide.",
    hint: "Why would a mother need a hat to fit a child perfectly before going to a hospital?",
    fullAnswer: "",
    parts: [
      "facial disfigurement",
      "measuring head growth",
      "face transplant",
      "biological donor",
      "raised as a spare part",
    ],
  },
  blind_man: {
    id: "blind_man",
    title: "The Blind Man",
    content:
      "A group of friends is celebrating a blind man's birthday. They are very close. They happily light the candles, sing the birthday song, and clap for him. After hearing the clapping, the blind man kills them all. Why?",
    fullAnswer:
      "The group had previously been stranded on a deserted island following a shipwreck. To survive the starvation, they agreed to each cut off one arm to provide food for the group. Because the man was blind, his friends conspired to keep their own arms intact while only cutting off his. During the birthday party, when he heard everyone \"clapping,\" he realized that clapping requires two hands—meaning his friends had lied to him and he was the only one who had sacrificed a limb.",
    parts: [
      "shipwreck survival",
      "cannibalism pact",
      "amputation deception",
      "clapping requires two hands",
      "betrayal discovery",
    ],
    hint: "",
  },
  The_Red_Dress: {
    id: "puzzle_1777786702699",
    title: "The Red Dress",
    content:
      "My older sister picked out a little red dress for me to wear to school. I thought I looked pretty, but by the time I got home, someone was dead.",
    fullAnswer:
      "The protagonist's mother was having an affair with the school teacher. They used the girl's clothing as a secret signal: whenever she wore the red dress to school, it meant the father was away and it was safe for the teacher to visit. Usually, the mother chose the outfits. On this day, the mother was busy, so the sister unknowingly picked the red dress. The teacher saw the girl at school, assumed the father was gone, and went to the house. However, the father was actually home, caught them together, and killed the teacher in a rage.",
    parts: [
      "The red dress was a secret signal for an affair.",
      "The signal meant the father was not at home.",
      "The sister picked the dress without knowing its meaning.",
      "The teacher saw the dress and went to the house.",
      "The father was home and killed the teacher.",
    ],
    hint: "The dress wasn't just a piece of clothing; it was a message intended for someone at school.",
  },
};
