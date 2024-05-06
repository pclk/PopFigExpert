"use client";

import DatePicker from "react-datepicker";
import { DayPicker } from "react-day-picker";
import { useQueryState } from "nuqs";

import "react-datepicker/dist/react-datepicker.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames }: CalendarProps) {
  const [startDate, setStartDate] = useQueryState("startDate");
  const [endDate, setEndDate] = useQueryState("endDate");

  // Convert ISO string to Date object or null
  const startDateDate = startDate ? new Date(startDate) : null;
  const endDateDate = endDate ? new Date(endDate) : null;

  const handleDateChange = (date: Date | null, start: boolean) => {
    const dateString = date ? date.toISOString() : "";
    if (start) {
      setStartDate(dateString);
    } else {
      setEndDate(dateString);
    }
  };

  return (
    <div className="flex space-x-2 bg-white pl-10 px-6 pb-6">
      <div>
        <p>Start Date</p>
        <DatePicker
          selected={startDateDate}
          onChange={(date) => handleDateChange(date, true)}
          selectsStart
          className="w-20"
        />
      </div>
      <div>
        <p>End Date</p>
        <DatePicker
          selected={endDateDate}
          onChange={(date) => handleDateChange(date, false)}
          selectsEnd
          startDate={startDateDate}
          endDate={endDateDate}
          minDate={startDateDate}
          className="w-20"
        />
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
