"use client";

import { DOG_BREEDS, PET_SIZE_OPTIONS } from "../dogBreeds";

type PetFormItem = {
  name: string;
  breed: string;
  size: string;
};

type PetDetailsStepProps = {
  petsCount: number;
  setPetsCount: (value: number) => void;
  pets: PetFormItem[];
  updatePet: (index: number, key: keyof PetFormItem, value: string) => void;
};

export default function PetDetailsStep({
  petsCount,
  setPetsCount,
  pets,
  updatePet,
}: PetDetailsStepProps) {
  return (
    <div className="rounded-[26px] border border-[#EDE4D8] bg-white p-4 shadow-[0_12px_28px_rgba(17,24,39,0.05)] sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#16386F]">Pet Details</h3>
        <span className="rounded-full bg-[#FFF7E8] px-3 py-1 text-xs font-semibold text-[#9A6200]">
          {petsCount} {petsCount === 1 ? "pet" : "pets"}
        </span>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Number of pets
        </label>
        <div className="flex items-center justify-between rounded-2xl border border-[#E7DED1] bg-white px-4 py-2">
          <button
            type="button"
            onClick={() => setPetsCount(Math.max(1, petsCount - 1))}
            disabled={petsCount <= 1}
            aria-label="Decrease number of pets"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E7DED1] text-xl font-semibold text-[#16386F] transition-all duration-150 active:scale-90 disabled:opacity-30"
          >
            −
          </button>

          <span className="text-[16px] font-semibold text-[#16386F]">
            {petsCount} {petsCount === 1 ? "pet" : "pets"}
          </span>

          <button
            type="button"
            onClick={() => setPetsCount(Math.min(5, petsCount + 1))}
            disabled={petsCount >= 5}
            aria-label="Increase number of pets"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E7DED1] text-xl font-semibold text-[#16386F] transition-all duration-150 active:scale-90 disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {pets.map((pet, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#EDE4D8] bg-[#FAF8F5] p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-base font-semibold text-[#16386F]">
                Pet {index + 1}
              </h4>
              <span className="rounded-full border border-[#E7DED1] bg-white px-2.5 py-1 text-xs font-medium text-[#7A746C]">
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
                  className="w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Breed
                </label>
                <select
                  value={
                    DOG_BREEDS.slice(0, -1).includes(
                      pet.breed as (typeof DOG_BREEDS)[number]
                    )
                      ? pet.breed
                      : "Other"
                  }
                  onChange={(e) =>
                    updatePet(
                      index,
                      "breed",
                      e.target.value === "Other" ? "" : e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
                >
                  {DOG_BREEDS.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>

                {!DOG_BREEDS.slice(0, -1).includes(
                  pet.breed as (typeof DOG_BREEDS)[number]
                ) && (
                  <input
                    type="text"
                    placeholder="Enter breed"
                    value={pet.breed}
                    onChange={(e) => updatePet(index, "breed", e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
                  />
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Size
                </label>
                <select
                  value={pet.size}
                  onChange={(e) => updatePet(index, "size", e.target.value)}
                  className="w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
                >
                  {PET_SIZE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
