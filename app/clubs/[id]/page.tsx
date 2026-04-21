import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase";
import BookNowButton from "@/components/club/BookNowButton";
import ClubImageGallery from "@/components/club/ClubImageGallery";

type ClubDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function getMapEmbedUrl(club: any) {
  if (club.latitude && club.longitude) {
    return `https://www.google.com/maps?q=${club.latitude},${club.longitude}&z=15&output=embed`;
  }

  const query = [club.name, club.area, club.city].filter(Boolean).join(", ");
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

export default async function ClubDetailsPage({
  params,
}: ClubDetailsPageProps) {
  const { id } = await params;

  const supabase = createClient();

  const { data: club, error } = await supabase
    .from("club_details")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !club) notFound();

  const images = [
    club.cover_image,
    ...(club.images
      ? club.images
          .split(",")
          .map((img: string) => img.trim())
          .filter(Boolean)
      : []),
  ].filter(Boolean);

  const services = club.services
    ? club.services
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

  const amenities = club.amenities
    ? club.amenities
        .split(",")
        .map((a: string) => a.trim())
        .filter(Boolean)
    : [];

  const dbPolicies = club.rules
    ? club.rules
        .split(",")
        .map((rule: string) => rule.trim())
        .filter(Boolean)
    : [];

  const defaultPolicies = [
    "Vaccinated dogs only",
    "Female dogs on heat are not advised to book",
  ];

  const policies = [...new Set([...defaultPolicies, ...dbPolicies])];

  const startingPrice =
    club.boarding_price ??
    club.daycare_price ??
    club.pool_price ??
    club.grooming_price ??
    club.cafe_price;

  const mapEmbedUrl = getMapEmbedUrl(club);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-28">
      <ClubImageGallery images={images} clubName={club.name} />

      <div className="space-y-8 px-4 pt-5">
        <div>
          <h1 className="text-[26px] font-semibold text-neutral-900">
            {club.name}
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            {[club.area, club.city].filter(Boolean).join(", ")}
          </p>

          <p className="mt-2 text-sm text-neutral-700">
            ⭐ {club.rating ?? "New"} · {club.review_count ?? 0} reviews
          </p>
        </div>

        {services.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">
              Services
            </h2>

            <div className="flex flex-wrap gap-3">
              {services.map((service: string, index: number) => (
                <span
                  key={`${service}-${index}`}
                  className="rounded-full bg-[#F5EFE8] px-5 py-2 text-sm font-medium capitalize text-[#8A5A34]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-3 text-lg font-semibold text-neutral-900">
            Pricing
          </h2>

          <div className="space-y-3 text-sm text-neutral-700">
            {club.pool_price && (
              <div className="flex justify-between">
                <span>Pool</span>
                <span className="font-medium">₹{club.pool_price}</span>
              </div>
            )}

            {club.daycare_price && (
              <div className="flex justify-between">
                <span>Daycare</span>
                <span className="font-medium">₹{club.daycare_price}</span>
              </div>
            )}

            {club.boarding_price && (
              <div className="flex justify-between">
                <span>Boarding</span>
                <span className="font-medium">₹{club.boarding_price}</span>
              </div>
            )}

            {club.grooming_price && (
              <div className="flex justify-between">
                <span>Grooming</span>
                <span className="font-medium">₹{club.grooming_price}</span>
              </div>
            )}

            {club.cafe_price && (
              <div className="flex justify-between">
                <span>Cafe</span>
                <span className="font-medium">₹{club.cafe_price}</span>
              </div>
            )}
          </div>
        </div>

        {amenities.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">
              Amenities
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {amenities.map((amenity: string, index: number) => (
                <div
                  key={`${amenity}-${index}`}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700"
                >
                  ✔ {amenity}
                </div>
              ))}
            </div>
          </div>
        )}

        {policies.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">
              Policies
            </h2>

            <div className="space-y-3">
              {policies.map((policy: string, index: number) => (
                <div
                  key={`${policy}-${index}`}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700"
                >
                  • {policy}
                </div>
              ))}
            </div>
          </div>
        )}

        {(club.area || club.city || club.latitude || club.longitude) && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                Location
              </h2>

              {club.google_maps_link && (
                <a
                  href={club.google_maps_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-[#8A5A34]"
                >
                  Open map
                </a>
              )}
            </div>

            <div className="overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-sm">
              <div className="h-[240px] w-full bg-neutral-100">
                <iframe
                  title={`${club.name} location map`}
                  src={mapEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="px-4 py-4">
                <p className="text-sm font-medium text-neutral-900">
                  {[club.area, club.city].filter(Boolean).join(", ")}
                </p>

                {club.address ? (
                  <p className="mt-1 text-sm text-neutral-500">
                    {club.address}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {club.timings && (
          <div>
            <h2 className="mb-2 text-lg font-semibold text-neutral-900">
              Timings
            </h2>

            <div className="rounded-[22px] border border-neutral-200 bg-white px-4 py-4 text-sm leading-7 text-neutral-600">
              <p className="whitespace-pre-line">{club.timings}</p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 z-30 w-full border-t border-neutral-200 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Starting from</p>
            <p className="text-xl font-semibold text-neutral-900">
              ₹{startingPrice ?? "--"}
            </p>
          </div>

          <div className="w-[160px]">
            <BookNowButton clubId={club.id} />
          </div>
        </div>
      </div>
    </div>
  );
}