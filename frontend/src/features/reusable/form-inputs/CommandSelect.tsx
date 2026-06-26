import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface FormCommandSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options?: Option[];
  searchValue?: string;
  onSearchChange?: (search: string) => void;
  onAddNew?: (search: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

export function FormCommandSelect<T extends FieldValues>({
  control,
  searchValue,
  name,
  label,
  options,
  onSearchChange,
  onAddNew,
  loading = false,
  disabled = false,
  placeholder,
  error,
}: FormCommandSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const isDisabled = loading || disabled;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="space-y-2">
          <label className="text-sm font-medium">{label}</label>
          <Popover open={open && !isDisabled} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={isDisabled}>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between font-normal",
                  !field.value && "text-muted-foreground",
                  error && "border-destructive",
                )}
                disabled={isDisabled}
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال بارگذاری...
                  </>
                ) : (
                  options?.find((o) => o.value === field.value)?.label ??
                    placeholder ?? "انتخاب کنید"
                )}
              </Button>
            </PopoverTrigger>
            {!isDisabled && (
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="جستجو..."
                    value={searchValue}
                    onValueChange={(v: string) => onSearchChange?.(v)}
                  />
                  <CommandEmpty>موردی یافت نشد</CommandEmpty>
                  <CommandGroup>
                    {options?.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          field.onChange(option.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "ml-2 h-4 w-4",
                            field.value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                    {onAddNew && (
                      <CommandItem
                        onSelect={() => {
                          onAddNew("");
                          setOpen(false);
                        }}
                      >
                        <Plus className="ml-2 h-4 w-4" />
                        افزودن مورد جدید
                      </CommandItem>
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            )}
          </Popover>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
      )}
    />
  );
}
