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

export const examplePrompts = {
  "📜Article summary of [xxx]":
    "Could you generate an article summary on xxx?",
  "🧑Profile summary of [xxx]":
    "Could you generate a profile summary on xxx?",
};

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum<tabs>(Object.values(tabs)).withDefault(tabs.chat),
  );

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
          <Tabs defaultValue={tab} onValueChange={(value) => setTab(value as tabs)}>
            <TabsList className="grid w-full grid-cols-2 drop-shadow-xl">
              <TabsTrigger
                className="border-hidden bg-white py-2 hover:bg-secondary"
                value="chat"
              >
                Chat with Eve
              </TabsTrigger>
              <TabsTrigger
                className="border-hidden bg-white py-2 hover:bg-secondary"
                value="search"
              >
                Manual Document Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <Card className="shadow-none">
                <CardHeader>
                  <div className="flex items-center justify-center space-x-2">
                    <Image
                      src="/chatbot.jpg"
                      alt="Chatbot Avatar"
                      width={50}
                      height={50}
                    />
                    <CardTitle className="text-4xl">
                      Hey there! I'm{" "}
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Eve!
                      </span>
                    </CardTitle>
                  </div>
                  <div className="flex  flex-col text-md text-slate-500 mt-0 whitespace-pre-line">
                    {`Looking for political documents from MFA-Press statements and Famous Politicians?
                    
                    You're doing that all by yourself? No way!
                    
                    I can craft search queries for you. This means that:`}
                    <ul>
                      <li>I can retrieve documents for you by writing a search query.</li>
                      <li>I can also search a Wikipedia summary of popular political figures.</li>
                    </ul>
                    {`Chat with me and let's see what we can do together! Yes, I'm a GenAI Chat model by the way.
                    
                    ←Look at the left for prompts that you can use!←
                    
                    ↓Or Look down to start chatting with me about anything related to politics!↓`}   
                  </div>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="search">
              <Card className="h-92 shadow-none">
                <CardHeader>
                <div className="flex items-center justify-center space-x-2">
                    <CardTitle className="text-4xl">
                      {"Alright, I understand, you want to do it yourself."}
                    </CardTitle>
                  </div>
                  <div className="text-md text-slate-500 mt-0 whitespace-pre-line">
                    {`That's alright, you can do it yourself. Before you go, I'm going to let you know some details.
                    
                    We have these documents in our Elasticsearch Instance:

                    1. MFA-Press statements
                    These statements were scraped from the Ministry of Foreign Affairs (MFA) Press Statements. These statements document the foreign affairs of Singapore. 
                    If you would like to, you can visit the website here: `}<a href="https://www.mfa.gov.sg/Newsroom/Press-Statements-Transcripts-and-Photos">MFA Press</a>

                    {`

                    2. Famous Politicians
                    These documents are a summary of the top section of the wikipedia page of the famous politicians.
                    The data has been collected by taking the names of the politicians from Singapore, Australia, Indonesia, China, Malaysia, India, Vietnam and Japan.
                    These countries match with the MFA-Press Statements that we store, which is why the selection of countries are as such.
                    Using these names, we scrape the top part of wikipedia, providing an overview of the politician.

                    Simply look to the left. You can start searching by entering the fields accordingly.`}   
                  </div>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      {tabState.tab === "chat" && (
              <Input
              placeholder={tabState.placeholder}
              description={tabState.description}
              submitMessage={async (message) => {
                  const chatId = Date.now();
                  const url = `/chat/${chatId}?message=${encodeURIComponent(message!)}`
                  console.log(`url: ${url}`)
                  router.push(url);
                  }}
            />
        
      )}
    </>
  );
}
