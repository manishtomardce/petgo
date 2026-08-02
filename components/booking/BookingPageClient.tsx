"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ClubSummaryCard from "./ClubSummaryCard";
import StepIndicator from "./StepIndicator";
import BookingDetailsStep from "./steps/BookingDetailsStep";
import PetDetailsStep from "./steps/PetDetailsStep";
import OwnerDetailsStep from "./steps/OwnerDetailsStep";

type Club = {
  id: string | number;
  name?: string;
  club_name?: string;
  city?: string | null;
  area?: string | null;
  cover_image?: string | null;
  rating?: number | null;
  review_count?: number | null;
  services?: string[] | string | null;
  service_type?: string | null;
  boarding_price?: number | null;
  daycare_price?: number | null;
  grooming_price?: number | null;
  pool_price?: number | null;
  cafe_price?: number | null;
  distance_km?: number | null;
  distance?: number | null;
};

type PetFormItem = {
  name: string;
  breed: string;
  size: string;
};

type BookingPageClientProps = {
  club: Club;
  initialService?: string;
};

type Step = 1 | 2 | 3;

function parseServices(services: Club["services"]) {
  if (!services) return [];

  if (Array.isArray(services)) {
    return services.filter(Boolean);
  }

  return services
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeService(value: string) {
  return value.trim().toLowerCase();
}

function getPriceForService(club: Club, selectedService: string) {
  const normalized = normalizeService(selectedService);

  if (normalized === "boarding") return Number(club.boarding_price ?? 0);
  if (normalized === "daycare") return Number(club.daycare_price ?? 0);
  if (normalized === "grooming") return Number(club.grooming_price ?? 0);
  if (normalized === "pool" || normalized === "park") {
    return Number(club.pool_price ?? 0);
  }
  if (normalized === "cafe") return Number(club.cafe_price ?? 0);

  return 0;
}

function getBookingUnitLabel(serviceType: string) {
  if (serviceType === "boarding") return "night";
  if (serviceType === "daycare") return "day";
  if (serviceType === "grooming") return "session";
  if (serviceType === "pool" || serviceType === "park") return "session";
  if (serviceType === "cafe") return "visit";
  return "unit";
}

function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeIndianPhone(phone: string) {
  const cleaned = String(phone || "")
    .replace(/[^\d+]/g, "")
    .trim();

  if (!cleaned) return "";
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;
  if (cleaned.length === 10) return `+91${cleaned}`;

  return cleaned;
}

function calculateNumberOfUnits(
  checkIn: string,
  checkOut: string,
  hideCheckout: boolean
) {
  if (hideCheckout) return 1;
  if (!checkIn || !checkOut) return 1;
  if (!isValidDateString(checkIn) || !isValidDateString(checkOut)) return 1;

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 1;
}

function createEmptyPet(): PetFormItem {
  return {
    name: "",
    breed: "",
    size: "small",
  };
}

function ChatHelpBar({ whatsappSupportUrl }: { whatsappSupportUrl: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#EDE4D8] bg-white px-4 py-4">
      <p className="text-sm font-medium text-neutral-800">
        Need help before booking?
      </p>

      <a
        href={whatsappSupportUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: "#25D366",
          color: "#ffffff",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1ebe5d";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#25D366";
        }}
        className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap shadow-md transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.7 5.5 2.1 7.9L.3 31.7l8-2.1c2.3 1.3 4.9 2 7.7 2 8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm0 28.5c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5c-1.3-2.1-2-4.5-2-6.9 0-7.3 5.9-13.2 13.2-13.2S29.2 8.7 29.2 16 23.3 28.9 16 28.9zm7.3-9.8c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2s-.9 1.2-1.1 1.5c-.2.2-.4.3-.7.1-.4-.2-1.5-.6-2.8-1.9-1-1-1.7-2.2-1.9-2.6-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2.1-.5 0-.7s-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5s-1.3 1.2-1.3 2.9 1.3 3.4 1.5 3.6c.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.7-.5z"
          />
        </svg>

        <span>Chat</span>
      </a>
    </div>
  );
}

export default function BookingPageClient({
  club,
  initialService = "",
}: BookingPageClientProps) {
  const router = useRouter();

  const services = parseServices(club.services);
  const fallbackService = services[0] || "boarding";

  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState(initialService || fallbackService);
  const [petsCount, setPetsCount] = useState(1);
  const [pets, setPets] = useState<PetFormItem[]>([createEmptyPet()]);
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkInValue, setCheckInValue] = useState("");
  const [checkOutValue, setCheckOutValue] = useState("");

  const serviceType = normalizeService(service || "");
  const hideCheckout = serviceType === "cafe" || serviceType === "grooming";

  const clubName = club.name || club.club_name || "Pet Club";
  const clubId = String(club.id || "").trim();

  const pricePerUnit = useMemo(() => {
    return getPriceForService(club, service);
  }, [club, service]);

  const bookingUnitLabel = useMemo(() => {
    return getBookingUnitLabel(serviceType);
  }, [serviceType]);

  const numberOfUnits = useMemo(() => {
    return calculateNumberOfUnits(checkInValue, checkOutValue, hideCheckout);
  }, [checkInValue, checkOutValue, hideCheckout]);

  const subtotal = useMemo(() => {
    return pricePerUnit * numberOfUnits * petsCount;
  }, [pricePerUnit, numberOfUnits, petsCount]);

  const total = subtotal;

  const updatePet = (index: number, key: keyof PetFormItem, value: string) => {
    setPets((current) =>
      current.map((pet, petIndex) =>
        petIndex === index ? { ...pet, [key]: value } : pet
      )
    );
  };

  const handleSetPetsCount = (count: number) => {
    const nextCount = Math.max(1, count);
    setPetsCount(nextCount);
    setPets((current) => {
      if (current.length === nextCount) return current;

      if (current.length < nextCount) {
        return [
          ...current,
          ...Array.from({ length: nextCount - current.length }, () =>
            createEmptyPet()
          ),
        ];
      }

      return current.slice(0, nextCount);
    });
  };

  const whatsappSupportUrl = useMemo(() => {
    const supportMessage = encodeURIComponent(
      `Hi PetGo, I need help with booking at ${clubName}${
        service ? ` for ${service}` : ""
      }${checkInValue ? ` on ${checkInValue}` : ""}`
    );

    return `https://wa.me/919667078411?text=${supportMessage}`;
  }, [clubName, service, checkInValue]);

  const goToStep2 = () => {
    if (!service.trim()) {
      alert("Please select service");
      return;
    }

    if (!checkInValue) {
      alert("Please select check-in date");
      return;
    }

    if (!isValidDateString(checkInValue)) {
      alert("Invalid check-in date");
      return;
    }

    if (!hideCheckout && !checkOutValue) {
      alert("Please select check-out date");
      return;
    }

    if (!hideCheckout && !isValidDateString(checkOutValue)) {
      alert("Invalid check-out date");
      return;
    }

    setStep(2);
    window.scrollTo(0, 0);
  };

  const goToStep3 = () => {
    const firstMissingPetIndex = pets
      .slice(0, petsCount)
      .findIndex((pet) => !pet.name.trim());

    if (firstMissingPetIndex !== -1) {
      alert(`Please enter pet name for pet ${firstMissingPetIndex + 1}`);
      return;
    }

    setStep(3);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setStep((current) => (current > 1 ? ((current - 1) as Step) : current));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    const trimmedOwnerName = ownerName.trim();
    const trimmedPhone = normalizeIndianPhone(phone.trim());

    const finalPets = pets.slice(0, petsCount).map((pet) => ({
      name: pet.name.trim(),
      breed: pet.breed.trim(),
      size: pet.size || "small",
    }));

    if (!clubId) {
      alert(
        "Club ID missing. Please open booking from club details page again."
      );
      return;
    }

    if (!trimmedOwnerName) {
      alert("Please enter owner name");
      return;
    }

    if (!trimmedPhone) {
      alert("Please enter phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          club_id: clubId,
          club_name: clubName,
          service: service.trim(),
          service_type: serviceType,
          check_in: checkInValue,
          check_out: hideCheckout ? null : checkOutValue,
          pets_count: petsCount,
          pets: finalPets,
          pet_name: finalPets[0]?.name || "",
          pet_breed: finalPets[0]?.breed || "",
          pet_size: finalPets[0]?.size || "small",
          owner_name: trimmedOwnerName,
          phone: trimmedPhone,
          instructions: instructions.trim() || "",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(
          result.missing
            ? `Missing required fields: ${Object.entries(result.missing)
                .filter(([, v]) => Boolean(v))
                .map(([k]) => k)
                .join(", ")}`
            : result.error || "Failed to save booking"
        );
        setLoading(false);
        return;
      }

      sessionStorage.setItem(
        `petgo_confirmation_preview_${result.bookingId}`,
        JSON.stringify({
          club_name: clubName,
          club_id: clubId,
          owner_name: trimmedOwnerName,
          phone: trimmedPhone,
          service: service.trim(),
          service_type: serviceType,
          pet_name: finalPets[0]?.name || "",
          check_in: checkInValue,
          check_out: hideCheckout ? null : checkOutValue,
          instructions: instructions.trim() || "",
        })
      );

      // keep the button in its loading state through the navigation itself,
      // so it doesn't flash back to normal right before the page swaps
      router.push(`/booking-confirmation/${result.bookingId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting booking");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#16386F]">Book Now</h1>
        </div>

        <ClubSummaryCard
          club={{
            name: clubName,
            city: club.city ?? null,
            area: club.area ?? null,
            cover_image: club.cover_image ?? null,
            rating: club.rating ?? null,
            review_count: club.review_count ?? null,
            services: services,
            distance_km: club.distance_km ?? club.distance ?? null,
          }}
          selectedService={service}
        />

        <div className="rounded-[26px] border border-[#EDE4D8] bg-white px-5 py-4 shadow-[0_12px_28px_rgba(17,24,39,0.05)]">
          <StepIndicator currentStep={step} />
        </div>

        {step === 1 && (
          <>
            <BookingDetailsStep
              services={services.length ? services : ["boarding"]}
              service={service}
              setService={setService}
              checkInValue={checkInValue}
              setCheckInValue={setCheckInValue}
              checkOutValue={checkOutValue}
              setCheckOutValue={setCheckOutValue}
              hideCheckout={hideCheckout}
            />

            <button
              type="button"
              onClick={goToStep2}
              className="w-full rounded-2xl bg-[#CF8750] px-4 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(207,135,80,0.28)] transition-all duration-150 active:scale-[0.98] hover:-translate-y-[1px] hover:shadow-[0_16px_34px_rgba(207,135,80,0.34)]"
            >
              Next: Pet Details
            </button>

            <ChatHelpBar whatsappSupportUrl={whatsappSupportUrl} />
          </>
        )}

        {step === 2 && (
          <>
            <PetDetailsStep
              petsCount={petsCount}
              setPetsCount={handleSetPetsCount}
              pets={pets}
              updatePet={updatePet}
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="w-1/3 rounded-2xl border border-[#E7DED1] bg-white px-4 py-4 text-base font-semibold text-[#16386F] transition-all duration-150 active:scale-[0.98]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToStep3}
                className="flex-1 rounded-2xl bg-[#CF8750] px-4 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(207,135,80,0.28)] transition-all duration-150 active:scale-[0.98] hover:-translate-y-[1px] hover:shadow-[0_16px_34px_rgba(207,135,80,0.34)]"
              >
                Next: Owner Details
              </button>
            </div>

            <ChatHelpBar whatsappSupportUrl={whatsappSupportUrl} />
          </>
        )}

        {step === 3 && (
          <>
            <OwnerDetailsStep
              ownerName={ownerName}
              setOwnerName={setOwnerName}
              phone={phone}
              setPhone={setPhone}
              instructions={instructions}
              setInstructions={setInstructions}
              selectedService={service}
              pricePerUnit={pricePerUnit}
              numberOfUnits={numberOfUnits}
              petsCount={petsCount}
              subtotal={subtotal}
              total={total}
              bookingUnitLabel={bookingUnitLabel}
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={loading}
                className="w-1/3 rounded-2xl border border-[#E7DED1] bg-white px-4 py-4 text-base font-semibold text-[#16386F] transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#CF8750] px-4 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(207,135,80,0.28)] transition-all duration-150 active:scale-[0.98] hover:-translate-y-[1px] hover:shadow-[0_16px_34px_rgba(207,135,80,0.34)] disabled:opacity-80 disabled:active:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-[0_12px_30px_rgba(207,135,80,0.28)]"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>

            <ChatHelpBar whatsappSupportUrl={whatsappSupportUrl} />
          </>
        )}
      </div>
    </main>
  );
}
