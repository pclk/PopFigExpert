// page.tsx
"use client";
import { ModelDropdown, TabSelector } from "@/components/home";
import ChatInput from "@/components/ChatInput";
import { useUIState, useActions } from "ai/rsc";
import { type AI } from "@/app/action";
import { useRouter } from "next/navigation";
import { nanoid } from "ai";
import { Chat } from "@/app/action";


export default function Home() {
  const router = useRouter()
  const [_, setChat] = useUIState<typeof AI>();

  return (
    <>
      <div className="sticky left-0 top-0">
        <ModelDropdown />
      </div>
      <TabSelector />
      <ChatInput
        placeholder="Type your message..."
        description="Eve can make mistakes. Please check her responses."
        submitMessage={async (message) => {
          const chatId = nanoid(); // Generate a unique chatId

          setChat((currentChat: Chat[]) => [
            ...currentChat,
            {
              chatID: chatId,
              messages: [
                {
                  messageID: Date.now(),
                  display: <div>{message}</div>,
                },
              ],
            },
          ]);

          router.push(`/chat/${chatId}`);
        }}
      />
    </>
  );
}