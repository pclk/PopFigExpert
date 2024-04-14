"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";

export default function ModelDropdown() {
  const [modelDisplay, setModelDisplay] = useState("GPT 3.5 Turbo");

  const handleModelChange = (model: string) => {
    const modelDisplay = model === "gpt-3.5-turbo" ? "GPT 3.5 Turbo" : "Mixtral 7x8b";
    setModelDisplay(modelDisplay);
  };

  return (
    <div className="sticky left-0 top-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-none font-inter text-darkprim hover:bg-secondary active:bg-primary active:text-white"
          >
            {modelDisplay}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Your model of choice</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={modelDisplay} onValueChange={handleModelChange}>
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
  );
}