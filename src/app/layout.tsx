import { Inter } from "next/font/google";
import "tailwindcss/tailwind.css";
import { IconMenu2 } from "@tabler/icons-react";
import React from "react";
import NavigationBar from "../components/NavigationBar";
import "@/app/globals.css";
import { AI } from "./action";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { HistoryType } from "@/lib/validators/HistoryType";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PopFigExpert",
  description: "Popular Figure Expert chatbot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chatHistory: HistoryType[] = JSON.parse(
    cookies().get("chatHistory")?.value ?? "[]",
  );
  const isDocumentPage = headers().get("referer") === "/document";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`m-0 flex ${inter.className}`}>
        <AI>
          <IconMenu2 className="fixed right-4 top-4 z-10 lg:hidden" />
          <nav
            className={`fixed left-0 top-0 z-20 box-border h-full w-72 transform bg-secondary p-4 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
          >
            <NavigationBar
              isDocumentPage={isDocumentPage}
              chatHistory={chatHistory}
            />
          </nav>
          <main className="relative grow overflow-y-hidden p-4">
            {children}
          </main>
        </AI>
      </body>
    </html>
  );
}
export const runtime = "edge";
