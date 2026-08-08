// components/FlightStatusTracker.tsx
'use client';

import { useState, useEffect } from 'react';

interface FlightStatusProps {
    flightNumber: string;
    origin: string;
    destination: string;
    orderId?: string;
}

interface TrackerData {
    flightNumber: string;
    origin: string;
    destination: string;
    airline: string;
    terminal: string;
    gate: string;
    status: 'Scheduled' | 'Boarding' | 'In Air' | 'Landed' | 'On Time';
    departureTime?: string;
    arrivalTime?: string;
}

export default function FlightStatusTracker({ flightNumber, origin, destination, orderId }: FlightStatusProps) {
    const [trackerData, setTrackerData] = useState<TrackerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadLiveTrackerData() {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    flightNumber,
                    origin,
                    destination,
                });
                if (orderId) params.append('orderId', orderId);

                const res = await fetch(`/api/flights/tracker?${params.toString()}`);
                const json = await res.json();

                if (res.ok && json.data && isMounted) {
                    setTrackerData(json.data);
                }
            } catch (err) {
                console.error('Error fetching live flight status tracker data:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadLiveTrackerData();
        return () => {
            isMounted = false;
        };
    }, [flightNumber, origin, destination, orderId]);

    const status = trackerData?.status || 'On Time';
    const gate = trackerData?.gate || 'B22';
    const terminal = trackerData?.terminal || 'Terminal 4';

    const statusColors = {
        'Scheduled': 'bg-blue-100 text-blue-700 border-blue-200',
        'Boarding': 'bg-orange-100 text-orange-700 border-orange-200',
        'In Air': 'bg-purple-100 text-purple-700 border-purple-200',
        'Landed': 'bg-slate-100 text-slate-700 border-slate-200',
        'On Time': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <span className="text-xs text-gray-400 font-semibold uppercase block">Live Flight Tracker</span>
                    <h3 className="text-xl font-black text-gray-900">{flightNumber}</h3>
                </div>
                <span className={`font-bold text-xs px-3 py-1 rounded-full border ${statusColors[status] || statusColors['On Time']}`}>
                    ● {loading ? 'Loading...' : status}
                </span>
            </div>

            {/* Visual Route Indicator */}
            <div className="flex items-center justify-between py-2">
                <div className="text-center">
                    <p className="text-2xl font-black text-gray-900">{origin}</p>
                    <p className="text-xs text-gray-400">Origin</p>
                </div>

                <div className="flex-1 px-6 flex flex-col items-center">
                    <div className="w-full bg-gray-200 h-1.5 rounded-full relative overflow-hidden">
                        <div className="bg-blue-600 h-full w-2/3 rounded-full animate-pulse" />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 font-semibold">
                        {loading ? 'Fetching...' : status === 'In Air' ? 'In Transit' : status}
                    </span>
                </div>

                <div className="text-center">
                    <p className="text-2xl font-black text-gray-900">{destination}</p>
                    <p className="text-xs text-gray-400">Destination</p>
                </div>
            </div>

            {/* Gate & Terminal Details */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl text-xs">
                <div>
                    <span className="text-gray-400 block">Terminal</span>
                    <span className="font-bold text-gray-800 text-sm">
                        {loading ? '...' : terminal}
                    </span>
                </div>
                <div>
                    <span className="text-gray-400 block">Gate</span>
                    <span className="font-bold text-gray-800 text-sm">
                        {loading ? '...' : gate}
                    </span>
                </div>
            </div>
        </div>
    );
}