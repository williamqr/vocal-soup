// src/lib/aiApi.ts
export type ChatResultType = "yes" | "no" | "not_sure";

const API_BASE = "https://backend-9hz3.onrender.com";

function buildUrl(path: string) {
  return `${API_BASE.replace(/\/+$/, "")}${path}`;
}

async function handleJsonResponse(res: Response) {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Backend error ${res.status}: ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON from backend:", text);
    throw err;
  }
}

export async function startStorySession(params: {
  puzzles: { id: string; title: string; summary: string }[];
  storyPremise: string;
}): Promise<{ storySessionId: string; openingText: string }> {
  const res = await fetch(buildUrl("/story/start"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return handleJsonResponse(res);
}

export async function evaluateAnswer(params: {
  puzzleId: string;
  puzzlePrompt: string;
  answerKey: string;
  userAnswer: string;
}): Promise<{ result: ChatResultType; explanation: string }> {
  const res = await fetch(buildUrl("/chat/evaluate"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return handleJsonResponse(res);
}

export async function appendStory(params: {
  storySessionId: string;
  puzzleId: string;
  userCorrectIdea: string;
  puzzleSummary: string;
}): Promise<{ storyChunk: string }> {
  const res = await fetch(buildUrl("/story/append"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return handleJsonResponse(res);
}

export async function fetchFinalStory(params: {
  storySessionId: string;
}): Promise<{ finalStory: string }> {
  const res = await fetch(buildUrl("/story/final"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return handleJsonResponse(res);
}
