import {
  type Control,
  type FieldValues,
  type Path,
  Controller,
} from "react-hook-form";
import { JalaliDatePicker } from "./JalaliDatePicker";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  outputType?: "date" | "iso" | "timestamp";
};

export function FormJalaliDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  outputType = "iso",
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          {label && <label className="block mb-2">{label}</label>}
          <JalaliDatePicker
            outputType={outputType}
            value={field.value}
            onChange={field.onChange}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        </div>
      )}
    />
  );
}
