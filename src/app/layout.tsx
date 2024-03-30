"use client"

import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import {
  createTheme,
  ColorSchemeScript,
  AppShell,
  Burger,
  ScrollArea,
} from "@mantine/core";
import "tailwindcss/tailwind.css";
import {
  IconRobot,
  IconMessages,
  IconArrowsDiagonal,
  IconArrowsDiagonalMinimize,
} from "@tabler/icons-react";
import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Providers from "@/components/Providers";
require('dotenv').config({path: "../.env.local"});

// layout.tsx at src/app

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  primaryColor: "teal",
  primaryShade: 4,
  fontFamily: 'Inter, "Helvetica Neue", sans-serif',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleburger = () => setOpened((o) => !o);
  const togglefullscreen = () => setFullscreen((f) => !f);
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Providers>
          <AppShell
            layout="alt"
            header={{ height: 60 }}
            navbar={{
              width: 250,
              breakpoint: "sm",
              collapsed: { mobile: !opened },
            }}
            padding="md"
            disabled={fullscreen}
          >
            <AppShell.Header p="md">
              
              <style>{`@layer tailwind {@tailwind base;}@tailwind components;@tailwind utilities;`}</style>
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
                  <NavigationBar />
              </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main>
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
              {children}
            </AppShell.Main>
          </AppShell>
          </Providers>
      </body>
    </html>
  );
}
