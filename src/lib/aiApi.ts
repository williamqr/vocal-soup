// src/lib/aiApi.ts
// Legacy API functions - now using centralized client
// These are kept for backward compatibility

import { api } from "./api";

export type ChatResultType = "yes" | "no" | "not_sure";

export async function startStorySession(params: {
  puzzleId: string;
  userId?: string;
}): Promise<{ sessionId: string }> {
  return api.post("/game/start", params);
}

export async function evaluateAnswer(params: {
  puzzleId: string;
  puzzlePrompt: string;
  answerKey: string;
  userAnswer: string;
}): Promise<{ result: ChatResultType; explanation: string }> {
  return api.post("/chat/evaluate", params);
}

export async function appendStory(params: {
  storySessionId: string;
  puzzleId: string;
  userCorrectIdea: string;
  puzzleSummary: string;
}): Promise<{ storyChunk: string }> {
  return api.post("/story/append", params);
}

export async function fetchFinalStory(params: {
  storySessionId: string;
}): Promise<{ finalStory: string }> {
  return api.post("/story/final", params);
}
