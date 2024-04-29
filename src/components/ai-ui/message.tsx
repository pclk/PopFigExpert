"use client";

/* eslint-disable @next/next/no-img-element */

// import { GoogleIcon, IconGemini, IconUser } from '@/components/ui/icons'
import { cn } from "@/lib/utils";
import { spinner } from "./spinner";
import { MemoizedReactMarkdown } from "../markdown";
import remarkGfm from "remark-gfm";
import { StreamableValue } from "ai/rsc";
import { useStreamableText } from "@/lib/use-streamable-text";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group flex self-end p-2">
      <div className=" flex shrink-0 select-none items-center justify-center ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>
      <div className="p-auto ml-4 flex-1 space-y-2 overflow-hidden">
        <div className="flex h-full items-center text-lg tracking-tight">{children}</div>
      </div>
    </div>
  );
}

export function BotMessage({
  content,
  className,
}: {
  content: string | StreamableValue<string>;
  className?: string;
}) {
  const text = useStreamableText(content);

  return (
    <div className="group mt-2 flex self-start rounded-md bg-secondary p-2 shadow-lg">
      <div className="flex size-[30px] shrink-0 select-none">
        <Image
          src="/chatbot.jpg"
          alt="Chatbot"
          width={30}
          height={30}
          className=""
        />
      </div>
      <div className="p-auto ml-4 flex-1 space-y-2 overflow-hidden">
        <div className="mt-0 flex h-full items-center">
          <MemoizedReactMarkdown
            className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 mt-0 text-lg tracking-tight "
            remarkPlugins={[remarkGfm]}
            components={{
              p({ children }) {
                return <p className="m-0">{children}</p>;
              },
            }}
          >
            {text}
          </MemoizedReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border shadow-sm">
        <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
      </div>
      <div className="ml-4 flex h-[24px] flex-1 flex-row items-center space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  );
}
