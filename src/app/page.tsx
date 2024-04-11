"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext, useState } from "react";
import ChatInput from "@/components/chatbot/ChatInput";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import { MessageType } from "@/lib/validators/MessageType";
import { HistoryType } from "@/lib/validators/HistoryType";
import { HistoryContext } from "../context/HistoryContext";
import { nanoid } from "nanoid";

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat");
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState("Chat with Eve...");
  const [description, setDescription] = useState(
    "Eve can make mistakes. Please check her responses.",
  );
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [modelDisplay, setModelDisplay] = useState("GPT 3.5 Turbo");
  const [filters, setFilters] = useState({
    content: "",
    date: "",
    title: "",
    country: "",
  });
  const { addHistory } = useContext(HistoryContext);

  function handleModelChange(model: string) {
    setModel(model);
    if (model === "gpt-3.5-turbo") {
      setModelDisplay("GPT 3.5 Turbo");
    } else if (model === "mistralai/mixtral-8x7b-instruct-v0.1") {
      setModelDisplay("Mixtral 7x8b");
    }
  }

  function changeTab(tab: string) {
    setActiveTab(tab);
    if (tab === "chat") {
      setPlaceholder("Chat with Eve...");
      setDescription("Eve can make mistakes. Please check her responses.");
    } else if (tab === "search") {
      setPlaceholder("Enter a search term...");
      setDescription("Showing results x of xx...");
    }
  }

  const handleSendMessage = (message: string) => {
    if (activeTab === "chat") {
      // Create a new chat message
      const newMessage: MessageType = {
        id: nanoid(),
        text: message,
        isUser: true,
      };

      // Create a new chat history
      const newHistory: HistoryType = {
        id: nanoid(),
        label: "New Chat",
        messages: [newMessage],
      };
      addHistory(newHistory);

      // Redirect to /chat/[chatId]
      router.push(`/chat/${newHistory.id}`);
    } else if (activeTab === "search") {
      // Redirect to /document with the search term
      router.push(`/document?search=${encodeURIComponent(message)}`);
    }
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
              {modelDisplay} ⏷
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Your model of choice</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={model}
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
        defaultValue="chat"
        className="flex h-full grow flex-col justify-center"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            className="group bg-secondary hover:bg-white active:bg-primary"
            value="chat"
            onClick={() => changeTab("chat")}
          >
            <text className="text-darkprim group-active:text-white">
              Chat with Eve{" "}
            </text>
          </TabsTrigger>
          <TabsTrigger
            className="group bg-secondary hover:bg-white active:bg-primary"
            value="search"
            onClick={() => changeTab("search")}
          >
            <text className="text-darkprim group-active:text-white">
              Manual Document Search
            </text>
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
            <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
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
                value={filters.content}
                onChange={(e) =>
                  setFilters({ ...filters, content: e.target.value })
                }
              />
              <TextareaAutosize
                className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                placeholder="Date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
              <TextareaAutosize
                className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                placeholder="Title"
                value={filters.title}
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
              />
              <TextareaAutosize
                className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                placeholder="Country"
                value={filters.country}
                onChange={(e) =>
                  setFilters({ ...filters, country: e.target.value })
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ChatInput
        onSendMessage={handleSendMessage}
        isPending={false}
        isError={false}
        error={null}
        placeholder={placeholder}
        description={description}
      />
    </>
  );
}
