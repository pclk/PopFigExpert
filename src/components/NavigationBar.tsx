"use client";
import { IconMenu2, IconMessages } from "@tabler/icons-react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { examplePrompts } from "@/app/page";
import TextareaAutosize from "react-textarea-autosize";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { useUserInput, useArticleSearch, useProfileSearch } from "@/app/stores";

export default function NavigationBar() {
  const router = useRouter();
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const {userInput, setUserInput} = useUserInput()
  const {articleSearch, setArticleSearch} = useArticleSearch()
  const {profileSearch, setProfileSearch} = useProfileSearch()

  const toggleNavBar = () => setIsNavBarOpen((prevState) => !prevState);

  const handleFilterEnter = () => {
    let searchParams = "";
    if (articleSearch.title) {
      searchParams += `title=${articleSearch.title}&`;
    }
    if (articleSearch.startDate) {
      searchParams += `startDate=${articleSearch.startDate}&`;
    }
    if (articleSearch.endDate) {
      searchParams += `endDate=${articleSearch.endDate}&`;
    }
    if (articleSearch.country) {
      searchParams += `country=${articleSearch.country}&`;
    }
    if (articleSearch.content) {
      searchParams += `content=${articleSearch.content}&`;
    }
    router.push(`/document?${searchParams}`);
  };


  return (
    <>
      <IconMenu2
        className="fixed right-4 top-4 z-10 lg:hidden"
        onClick={toggleNavBar}
      />

      <nav
        className={`fixed left-0 top-0 z-20 box-border h-full w-80 overflow-y-auto flex-shrink-0 transform bg-secondary p-4 text-darkprim shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isNavBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <>
            <div className="flex justify-between rounded-sm">
              <button
                className="group w-full rounded-md border-0 bg-secondary text-sm transition-all hover:bg-white hover:shadow-md active:bg-primary active:text-white"
                onClick={() => router.push("/")}
              >
                <div className="flex items-center group-active:text-white">
                  <Image
                    src="/ProcoLink.png"
                    alt="Chatbot"
                    width={40}
                    height={40}
                    className="mr-4"
                  />
                  {/* <IconMessages className="mr-4 size-7 fill-darkprim group-hover:fill-white group-active:fill-primary" /> */}
                  <div className="font-inter text-lg font-semibold">
                    ProcoLink{" "}
                    <div className="hidden group-hover:inline">
                      (Home button)
                    </div>
                  </div>
                </div>
              </button>
            </div>
            <hr className="w-full border-[-1px] border-solid border-darkprim" />
            <div className="flex flex-col gap-8 mt-8">
              <Card className="shadow-none">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/chatbot.jpg"
                      alt="Chatbot Avatar"
                      width={50}
                      height={50}
                    />
                    <CardTitle className="m-0">
                      Chat with
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {" "}Eve
                      </span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                  {Object.entries(examplePrompts).map(([key, prompt]) => (
                    <Button
                      key={key}
                      className="h-auto text-wrap hover:bg-secondary active:bg-primary active:text-white"
                      variant="ghost"
                      onClick={() => {
                        setUserInput(prompt);
                      }}
                    >
                      {key}
                    </Button>
                  ))}
                </CardContent>
              </Card>
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="m-0">Article search</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1">
                  <label className="mb-1">Date Range</label>
                  <DatePickerWithRange className="rounded-sm border border-primary font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary" />
                  <label className="mt-3 mb-1">Title</label>
                  <TextareaAutosize
                    className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
                    placeholder="Title"
                    value={articleSearch.title ? articleSearch.title : ""}
                    minRows={1}
                    cacheMeasurements={true}
                    onChange={(e) => setArticleSearch({...articleSearch, title: e.target.value})}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFilterEnter();
                      }
                    }}
                  />
                  <label className="mt-3 mb-1">Country</label>
                  <TextareaAutosize
                    className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
                    placeholder="Country"
                    value={articleSearch.country ? articleSearch.country : ""}
                    minRows={1}
                    cacheMeasurements={true}
                    onChange={(e) => setArticleSearch({...articleSearch, country: e.target.value})}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFilterEnter();
                      }
                    }}
                  />
                  <label className="mt-3 mb-1">Content</label>
                  <TextareaAutosize
                    className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
                    placeholder="Content"
                    value={articleSearch.content ? articleSearch.content : ""}
                    minRows={1}
                    cacheMeasurements={true}
                    onChange={(e) => setArticleSearch({...articleSearch, content: e.target.value})}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFilterEnter();
                      }
                    }}
                  />
                  <div className="mt-3 mb-1"></div>
                  <Button
                    onClick={handleFilterEnter}
                    className="border-none bg-primary text-darkprim hover:bg-darkprim hover:text-white active:bg-secondary active:text-darkprim"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>
                    Search
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle className="m-0">Profile Search</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1">
                  <label className="mb-1">Name</label>
                  <TextareaAutosize
                    className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
                    placeholder="Name"
                    value={profileSearch ? profileSearch : ""}
                    minRows={1}
                    cacheMeasurements={true}
                    onChange={(e) => setProfileSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // handleProfileSearch();
                      }
                    }}
                  />
                  <div className="mt-3 mb-1"></div>
                  <Button
                    onClick={handleFilterEnter}
                    className="border-none bg-primary text-darkprim hover:bg-darkprim hover:text-white active:bg-secondary active:text-darkprim"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>
                    Search
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        </div>
      </nav>
    </>
  );
}
