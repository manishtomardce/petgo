import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";

export default function HeroSection() {
  return (
    <section className="bg-[#fcfaf8] py-10 md:py-14">
      <Container>
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Tag label="Dog Parks" />
              <Tag label="Pet Pools" />
              <Tag label="Cafés" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Discover the best pet-friendly places near you
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Find dog parks, pools, cafés, grooming, daycare and more — all in
              one premium browsing experience built for pet parents.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button>Explore Clubs</Button>
              <Button variant="secondary">List Your Club</Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
              <span>Trusted venues</span>
              <span>Easy discovery</span>
              <span>Mobile-first experience</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1400&q=80"
                alt="Happy dog outdoors"
                className="h-[320px] w-full object-cover md:h-[420px]"
              />
            </div>

            <div className="absolute -bottom-4 left-4 rounded-2xl bg-white px-4 py-3 shadow-md">
              <p className="text-xs text-gray-500">Now exploring</p>
              <p className="text-sm font-semibold text-gray-900">
                Gurgaon pet clubs
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}