type ServicesStripProps = {
  services: string[];
  selectedService: string;
  onSelectService: (service: string) => void;
};

export default function ServicesStrip({
  services,
  selectedService,
  onSelectService,
}: ServicesStripProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
      {services.map((service) => {
        const isActive = selectedService === service;

        return (
          <button
            key={service}
            type="button"
            onClick={() => onSelectService(service)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-[#cf8750] text-white shadow-[0_8px_18px_rgba(207,135,80,0.22)]"
                : "bg-[#f5f1eb] text-[#4f4338] hover:bg-[#eee6dc]"
            }`}
          >
            {service}
          </button>
        );
      })}
    </div>
  );
}