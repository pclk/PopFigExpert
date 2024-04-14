import { useParams } from "next/navigation";
import ChatInput from "@/components/ChatInput";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "@/app/action";
import { IconUser } from "@tabler/icons-react";
import { submitUserMessage } from "@/app/action";

export default function ChatPage() {
  const params = useParams()!;
  const ChatID = params.chatId as string;
  const [messages, setMessages] = useUIState<typeof AI>();

  async function handleSendMessage(formData: FormData) {
    "use server";
    const userInput = formData.get("userInput") as string;
    if (userInput.trim() !== "") {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now(),
          display: <div>{userInput}</div>,
          isUser: true,
        },
      ]);
      const responseMessage = await submitUserMessage(userInput);
      setMessages((currentMessages) => [...currentMessages, responseMessage]);
    }

    return messages;
  }

  return (
    <div>
      {
        // View messages in UI state
        messages.map((message) => (
          <div key={message.id}>{message.display}</div>
        ))
      }

      <form
        action={async (formData) => {
          const updatedMessages = await handleSendMessage(formData);
          setMessages(updatedMessages);
        }}
      >
        <input placeholder="Send a message..." name="userInput" />
      </form>
    </div>
  );
}
