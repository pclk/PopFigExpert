"use client";

import { useState } from "react";
import ChatContainer from "../../components/chatbot/ChatContainer";
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
    { label: "Customer inquiring about return policy", id: "chat3" },
  ]);

  return <ChatContainer />;
}
