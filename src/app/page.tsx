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
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import { useFormState } from "react-dom";
import { useUIState, useActions } from "ai/rsc";
import {
  handleFilterChange,
  handleModelChange,
  handleSendMessage,
  handleTabChange,
  type AI,
} from "@/app/action";

export default function Home() {
  const router = useRouter();
  const [modelDisplayState, handleModelChangeAction] = useFormState(
    handleModelChange,
    { modelDisplay: "GPT 3.5 Turbo" },
  );
  const [tabState, handleTabChangeAction] = useFormState(handleTabChange, {
    tab: "chat",
    placeholder: "Chat with Eve...",
    description: "Eve can make mistakes. Please check her responses.",
  });
  const [filterState, handleFilterChangeAction] = useFormState(
    handleFilterChange,
    {
      content: "",
      date: "",
      title: "",
      country: "",
    },
  );
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  return (
    <>
      <div className="sticky left-0 top-0">
        <form action={handleModelChangeAction}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-none font-inter text-darkprim hover:bg-secondary active:bg-primary active:text-white"
              >
                {modelDisplayState?.modelDisplay}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Your model of choice</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup>
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
        </form>
      </div>

      <Tabs
        defaultValue="chat"
        className="flex h-full grow flex-col justify-center"
      >
        <TabsList className="grid w-full grid-cols-2">
          <form action={handleTabChangeAction}>
            <TabsTrigger
              className="group bg-secondary hover:bg-white active:bg-primary"
              value="chat"
            >
              <input type="hidden" name="tab" value="chat" />
              <text className="text-darkprim group-active:text-white">
                Chat with Eve{" "}
              </text>
            </TabsTrigger>
            <TabsTrigger
              className="group bg-secondary hover:bg-white active:bg-primary"
              value="search"
            >
              <input type="hidden" name="tab" value="search" />
              <text className="text-darkprim group-active:text-white">
                Manual Document Search
              </text>
            </TabsTrigger>
          </form>
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
              <form action={handleFilterChangeAction}>
                <TextareaAutosize
                  className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                  placeholder="Content"
                  name="content"
                  value={filterState.content}
                />
                <TextareaAutosize
                  className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                  placeholder="Date"
                  name="date"
                  value={filterState.date}
                />
                <TextareaAutosize
                  className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                  placeholder="Title"
                  name="title"
                  value={filterState.title}
                />
                <TextareaAutosize
                  className="box-border w-full grow resize-none overflow-hidden rounded-sm border-primary p-2 font-inter text-sm text-darkprim caret-primary outline-0 transition-all duration-75 focus:ring-2 focus:ring-primary"
                  placeholder="Country"
                  name="country"
                  value={filterState.country}
                />
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ChatInput
        action={handleSendMessage}
        placeholder={tabState.placeholder}
        description={tabState.description}
      />
    </>
  );
}
