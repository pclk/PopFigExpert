import { useActions, useUIState } from "ai/rsc";
import React from "react";

interface SuggestionProps {
  suggestions: {
    [key: string]: string;
  };
}

const Suggestions: React.FC<SuggestionProps> = ({ suggestions }) => {
  const { submitUserMessage } = useActions();
  const [_, setMessage] = useUIState();

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {Object.entries(suggestions).map(([display, message]) => (
        <div
          key={display}
          className="cursor-pointer rounded-2xl border-[1px] border-solid border-darkprim px-4 py-2 text-darkprim hover:bg-secondary active:bg-primary active:text-white"
          onClick={async () => {
            const response = await submitUserMessage(message);
            setMessage((currentMessages: any[]) => [
              ...currentMessages,
              response,
            ]);
          }}
        >
          {display}
        </div>
      ))}
    </div>
  );
};

export default Suggestions;
