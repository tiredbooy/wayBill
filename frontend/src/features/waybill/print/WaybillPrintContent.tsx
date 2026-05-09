import type { Setting } from "@/_libs/types/setting-types";
import type { WaybillDetail } from "@/_libs/types/waybill-types";
import {
  convertToPersianDigits,
  convertToPersianWords,
  formatNumber,
  getDisplayWaybillNumber,
  translatePaymentStatus,
} from "@/_libs/utils/helper";
import { forwardRef } from "react";

interface WaybillPrintContentProps {
  waybill: WaybillDetail;
  setting?: Setting;
}

export const WaybillPrintContent = forwardRef<
  HTMLDivElement,
  WaybillPrintContentProps
>(({ waybill, setting }, ref) => {
  const totalAmount = waybill.total_amount ?? 0;
  const priceWords = convertToPersianWords(totalAmount);

  const disclaimer = `بدینوسیله محموله صحیح و سالم تحویل شد و رضایت کامل حاصل است. راننده مسئول است در هنگام بارگیری آن را شمارش و موقع تحویل رسید دریافت کند. جهت حمل بارهای استاندارد با توافق طرفین خواهد بود. هرگونه جریمه ارتفاع بار ممنوع و به عهده صاحب کالا می‌باشد.`;

  const [phone1, phone2] = setting?.contact?.mobiles?.slice(0, 2) || [];
  console.log(`Phone 1: ${phone1} -- Phone 2: ${phone2}`);

  return (
    <div
      ref={ref}
      className="print:w-full print:max-w-none w-full bg-white p-4 print:p-5"
      style={{
        direction: "rtl",
        fontFamily: "Vazirmatn, Tahoma, sans-serif",
        fontSize: "12px",
        lineHeight: 1.45,
        color: "#1a1a1a",
      }}
    >
      {/* ========== HEADER (company left, waybill right) ========== */}
      <div className="relative mb-4 pt-6 pb-3 px-3 border border-gray-400 rounded-sm">
        <div
          className="absolute top-1.5 right-2 text-right bg-white px-2 py-1 rounded-sm"
          style={{ minWidth: "120px" }}
        >
          <div className="text-[9px] text-gray-500 mb-0.5">شماره بارنامه</div>
          <div
            className="text-sm font-extrabold text-gray-700 leading-tight"
            style={{ direction: "ltr" }}
          >
            {convertToPersianDigits(getDisplayWaybillNumber(waybill))}
          </div>
          {waybill.issue_date && (
            <div className="text-[9px] text-gray-500 print:text-gray-400 mt-1 pt-1 border-t border-gray-200 print:border-gray-300">
              <span className="font-medium">تاریخ: </span>
              <span style={{ direction: "ltr" }}>
                {new Date(waybill.issue_date).toLocaleDateString("fa-IR")}
              </span>
            </div>
          )}
        </div>

        {/* Centered company information */}
        <div className="text-center mt-2">
          {/* Document title */}
          <h1 className="text-base font-extrabold text-gray-800 mb-1">
            بارنامه
          </h1>

          {/* Company name (slightly larger) */}
          {setting?.company_name && (
            <h2 className="text-sm font-bold text-gray-900 mb-1">
              {setting.company_name}
            </h2>
          )}

          {/* Address */}
          {setting?.address && (
            <p className="text-[10px] text-gray-700 mb-1 max-w-md mx-auto">
              {setting.address}
            </p>
          )}

          {/* Contact – compact, without extra label */}
          {(phone1 || setting?.contact?.fixed) && (
            <p className="text-[10px] text-gray-700">
              {phone1 && <>تلفن: {convertToPersianDigits(phone1)}</>}
              {setting?.contact?.fixed && (
                <>
                  {" "}
                  &nbsp;|&nbsp; {convertToPersianDigits(setting.contact.fixed)}
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* ========== SENDER & RECEIVER (side‑by‑side on landscape) ========== */}
      <div className="grid grid-cols-1 print:grid-cols-2 gap-4 mb-5">
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <h3 className="font-bold text-sm border-r-4 border-blue-500 pr-2 mb-2">
            فرستنده
          </h3>
          <div className="space-y-1 text-[11px]">
            {waybill.sender && (
              <p>
                <span className="font-medium">نام / شرکت:</span>{" "}
                {waybill.sender}
              </p>
            )}
            {waybill.origin_location && (
              <p>
                <span className="font-medium">مبدا:</span>{" "}
                {waybill.origin_location}
              </p>
            )}
            {waybill.sender_phone_mobile && (
              <p>
                <span className="font-medium">تلفن همراه:</span>{" "}
                {convertToPersianDigits(waybill.sender_phone_mobile)}
              </p>
            )}
            {waybill.sender_phone_fixed && (
              <p>
                <span className="font-medium">تلفن ثابت:</span>{" "}
                {convertToPersianDigits(waybill.sender_phone_fixed)}
              </p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <h3 className="font-bold text-sm border-r-4 border-green-600 pr-2 mb-2">
            گیرنده
          </h3>
          <div className="space-y-1 text-[11px]">
            {waybill.receiver && (
              <p>
                <span className="font-medium">نام / شرکت:</span>{" "}
                {waybill.receiver}
              </p>
            )}
            {waybill.destination_location && (
              <p>
                <span className="font-medium">مقصد:</span>{" "}
                {waybill.destination_location}
              </p>
            )}
            {waybill.receiver_phone_mobile && (
              <p>
                <span className="font-medium">تلفن همراه:</span>{" "}
                {convertToPersianDigits(waybill.receiver_phone_mobile)}
              </p>
            )}
            {waybill.receiver_phone_fixed && (
              <p>
                <span className="font-medium">تلفن ثابت:</span>{" "}
                {convertToPersianDigits(waybill.receiver_phone_fixed)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ========== DRIVER & VEHICLE (side‑by‑side) ========== */}
      <div className="grid grid-cols-1 print:grid-cols-2 gap-4 mb-5">
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <h3 className="font-bold text-sm border-r-4 border-yellow-600 pr-2 mb-2">
            راننده
          </h3>
          <div className="space-y-1 text-[11px]">
            {waybill.driver && (
              <p>
                <span className="font-medium">نام:</span> {waybill.driver}
              </p>
            )}
            {waybill.driver_national_code && (
              <p>
                <span className="font-medium">کد ملی:</span>{" "}
                {convertToPersianDigits(waybill.driver_national_code)}
              </p>
            )}
            {waybill.driver_license_num && (
              <p>
                <span className="font-medium">گواهینامه:</span>{" "}
                {convertToPersianDigits(waybill.driver_license_num)}
              </p>
            )}
            {waybill.driver_phone_num && (
              <p>
                <span className="font-medium">تلفن همراه:</span>{" "}
                {convertToPersianDigits(waybill.driver_phone_num)}
              </p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <h3 className="font-bold text-sm border-r-4 border-purple-600 pr-2 mb-2">
            وسیله نقلیه
          </h3>
          <div className="space-y-1 text-[11px]">
            {waybill.vehicle_plate && (
              <p>
                <span className="font-medium">پلاک:</span>{" "}
                {convertToPersianDigits(waybill.vehicle_plate)}
              </p>
            )}
            {waybill.vehicle && (
              <p>
                <span className="font-medium">توضیحات:</span> {waybill.vehicle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ========== CARGO DETAILS ========== */}
      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-5">
        <h3 className="font-bold text-sm border-r-4 border-red-500 pr-2 mb-2">
          مشخصات محموله
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
          {waybill.total_weight != null && (
            <span>
              <span className="font-medium">وزن کل:</span>{" "}
              {formatNumber(waybill.total_weight)} کیلوگرم
            </span>
          )}
          {waybill.total_packages != null && (
            <span>
              <span className="font-medium">تعداد بسته‌ها:</span>{" "}
              {formatNumber(waybill.total_packages)} عدد
            </span>
          )}
          {waybill.description && (
            <span className="w-full">
              <span className="font-medium">شرح کالا:</span>{" "}
              {convertToPersianDigits(waybill.description)}
            </span>
          )}
        </div>
      </div>

      {/* ========== FINANCIAL ROW (one line) ========== */}
      <div className="bg-gray-100 p-2 rounded-md border border-gray-300 mb-5 flex flex-wrap justify-between items-center text-[11px] font-medium">
        <span>کرایه: {formatNumber(waybill.freight_charge ?? 0)} تومان</span>
        <span>
          بیمه:{" "}
          {waybill.have_insurance && waybill.insurance_amount != null
            ? `${formatNumber(waybill.insurance_amount)} تومان`
            : "ندارد"}
        </span>
        {waybill.other_charges && waybill.other_charges > 0 && (
          <span> سایر: {formatNumber(waybill.other_charges)} تومان</span>
        )}
        <span>
          وضعیت پرداخت:{" "}
          {translatePaymentStatus(waybill.payment_status ?? "unknown")}
        </span>
        <span className="text-black font-bold text-sm">
          مجموع: {formatNumber(totalAmount)} تومان
        </span>
      </div>
      <div className="text-[11px] text-gray-600 -mt-3 mb-4 text-left">
        {priceWords}
      </div>

      {/* ========== LEGAL DISCLAIMER ========== */}
      <div className="text-[10px] text-gray-600 leading-relaxed text-justify border-t border-gray-200 pt-3 mb-4">
        {disclaimer}
      </div>

      {/* ========== SIGNATURE (single) ========== */}
      <div className="flex justify-between items-end mt-2">
        {setting?.company_name && (
          <div className="text-[10px] text-gray-400">
            چاپ شده در {setting.company_name}
          </div>
        )}

        <div className="text-center min-w-[180px]">
          <div className="border-t border-dotted border-gray-400 pt-3 w-full" />
          <div className="font-bold text-[11px] mt-1">
            امضا و مهر فرستنده / گیرنده
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[9px] text-gray-400 mt-4 pt-1 border-t border-gray-200">
        تاریخ چاپ: {new Intl.DateTimeFormat("fa-IR").format(new Date())}
      </div>
    </div>
  );
});

WaybillPrintContent.displayName = "WaybillPrintContent";
