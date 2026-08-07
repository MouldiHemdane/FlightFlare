import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">FlightFlare</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              FlightFlare is a modern, smart travel technology platform designed to deliver
              deeply comprehensive options and effortless flight bookings.
            </p>
          </div>

          {/* Explore Column */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Flights</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Popular Routes</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Airlines</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Hotels</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Packages</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Manage Booking</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Refund Policies</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Carrier Rules</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Chat</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press Releases</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Partnerships</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy &amp; Safety</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 FlightFlare Inc. All rights reserved. Registered Travel Agent ID 8740-1A.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
