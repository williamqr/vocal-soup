// src/lib/api/index.ts
// Re-export all API modules

export { api, ApiError } from "./client";
export { storyApi } from "./storyApi";
export { chatApi } from "./chatApi";

// Re-export types
export type { StartSessionResponse, TranscribeResponse, AppendStoryResponse, FinalStoryResponse } from "./storyApi";
export type { ChatResultType, EvaluateResponse } from "./chatApi";
