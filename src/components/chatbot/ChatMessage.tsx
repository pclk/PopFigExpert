import { MessageType } from "@/lib/validators/MessageType";

interface ChatMessageProps {
  message: MessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`mb-4 flex items-center`}>
      {message.isUser ? (
        <>
          <text className={`mr-2 rounded-md bg-white p-4`}>{message.text}</text>
          <img alt="User Avatar" />
        </>
      ) : (
        <>
          <img
            src="/chatbot.png"
            alt="Chatbot Avatar"
            className="mr-2 size-16 rounded-full align-middle"
          />
          <text className={`justify-start rounded-md bg-secondary p-4`}>
            {message.text}
          </text>
        </>
      )}
    </div>
  );
}
