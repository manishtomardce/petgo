"use client";

import dynamic from "next/dynamic";

const DatePickerField = dynamic(() => import("../DatePickerField"), {
  ssr: false,
});

type BookingDetailsStepProps = {
  services: string[];
  service: string;
  setService: (value: string) => void;
  checkInValue: string;
  setCheckInValue: (value: string) => void;
  checkOutValue: string;
  setCheckOutValue: (value: string) => void;
  hideCheckout: boolean;
};

export default function BookingDetailsStep({
  services,
  service,
  setService,
  checkInValue,
  setCheckInValue,
  checkOutValue,
  setCheckOutValue,
  hideCheckout,
}: BookingDetailsStepProps) {
  return (
    <div className="rounded-[26px] border border-[#EDE4D8] bg-white p-4 shadow-[0_12px_28px_rgba(17,24,39,0.05)] sm:p-5">
      <h3 className="text-lg font-semibold text-[#16386F]">Booking Details</h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Service
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
            required
          >
            {services.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <DatePickerField
            name="check_in"
            label="Check-in"
            required
            value={checkInValue}
            onChange={setCheckInValue}
          />
        </div>

        {!hideCheckout && (
          <div>
            <DatePickerField
              name="check_out"
              label="Check-out"
              required
              value={checkOutValue}
              onChange={setCheckOutValue}
            />
          </div>
        )}
      </div>
    </div>
  );
}
