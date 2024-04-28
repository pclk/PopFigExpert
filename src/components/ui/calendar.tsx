"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DayPicker } from "react-day-picker";
import { useState } from "react";
import { useQueryState } from "nuqs";
import { format } from 'date-fns';


import "react-datepicker/dist/react-datepicker.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames }: CalendarProps) {
  const [startDate, setStartDate] = useQueryState("startDate");
  const [endDate, setEndDate] = useQueryState("endDate");

  const handleDateChange = (date: Date | null, start: boolean) => {
    const dateString = date ? format(date, "LLL dd, y") : "";
    if (start) {
      setStartDate(dateString);
    } else {
      setEndDate(dateString);
    }
  };

  return (
    <div className="flex space-x-2 bg-white p-6">
      <div>
        <p>Start Date</p>
        <DatePicker
          selected={startDate as Date|null}
          onChange={(date) => handleDateChange(date, true)}
          selectsStart
          startDate={startDate as Date|null}
          endDate={endDate as Date|null}
        />
      </div>
      <div>
        <p>End Date</p>
        <DatePicker
          selected={endDate as Date|null}
          onChange={(date) => handleDateChange(date, false)}
          selectsEnd
          startDate={startDate as Date|null}
          endDate={endDate as Date|null}
          minDate={startDate as Date|null}
        />
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
