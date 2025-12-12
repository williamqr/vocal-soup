// src/lib/api/chatApi.ts
// Chat/evaluation-related API endpoints

import { api } from "./client";

// Response types
export type ChatResultType = "yes" | "no" | "not_sure";

export type EvaluateResponse = {
  result: ChatResultType;
  explanation: string;
};

// API functions
export const chatApi = {
  /**
   * Evaluate a user's answer against the puzzle
   */
  evaluate: (params: {
    puzzleId: string;
    puzzlePrompt: string;
    answerKey: string;
    userAnswer: string;
  }) => api.post<EvaluateResponse>("/chat/evaluate", params),
};

export default chatApi;
