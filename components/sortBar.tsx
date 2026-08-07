// src/components/SortBar.tsx
'use client';

import { SortOption } from '@/types/flight';

interface Props {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    resultCount: number;
}

export default function SortBar({ currentSort, onSortChange, resultCount }: Props) {
    const options: { id: SortOption; label: string }[] = [
        { id: 'cheapest', label: 'Cheapest' },
        { id: 'fastest', label: 'Fastest' },
        { id: 'earliest', label: 'Earliest' },
    ];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4 gap-3">
            <span className="text-sm font-semibold text-gray-600">
                Showing <span className="text-gray-900 font-bold">{resultCount}</span> flights
            </span>

            <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 font-medium mr-1">Sort by:</span>
                <div className="inline-flex bg-gray-100 p-1 rounded-lg">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => onSortChange(opt.id)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currentSort === opt.id
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}