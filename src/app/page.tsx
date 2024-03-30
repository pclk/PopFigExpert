'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SetStateAction, useState } from "react"

export default function Home() {
  const [activeButton, setActiveButton] = useState("")

  const handleButtonClick = (buttonName: SetStateAction<string>) => {
    setActiveButton(buttonName)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Tabs defaultValue="chat" >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat with Eve</TabsTrigger>
          <TabsTrigger value="search">Manual Document Search</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Hey there! I'm Eve!</CardTitle>
              <CardDescription>
                I can help you summarize reports! Here are some prompts to get started:
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="ghost">I want a report summary of [xxx]</Button>
              <Button variant="ghost">I want a report summary of [xxx]</Button>
              <Button variant="ghost">I want a report summary of [xxx]</Button>
              <Button variant="ghost">I want a report summary of [xxx]</Button>
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
            <CardContent className="grid grid-flow-col grid-rows-2 gap-4">
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("content")}
                className={activeButton === "content" ? "bg-teal-400" : ""}
              >
                Content
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("date")}
                className={activeButton === "date" ? "bg-teal-400" : ""}
              >
                Date
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("title")}
                className={activeButton === "title" ? "bg-teal-400" : ""}
              >
                Title
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("country")}
                className={activeButton === "country" ? "bg-teal-400" : ""}
              >
                Country
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleButtonClick("url")}
                className={activeButton === "url" ? "bg-teal-400" : ""}
              >
                URL
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}