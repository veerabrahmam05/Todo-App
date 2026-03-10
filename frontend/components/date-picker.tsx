"use client";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    date: Date;
    setDate: (val: Date) => void;
}

export function DatePicker({
    date,
    setDate,
}: DatePickerProps) {

  return (
    <Field className="mx-auto w-44">
      {/* <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-simple"
            className="justify-start font-normal"
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            required
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
