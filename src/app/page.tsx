// page.tsx
"use client";
import { useState, useEffect } from "react";
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
import { useSelectedLayoutSegment } from "next/navigation";
import ChatInput from "@/components/ChatInput";
import { useUIState, useActions } from "ai/rsc";
import { type AI } from "@/app/action";
import { useRouter } from "next/navigation";
import { nanoid } from "ai";
import { Chat } from "@/app/action";

export default function Home() {
  const router = useRouter();
  const [_, setChat] = useUIState<typeof AI>();
  const [modelType, setModelType] = useState("gpt-3.5-turbo");
  const { changeModel } = useActions();
  const selectedTab = useSelectedLayoutSegment() || "chat";

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

  useEffect(() => {
    changeModel(modelType);
  }, [modelType, changeModel]);

  const handleModelChange = (model: string) => {
    setModelType(model);
  };

  const handleTabChange = (tab: string) => {
    const placeholder =
      tab === "chat" ? "Chat with Eve..." : "Enter a search term...";
    const description =
      tab === "chat"
        ? "Eve can make mistakes. Please check her responses."
        : "Showing results x of xx...";
    setTabState({ tab, placeholder, description });
  };

  const handleFilterChange = (formData: FormData) => {
    const content = formData.get("content") as string;
    const date = formData.get("date") as string;
    const title = formData.get("title") as string;
    const country = formData.get("country") as string;
    setFilterState({ content, date, title, country });
  };

  const handleTabClick = (tab: string) => {
    handleTabChange(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value }));
  };

  const encodeFilterURI = (filterStateURI: typeof filterState) => {
    const encodedFilters = Object.entries(filterStateURI)
      .filter(([_, value]) => value !== "")
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    return encodedFilters ? `?${encodedFilters}` : "";
  };

  return (
    <>
      <div className="sticky left-0 top-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-none font-inter text-darkprim hover:bg-secondary active:bg-primary active:text-white"
            >
              {modelType}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Your model of choice</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={modelType}
              onValueChange={handleModelChange}
            >
              <DropdownMenuRadioItem
                value="gpt-3.5-turbo"
                className="hover:bg-secondary active:bg-primary active:text-white"
              >
                GPT 3.5 Turbo
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="mistralai/mixtral-8x7b-instruct-v0.1"
                className="text hover:bg-secondary active:bg-primary active:text-white"
              >
                Mixtral 7x8b
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ChatInput
        placeholder={tabState.placeholder}
        description={tabState.description}
        submitMessage={async (message) => {
          if (tabState.tab === "chat") {
            const chatId = nanoid(); // Generate a unique chatId

            setChat((currentChat: Chat[]) => [
              ...currentChat,
              {
                chatID: chatId,
                messages: [
                  {
                    messageID: Date.now(),
                    display: <div>{message}</div>,
                  },
                ],
              },
            ]);

            router.push(`/chat/${chatId}`);
          } else if (tabState.tab === "search") {
            const filterURI = encodeFilterURI(filterState);
            router.push(`/document${filterURI}`);
          }
        }}
      />
    </>
  );
}