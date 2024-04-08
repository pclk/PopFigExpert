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
import { Avatar } from "@mantine/core";
import { SetStateAction, useState } from "react";
import ChatInput from "@/components/chatbot/ChatInput";
import { useRouter } from "next/navigation";

export default function Home() {
  const [activeButton, setActiveButton] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState("Chat with Eve...");
  const [description, setDescription] = useState(
    "Eve can make mistakes. Please check her responses.",
  );

  const handleButtonClick = (buttonName: SetStateAction<string>) => {
    setActiveButton(buttonName);
  };

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
      // Start a new chat with the user message
      // Implement your chat logic here
      console.log("Starting a new chat with message:", message);
    } else if (activeTab === "search") {
      // Redirect to /document with the search term
      router.push(`/document?search=${encodeURIComponent(message)}`);
    }
  };

  return (
    <>
      <Tabs defaultValue="chat" className="flex grow flex-col justify-center">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            className="group bg-secondary hover:bg-white active:bg-primary"
            value="chat"
            onClick={() => changeTab("chat")}
          >
            <text className="group-active:text-white text-darkprim">
              Chat with Eve{" "}
            </text>
          </TabsTrigger>
          <TabsTrigger
            className="group bg-secondary hover:bg-white active:bg-primary"
            value="search"
            onClick={() => changeTab("search")}
          >
            <text className="group-active:text-white text-darkprim">
              Manual Document Search
            </text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center">
                <Avatar
                  src="/chatbot.png"
                  alt="Chatbot Avatar"
                  size="md"
                  className="mr-2 rounded-full align-middle"
                />
                <CardTitle>Hey there! I'm Eve!</CardTitle>
              </div>
              <CardDescription>
                I can help you summarize reports! Here are some prompts to get
                started:
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
              <Button
                className="active:text-white hover:bg-secondary active:bg-primary"
                variant="ghost"
              >
                I want a report summary of [xxx]
              </Button>
              <Button
                className="active:text-white hover:bg-secondary active:bg-primary"
                variant="ghost"
              >
                I want a report summary of [xxx]
              </Button>
              <Button
                className="active:text-white hover:bg-secondary active:bg-primary"
                variant="ghost"
              >
                I want a report summary of [xxx]
              </Button>
              <Button
                className="active:text-white hover:bg-secondary active:bg-primary"
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
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("content")}
                className={`hover:bg-secondary ${
                  activeButton === "content" ? "text-white bg-primary" : ""
                }`}
              >
                Content
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("date")}
                className={`hover:bg-secondary ${
                  activeButton === "date" ? "text-white bg-primary" : ""
                }`}
              >
                Date
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("title")}
                className={`hover:bg-secondary ${
                  activeButton === "title" ? "text-white bg-primary" : ""
                }`}
              >
                Title
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("country")}
                className={`hover:bg-secondary ${
                  activeButton === "country" ? "text-white bg-primary" : ""
                }`}
              >
                Country
              </Button>
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
