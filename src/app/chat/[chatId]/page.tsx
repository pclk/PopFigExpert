import { nanoid } from "ai";
import { Chat } from "./chat";
import { AI } from "@/app/ai_sdk_action";

export const metadata = {
  title: "Eve is talking to you!",
};

export interface ChatPageProps {
  searchParams: {
    message: string | undefined;
    chatId: string | undefined;
  };
}

export default async function IndexPage({ searchParams }: ChatPageProps) {
  const id = searchParams.chatId as string;
  const messageString = searchParams.message as string;

  return (
    <AI
      initialAIState={{
        chatID: id,
        messages: [
          { role: "user", content: messageString, id: nanoid() },
        ],
      }}
    >
      <Chat id={id} />
    </AI>
  );
}
