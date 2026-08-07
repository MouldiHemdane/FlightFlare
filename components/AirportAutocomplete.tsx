'use client';
import { useState, useEffect, useRef } from 'react';

interface PlaceSuggestion {
    id: string;
    name: string;
    type: string;
    iataCode: string;
    city: string;
    country: string;
}

interface Props {
    label: string;
    onSelect: (code: string) => void;
    initialValue?: string;
}

export default function AirportAutocomplete({ label, onSelect, initialValue = '' }: Props) {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Prevent fetching on initial load when using initialValue
    const isFirstRender = useRef(true);
    // Prevent fetching immediately after selecting an option
    const isSelected = useRef(false);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (isSelected.current) {
            return; // Skip fetch if the query changed because we just selected an option
        }

        const fetchPlaces = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
                const json = await res.json();
                setSuggestions(json.data || []);
            } catch (err) {
                console.error('Failed to fetch places:', err);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce the API call by 300ms
        const timeoutId = setTimeout(fetchPlaces, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="relative flex flex-col w-full">
            {label && <label className="text-xs font-semibold text-gray-600 mb-1">{label}</label>}
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    isSelected.current = false;
                    setQuery(e.target.value);
                }}
                placeholder="City or Airport (e.g. JFK, London)"
                className="text-sm font-semibold text-gray-800 bg-transparent outline-none placeholder:text-gray-400 placeholder:font-normal w-full"
            />
            {suggestions.length > 0 && (
                <ul className="absolute top-[calc(100%+8px)] z-20 w-full min-w-[240px] bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {suggestions.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => {
                                isSelected.current = true;
                                setQuery(`${item.name} (${item.iataCode})`);
                                onSelect(item.iataCode);
                                setSuggestions([]);
                            }}
                            className="p-3 text-sm hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900">{item.name}</span>
                                <span className="text-xs text-gray-500">{item.city}, {item.country} • {item.type}</span>
                            </div>
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 ml-2 shrink-0">
                                {item.iataCode}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            {loading && query.length >= 2 && !isSelected.current && (
                <div className="absolute top-[calc(100%+8px)] z-20 w-full bg-white border rounded-xl shadow-xl p-3 text-sm text-gray-500 text-center animate-pulse">
                    Searching places...
                </div>
            )}
        </div>
    );
}