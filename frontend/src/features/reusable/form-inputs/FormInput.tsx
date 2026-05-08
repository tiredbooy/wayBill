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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FormInputProps<T extends FieldValues> {
  control?: Control<T>;
  name?: Path<T>;
  error?: string;
  label: string;
  icon?: ReactNode;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  disabled?: boolean;
  className?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  error,
  label,
  icon,
  placeholder,
  type = "text",
  disabled,
  className,
}: FormInputProps<T>) {
  const LabelContent = (
    <div className="flex items-center gap-2">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <span>{label}</span>
    </div>
  );

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={"" as any}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>{LabelContent}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
              />
            </FormControl>
            {error && <span className="text-destructive text-sm">{error}</span>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">{LabelContent}</label>
      <Input type={type} placeholder={placeholder} disabled={disabled} />
    </div>
  );
}
