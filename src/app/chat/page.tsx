"use client";

import { AppShell, Burger, ScrollArea, NavLink, Text } from "@mantine/core";
import { useState } from "react";
import Chatbot from "../../components/chatbot/ChatContainer";
import {
  IconMessages,
  IconRobot,
  IconArrowsDiagonal,
  IconArrowsDiagonalMinimize,
} from "@tabler/icons-react";

//page.tsx at root.

interface HistoryType {
  label: string;
  id: string;
}

export default function Home() {
  // toggles
  const [opened, setOpened] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleburger = () => setOpened((o) => !o);
  const togglefullscreen = () => setFullscreen((f) => !f);

  // vars
  const [Chathistory, setChathistory] = useState<HistoryType[]>([
    { label: "User seeking for order assistance.", id: "chat1" },
    { label: "Troubleshooting missing Political information.", id: "chat2" },
    { label: "Customer inquiring about return policy", id: "chat3" }
  ]);
  
  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
      disabled={fullscreen}
    >
      <AppShell.Header p="md">
        <style>
          @tailwind base; @tailwind components; @tailwind utilities;
        </style>
        <Burger
          opened={opened}
          onClick={toggleburger}
          hiddenFrom="sm"
          size="sm"
        />
        <div className="flex items-center">
          <IconRobot className="mr-2" />
          <div>PopFigExpert</div>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Burger
          opened={opened}
          onClick={toggleburger}
          hiddenFrom="sm"
          size="sm"
        />
        <AppShell.Section className="flex">
          <IconMessages className="mr-2" />
          Chat History
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          {Chathistory.map((history, index) => (
            <NavLink
              key={index}
              href={"#" + history.id}
              label={String(history.label).substring(0, 17) + "..."}
              className="bg-gray-100 p-2 rounded-md mb-2"
            >
            </NavLink>
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        {fullscreen ? (
          <IconArrowsDiagonalMinimize
            onClick={togglefullscreen}
            className="absolute right-2"
          />
        ) : (
          <IconArrowsDiagonal
            onClick={togglefullscreen}
            className="absolute right-2"
          />
        )}
        <Chatbot />
      </AppShell.Main>
    </AppShell>
  );
}
