type PriceSummaryProps = {
  selectedService: string;
  pricePerUnit: number;
  numberOfUnits: number;
  petsCount: number;
  subtotal: number;
  total: number;
  bookingUnitLabel: string;
};

export default function PriceSummary({
  selectedService,
  pricePerUnit,
  numberOfUnits,
  petsCount,
  subtotal,
  total,
  bookingUnitLabel,
}: PriceSummaryProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-neutral-900">Price Summary</h3>

      <div className="mt-4 space-y-3 text-sm text-neutral-700">
        <div className="flex items-center justify-between">
          <span className="capitalize">{selectedService} price</span>
          <span>
            ₹{pricePerUnit}/{bookingUnitLabel}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>
            {bookingUnitLabel.charAt(0).toUpperCase() + bookingUnitLabel.slice(1)}
            {numberOfUnits > 1 ? "s" : ""}
          </span>
          <span>{numberOfUnits}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Pets</span>
          <span>{petsCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="border-t border-neutral-200 pt-3">
          <div className="flex items-center justify-between text-base font-bold text-neutral-900">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}