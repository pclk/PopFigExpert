"use client";

import { AppShell, Burger, ScrollArea, NavLink, Text } from "@mantine/core";
import { useState } from "react";
import Chatbot from "./components/Chatbot";
import {
  IconMessages,
  IconRobot,
  IconArrowsDiagonal,
  IconArrowsDiagonalMinimize,
} from "@tabler/icons-react";

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
    { label: "User requesting product specifications", id: "chat4" },
    { label: "Client asking for shipping timeline", id: "chat5" },
    { label: "Guest seeking reservation modification", id: "chat6" },
    { label: "Member reporting website login issue", id: "chat7" },
    { label: "Subscriber requesting plan upgrade", id: "chat8" },
    { label: "Patron asking about event details", id: "chat9" },
    { label: "Customer seeking alternative payment options", id: "chat10" },
    { label: "User reporting a bug in mobile app", id: "chat11" },
    { label: "Client requesting a feature enhancement", id: "chat12" },
    { label: "Guest inquiring about loyalty program benefits", id: "chat13" },
    { label: "Member asking for account verification", id: "chat14" },
    { label: "Subscriber reporting a billing discrepancy", id: "chat15" },
    { label: "Patron requesting a refund for a canceled service", id: "chat16" },
    { label: "Customer seeking assistance with product assembly", id: "chat17" },
    { label: "User asking for personalized recommendations", id: "chat18" },
    { label: "Client requesting a quote for bulk orders", id: "chat19" },
    { label: "Guest inquiring about parking facilities", id: "chat20" },
    { label: "Member reporting a missing reward points", id: "chat21" },
    { label: "Subscriber asking for a trial extension", id: "chat22" },
    { label: "Patron requesting a digital receipt", id: "chat23" },
    { label: "Customer seeking information about warranty coverage", id: "chat24" },
    { label: "User reporting a glitch in the checkout process", id: "chat25" },
    { label: "Client asking for a product demo", id: "chat26" },
    { label: "Guest requesting early check-in options", id: "chat27" },
    { label: "Member inquiring about referral program details", id: "chat28" },
    { label: "Subscriber reporting a delayed shipment", id: "chat29" },
    { label: "Patron asking for a virtual tour of the venue", id: "chat30" },
    { label: "Customer seeking assistance with product customization", id: "chat31" },
    { label: "User requesting integration with third-party software", id: "chat32" },
    { label: "Client asking for a price match guarantee", id: "chat33" },
    { label: "Guest inquiring about pet-friendly accommodations", id: "chat34" },
    { label: "Member reporting a duplicate charge", id: "chat35" },
    { label: "Subscriber requesting a pause in subscription", id: "chat36" },
    { label: "Patron asking for a virtual backstage meet-and-greet", id: "chat37" },
    { label: "Customer seeking assistance with product repair", id: "chat38" },
    { label: "User asking for a wishlist feature", id: "chat39" },
    { label: "Client requesting a contract revision", id: "chat40" },
    { label: "Guest inquiring about contactless check-in options", id: "chat41" },
  ]);

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: "sm", collapsed: { mobile: !opened } }}
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

      <AppShell.Main className="flex">
        {fullscreen ? (
          <IconArrowsDiagonalMinimize
            onClick={togglefullscreen}
            className="absolute"
            style={{ right: 16 }}
          />
        ) : (
          <IconArrowsDiagonal
            onClick={togglefullscreen}
            className="absolute"
            style={{ right: 16 }}
          />
        )}
        <Chatbot />
      </AppShell.Main>
    </AppShell>
  );
}
