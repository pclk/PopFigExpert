// page.tsx
"use client";
import { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import TextareaAutosize from "react-textarea-autosize";
import ChatInput from "@/components/ChatInput";
import {
  useRouter,
} from "next/navigation";
import { useQueryState, parseAsStringEnum } from "nuqs";

enum tabs {
  chat = "chat",
  search = "search",
}

const examplePrompts = {
  "Report summary of Singapore AI": "Could you generate a report summary on Singapore AI?",
  "Report summary of Australia's Prime Minister": "Could you generate a report summary on Australia's Prime Minister?",
  "Report summary of China's economy": "Could you generate a report summary on China's economy?",
  "Report summary of the Covid-19 in US": "Could you generate a report summary on the Covid-19 in the United States?",
} 

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum<tabs>(Object.values(tabs)).withDefault(tabs.chat),
  );
  const [URL, setURL] = useQueryState("urlfilter");
  const [date, setDate] = useQueryState("datefilter");
  const [title, setTitle] = useQueryState("titlefilter");
  const [country, setCountry] = useQueryState("countryfilter");

  const tabState = {
    tab: tab,
    placeholder: tab === "chat" ? "Chat with Eve..." : "Enter a search term...",
    description:
      tab === "chat"
        ? "Eve can make mistakes. Please check her responses."
        : "Showing results x of xx...",
  };

  const encodeFilterURI = (filterStateURI: typeof filterState) => {
    const encodedFilters = Object.entries(filterStateURI)
      .filter(([_, value]) => value !== "")
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");
    return encodedFilters ? `?${encodedFilters}` : "";
  };

  return (
    <>
    <div className="flex flex-col h-[calc(100%-20px-1.25rem-20px-2px)] justify-center grow">
      {/* 100% - text-description -(text-description marginbottom-1, textarea-padding-4) - textarea - textarea border */}
    <Card className="p-10 drop-shadow-xl">
      <Tabs
        defaultValue={tab}
        className=""
      >
        <TabsList className="grid w-full grid-cols-2 drop-shadow-xl">
          <TabsTrigger className="py-2 border-hidden bg-white hover:bg-secondary" value="chat" onClick={() => setTab(tabs.chat)}>
            Chat with Eve
          </TabsTrigger>
          <TabsTrigger className="py-2 border-hidden bg-white hover:bg-secondary" value="search" onClick={() => setTab(tabs.search)}>
            Manual Document Search
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card className="shadow-none  h-92">
            <CardHeader>
              <div className="flex items-center justify-center">
                <img
                  src="/chatbot.png"
                  alt="Chatbot Avatar"
                  className="mr-2 size-16 rounded-full align-middle"
                />
                <CardTitle>
                  Hey there! I'm{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Eve!
                  </span>
                </CardTitle>
              </div>
              <CardDescription>
                I can help you summarize reports! Here are some prompts to get
                started:
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {Object.entries(examplePrompts).map(([key, prompt]) => (
                <Button
                  key={key}
                  className="hover:bg-secondary active:bg-primary active:text-white"
                  variant="ghost"
                  onClick={() => {
                    const chatId = Date.now();
                    router.push(`/chat/${chatId}?startingMessage=${encodeURIComponent(prompt)}`);
                  }}
                >
                  {key}
                </Button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card className="shadow-none h-92">
            <CardHeader>
              <CardTitle>Let's look through some documents ourselves</CardTitle>
              <CardDescription>
                These are the fields available to search by:
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TextareaAutosize
                className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                placeholder="URL"
                name="url"
                value={URL || ""}
                onChange={(e) => setURL(e.target.value)}
              />
              <TextareaAutosize
                className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                placeholder="Date"
                name="date"
                value={date || ""}
                onChange={(e) => setDate(e.target.value)}
              />
              <TextareaAutosize
                className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                placeholder="Title"
                name="title"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextareaAutosize
                className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                placeholder="Country"
                name="country"
                value={country || ""}
                onChange={(e) => setCountry(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </Card>
      </div>
      <ChatInput
        placeholder={tabState.placeholder}
        description={tabState.description}
        submitMessage={async (message) => {
          if (tabState.tab === "chat") {
            const chatId = Date.now();
            router.push(`/chat/${chatId}?startingMessage=${encodeURIComponent(message)}`);
          } else if (tabState.tab === "search") {
            const filterURI = encodeFilterURI(filterState);
            router.push(`/document${filterURI}`);
          }
        }}
      />
    </>
  );
}
