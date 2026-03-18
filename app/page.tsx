export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <p className="mb-3 text-sm font-medium text-orange-600">PetGo</p>
        <h1 className="text-4xl font-bold leading-tight">
          PetGo setup is ready
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Next.js project is running. Tomorrow we build the premium UI.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Day 1 checklist</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>✅ Next.js app created</li>
            <li>✅ Tailwind working</li>
            <li>✅ GitHub connected</li>
            <li>✅ Supabase project created</li>
            <li>✅ Environment variables added</li>
          </ul>
        </div>
      </section>
    </main>
  );
}