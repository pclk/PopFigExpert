"use server";
import "server-only";

import {
  createAI,
  getMutableAIState,
  createStreamableUI,
  render,
} from "ai/rsc";
import OpenAI from "openai";

import { HistoryType } from "@/lib/validators/HistoryType";
import { nanoid } from "ai";
import { MessageType } from "../lib/validators/MessageType";
import { cookies } from "next/headers";
// import { runOpenAICompletion } from "@/lib/utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

async function submitUserMessage(userInput: string): Promise<Message> {
  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);

  const reply = createStreamableUI(
    <div>
      <p>Thinking...</p>
    </div>,
  );

  const ui = render({
    model: "gpt-3.5-turbo",
    provider: openai,
    messages: [
      {
        role: "system",
        content: "You are a simple AI assistant.",
      },
      ...aiState.get().map((info: any) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    text: ({ content, done }) => {
      if (done) {
        aiState.done([...aiState.get(), { role: "assistant", content: content }]);
      }
      return <p>{content}</p>;
    },
    //tools: {},
  });
  return {
    messageID: Date.now(),
    display: ui,
  };
}

export async function handleSendMessage(message: string): Promise<void> {
  const aiState = getMutableAIState<typeof AI>();
  const currentMessages = aiState.get();

  // Add user message to the state
  aiState.update([...currentMessages, { role: "user", content: message }]);

  // Submit and get response message
  const responseMessage = await submitUserMessage(message);

  // Add response message to the state
  aiState.update([...currentMessages, { role: "assistant", content: responseMessage.display!.props.children }]);

  return aiState.get();
}

async function handleTabChange(prevState: any, formData: FormData) {
  const tab = formData.get("tab") as string;
  const placeholder =
    tab === "chat" ? "Chat with Eve..." : "Enter a search term...";
  const description =
    tab === "chat"
      ? "Eve can make mistakes. Please check her responses."
      : "Showing results x of xx...";
  return { ...prevState, tab, placeholder, description };
}

async function handleModelChange(prevState: any, formData: FormData) {
  const model = formData.get("model") as string;
  const modelDisplay =
    model === "gpt-3.5-turbo" ? "GPT 3.5 Turbo" : "Mixtral 7x8b";
  return { ...prevState, modelDisplay };
}

async function handleFilterChange(prevState: any, formData: FormData) {
  const content = formData.get("content") as string;
  const date = formData.get("date") as string;
  const title = formData.get("title") as string;
  const country = formData.get("country") as string;
  return { ...prevState, content, date, title, country };
}

//Chat
const defaultValue = [
  {
    id: "ocH49A5lVYXi9izu6eNuU",
    label: "User seeking for order assistance.",
    messages: [
      {
        id: nanoid(),
        text: "Hello! How can I assist you today?",
        isUser: false,
      },
    ],
  },
];

const chatHistory = cookies().get("chatHistory");
const Chathistory: HistoryType[] = chatHistory
  ? JSON.parse(chatHistory.value)
  : [];

async function addHistory(history: HistoryType) {
  const updatedHistory = [...Chathistory, history];
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}

async function removeHistory(id: string) {
  const updatedHistory = Chathistory.filter((history) => history.id !== id);
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}

async function updateHistoryLabel(
  id: string,
  updateFn: (prevLabel: string) => string,
) {
  const updatedHistory = Chathistory.map((history) => {
    if (history.id === id) {
      return { ...history, label: updateFn(history.label) };
    }
    return history;
  });
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}

async function addMessages(id: string, message: MessageType) {
  const updatedHistory = Chathistory.map((history) => {
    if (history.id === id) {
      return { ...history, messages: [...history.messages, message] };
    }
    return history;
  });
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}

async function updateMessages(
  id: string,
  updateFn: (prevMessages: MessageType[]) => MessageType[],
) {
  const updatedHistory = Chathistory.map((history) => {
    if (history.id === id) {
      return { ...history, messages: updateFn(history.messages) };
    }
    return history;
  });
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}
export interface Message {
  messageID: number;
  display: React.ReactNode;
}

export interface Chat {
  chatID: string;
  messages: Message[];
}
const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: Chat[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
    handleSendMessage,
    handleTabChange,
    handleModelChange,
    handleFilterChange,
    addHistory,
    removeHistory,
    updateHistoryLabel,
    addMessages,
    updateMessages,
  },
  initialUIState,
  initialAIState,
});