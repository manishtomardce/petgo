export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <p className="mb-3 text-sm font-medium text-orange-600">PetGo</p>
        <h1 className="text-4xl font-bold leading-tight">
          Find the best pet clubs near you
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Explore pools, parks, cafés, grooming, daycare and boarding for your dog.
        </p>

        <div className="mt-8">
          <button className="w-full rounded-xl bg-black px-5 py-4 text-white">
            Explore Clubs
          </button>
        </div>
      </section>
    </main>
  );
}