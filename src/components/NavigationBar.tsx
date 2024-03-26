import { useContext } from "react";
import { HistoryContext } from "../context/HistoryContext";
import { NavLink, Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
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
    <>
      <Group mb="md">
        <span>Chat History</span>
        <Button variant="outline" onClick={handleNewChat}>
          <IconPlus size={16} />
        </Button>
      </Group>
      {Chathistory.map((history, index) => (
        <NavLink
          key={index}
          href={`/chat/${history.id}`}
          label={String(history.label).substring(0, 17) + "..."}
          className="bg-gray-100 p-2 rounded-md mb-2"
        />
      ))}
    </>
  );
}