"use client";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import { useQueryState } from "nuqs";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Input from "@/components/Input";

interface Props {
  description: string;
  handleSubmit: () => void;
}

export default function DocumentSearch({ description, handleSubmit }: Props) {
  const [titleFilter, setTitleFilter] = useQueryState("title");
  const [countryFilter, setCountryFilter] = useQueryState("country");
  const [contentFilter, setContentFilter] = useQueryState("content");

  return (
    <div className="sticky bottom-0 left-0 w-full bg-white">
      <div className="mb-2"></div>
      <div className="mb-4">
        <div className="grid grid-rows-1 gap-4 lg:grid-cols-3">
          <DatePickerWithRange className="rounded-sm border border-primary font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary" />
          <TextareaAutosize
            className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder="Title"
            value={titleFilter ? titleFilter : ""}
            onChange={(e) => setTitleFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <TextareaAutosize
            className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder="Country"
            value={countryFilter ? countryFilter : ""}
            onChange={(e) => setCountryFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </div>
      </div>
      <Input
        placeholder={"Enter your content..."}
        description={description}
        clearInput={false}
        submitMessage={handleSubmit}
        value={contentFilter as string}
        onChange={(e) => setContentFilter((e.target as HTMLInputElement).value)}
      />
    </div>
  );
}
