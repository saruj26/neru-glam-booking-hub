
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  bookedDates?: Date[];
  userBookedDates?: Date[];
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  bookedDates = [],
  userBookedDates = [],
  ...props
}: CalendarProps) {
  // Function to determine if a date is booked by others
  const isBookedByOthers = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.getDate() === date.getDate() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getFullYear() === date.getFullYear()
    );
  };

  // Function to determine if a date is booked by the current user
  const isBookedByUser = (date: Date) => {
    return userBookedDates.some(
      (userDate) =>
        userDate.getDate() === date.getDate() &&
        userDate.getMonth() === date.getMonth() &&
        userDate.getFullYear() === date.getFullYear()
    );
  };

  const getDayClass = (date: Date) => {
    if (isBookedByOthers(date)) return "booked-by-others";
    if (isBookedByUser(date)) return "booked-by-user";
    return "";
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        day_booked_by_others: "bg-red-200 text-red-800 hover:bg-red-300",
        day_booked_by_user: "bg-green-200 text-green-800 hover:bg-green-300",
        ...classNames,
      }}
      modifiers={{
        "booked-by-others": (date) => isBookedByOthers(date),
        "booked-by-user": (date) => isBookedByUser(date),
      }}
      modifiersStyles={{
        "booked-by-others": { 
          backgroundColor: "#ffcdd2", 
          color: "#d32f2f", 
          fontWeight: "bold" 
        },
        "booked-by-user": { 
          backgroundColor: "#c8e6c9", 
          color: "#2e7d32", 
          fontWeight: "bold" 
        },
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
