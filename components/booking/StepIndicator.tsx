type StepIndicatorProps = {
  currentStep: 1 | 2 | 3;
};

const STEPS = [
  { step: 1, label: "Service Details" },
  { step: 2, label: "Pets Details" },
  { step: 3, label: "Owner Details" },
] as const;

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      {STEPS.map(({ step, label }, index) => {
        const isComplete = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isComplete
                    ? "bg-[#16386F] text-white"
                    : isActive
                    ? "bg-[#16386F] text-white"
                    : "bg-[#EDE4D8] text-[#7A746C]"
                }`}
              >
                {isComplete ? "✓" : step}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  isActive ? "text-[#16386F]" : "text-[#7A746C]"
                }`}
              >
                {label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`mx-2 h-[2px] flex-1 rounded-full transition-colors ${
                  isComplete ? "bg-[#16386F]" : "bg-[#EDE4D8]"
                }`}
                style={{ marginBottom: "18px" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
