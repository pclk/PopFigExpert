"use client";

import { Inter } from "next/font/google";
import "tailwindcss/tailwind.css";
import { IconMenu2 } from "@tabler/icons-react";
import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Providers from "@/components/Providers";
require("dotenv").config({ path: "../.env.local" });
import "@/app/globals.css";

// layout.tsx at src/app

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);

  const toggleNavBar = () => setIsNavBarOpen((prevState) => !prevState);

  return (
    <html lang="en">
      <head>
        <title>PopFigExpert</title>
      </head>
      <body className={`m-0 flex ${inter.className}`}>
        <Providers>
          <IconMenu2
            className="fixed right-4 top-4 z-10 lg:hidden"
            onClick={toggleNavBar}
          />
          <nav
            className={`fixed left-0 top-0 z-20 box-border h-full w-72 transform bg-secondary p-4 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
              isNavBarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <NavigationBar />
          </nav>
          <main className="grow p-4">
            <div className="relative flex h-full flex-col items-center justify-end">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
