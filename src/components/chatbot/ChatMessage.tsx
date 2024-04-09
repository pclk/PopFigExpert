import { MessageType } from "@/lib/validators/MessageType";
import { IconUser } from "@tabler/icons-react";

interface ChatMessageProps {
  message: MessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="mb-4 flex flex-col items-center">
      {message.isUser ? (
        <div className="flex items-center self-end">
          <text className={`mr-2 rounded-md bg-primary p-4`}>
            {message.text}
          </text>
          <IconUser className="size-10 flex-shrink-0 fill-darkprim " />
        </div>
      ) : (
        <div className="flex items-center self-start">
          <img
            src="/chatbot.png"
            alt="Chatbot Avatar"
            className="mr-2 size-12 flex-shrink-0 rounded-full align-middle"
          />
          <text className={`justify-start rounded-md bg-secondary p-4`}>
            {message.text}
          </text>
        </div>
      )}
    </div>
  );
}
