import { useActions, useUIState } from "ai/rsc";
import React from "react";

interface SuggestionProps {
  suggestions: {
    [key: string]: string;
  };
}

const Suggestions: React.FC<SuggestionProps> = ({
  suggestions,
}) => {
    const { submitUserMessage } = useActions();
    const [_, setMessage] = useUIState();

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.entries(suggestions).map(([display, message]) => (
        <div
          key={display}
          className="px-4 py-2 text-darkprim rounded-2xl border-solid border-[1px] border-darkprim hover:bg-secondary active:bg-primary active:text-white cursor-pointer"
          onClick={async () => {
            const response = await submitUserMessage(message)
            setMessage((currentMessages: any[]) => [
                ...currentMessages,
                response
            ])
          }}
        >
          {display}
        </div>
      ))}
    </div>
  );
};

export default Suggestions;