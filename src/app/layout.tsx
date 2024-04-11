import { Inter } from "next/font/google";
import "tailwindcss/tailwind.css";
import { IconMenu2 } from "@tabler/icons-react";
import React from "react";
import NavigationBar from "../components/NavigationBar";
import Providers from "@/components/Providers";
require("dotenv").config({ path: "../.env.local" });
import "@/app/globals.css";
import { AI } from "./ai";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  segments,
}: {
  children: React.ReactNode;
  segments: string[];
}) {
  const isDocumentPage = segments[0] === "document";

  return (
    <html lang="en">
      <head>
        <title>PopFigExpert</title>
      </head>
      <body className={`m-0 flex ${inter.className}`}>
        <AI>
          <Providers>
            <IconMenu2 className="fixed right-4 top-4 z-10 lg:hidden" />
            <nav
              className={`fixed left-0 top-0 z-20 box-border h-full w-72 transform bg-secondary p-4 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
            >
              <NavigationBar isDocumentPage={isDocumentPage} />
            </nav>
            <main className="relative grow overflow-y-hidden p-4">
              {children}
            </main>
          </Providers>
        </AI>
      </body>
    </html>
  );
}
