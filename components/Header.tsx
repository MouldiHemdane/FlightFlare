import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">FlightFlare</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-0.5">
            Flights
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Hotels
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Packages
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link href="/my-bookings" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hidden sm:block">
            My Bookings
          </Link>
        </div>
      </div>
    </header>
  );
}
