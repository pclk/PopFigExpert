// components/home/TabSelector.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import TextareaAutosize from "react-textarea-autosize";
import { useSelectedLayoutSegment } from "next/navigation";
import { useActions } from "ai/rsc";

export default function TabSelector() {
  const selectedTab = useSelectedLayoutSegment() || "chat";
  const { handleTabChange, handleFilterChange } = useActions();

  const [tabState, setTabState] = useState({
    tab: selectedTab,
    placeholder:
      selectedTab === "chat" ? "Chat with Eve..." : "Enter a search term...",
    description:
      selectedTab === "chat"
        ? "Eve can make mistakes. Please check her responses."
        : "Showing results x of xx...",
  });

  const [filterState, setFilterState] = useState({
    content: "",
    date: "",
    title: "",
    country: "",
  });

  const handleTabClick = (tab: string) => {
    const placeholder =
      tab === "chat" ? "Chat with Eve..." : "Enter a search term...";
    const description =
      tab === "chat"
        ? "Eve can make mistakes. Please check her responses."
        : "Showing results x of xx...";
    const newTabState = { tab, placeholder, description };
    setTabState(newTabState);
    handleTabChange(null, { get: () => tab } as unknown as FormData);
  };

  const handleFilterClick = () => {
    handleFilterChange(null, {
      get: (key: string) => filterState[key as keyof typeof filterState],
    } as unknown as FormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <Tabs
      defaultValue={selectedTab}
      className="flex h-full grow flex-col justify-center"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chat" onClick={() => handleTabClick("chat")}>
          Chat with Eve
        </TabsTrigger>
        <TabsTrigger value="search" onClick={() => handleTabClick("search")}>
          Manual Document Search
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chat">
        <Card className="shadow-none">
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
            <Button
              className="hover:bg-secondary active:bg-primary active:text-white"
              variant="ghost"
            >
              I want a report summary of [xxx]
            </Button>
            <Button
              className="hover:bg-secondary active:bg-primary active:text-white"
              variant="ghost"
            >
              I want a report summary of [xxx]
            </Button>
            <Button
              className="hover:bg-secondary active:bg-primary active:text-white"
              variant="ghost"
            >
              I want a report summary of [xxx]
            </Button>
            <Button
              className="hover:bg-secondary active:bg-primary active:text-white"
              variant="ghost"
            >
              I want a report summary of [xxx]
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="search">
        <Card>
          <CardHeader>
            <CardTitle>Let's look through some documents ourselves</CardTitle>
            <CardDescription>
              These are the fields available to search by:
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TextareaAutosize
              className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
              placeholder="Content"
              name="content"
              value={filterState.content}
              onChange={handleInputChange}
            />
            <TextareaAutosize
              className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
              placeholder="Date"
              name="date"
              value={filterState.date}
              onChange={handleInputChange}
            />
            <TextareaAutosize
              className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
              placeholder="Title"
              name="title"
              value={filterState.title}
              onChange={handleInputChange}
            />
            <TextareaAutosize
              className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
              placeholder="Country"
              name="country"
              value={filterState.country}
              onChange={handleInputChange}
            />
            <Button onClick={handleFilterClick}>Apply Filters</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
