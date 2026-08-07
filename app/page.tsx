// app/page.tsx
import SearchForm from '@/components/SearchForm';

export default function HomePage() {
  const popularDestinations = [
    { city: 'Paris', country: 'France', code: 'CDG', price: '$350', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
    { city: 'New York', country: 'United States', code: 'JFK', price: '$280', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
    { city: 'London', country: 'United Kingdom', code: 'LHR', price: '$410', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80' },
    { city: 'Tokyo', country: 'Japan', code: 'HND', price: '$720', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black text-blue-600">FlightFlare</span>
          </div>
          <nav className="flex space-x-6 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Flights</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Deals</a>
            <a href="#" className="hover:text-blue-600 transition-colors">About Us</a>
          </nav>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1">
        <section className="relative bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <span className="bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30">
              Live API Search Supported
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              Compare & Book The Best Flight Deals
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto font-normal">
              Find real-time routes, cheap fares, and seamless travel options across top global airlines.
            </p>

            {/* Embedded Search Form Component */}
            <div className="pt-8">
              <SearchForm />
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                ⚡
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Real-Time Search</h3>
              <p className="text-sm text-gray-500">
                Direct integration with global airline distribution networks for up-to-second pricing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                🔍
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Smart Autocomplete</h3>
              <p className="text-sm text-gray-500">
                Instant fuzzy search mapping over 28,000 airports worldwide by city name or IATA code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                🏷️
              </div>
              <h3 className="font-bold text-gray-900 text-lg">No Hidden Fees</h3>
              <p className="text-sm text-gray-500">
                Clear cost structures with full price breakdowns including taxes and luggage allowances.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Destinations Grid */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Trending Routes</h2>
            <p className="text-sm text-gray-500">Explore popular flight routes selected by travelers this month.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest) => (
              <div key={dest.code} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">
                    {dest.code}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{dest.city}</h4>
                    <p className="text-xs text-gray-500">{dest.country}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">From</span>
                    <span className="font-black text-blue-600 text-base">{dest.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400 space-y-2">
          <p>© 2026 FlightFlare. Built with Next.js, Tailwind CSS, and Duffel API.</p>
        </div>
      </footer>
    </div>
  );
}