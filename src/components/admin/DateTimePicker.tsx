"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Extract hours and minutes from current value
  const hours = value ? value.getHours().toString().padStart(2, "0") : "12";
  const minutes = value ? value.getMinutes().toString().padStart(2, "0") : "00";

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Preserve existing time when selecting a new date
      const newDate = new Date(date);
      if (value) {
        newDate.setHours(value.getHours());
        newDate.setMinutes(value.getMinutes());
      } else {
        newDate.setHours(12);
        newDate.setMinutes(0);
      }
      onChange(newDate);
    } else {
      onChange(undefined);
    }
  };

  const handleTimeChange = (type: "hours" | "minutes", val: string) => {
    const numVal = parseInt(val, 10);
    if (isNaN(numVal)) return;

    const newDate = value ? new Date(value) : new Date();

    if (type === "hours") {
      if (numVal >= 0 && numVal <= 23) {
        newDate.setHours(numVal);
      }
    } else {
      if (numVal >= 0 && numVal <= 59) {
        newDate.setMinutes(numVal);
      }
    }

    onChange(newDate);
  };

  const handleClear = () => {
    onChange(undefined);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-warm-700/30 bg-warm-900/50 px-4 py-3 text-left text-warm-100 transition-colors hover:border-warm-600 focus:border-warm-500 focus:outline-none"
        >
          <span className={value ? "text-warm-100" : "text-warm-500"}>
            {value ? format(value, "PPP 'at' HH:mm") : placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 text-warm-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="border-t border-warm-700/30 p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-warm-300">Time:</span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={hours}
                onChange={(e) => handleTimeChange("hours", e.target.value)}
                onBlur={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (isNaN(val) || val < 0 || val > 23) {
                    handleTimeChange("hours", "12");
                  }
                }}
                className="w-12 rounded border border-warm-700/30 bg-warm-800 px-2 py-1.5 text-center text-sm text-warm-100 focus:border-warm-500 focus:outline-none"
                maxLength={2}
              />
              <span className="text-warm-400">:</span>
              <input
                type="text"
                value={minutes}
                onChange={(e) => handleTimeChange("minutes", e.target.value)}
                onBlur={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (isNaN(val) || val < 0 || val > 59) {
                    handleTimeChange("minutes", "00");
                  }
                }}
                className="w-12 rounded border border-warm-700/30 bg-warm-800 px-2 py-1.5 text-center text-sm text-warm-100 focus:border-warm-500 focus:outline-none"
                maxLength={2}
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="rounded px-3 py-1.5 text-sm text-warm-400 transition-colors hover:text-warm-200"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded bg-warm-700 px-3 py-1.5 text-sm text-warm-200 transition-colors hover:bg-warm-600"
            >
              Done
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
