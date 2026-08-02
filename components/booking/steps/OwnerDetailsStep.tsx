"use client";

import PriceSummary from "../PriceSummary";

type OwnerDetailsStepProps = {
  ownerName: string;
  setOwnerName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  instructions: string;
  setInstructions: (value: string) => void;
  selectedService: string;
  pricePerUnit: number;
  numberOfUnits: number;
  petsCount: number;
  subtotal: number;
  total: number;
  bookingUnitLabel: string;
};

export default function OwnerDetailsStep({
  ownerName,
  setOwnerName,
  phone,
  setPhone,
  instructions,
  setInstructions,
  selectedService,
  pricePerUnit,
  numberOfUnits,
  petsCount,
  subtotal,
  total,
  bookingUnitLabel,
}: OwnerDetailsStepProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-[26px] border border-[#EDE4D8] bg-white p-4 shadow-[0_12px_28px_rgba(17,24,39,0.05)] sm:p-5">
        <h3 className="text-lg font-semibold text-[#16386F]">Owner Details</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Full name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              className="w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Phone
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Special instructions
            </label>
            <textarea
              rows={4}
              placeholder="Anything the club should know?"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
            />
          </div>
        </div>
      </div>

      <PriceSummary
        selectedService={selectedService}
        pricePerUnit={pricePerUnit}
        numberOfUnits={numberOfUnits}
        petsCount={petsCount}
        subtotal={subtotal}
        total={total}
        bookingUnitLabel={bookingUnitLabel}
      />
    </div>
  );
}
