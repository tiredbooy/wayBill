// app/settings/page.tsx
"use client";

import { useEffect, useCallback } from "react";
import {
  useForm,
  type Resolver,
  type FieldNamesMarkedBoolean,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useSetting,
  useUpdateSetting,
} from "@/_libs/services/queries/setting.queries";
import type { SettingInput } from "@/_libs/types/setting-types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/useDebounce";

const settingSchema = z.object({
  company_name: z.string().min(1, "نام شرکت الزامی است"),
  address: z.string().optional(),
  contact: z.object({
    mobile: z.string().optional(),
    fixed: z.string().optional(),
    email: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")),
    website: z.string().optional().or(z.literal("")),
  }),
  commission_rate: z.coerce.number().min(0, "حداقل ۰٪").max(100, "حداکثر ۱۰۰٪"),
  preferred_theme: z.enum(["light", "dark", "system"]),
});

type FormValues = z.infer<typeof settingSchema>;

function pickDirty<T extends Record<string, any>>(
  allValues: T,
  dirtyFields: FieldNamesMarkedBoolean<T>,
): Partial<T> {
  const result: any = {};
  for (const key in dirtyFields) {
    if (!dirtyFields[key]) continue;

    if (typeof dirtyFields[key] === "object" && dirtyFields[key] !== null) {
      // Nested object – recurse
      const nestedDirty = dirtyFields[key] as FieldNamesMarkedBoolean<any>;
      const nestedValues = allValues[key] as Record<string, any>;
      result[key] = pickDirty(nestedValues, nestedDirty);
    } else {
      // leaf field – include the current value
      result[key] = allValues[key];
    }
  }
  return result;
}

function apiToFormValues(apiData: SettingInput): FormValues {
  return {
    company_name: apiData?.company_name || "",
    address: apiData.address || "",
    contact: {
      mobile: apiData?.contact?.mobiles?.join(", ") || "",
      fixed: apiData?.contact?.fixed || "",
      email: apiData?.contact?.email || "",
      website: apiData?.contact?.website || "",
    },
    commission_rate: apiData?.commission_rate || 0,
    preferred_theme: apiData.preferred_theme as "light" | "dark" | "system",
  };
}

export default function SettingsPage() {
  const { data: settings, isLoading, error } = useSetting();
  const updateMutation = useUpdateSetting();

  const form = useForm<FormValues>({
    resolver: zodResolver(settingSchema) as Resolver<FormValues>,
    defaultValues: {
      company_name: "",
      address: "",
      contact: { mobile: "", fixed: "", email: "", website: "" },
      commission_rate: 0,
      preferred_theme: settings?.preferred_theme || "light",
    },
  });

  useEffect(() => {
    if (settings) {
      const formValues = apiToFormValues(settings);
      form.reset(formValues);
    }
  }, [settings, form]);

  const debouncedSave = useDebouncedCallback(
    async (dirtyPayload: Partial<SettingInput>) => {
      try {
        const currentValues = form.getValues();

        // Build the full contact object using all current form values
        // because the backend expects a complete ContactInfo block.
        const contactPayload = dirtyPayload.contact
          ? {
              mobiles: currentValues.contact.mobile
                ? currentValues.contact.mobile
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== "")
                : [],
              fixed: currentValues.contact.fixed || "",
              email: currentValues.contact.email || "",
              website: currentValues.contact.website || "",
            }
          : undefined;

        const payload: Partial<SettingInput> = {
          ...dirtyPayload,
          contact: contactPayload,
          // Always coerce commission_rate to number (if you want to send it)
          commission_rate: Number(currentValues.commission_rate),
        };

        await updateMutation.mutateAsync(payload);
        toast.success("تنظیمات با موفقیت بروزرسانی شد.");
      } catch (err: unknown) {
        toast.error("مشکلی در ذخیره تنظیمات رخ داد.");
      }
    },
    { delay: 800, leading: false, trailing: true },
  );
  const handleFieldBlur = useCallback(async () => {
    // Validate the whole form first
    const isValid = await form.trigger();
    if (!isValid) return;

    // Get the dirty fields and current values
    const dirtyFields = form.formState.dirtyFields;
    const allValues = form.getValues();

    // Build a partial payload with only the changed fields
    const partialPayload = pickDirty(
      allValues,
      dirtyFields,
    ) as Partial<SettingInput>;

    // Only send if something actually changed
    if (Object.keys(partialPayload).length > 0) {
      debouncedSave(partialPayload);
    }
  }, [form, debouncedSave]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <p className="text-destructive">خطا در دریافت تنظیمات</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">تنظیمات بارنامه</h1>
        <p className="text-muted-foreground">
          اطلاعات شرکت، روش‌های ارتباطی و تنظیمات برنامه
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات شرکت</CardTitle>
              <CardDescription>
                نام، آدرس و دیگر جزئیات شرکت حمل و نقل
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام شرکت *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="مثال: بارنامه سریع"
                        {...field}
                        onBlur={handleFieldBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آدرس</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="آدرس کامل شرکت"
                        {...field}
                        onBlur={handleFieldBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>اطلاعات تماس</CardTitle>
              <CardDescription>شماره‌های تماس، ایمیل و وب‌سایت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="contact.mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره موبایل</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="مثال: 09123456789, 09129876543"
                        {...field}
                        onBlur={handleFieldBlur}
                      />
                    </FormControl>
                    <FormDescription>
                      در صورت چند شماره، با کاما (,) جدا کنید.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.fixed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تلفن ثابت</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
                        {...field}
                        onBlur={handleFieldBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="info@example.com"
                        {...field}
                        onBlur={handleFieldBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact.website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وب‌سایت</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        onBlur={handleFieldBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سایر تنظیمات</CardTitle>
              <CardDescription>نرخ کمیسیون و ظاهر برنامه</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="commission_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نرخ کمیسیون (درصد)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onBlur={handleFieldBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferred_theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تم برنامه</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setTimeout(handleFieldBlur, 0);
                      }}
                      defaultValue={field.value ?? "light"}
                      onOpenChange={() => setTimeout(handleFieldBlur, 100)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب تم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">روشن</SelectItem>
                        <SelectItem value="dark">تاریک</SelectItem>
                        <SelectItem value="system">پیش‌فرض سیستم</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const isValid = await form.trigger();
                if (isValid) {
                  debouncedSave.flush();
                }
              }}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
              ذخیره دستی
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
