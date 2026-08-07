'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AirportAutocomplete from './AirportAutocomplete';

interface SearchFormProps {
    initialOrigin?: string;
    initialDestination?: string;
    initialDate?: string;
    initialPassengers?: string;
    initialCabin?: string;
}

type TripType = 'roundtrip' | 'oneway' | 'multicity';

// SVG Icons
const IconPlane = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
);

const IconPlaneLanding = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.5 19h19v2h-19zm7.18-1.73l4.35 1.16 5.31 1.42c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-4.97-1.33-1.97-6.12L11 11v4l-4-2-1-3H4l1.5 5.15L9.68 17.27z"/>
    </svg>
);

const IconSwap = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
        <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
    </svg>
);

const IconCalendar = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const IconSearch = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);

const IconUser = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

const IconChevronDown = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);

const IconSeat = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.2 6c.2.8.3 1.6.3 2.5 0 3.5-2 6.4-4.8 7.7L17 18H7l.5-1.7C4.7 14.9 3 12.1 3 8.5c0-.9.1-1.7.3-2.5"/>
        <path d="M12 3a2 2 0 0 1 2 2v4H10V5a2 2 0 0 1 2-2z"/>
        <line x1="7" y1="18" x2="17" y2="18"/>
        <line x1="7" y1="22" x2="17" y2="22"/>
    </svg>
);

export default function SearchForm({
    initialOrigin = '',
    initialDestination = '',
    initialDate,
    initialPassengers = '1',
    initialCabin = 'economy'
}: SearchFormProps) {
    const router = useRouter();

    const [tripType, setTripType] = useState<TripType>('roundtrip');
    const [origin, setOrigin] = useState(initialOrigin);
    const [destination, setDestination] = useState(initialDestination);
    const [passengers, setPassengers] = useState(initialPassengers);
    const [cabin, setCabin] = useState(initialCabin);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];
    const [date, setDate] = useState(initialDate || defaultDate);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination || !date) {
            alert('Please fill in all fields (Origin, Destination, and Date).');
            return;
        }
        router.push(`/flights?origin=${origin}&destination=${destination}&date=${date}&passengers=${passengers}&cabin=${cabin}`);
    };

    const tripTypes: { id: TripType; label: string }[] = [
        { id: 'roundtrip', label: 'Round Trip' },
        { id: 'oneway', label: 'One Way' },
        { id: 'multicity', label: 'Multi-City' },
    ];

    const cabinLabels: Record<string, string> = {
        economy: 'Economy',
        premium_economy: 'Premium Economy',
        business: 'Business',
        first: 'First Class',
    };

    return (
        <form
            onSubmit={handleSearch}
            className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
            {/* ── Row 1: Trip type + Passenger & Cabin ── */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
                {/* Trip type tabs */}
                <div className="flex items-center gap-1">
                    {tripTypes.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setTripType(t.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                tripType === t.id
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Passenger & Cabin dropdowns */}
                <div className="flex items-center gap-2">
                    {/* Passengers */}
                    <div className="relative flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors cursor-pointer">
                        <IconUser className="w-3.5 h-3.5 text-gray-500" />
                        <select
                            value={passengers}
                            onChange={(e) => setPassengers(e.target.value)}
                            className="text-sm font-medium text-gray-700 bg-transparent outline-none cursor-pointer appearance-none pr-4"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                        <IconChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                    </div>

                    {/* Cabin */}
                    <div className="relative flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors cursor-pointer">
                        <IconSeat className="w-3.5 h-3.5 text-gray-500" />
                        <select
                            value={cabin}
                            onChange={(e) => setCabin(e.target.value)}
                            className="text-sm font-medium text-gray-700 bg-transparent outline-none cursor-pointer appearance-none pr-4"
                        >
                            <option value="economy">Economy</option>
                            <option value="premium_economy">Premium Economy</option>
                            <option value="business">Business</option>
                            <option value="first">First Class</option>
                        </select>
                        <IconChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* ── Row 2: Departure | Swap | Destination | Dates | Search ── */}
            <div className="flex items-stretch divide-x divide-gray-100 px-2 py-2">
                {/* Departure */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2 min-w-0">
                    <IconPlane className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="flex flex-col min-w-0 w-full">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Departure</span>
                        <AirportAutocomplete
                            label=""
                            onSelect={(iata) => setOrigin(iata)}
                            initialValue={origin}
                        />
                    </div>
                </div>

                {/* Swap button */}
                <div className="flex items-center px-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            // swap origin/destination visual states are handled by re-mounting
                            const tempOrigin = origin;
                            setOrigin(destination);
                            setDestination(tempOrigin);
                        }}
                        className="w-8 h-8 rounded-full border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                        title="Swap airports"
                    >
                        <IconSwap className="w-4 h-4 text-blue-500" />
                    </button>
                </div>

                {/* Destination */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2 min-w-0">
                    <IconPlaneLanding className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="flex flex-col min-w-0 w-full">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Destination</span>
                        <AirportAutocomplete
                            label=""
                            onSelect={(iata) => setDestination(iata)}
                            initialValue={destination}
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-3 px-4 py-2 w-52 shrink-0">
                    <IconCalendar className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="flex flex-col w-full">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Dates</span>
                        <input
                            type="date"
                            value={date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="text-sm font-semibold text-gray-800 bg-transparent outline-none cursor-pointer w-full"
                            required
                        />
                    </div>
                </div>

                {/* Search Button */}
                <div className="flex items-center px-2 shrink-0">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3 px-7 rounded-xl transition-all duration-150 shadow-md shadow-orange-200 text-sm whitespace-nowrap"
                    >
                        <IconSearch className="w-4 h-4" />
                        Search
                    </button>
                </div>
            </div>
        </form>
    );
}