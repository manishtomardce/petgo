type SortOption = {
  label: string;
  value: string;
};

type FilterBarProps = {
  cityOptions: string[];
  serviceOptions: string[];
  sortOptions: SortOption[];
  selectedCity: string;
  selectedService: string;
  selectedSort: string;
  onCityChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function FilterBar({
  cityOptions,
  serviceOptions,
  sortOptions,
  selectedCity,
  selectedService,
  selectedSort,
  onCityChange,
  onServiceChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="mb-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {cityOptions.map((city) => {
          const isActive = selectedCity === city;

          return (
            <button
              key={city}
              type="button"
              onClick={() => onCityChange(city)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border-[#cf8750] bg-white text-[#cf8750] shadow-[0_6px_14px_rgba(207,135,80,0.12)]"
                  : "border-[#eadfd2] bg-white text-[#4f4338]"
              }`}
            >
              {city}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="relative">
            <select
              value={selectedService}
              onChange={(e) => onServiceChange(e.target.value)}
              className="h-12 w-full appearance-none rounded-[22px] border border-[#eadfd2] bg-white px-4 pr-10 text-sm font-medium text-[#4f4338] outline-none transition focus:border-[#CF8750]"
            >
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#4f4338]">
              ˅
            </span>
          </div>
        </div>

        <div className="w-[150px] shrink-0">
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-12 w-full appearance-none rounded-[22px] border border-[#eadfd2] bg-white px-4 pr-10 text-sm font-medium text-[#4f4338] outline-none transition focus:border-[#CF8750]"
            >
              {sortOptions.map((sort) => (
                <option key={sort.value || sort.label} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#4f4338]">
              ˅
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}