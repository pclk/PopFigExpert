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
import { useActions } from "ai/rsc";
import { useModelContext } from "@/context/ModelContext";

export default function ModelDropdown() {
  const { changeModel } = useActions();
  const { modelType, setModelType } = useModelContext();

  useEffect(() => {
    changeModel(modelType);
  }, [modelType, changeModel]);

  const handleModelChange = (model: string) => {
    setModelType(model);
  };

  return (
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
  );
}