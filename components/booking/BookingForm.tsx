"use client";

import dynamic from "next/dynamic";

const DatePickerField = dynamic(() => import("./DatePickerField"), {
  ssr: false,
});

type PetFormItem = {
  name: string;
  breed: string;
  size: string;
};

type BookingFormProps = {
  services: string[];
  service: string;
  setService: (value: string) => void;
  petsCount: number;
  setPetsCount: (value: number) => void;
  pets: PetFormItem[];
  updatePet: (index: number, key: keyof PetFormItem, value: string) => void;
  ownerName: string;
  setOwnerName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  instructions: string;
  setInstructions: (value: string) => void;
  serviceType: string;
};

export default function BookingForm({
  services,
  service,
  setService,
  petsCount,
  setPetsCount,
  pets,
  updatePet,
  ownerName,
  setOwnerName,
  phone,
  setPhone,
  instructions,
  setInstructions,
  serviceType,
}: BookingFormProps) {
  const normalizedServiceType = serviceType?.toLowerCase() || "";
  const hideCheckout =
    normalizedServiceType === "cafe" || normalizedServiceType === "grooming";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="text-lg font-semibold text-neutral-900">Booking Details</h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Service
          </label>
          <select
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
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
          <DatePickerField name="check_in" label="Check-in" required />
        </div>

        {!hideCheckout && (
          <div>
            <DatePickerField name="check_out" label="Check-out" required />
          </div>
        )}

        <div className={hideCheckout ? "sm:col-span-2" : ""}>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Number of pets
          </label>
          <select
            name="pets_count"
            value={petsCount}
            onChange={(e) => setPetsCount(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
            required
          >
            {[1, 2, 3, 4, 5].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "pet" : "pets"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 border-t border-neutral-200 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Pet Details</h3>
          <span className="rounded-full bg-[#F6EEE7] px-3 py-1 text-xs font-medium text-[#8A5A34]">
            {petsCount} {petsCount === 1 ? "pet" : "pets"}
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {pets.map((pet, index) => (
            <div
              key={index}
              className="rounded-2xl border border-neutral-200 bg-[#fcfbf8] p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-base font-semibold text-neutral-900">
                  Pet {index + 1}
                </h4>
                <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600">
                  Details
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Pet name
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter pet ${index + 1} name`}
                    value={pet.name}
                    onChange={(e) => updatePet(index, "name", e.target.value)}
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Breed
                  </label>
                  <input
                    type="text"
                    placeholder="Enter breed"
                    value={pet.breed}
                    onChange={(e) => updatePet(index, "breed", e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Size
                  </label>
                  <select
                    value={pet.size}
                    onChange={(e) => updatePet(index, "size", e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-neutral-200 pt-6">
        <h3 className="text-lg font-semibold text-neutral-900">Owner Details</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Full name
            </label>
            <input
              type="text"
              name="owner_name"
              placeholder="Enter your name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Special instructions
            </label>
            <textarea
              name="instructions"
              rows={4}
              placeholder="Anything the club should know?"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}