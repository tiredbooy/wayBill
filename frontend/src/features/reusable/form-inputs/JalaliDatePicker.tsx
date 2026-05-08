import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { startOfDay } from "date-fns";
import { CiCalendar } from "react-icons/ci";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as PersianCalendar } from "@/components/ui/persian-calendar";

type OutputType = "date" | "iso" | "timestamp";

type Props = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (value?: string | number | Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  error?: boolean;
  helperText?: string;
  outputType?: OutputType;
  className?: string;
};

export function JalaliDatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = "انتخاب تاریخ",
  disabled,
  minDate,
  maxDate,
  error,
  helperText,
  outputType = "date",
  className,
}: Props) {
  const [internalValue, setInternalValue] = useState<Date | undefined>(
    defaultValue
  );
  const [open, setOpen] = useState(false);

  const isControlled = value !== undefined;
  const selected = isControlled ? value : internalValue;

  const formatOutput = (date?: Date) => {
    if (!date) return undefined;

    const normalized = startOfDay(date);

    switch (outputType) {
      case "iso":
        return normalized.toISOString();
      case "timestamp":
        return normalized.getTime();
      default:
        return normalized;
    }
  };

  const handleChange = (date?: Date) => {
    if (!isControlled) {
      setInternalValue(date);
    }

    onChange?.(formatOutput(date));
    setOpen(false);
  };

  const label = selected
    ? format(selected, "yyyy/MM/dd", { locale: faIR })
    : placeholder;

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={`w-full justify-between ${
              error ? "border-red-500" : ""
            }`}
            disabled={disabled}
          >
            <span className={!selected ? "text-muted-foreground" : ""}>
              {label}
            </span>
            <CiCalendar className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-2" align="start">
          <PersianCalendar
            mode="single"
            selected={selected}
            onSelect={handleChange}
            disabled={(date: Date) =>
              (minDate && date < minDate) ||
              (maxDate && date > maxDate)
            }
            className="rounded-md"
          />

          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => handleChange(undefined)}
            >
              حذف
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleChange(new Date())}
            >
              امروز
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {helperText && (
        <p
          className={`text-sm mt-1 ${
            error ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
