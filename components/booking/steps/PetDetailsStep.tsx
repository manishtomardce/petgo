"use client";

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
        <select
          value={petsCount}
          onChange={(e) => setPetsCount(Math.max(1, Number(e.target.value) || 1))}
          className="w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
          required
        >
          {[1, 2, 3, 4, 5].map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? "pet" : "pets"}
            </option>
          ))}
        </select>
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
                <input
                  type="text"
                  placeholder="Enter breed"
                  value={pet.breed}
                  onChange={(e) => updatePet(index, "breed", e.target.value)}
                  className="w-full rounded-2xl border border-[#E7DED1] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#CF8750]"
                />
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
  );
}
