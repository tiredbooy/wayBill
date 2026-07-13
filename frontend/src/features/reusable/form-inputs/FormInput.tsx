import {
  type Control,
  Controller,
  type FieldValues,
  type FieldPathValue,
  type Path,
} from "react-hook-form";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  step?: string;
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  error,
  label,
  icon,
  placeholder,
  type = "text",
  step,
  disabled,
  className,
  multiline = false,
  rows = 3,
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
        defaultValue={"" as FieldPathValue<T, Path<T>>}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>{LabelContent}</FormLabel>
            <FormControl>
              {multiline ? (
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={rows}
                  placeholder={placeholder}
                  disabled={disabled}
                />
              ) : (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  type={type}
                  step={step}
                  placeholder={placeholder}
                  disabled={disabled}
                />
              )}
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
      {multiline ? (
        <Textarea rows={rows} placeholder={placeholder} disabled={disabled} />
      ) : (
        <Input type={type} placeholder={placeholder} disabled={disabled} />
      )}
    </div>
  );
}
