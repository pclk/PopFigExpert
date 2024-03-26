"use client";

import { createContext, useState } from "react";
import { nanoid } from "nanoid";
import { HistoryType } from "../lib/validators/HistoryType";
import { MessageType } from "../lib/validators/MessageType";

// HistoryContext.tsx at src/app/context

const defaultValue = [
  {
    id: "ocH49A5lVYXi9izu6eNuU",
    label: "User seeking for order assistance.",
    messages: [{ id: nanoid(), text: "Hello! How can I assist you today?", isUser: false }],
  },
];
export const HistoryContext = createContext<{
  Chathistory: HistoryType[];
  addHistory: (history: HistoryType) => void;
  removeHistory: (id: string) => void;
  updateHistoryLabel: (id: string, updateFn: (prevLabel: string) => string) => void;
  addMessages: (id: string, message: MessageType) => void;
  updateMessages: (id: string, updateFn: (prevMessages: MessageType[]) => MessageType[]) => void;
}>({
  Chathistory: [],
  addHistory: () => {},
  removeHistory: () => {},
  updateHistoryLabel: () => {},
  addMessages: () => {},
  updateMessages: () => {},
});

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [Chathistory, setChathistory] = useState(defaultValue);

  const addHistory = (history: HistoryType) => {
    setChathistory((prev) => [...prev, history]);
  };

  const removeHistory = (id: string) => {
    setChathistory((prev) => prev.filter((history) => history.id !== id));
  };

  const updateHistoryLabel = (id: string, updateFn: (prevLabel: string) => string) => {
    setChathistory((prev) =>
      prev.map((history) => {
        if (history.id === id) {
          return { ...history, label: updateFn(history.label) };
        }
        return history;
      })
    );
  };

  const addMessages = (id: string, message: MessageType) => {
    setChathistory((prev) =>
      prev.map((history) => {
        if (history.id === id) {
          return { ...history, messages: [...history.messages, message] };
        }
        return history;
      })
    );
  }

  const updateMessages = (id: string, updateFn: (prevMessages: MessageType[]) => MessageType[]) => {
    setChathistory((prev) =>
      prev.map((history) => {
        if (history.id === id) {
          return { ...history, messages: updateFn(history.messages) };
        }
        return history;
      })
    );
  };

  return (
    <HistoryContext.Provider value={{ Chathistory, addHistory, removeHistory, updateHistoryLabel, addMessages, updateMessages }}>
      {children}
    </HistoryContext.Provider>
  );
}