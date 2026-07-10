import type { WaybillDetail } from "../types/waybill-types";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName && cookieName === name) {
      return decodeURIComponent(cookieValue || "");
    }
  }

  return null;
}

export function convertToPersianDigits(
  input: number | string | null | undefined,
) {
  if (input == null) return "";
  const persianDigits: string[] = [
    "۰",
    "۱",
    "۲",
    "۳",
    "۴",
    "۵",
    "۶",
    "۷",
    "۸",
    "۹",
  ];
  return input
    .toString()
    .replace(/[0-9]/g, (digit: string) => persianDigits[parseInt(digit, 10)]);
}

// ---------- Helper functions (updated price words) ----------
export function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function formatNumber(num: number | null | undefined): string {
  if (num == null) return "—";
  return new Intl.NumberFormat("fa-IR").format(num);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function getDisplayWaybillNumber(waybill: WaybillDetail): string {
  if (!waybill.waybill_number || isUUID(waybill.waybill_number)) {
    return waybill.id?.toString() ?? "—";
  }
  return waybill.waybill_number;
}

const paymentStatusMap: Record<string, string> = {
  unpaid: "پرداخت نشده",
  partial: "پرداخت جزئی",
  paid: "پرداخت شده",
  refunded: "بازگشت وجه",
};

export function translatePaymentStatus(status: string | null): string {
  if (!status) return "—";
  return paymentStatusMap[status.toLowerCase()] || status;
}

export function convertToPersianWords(amount: number): string {
  if (amount === 0) return "صفر تومان";

  const units = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
  const teens = [
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
  ];
  const tens = [
    "",
    "",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
  ];
  const hundreds = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
  ];
  const groups = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

  function convertThreeDigits(num: number): string {
    if (num === 0) return "";
    const parts: string[] = [];
    const h = Math.floor(num / 100);
    const rest = num % 100;
    if (h > 0) parts.push(hundreds[h]);
    if (rest >= 10 && rest <= 19) {
      parts.push(teens[rest - 10]);
    } else {
      const t = Math.floor(rest / 10);
      const u = rest % 10;
      if (t > 1) parts.push(tens[t]);
      if (u > 0) parts.push(units[u]);
    }
    return parts.join(" و ");
  }

  const groupParts: string[] = [];
  let remaining = amount;
  let groupIndex = 0;
  while (remaining > 0) {
    const threeDigits = remaining % 1000;
    if (threeDigits !== 0) {
      const text = convertThreeDigits(threeDigits);
      const groupName = groups[groupIndex];
      groupParts.unshift(text + (groupName ? " " + groupName : ""));
    }
    remaining = Math.floor(remaining / 1000);
    groupIndex++;
  }

  return groupParts.join(" و ") + " تومان";
}
