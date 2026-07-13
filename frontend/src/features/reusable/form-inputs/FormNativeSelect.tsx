import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface SelectOption {
  label: string;
  value: string;
}

interface FormNativeSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
}

export function FormNativeSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "انتخاب کنید",
  error,
  className,
}: FormNativeSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <select
              {...field}
              value={field.value ?? ""}
              aria-invalid={Boolean(error)}
              className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormControl>
          {error && <span className="text-destructive text-sm">{error}</span>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
