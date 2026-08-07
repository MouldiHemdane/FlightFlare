'use client';
import { useState } from 'react';
import airportsData from '@/lib/iataData.json';

const airports = Object.values(airportsData)
    .filter((a: any) => a.iata && a.iata.length === 3)
    .map((a: any) => ({
        ...a,
        code: a.iata
    }));

interface Props {
    label: string;
    onSelect: (code: string) => void;
    initialValue?: string;
}

export default function AirportAutocomplete({ label, onSelect, initialValue = '' }: Props) {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<typeof airports>([]);

    const handleSearch = (text: string) => {
        setQuery(text);
        if (text.length > 1) {
            const filtered = airports.filter(
                (a) =>
                    (a.city || '').toLowerCase().includes(text.toLowerCase()) ||
                    (a.code || '').toLowerCase().includes(text.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="relative flex flex-col w-full">
            <label className="text-xs font-semibold text-gray-600 mb-1">{label}</label>
            <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="City or Airport (e.g. JFK)"
                className="border p-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            {suggestions.length > 0 && (
                <ul className="absolute top-16 z-10 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((item) => (
                        <li
                            key={item.code}
                            onClick={() => {
                                setQuery(`${item.city} (${item.code})`);
                                onSelect(item.code);
                                setSuggestions([]);
                            }}
                            className="p-2 text-sm hover:bg-gray-100 cursor-pointer flex justify-between"
                        >
                            <span>{item.city} - {item.name}</span>
                            <span className="font-bold text-blue-600">{item.code}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}