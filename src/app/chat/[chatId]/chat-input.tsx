import { Button } from "@/components/ui/button";
import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/app/ai_sdk_action";
import { nanoid } from "ai";
import TextareaAutosize from "react-textarea-autosize";

export interface ChatInputProps {
  id?: string;
  title?: string;
  input: string;
  setInput: (value: string) => void;
}

export function ChatInput2({ id, title, input, setInput }: ChatInputProps) {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

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
          value={input}
          autoFocus
          rows={1}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const value = input.trim();
              setInput("");
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
            setInput(e.target.value);
          }}
        />
        </div>
        <button
          type="button"
          className="group rounded-sm border-none bg-primary px-4 py-2 text-sm transition-all hover:bg-secondary active:bg-primary"
          onClick={async (e) => {
            handleSendMessage();
          }}
        >
          <div className="text-white group-hover:text-darkprim">Send</div>
        </button>
      </div>
    </div>  
    );
}
