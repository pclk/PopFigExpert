"use client";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { useActions } from "ai/rsc";

export default function FilterForm() {
  const [filterState, setFilterState] = useState({
    content: "",
    date: "",
    title: "",
    country: "",
  });
  const { handleFilterChange } = useActions();

  const handleFilterClick = () => {
    handleFilterChange(null, {
      get: (key: string) => filterState[key as keyof typeof filterState],
    } as unknown as FormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div>
      <TextareaAutosize
        placeholder="Content"
        name="content"
        value={filterState.content}
        onChange={handleInputChange}
      />
      {/* ... */}
      <Button onClick={handleFilterClick}>Apply Filters</Button>
    </div>
  );
}
