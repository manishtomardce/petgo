type StickyBookingBarProps = {
    total: number;
    onSubmit: () => void;
    loading?: boolean;
  };
  
  export default function StickyBookingBar({
    total,
    onSubmit,
    loading = false,
  }: StickyBookingBarProps) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div>
            <p className="text-xs text-neutral-500">Estimated total</p>
            <p className="text-lg font-bold text-neutral-900">₹{total}</p>
          </div>
  
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="min-w-[170px] rounded-xl bg-[#CF8750] px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Request Booking"}
          </button>
        </div>
      </div>
    );
  }