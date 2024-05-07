import { Button } from "@/components/ui/button";
import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/ai_sdk_action";
import { nanoid } from "ai";
import TextareaAutosize from "react-textarea-autosize";
import { UserMessage } from "@/components/ai-ui/message";
import { useUserInput } from "@/app/stores";

export interface ChatInputProps {
  id?: string;
  title?: string;
}

export function ChatInput({ id, title }: ChatInputProps) {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const {userInput, setUserInput} = useUserInput();

  return (
    <div className="sticky bottom-0 left-0 flex w-full bg-white">
      <div className="flex w-full items-end gap-4">
        <div className="flex w-full flex-grow flex-col justify-end">
          <div className="text-muted-foreground mb-1 text-sm text-gray-400">
            {"Eve can make mistakes. Please check her responses."}
          </div>
          <TextareaAutosize
            className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder="Send a message"
            value={userInput}
            autoFocus
            rows={1}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const value = userInput.trim();
                setUserInput("");
                if (!value) return;

                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: nanoid(),
                    display: <UserMessage>{value}</UserMessage>,
                  },
                ]);

                try {
                  const response = await submitUserMessage(value, "mixtral");
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    response,
                  ]);
                } catch (e) {
                  console.error(e);
                }
              }
            }}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
        </div>
        <button
          type="button"
          className="group rounded-sm border-none bg-primary px-4 py-2 text-sm transition-all hover:bg-secondary active:bg-primary"
          onClick={async (e) => {
            const value = userInput.trim();
            setUserInput("");
            if (!value) return;

            setMessages((currentMessages) => [
              ...currentMessages,
              {
                id: nanoid(),
                display: <div>{value}</div>,
              },
            ]);

            try {
              const response = await submitUserMessage(value, "mixtral");
              setMessages((currentMessages) => [...currentMessages, response]);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <div className="text-white group-hover:text-darkprim">Send</div>
        </button>
      </div>
    </div>
  );
}
