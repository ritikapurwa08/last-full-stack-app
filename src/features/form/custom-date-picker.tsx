import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the date picker CSS
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import CalendarSvg from "../../../public/assets/icons/calendar.svg";
import Image from "next/image";
import { format, parseISO } from "date-fns"; // Import date-fns functions

interface CustomDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
  showTimeSelect?: boolean;
  dateFormat?: string;
  timeFormat?: string;
  timeIntervals?: number;
}

export default function CustomDatePicker<T extends FieldValues>({
  name,
  className,
  placeholder,
  disabled,
  label,
  control,
  defaultValue,
  showTimeSelect = true, // Enable time selection by default
  dateFormat = "MM/dd/yyyy h:mm aa", // Date and time format
  timeFormat = "h:mm aa", // Time format
  timeIntervals = 15, // Time dropdown intervals in minutes
}: Readonly<CustomDatePickerProps<T>>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  // Format today's date for the placeholder
  const today = new Date();
  const placeholderText = placeholder || format(today, "MM/dd/yyyy h:mm aa");

  // Convert ISO string to Date for the DatePicker
  const selectedDate = field.value ? parseISO(field.value) : null;

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Convert the date to an ISO string (e.g., "2023-10-10T14:30:00.000Z")
      const dateString = date.toISOString();
      field.onChange(dateString); // Pass the ISO string to the form
    } else {
      field.onChange(""); // Handle null case (optional)
    }
  };

  // Format the selected date for display
  const displayValue = selectedDate
    ? format(selectedDate, "MM/dd/yyyy h:mm aa")
    : "";

  return (
    <FormItem className={cn("flex flex-col gap-y-1", className)}>
      {/* Form Label */}
      <FormLabel className="text-sm font-medium text-dark-500">
        {label}
      </FormLabel>

      {/* Date Picker */}
      <FormControl>
        <div className="flex rounded-md border">
          <Image
            src={CalendarSvg}
            height={24}
            width={24}
            alt="calendar"
            className="ml-2"
          />
          <ReactDatePicker
            showTimeSelect={showTimeSelect} // Enable time selection
            selected={selectedDate} // Pass the Date object
            onChange={handleDateChange} // Handle date change
            timeInputLabel="Time:"
            dateFormat={dateFormat} // Date and time format
            timeFormat={timeFormat} // Time format
            timeIntervals={timeIntervals} // Time dropdown intervals
            wrapperClassName="date-picker"
            placeholderText={placeholderText} // Show today's date as placeholder
            disabled={disabled}
            className="w-full p-2 bg-transparent outline-none"
            value={displayValue} // Display the formatted date
          />
        </div>
      </FormControl>

      {/* Error Message */}
      <FormMessage className="text-xs text-red-600">
        {error?.message && <span>{error.message}</span>}
      </FormMessage>
    </FormItem>
  );
}
