'use client';

import { SortOption } from '@/types/flight';

interface Props {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    resultCount: number;
}

export default function SortBar({ currentSort, onSortChange, resultCount }: Props) {
    const options: { id: SortOption; label: string; sub: string }[] = [
        { id: 'cheapest', label: 'Best', sub: 'Best value' },
        { id: 'cheapest', label: 'Cheapest', sub: 'Lowest price' },
        { id: 'fastest', label: 'Fastest', sub: 'Short flight' },
    ];

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

            <span className="text-sm text-gray-500">
                <span className="font-bold text-gray-800">{resultCount}</span> flights found
            </span>
        </div>
    );
}