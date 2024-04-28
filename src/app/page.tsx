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
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsStringEnum } from "nuqs";
import Image from "next/image";
import { DatePickerWithRange } from "@/components/DateRangePicker";

enum tabs {
  chat = "chat",
  search = "search",
}

const examplePrompts = {
  "Report summary of Singapore AI":
    "Could you generate a report summary on Singapore AI?",
  "Report summary of Australia's Prime Minister":
    "Could you generate a report summary on Australia's Prime Minister?",
  "Report summary of China's economy":
    "Could you generate a report summary on China's economy?",
  "Report summary of the Covid-19 in US":
    "Could you generate a report summary on the Covid-19 in the United States?",
};

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum<tabs>(Object.values(tabs)).withDefault(tabs.chat),
  );
  const [titleFilter, setTitleFilter] = useQueryState("title");
  const [countryFilter, setCountryFilter] = useQueryState("country");
  const [startDateFilter, setStartDateFilter] = useQueryState("startDate");
  const [endDateFilter, setEndDateFilter] = useQueryState("endDate");

  const tabState = {
    tab: tab,
    placeholder: tab === "chat" ? "Chat with Eve..." : "Enter a search term...",
    description:
      tab === "chat"
        ? "Eve can make mistakes. Please check her responses."
        : "Showing results x of xx...",
  };

  return (
    <>
      <div className="flex h-[calc(100%-20px-1.25rem-20px-2px)] grow flex-col justify-center">
        {/* 100% - text-description -(text-description marginbottom-1, textarea-padding-4) - textarea - textarea border */}
        <Card className="p-10 drop-shadow-xl">
          <Tabs defaultValue={tab} className="h-[400px]">
            <TabsList className="grid w-full grid-cols-2 drop-shadow-xl">
              <TabsTrigger
                className="border-hidden bg-white py-2 hover:bg-secondary"
                value="chat"
                onClick={() => setTab(tabs.chat)}
              >
                Chat with Eve
              </TabsTrigger>
              <TabsTrigger
                className="border-hidden bg-white py-2 hover:bg-secondary"
                value="search"
                onClick={() => setTab(tabs.search)}
              >
                Manual Document Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <Card className="h-92  shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-center space-x-2">
                    <Image
                      src="/chatbot.jpg"
                      alt="Chatbot Avatar"
                      width={50}
                      height={50}
                    />
                    <CardTitle>
                      Hey there! I'm{" "}
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Eve!
                      </span>
                    </CardTitle>
                  </div>
                  <CardDescription>
                    I can help you summarize reports! Here are some prompts to
                    get started:
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
                        router.push(
                          `/chat/${chatId}?startingMessage=${encodeURIComponent(prompt)}`,
                        );
                      }}
                    >
                      {key}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="search" className="h-[400px]">
              <Card className="h-92 shadow-none">
                <CardHeader>
                  <CardTitle>
                    Let's look through some documents ourselves
                  </CardTitle>
                  <CardDescription>
                    These are the fields available to search by:
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 ">
                  <DatePickerWithRange className="rounded-sm border border-primary font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary" />
                  <TextareaAutosize
                    className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
                    placeholder="Title"
                    value={titleFilter ? titleFilter : ""}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        let searchParams = "";
                        if (titleFilter) {
                          searchParams += `title=${titleFilter.replace(/ /g, "+")}&`;
                        }
                        if (countryFilter) {
                          searchParams += `country=${countryFilter.replace(/ /g, "+")}&`;
                        }
                        if (startDateFilter) {
                          searchParams += `startDate=${startDateFilter}&`;
                        }
                        if (endDateFilter) {
                          searchParams += `endDate=${endDateFilter}&`;
                        }
                        router.push(`/document?${searchParams}`);
                      }
                    }}
                  />
                  <TextareaAutosize
                    className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
                    placeholder="Country"
                    value={countryFilter ? countryFilter : ""}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        let searchParams = "";
                        if (titleFilter) {
                          searchParams += `title=${titleFilter.replace(/ /g, "+")}&`;
                        }
                        if (countryFilter) {
                          searchParams += `country=${countryFilter.replace(/ /g, "+")}&`;
                        }
                        if (startDateFilter) {
                          searchParams += `startDate=${startDateFilter}&`;
                        }
                        if (endDateFilter) {
                          searchParams += `endDate=${endDateFilter}&`;
                        }
                        router.push(`/document?${searchParams}`);
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <Input
        placeholder={tabState.placeholder}
        description={tabState.description}
        submitMessage={async (message) => {
          if (tabState.tab === "chat") {
            const chatId = Date.now();
            router.push(
              `/chat/${chatId}?startingMessage=${encodeURIComponent(message)}`,
            );
          } else if (tabState.tab === "search") {
            let searchParams = "";
            if (titleFilter) {
              searchParams += `title=${titleFilter.replace(/ /g, "+")}&`;
            }
            if (countryFilter) {
              searchParams += `country=${countryFilter.replace(/ /g, "+")}&`;
            }
            if (message) {
              searchParams += `content=${message.replace(/ /g, "+")}&`;
            }
            if (startDateFilter) {
              searchParams += `startDate=${startDateFilter}&`;
            }
            if (endDateFilter) {
              searchParams += `endDate=${endDateFilter}&`;
            }
            router.push(`/document?${searchParams}`);
          }
        }}
      />
    </>
  );
}
