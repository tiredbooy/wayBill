import { FormCommandSelect } from "@/features/reusable/form-inputs/CommandSelect";

interface EntitySelectorProps {
  control: any;
  name: string;
  label: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  onAddNew: () => void;
  loading: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

export function EntitySelector({
  control,
  name,
  label,
  searchValue,
  onSearchChange,
  options,
  onAddNew,
  loading,
  disabled,
  placeholder,
  error,
}: EntitySelectorProps) {
  return (
    <FormCommandSelect
      control={control}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      name={name}
      label={label}
      options={options}
      onAddNew={onAddNew}
      loading={loading}
      disabled={disabled}
      placeholder={placeholder}
      error={error}
    />
  );
}
