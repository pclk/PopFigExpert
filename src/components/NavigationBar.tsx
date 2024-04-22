"use client";
import { IconMenu2, IconMessages } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { HistoryType } from "../lib/validators/HistoryType";
import { useActions } from "ai/rsc";
import { useState } from "react";

interface NavigationBarProps {
  isDocumentPage: boolean;
  chatHistory: HistoryType[];
}

export default function NavigationBar({
  isDocumentPage,
  chatHistory,
}: NavigationBarProps) {
  const { addHistory } = useActions();

  const handleNewChat = () => {
    const newHistory: HistoryType = {
      id: nanoid(),
      label: "New Chat",
      messages: [],
    };
    addHistory(newHistory);
  };
  const [isNavBarOpen, setIsNavBarOpen] = useState(false);

  const toggleNavBar = () => setIsNavBarOpen((prevState) => !prevState);

  return (
    <>
      <IconMenu2
        className="fixed right-4 top-4 z-10 lg:hidden"
        onClick={toggleNavBar}
      />

      <nav
        className={`fixed left-0 top-0 flex-shrink-0 z-20 box-border h-full w-72 transform bg-secondary p-4 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isNavBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {isDocumentPage ? (
            // Render the navigation bar for the document page
            <div>
              {/* Display previous searches performed on the document page */}
              <h3>Previous Searches</h3>
              {/* Render the list of previous searches */}
            </div>
          ) : (
            // Render the navigation bar for other pages
            <>
              <div className="flex justify-between rounded-sm">
                <button
                  className="group w-full rounded-md border-0 bg-secondary p-2 text-sm transition-all hover:bg-white hover:shadow-md active:bg-primary active:text-white"
                  onClick={handleNewChat}
                >
                  <div className="flex items-center group-active:text-white">
                    <IconMessages className="mr-4 size-7 fill-darkprim group-hover:fill-white group-active:fill-primary" />
                    New Chat
                  </div>
                </button>
              </div>
              <hr className="w-full border-[-1px] border-solid border-darkprim" />
              {chatHistory.map((history, index) => (
                <a
                  key={index}
                  href={`/chat/${history.id}`}
                  className="mb-2 truncate rounded-md p-2 no-underline transition-all hover:bg-white hover:shadow-md active:bg-primary active:text-white"
                >
                  {String(history.label)}
                </a>
              ))}
            </>
          )}
        </div>
      </nav>
    </>
  );
}
