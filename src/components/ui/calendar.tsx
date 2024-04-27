"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker"
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DayPicker } from "react-day-picker";
import { useState } from "react";
import { useQueryState } from "nuqs";

import "react-datepicker/dist/react-datepicker.css"

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
}: CalendarProps) {
  const [startDate, setStartDate] = useQueryState("startDate");
  const [endDate, setEndDate] = useQueryState("endDate");
  return (
    <div className="bg-white p-6 flex space-x-2">
      <div>
        <p>Start Date</p>      
        <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      </div>
      <div>
        <p>End Date</p>
        <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
      </div>
    </div>
  );
};
Calendar.displayName = "Calendar";

export { Calendar };
