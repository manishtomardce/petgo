"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BookingForm from "./BookingForm";
import ClubSummaryCard from "./ClubSummaryCard";
import PriceSummary from "./PriceSummary";

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

export default function BookingPageClient({
  club,
  initialService = "",
}: BookingPageClientProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const services = parseServices(club.services);
  const fallbackService = services[0] || "boarding";

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

  useEffect(() => {
    setPets((current) => {
      if (current.length === petsCount) return current;

      if (current.length < petsCount) {
        return [
          ...current,
          ...Array.from({ length: petsCount - current.length }, () =>
            createEmptyPet()
          ),
        ];
      }

      return current.slice(0, petsCount);
    });
  }, [petsCount]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const checkInInput = form.elements.namedItem(
      "check_in"
    ) as HTMLInputElement | null;
    const checkOutInput = form.elements.namedItem(
      "check_out"
    ) as HTMLInputElement | null;

    const syncValues = () => {
      setCheckInValue(checkInInput?.value?.trim() || "");
      setCheckOutValue(checkOutInput?.value?.trim() || "");
    };

    syncValues();

    checkInInput?.addEventListener("input", syncValues);
    checkInInput?.addEventListener("change", syncValues);
    checkOutInput?.addEventListener("input", syncValues);
    checkOutInput?.addEventListener("change", syncValues);

    return () => {
      checkInInput?.removeEventListener("input", syncValues);
      checkInInput?.removeEventListener("change", syncValues);
      checkOutInput?.removeEventListener("input", syncValues);
      checkOutInput?.removeEventListener("change", syncValues);
    };
  }, [serviceType]);

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

  const total = useMemo(() => {
    return subtotal;
  }, [subtotal]);

  const updatePet = (index: number, key: keyof PetFormItem, value: string) => {
    setPets((current) =>
      current.map((pet, petIndex) =>
        petIndex === index ? { ...pet, [key]: value } : pet
      )
    );
  };

  const whatsappSupportUrl = useMemo(() => {
    const supportMessage = encodeURIComponent(
      `Hi PetGo, I need help with booking at ${clubName}${
        service ? ` for ${service}` : ""
      }${checkInValue ? ` on ${checkInValue}` : ""}`
    );

    return `https://wa.me/919667078411?text=${supportMessage}`;
  }, [clubName, service, checkInValue]);

  const handleSubmit = async () => {
    const form = formRef.current;

    const domService =
      (
        form?.elements.namedItem("service") as HTMLSelectElement | null
      )?.value?.trim() || "";
    const domCheckIn =
      (
        form?.elements.namedItem("check_in") as HTMLInputElement | null
      )?.value?.trim() || "";
    const domCheckOut =
      (
        form?.elements.namedItem("check_out") as HTMLInputElement | null
      )?.value?.trim() || "";
    const domPetsCount =
      (form?.elements.namedItem("pets_count") as HTMLInputElement | null)
        ?.value || "1";
    const domOwnerName =
      (
        form?.elements.namedItem("owner_name") as HTMLInputElement | null
      )?.value?.trim() || "";
    const domPhone =
      (
        form?.elements.namedItem("phone") as HTMLInputElement | null
      )?.value?.trim() || "";
    const domInstructions =
      (
        form?.elements.namedItem("instructions") as HTMLTextAreaElement | null
      )?.value?.trim() || "";

    const trimmedClubId = clubId;
    const trimmedService = domService || service.trim();
    const trimmedCheckIn = domCheckIn;
    const trimmedCheckOut = domCheckOut;
    const trimmedOwnerName = domOwnerName || ownerName.trim();
    const trimmedPhone = normalizeIndianPhone(domPhone || phone.trim());
    const finalPetsCount = Math.max(1, Number(domPetsCount) || petsCount || 1);

    const finalPets = pets.slice(0, finalPetsCount).map((pet) => ({
      name: pet.name.trim(),
      breed: pet.breed.trim(),
      size: pet.size || "small",
    }));

    if (!trimmedClubId) {
      alert(
        "Club ID missing. Please open booking from club details page again."
      );
      return;
    }

    if (!trimmedService) {
      alert("Please select service");
      return;
    }

    if (!trimmedCheckIn) {
      alert("Please select check-in date");
      return;
    }

    if (!isValidDateString(trimmedCheckIn)) {
      alert("Invalid check-in date");
      return;
    }

    if (!hideCheckout && !trimmedCheckOut) {
      alert("Please select check-out date");
      return;
    }

    if (!hideCheckout && !isValidDateString(trimmedCheckOut)) {
      alert("Invalid check-out date");
      return;
    }

    const firstMissingPetIndex = finalPets.findIndex((pet) => !pet.name);
    if (firstMissingPetIndex !== -1) {
      alert(`Please enter pet name for pet ${firstMissingPetIndex + 1}`);
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
          club_id: trimmedClubId,
          club_name: clubName,
          service: trimmedService,
          service_type: serviceType,
          check_in: trimmedCheckIn,
          check_out: hideCheckout ? null : trimmedCheckOut,
          pets_count: finalPetsCount,
          pets: finalPets,
          pet_name: finalPets[0]?.name || "",
          pet_breed: finalPets[0]?.breed || "",
          pet_size: finalPets[0]?.size || "small",
          owner_name: trimmedOwnerName,
          phone: trimmedPhone,
          instructions: domInstructions || instructions.trim() || "",
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
        return;
      }

      router.push(`/booking-confirmation/${result.bookingId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-6">
      <form
        ref={formRef}
        className="mx-auto max-w-3xl space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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

        <BookingForm
          services={services.length ? services : ["boarding"]}
          service={service}
          setService={setService}
          petsCount={petsCount}
          setPetsCount={setPetsCount}
          pets={pets}
          updatePet={updatePet}
          ownerName={ownerName}
          setOwnerName={setOwnerName}
          phone={phone}
          setPhone={setPhone}
          instructions={instructions}
          setInstructions={setInstructions}
          serviceType={serviceType}
        />

        <PriceSummary
          selectedService={service}
          pricePerUnit={pricePerUnit}
          numberOfUnits={numberOfUnits}
          petsCount={petsCount}
          subtotal={subtotal}
          total={total}
          bookingUnitLabel={bookingUnitLabel}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#CF8750] px-4 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(207,135,80,0.28)] transition-all duration-150 active:scale-[0.98] hover:-translate-y-[1px] hover:shadow-[0_16px_34px_rgba(207,135,80,0.34)] disabled:opacity-60 disabled:active:scale-100"
        >
          {loading ? "Submitting..." : "Confirm Booking"}
        </button>
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
      </form>
    </main>
  );
}
