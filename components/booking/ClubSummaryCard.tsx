type ClubDetails = {
  name: string;
  city: string | null;
  area: string | null;
  cover_image: string | null;
  rating: number | null;
  review_count: number | null;
  services?: string[] | null;
  distance_km?: number | null;
};

type ClubSummaryCardProps = {
  club: ClubDetails;
  selectedService: string;
};

function formatDistance(distance?: number | null) {
  if (distance == null || Number.isNaN(distance)) return null;

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }

  return `${distance.toFixed(1)} km away`;
}

export default function ClubSummaryCard({
  club,
  selectedService,
}: ClubSummaryCardProps) {
  const services = club.services?.filter(Boolean) ?? [];
  const distanceText = formatDistance(club.distance_km);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">{club.name}</h2>

          <p className="mt-1 text-sm text-neutral-600">
            {[club.area, club.city].filter(Boolean).join(", ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {services.map((item) => {
            const isActive =
              item.trim().toLowerCase() === selectedService.trim().toLowerCase();

            return (
              <span
                key={item}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  isActive
                    ? "bg-[#F6EEE7] text-[#8A5A34]"
                    : "bg-[#F6EEE7] text-[#8A5A34]"
                }`}
              >
                {item}
              </span>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          {club.rating ? (
            <span>
              ⭐ {club.rating} ({club.review_count ?? 0} reviews)
            </span>
          ) : null}

          {distanceText ? (
            <span className="font-medium text-neutral-600">{distanceText}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}