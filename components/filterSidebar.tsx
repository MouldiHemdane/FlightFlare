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

    const pricePercent = ((filters.maxPrice - 50) / ((maxPossiblePrice || 2000) - 50)) * 100;

    return (
        <div className="w-full lg:w-64 shrink-0 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                        Filters
                    </h3>
                    <button
                        onClick={onReset}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                        Reset all
                    </button>
                </div>

                {/* Price Range */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-gray-700">Price Range</label>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span className="font-semibold">$50</span>
                        <span className="font-semibold text-blue-600">${filters.maxPrice.toLocaleString()}</span>
                    </div>
                    <div className="relative">
                        <input
                            type="range"
                            min={50}
                            max={maxPossiblePrice || 2000}
                            step={25}
                            value={filters.maxPrice}
                            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-600"
                            style={{
                                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pricePercent}%, #e5e7eb ${pricePercent}%, #e5e7eb 100%)`
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>Min</span>
                        <span>${maxPossiblePrice || 2000}</span>
                    </div>
                </div>

                {/* Stops */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <label className="text-sm font-bold text-gray-700 block mb-3">Stops</label>
                    <div className="space-y-2.5">
                        {[
                            { id: 'all', label: 'Any stop', sub: 'All flights' },
                            { id: 'direct', label: 'Non-stop', sub: '0 stops' },
                            { id: '1stop', label: '1 Stop', sub: '1 or fewer stops' },
                        ].map((option) => (
                            <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    filters.stops === option.id ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                                }`}>
                                    {filters.stops === option.id && (
                                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    )}
                                </div>
                                <input
                                    type="radio"
                                    name="stops"
                                    checked={filters.stops === option.id}
                                    onChange={() => onChange({ ...filters, stops: option.id as FilterState['stops'] })}
                                    className="sr-only"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-800">{option.label}</span>
                                    <span className="text-xs text-gray-400 ml-1.5">({option.sub})</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Airlines */}
                <div className="px-5 py-4">
                    <label className="text-sm font-bold text-gray-700 block mb-3">Airlines</label>
                    <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                        {availableAirlines.map((airline) => {
                            const checked = filters.selectedAirlines.length === 0 || filters.selectedAirlines.includes(airline);
                            return (
                                <label key={airline} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                        checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                                    }`}>
                                        {checked && (
                                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                                <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleAirlineToggle(airline)}
                                        className="sr-only"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">{airline}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}