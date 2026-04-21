import ClubCard from "./ClubCard";

type Club = {
  id: string | number;
  name: string;
  city: string | null;
  area: string | null;
  cover_image: string | null;
  images: string | null;
  services: string | null;
  rating: number | null;
  review_count?: number | null;
  distanceKm?: number | null;
};

type ClubListingSectionProps = {
  filteredClubs: Club[];
  loading?: boolean;
  onResetFilters?: () => void;
};

export default function ClubListingSection({
  filteredClubs,
  loading = false,
  onResetFilters,
}: ClubListingSectionProps) {
  if (loading) {
    return (
      <section className="mt-8">
        <div className="rounded-[24px] border border-[#eee7de] bg-white p-6 text-sm text-[#6f6256] shadow-sm">
          Loading clubs...
        </div>
      </section>
    );
  }

  if (!filteredClubs.length) {
    return (
      <section className="mt-8">
        <div className="rounded-[24px] border border-[#eee7de] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#2d241c]">
            No clubs found
          </h3>
          <p className="mt-2 text-sm text-[#6f6256]">
            Try changing city or service filters.
          </p>

          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="mt-4 rounded-full bg-[#cf8750] px-4 py-2 text-sm font-medium text-white"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#2d241c]">
          Popular clubs
        </h2>
        <p className="text-sm text-[#7a6b5f]">{filteredClubs.length} found</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </section>
  );
}