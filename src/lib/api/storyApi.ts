// src/lib/api/storyApi.ts
// Story-related API endpoints

import { api } from "./client";

// Response types
export type StartSessionResponse = {
  storySessionId: string;
  openingText?: string;
};

export type TranscribeResponse = {
  evaluation: string;
  completion: number;
  transcription?: string;
};

export type AppendStoryResponse = {
  storyChunk: string;
};

export type FinalStoryResponse = {
  finalStory: string;
};

// API functions
export const storyApi = {
  /**
   * Start a new story session for a puzzle
   */
  startSession: (puzzleId: string, userId: string) =>
    api.post<StartSessionResponse>("/story/start", { puzzleId, userId }),

  /**
   * Upload audio and get transcription + evaluation
   */
  transcribeAudio: (sessionId: string, audioUri: string, language: string) => {
    const formData = new FormData();
    const fileType = "audio/m4a";
    const fileName = `recording-${Date.now()}.m4a`;

    formData.append("audioFile", {
      uri: audioUri,
      type: fileType,
      name: fileName,
    } as any);

    formData.append("language", language);

    return api.upload<TranscribeResponse>("/chat/transcribe", formData, {
      queryParams: { sessionId },
      timeout: 60000, // 60s for audio upload
    });
  },

  /**
   * Append to the story after a correct answer
   */
  appendStory: (params: {
    storySessionId: string;
    puzzleId: string;
    userCorrectIdea: string;
    puzzleSummary: string;
  }) => api.post<AppendStoryResponse>("/story/append", params),

  /**
   * Get the final complete story
   */
  getFinalStory: (storySessionId: string) =>
    api.post<FinalStoryResponse>("/story/final", { storySessionId }),
};

export default storyApi;
