'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AirportAutocomplete from './AirportAutocomplete';

interface SearchFormProps {
    initialOrigin?: string;
    initialDestination?: string;
    initialDate?: string;
}

export default function SearchForm({ initialOrigin = '', initialDestination = '', initialDate }: SearchFormProps) {
    const router = useRouter();

    const [origin, setOrigin] = useState(initialOrigin);
    const [destination, setDestination] = useState(initialDestination);

    // Default date to tomorrow if no initial date
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

        router.push(`/flights?origin=${origin}&destination=${destination}&date=${date}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto w-full flex flex-col md:flex-row items-end gap-4"
        >
            {/* Origin Autocomplete */}
            <div className="w-full md:w-1/3">
                <AirportAutocomplete
                    label="Where from?"
                    onSelect={(iata) => setOrigin(iata)}
                    initialValue={origin}
                />
            </div>

            {/* Destination Autocomplete */}
            <div className="w-full md:w-1/3">
                <AirportAutocomplete
                    label="Where to?"
                    onSelect={(iata) => setDestination(iata)}
                    initialValue={destination}
                />
            </div>

            {/* Date Picker */}
            <div className="w-full md:w-1/4">
                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                    Departure Date
                </label>
                <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    required
                />
            </div>

            {/* Submit Button */}
            <div className="w-full md:w-auto">
                <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors text-sm h-[42px]"
                >
                    Search
                </button>
            </div>
        </form>
    );
}