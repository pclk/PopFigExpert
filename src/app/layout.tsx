import { Inter } from "next/font/google";
import "tailwindcss/tailwind.css";
import { IconMenu2 } from "@tabler/icons-react";
import React from "react";
import NavigationBar from "../components/NavigationBar";
import "@/app/globals.css";
import { AI } from "./action";
import { ModelProvider } from "@/context/ModelContext";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { HistoryType } from "@/lib/validators/HistoryType";
import Providers from "@/components/Providers";

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
          <Providers>
          <ModelProvider>
          <NavigationBar
            isDocumentPage={isDocumentPage}
            chatHistory={chatHistory}
          />
          <main className="relative grow overflow-y-hidden p-4">
            {children}
          </main>
          </ModelProvider>
          </Providers>
        </AI>
      </body>
    </html>
  );
}
export const runtime = "edge";
