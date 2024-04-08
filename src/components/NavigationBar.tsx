import { useContext } from "react";
import { IconMessages } from "@tabler/icons-react";
import { HistoryContext } from "../context/HistoryContext";
import { nanoid } from "nanoid";
import { HistoryType } from "../lib/validators/HistoryType";

// NavigationBar.tsx at src/app/components
export default function NavigationBar() {
  const { Chathistory, addHistory } = useContext(HistoryContext);

  const handleNewChat = () => {
    const newHistory: HistoryType = {
      id: nanoid(),
      label: "New Chat",
      messages: [],
    };
    addHistory(newHistory);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between rounded-sm">
        <button
          className="active:text-white group w-full rounded-md border-0 bg-secondary p-2 text-sm transition-all hover:bg-white hover:shadow-md active:bg-primary"
          onClick={handleNewChat}
        >
          <div className="group-active:text-white flex items-center">
            <IconMessages className="mr-4 size-7 fill-darkprim group-hover:fill-white group-active:fill-primary" />
            New Chat
          </div>
        </button>
      </div>
      <hr className="w-full border-[-1px] border-solid border-darkprim" />
      {Chathistory.map((history, index) => (
        <a
          key={index}
          href={`/chat/${history.id}`}
          className="active:text-white mb-2 truncate rounded-md p-2 no-underline transition-all hover:bg-white hover:shadow-md active:bg-primary"
        >
          {String(history.label)}
        </a>
      ))}
    </div>
  );
}
