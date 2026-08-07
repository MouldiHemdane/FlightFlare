import SearchForm from '@/components/SearchForm';
import Link from 'next/link';

// SVG step icons
const IconMapPin = () => (
    <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

const IconBarChart = () => (
    <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
);

const IconTicket = () => (
    <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
        <line x1="9" y1="9" x2="9" y2="15"/>
        <line x1="15" y1="9" x2="15" y2="15"/>
        <line x1="12" y1="9" x2="12" y2="15"/>
    </svg>
);

const IconStar = () => (
    <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);

const IconPlaneSmall = () => (
    <svg className="w-3.5 h-3.5 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
);

export default function Home() {
    const destinations = [
        {
            city: 'Tokyo',
            country: 'Japan',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
            from: 'From JFK',
            price: 849,
            rating: 4.9,
        },
        {
            city: 'Reykjavik',
            country: 'Iceland',
            image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=800&auto=format&fit=crop',
            from: 'From NYC',
            price: 499,
            rating: 4.8,
        },
        {
            city: 'Paris',
            country: 'France',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
            from: 'From JFK',
            price: 312,
            rating: 4.7,
        },
    ];

    const steps = [
        {
            number: '01',
            icon: <IconMapPin />,
            title: 'Set Destination',
            description: 'Enter your origin, dream getaway destination, and flexible trip dates for easy comparison.',
        },
        {
            number: '02',
            icon: <IconBarChart />,
            title: 'Compare Fares',
            description: 'Our technology scans and consolidates pricing from over 160+ airlines in real-time.',
        },
        {
            number: '03',
            icon: <IconTicket />,
            title: 'Book Securely',
            description: 'Reserve available airline tickets and finalize your booking with a 100% price guarantee.',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[580px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 via-[#0a1628]/60 to-[#0a1628]/80" />

                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center py-16">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                        <IconPlaneSmall />
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">
                            Smart Fares · Endless Destinations
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                        Discover your next<br />
                        <span className="text-blue-400">horizon</span>
                    </h1>
                    <p className="text-gray-300 mb-10 text-base font-medium max-w-lg mx-auto">
                        Simple search, compare, and book flights across 160+ airlines with instant price validation.
                    </p>

                    <SearchForm />
                </div>
            </section>

            {/* Three Steps Section */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Simple &amp; Efficient</p>
                        <h2 className="text-3xl font-black text-gray-900 mb-3">Your journey in three steps</h2>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            We bypass complexity to deliver value-building, transparent options from flight search to booking.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="relative group p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="text-6xl font-black text-gray-100 absolute top-6 right-6 select-none group-hover:text-blue-50 transition-colors">
                                    {step.number}
                                </div>
                                <div className="mb-4">{step.icon}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Destinations Section */}
            <section className="py-20 bg-[#f0f7ff] border-t border-blue-100">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <div className="flex gap-1 mb-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                ))}
                            </div>
                            <h2 className="text-3xl font-black text-gray-900">Popular flight destinations</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Browse and find the best deals from these popular destinations.
                            </p>
                        </div>
                        <Link
                            href="/flights"
                            className="hidden md:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
                        >
                            View All Flights →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {destinations.map((dest) => (
                            <div
                                key={dest.city}
                                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                            >
                                <div className="relative h-52 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={dest.image}
                                        alt={`${dest.city}, ${dest.country}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                                        <IconStar />
                                        <span className="text-xs font-bold text-gray-800">{dest.rating}</span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-base font-black text-gray-900">{dest.city}, {dest.country}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">{dest.from}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide">Starting from</p>
                                            <p className="text-xl font-black text-gray-900">${dest.price}</p>
                                        </div>
                                        <Link
                                            href={`/flights?destination=${dest.city}&date=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`}
                                            className="bg-[#0f172a] hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                                        >
                                            Book Flight
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}