import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CF8750] text-base font-bold text-white">
              P
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-gray-900">PetGo</p>
              <p className="mt-1 text-xs text-gray-500">Pet places near you</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Explore
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Services
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Bookings
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button>List Your Club</Button>
          </div>
        </div>
      </Container>
    </header>
  );
}