'use client';

import { SortOption } from '@/types/flight';

interface Props {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    resultCount: number;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export default function SortBar({ currentSort, onSortChange, resultCount, onRefresh, isRefreshing }: Props) {
    const uniqueOptions: { id: SortOption; label: string; sub: string }[] = [
        { id: 'cheapest', label: 'Cheapest', sub: 'Lowest price' },
        { id: 'fastest', label: 'Fastest', sub: 'Short flight' },
        { id: 'earliest', label: 'Earliest', sub: 'First departure' },
    ];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm mb-4 gap-3">
            <div className="flex items-center gap-1">
                {uniqueOptions.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSortChange(opt.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            currentSort === opt.id
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                    >
                        {opt.label}
                        <span className={`block text-[10px] font-normal mt-0.5 ${currentSort === opt.id ? 'text-blue-100' : 'text-gray-400'}`}>
                            {opt.sub}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
                <span className="text-sm text-gray-500">
                    <span className="font-bold text-gray-800">{resultCount}</span> flights found
                </span>

                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-2 rounded-lg border border-blue-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        title="Re-fetch live Duffel fares and update offer sorting"
                    >
                        <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M23 4v6h-6M1 20v-6h6" />
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                        {isRefreshing ? 'Updating...' : 'Sync Live Prices'}
                    </button>
                )}
            </div>
        </div>
    );
}