// page.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModelDropdown, TabSelector } from "@/components/home";
import ChatInput from "@/components/ChatInput";
import { useUIState, useActions } from "ai/rsc";
import { type AI } from "@/app/action";
import { useRouter } from "next/navigation";
import { nanoid } from "ai";

export default function Home() {
  const router = useRouter();
  const [_, setMessages] = useUIState<typeof AI>();

  const handleSubmitMessage = async (message: string) => {
    const chatId = nanoid(); // Generate a unique chatId
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <div>{message}</div>,
      },
    ]);
    router.push(`/chat/${chatId}`);
  };

  return (
    <>
      <div className="sticky left-0 top-0">
        <ModelDropdown />
      </div>

      <TabSelector />

      <ChatInput
        placeholder="Type your message..."
        description="Eve can make mistakes. Please check her responses."
        submitMessage={handleSubmitMessage}
      />
    </>
  );
}