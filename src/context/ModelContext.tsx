"use client";
// ModelContext.tsx
import { createContext, useContext, useState } from "react";

const ModelContext = createContext<{
  modelType: string;
  setModelType: (modelType: string) => void;
}>({
  modelType: "gpt-3.5-turbo",
  setModelType: () => {},
});

export const useModelContext = () => useContext(ModelContext);

export const ModelProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [modelType, setModelType] = useState("gpt-3.5-turbo");

  return (
    <ModelContext.Provider value={{ modelType, setModelType }}>
      {children}
    </ModelContext.Provider>
  );
};