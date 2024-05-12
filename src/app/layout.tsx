import { Inter } from "next/font/google";
import "tailwindcss/tailwind.css";
import React from "react";
import NavigationBar from "../components/NavigationBar";
import "@/app/globals.css";
import { AI } from "./ai_sdk_action";
import type { Metadata } from "next";
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`m-0 flex ${inter.className}`}>
        <AI>
          <Providers>
            <NavigationBar />
            <main className="relative grow overflow-y-auto p-4">
              {children}
            </main>
          </Providers>
        </AI>
      </body>
    </html>
  );
}
export const runtime = "edge";
