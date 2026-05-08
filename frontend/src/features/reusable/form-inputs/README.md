# Form Components Documentation

This folder contains reusable form components built with:

- React
- TypeScript
- React Hook Form
- Zod
- Shadcn UI

All components are:

- Fully generic
- Feature independent
- Type safe
- Controlled-safe (no uncontrolled warnings)
- Production ready
- Extendable

---

# 1️⃣ FormInput

Reusable text input component.

## Features

- React Hook Form support
- Prevents uncontrolled/controlled warning
- Can be used without RHF
- Supports icon inside label
- Fully generic

## Props

| Prop | Type | Description |
|------|------|------------|
| control | Control<T> | RHF control |
| name | Path<T> | Field name |
| label | string | Label text |
| icon | ReactNode | Optional icon inside label |
| placeholder | string | Placeholder |
| type | string | Input type |
| disabled | boolean | Disable input |
| className | string | Additional classes |

---

# 2️⃣ FormDatePicker

Reusable Jalali Date Picker.

## Features

- Persian calendar support
- RTL layout
- RHF compatible
- Stores standard JS Date object
- Prevents uncontrolled warnings
- Supports icon inside label

## Props

| Prop | Type | Description |
|------|------|------------|
| control | Control<T> | RHF control |
| name | Path<T> | Field name |
| label | string | Label text |
| icon | ReactNode | Optional icon |
| disabled | boolean | Disable picker |

---

# Important Notes

1. Always define `defaultValues` in `useForm`.
2. Text inputs should have empty string "" as default.
3. Date fields should have `null` as default.
4. Components are fully decoupled from business logic.
5. Removing a field will not break the form.

---

# Future Improvements

- Multi Select
- Async Select
- File Upload
- Masked Input
- Schema-driven form engine
- FormProvider abstraction layer
