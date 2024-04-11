import "server-only"
// ai.ts
import { createAI } from "ai/rsc";
import { submitUserMessage } from "./action";

const initialAIState: {
    role: "user" | "assistant" | "system" | "function";
    content: string;
    id?: string;
    name?: string;
  }[] = [];

  const initialUIState: {
    id: number;
    display: React.ReactNode;
    isUser: boolean;
  }[] = [];

// @ts-ignore
export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});