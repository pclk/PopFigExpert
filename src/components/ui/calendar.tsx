"use client";

import { articleSearchType, profileSearchType } from "@/app/stores";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
  store: articleSearchType | profileSearchType | null;
  setStore: (date: articleSearchType | profileSearchType) => void;
  setOtherStore: (date: articleSearchType | profileSearchType) => void;
}

function Calendar({ store, setStore, setOtherStore }: CalendarProps) {

  // Convert ISO string to Date object or null
  const startDateDate = store?.startDate ? new Date(store.startDate) : null;
  const endDateDate = store?.endDate ? new Date(store.endDate) : null;

  const handleDateChange = (date: Date | null, start: boolean) => {
    const dateString = date ? date.toISOString() : "";
    if (start) {
      setStore({ ...store, startDate: dateString });
    } else {
      setStore({ ...store, endDate: dateString });
    }
  };

  return (
    <div className="flex space-x-2 bg-white pl-10 px-6 pb-6">
      <div>
        <p>Start Date</p>
        <DatePicker
          selected={startDateDate}
          onChange={(date) => {
            handleDateChange(date, true);
            setOtherStore({});
          }}
          selectsStart
          className="w-20"
        />
      </div>
      <div>
        <p>End Date</p>
        <DatePicker
          selected={endDateDate}
          onChange={(date) => {
            handleDateChange(date, false);
            setOtherStore({});
          }}
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
