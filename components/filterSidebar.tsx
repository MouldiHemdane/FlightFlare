// src/components/FilterSidebar.tsx
'use client';

import { FilterState } from '@/types/flight';

interface Props {
    filters: FilterState;
    availableAirlines: string[];
    maxPossiblePrice: number;
    onChange: (newFilters: FilterState) => void;
    onReset: () => void;
}

export default function FilterSidebar({
    filters,
    availableAirlines,
    maxPossiblePrice,
    onChange,
    onReset,
}: Props) {
    const handleAirlineToggle = (airline: string) => {
        const exists = filters.selectedAirlines.includes(airline);
        const updated = exists
            ? filters.selectedAirlines.filter((a) => a !== airline)
            : [...filters.selectedAirlines, airline];

        onChange({ ...filters, selectedAirlines: updated });
    };

    return (
        <div className="w-full lg:w-64 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
                <button
                    onClick={onReset}
                    className="text-xs text-blue-600 hover:underline font-medium"
                >
                    Reset All
                </button>
            </div>

            {/* Price Filter */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Max Price: <span className="text-blue-600">${filters.maxPrice}</span>
                </label>
                <input
                    type="range"
                    min={50}
                    max={maxPossiblePrice || 2000}
                    step={25}
                    value={filters.maxPrice}
                    onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>$50</span>
                    <span>${maxPossiblePrice || 2000}</span>
                </div>
            </div>

            {/* Stops Filter */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Stops</label>
                <div className="space-y-2 text-sm text-gray-600">
                    {[
                        { id: 'all', label: 'All Flights' },
                        { id: 'direct', label: 'Direct Only (0 stops)' },
                        { id: '1stop', label: '1 Stop or less' },
                    ].map((option) => (
                        <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="stops"
                                checked={filters.stops === option.id}
                                onChange={() => onChange({ ...filters, stops: option.id as FilterState['stops'] })}
                                className="text-blue-600 accent-blue-600"
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Airlines Filter */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Airlines</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-sm text-gray-600">
                    {availableAirlines.map((airline) => (
                        <label key={airline} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.selectedAirlines.length === 0 || filters.selectedAirlines.includes(airline)}
                                onChange={() => handleAirlineToggle(airline)}
                                className="rounded text-blue-600 accent-blue-600"
                            />
                            <span>{airline}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}