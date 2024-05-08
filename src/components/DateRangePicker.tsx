// DateRangePicker.tsx
import * as React from "react";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { articleSearchType, profileSearchType } from "@/app/stores";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  store: articleSearchType | profileSearchType | null;
  setStore: (date: articleSearchType | profileSearchType) => void;
  setOtherStore: (date: articleSearchType | profileSearchType) => void;
}

export function DatePickerWithRange({
  className,
  store,
  setStore,
  setOtherStore
}: DatePickerWithRangeProps) {

  

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal border-solid p-2 border-primary rounded-sm",
              !store?.startDate && "text-muted-foreground",
            )}
          >
            {store?.startDate ? (
              store?.endDate ? (
                <>
                  {format(store.startDate, "LLL dd, y")} -{" "}
                  {format(store.endDate, "LLL dd, y")}
                </>
              ) : (
                format(store.startDate, "LLL dd, y")
              )
            ) : (
              <span className="text-slate-500">Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar store={store} setStore={setStore} setOtherStore={setOtherStore} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
