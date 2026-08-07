// src/components/FlightCard.tsx
'use client';

import { FlightOffer } from '@/types/flight';
import { buildAffiliateUrl } from '@/lib/affiliate';

interface Props {
    flight: FlightOffer;
    departDate: string;
}

export default function FlightCard({ flight, departDate }: Props) {
    const handleBooking = () => {
        const redirectUrl = buildAffiliateUrl({
            origin: flight.origin.iata,
            destination: flight.destination.iata,
            departDate: departDate,
            airlineCode: flight.airlineCode,
        });

        // Open Google Flights filtered to this airline's flights in a new tab
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Airline info */}
            <div className="flex items-center space-x-4 min-w-[160px]">
                <div className="w-10 h-10 bg-blue-50 text-blue-700 font-bold rounded-lg flex items-center justify-center text-sm border border-blue-100">
                    {flight.airlineCode}
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-sm">{flight.airline}</p>
                    <p className="text-xs text-gray-400">{flight.flightNumber}</p>
                </div>
            </div>

            {/* Flight timing details */}
            <div className="flex items-center space-x-6">
                <div className="text-center">
                    <p className="text-lg font-extrabold text-gray-900">
                        {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">{flight.origin.iata}</p>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-medium">{flight.durationFormatted}</span>
                    <div className="w-24 border-t-2 border-gray-300 relative my-1">
                        {flight.stops > 0 && (
                            <span className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-3 h-3 bg-orange-400 rounded-full border-2 border-white" />
                        )}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500">
                        {flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}
                    </span>
                </div>

                <div className="text-center">
                    <p className="text-lg font-extrabold text-gray-900">
                        {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">{flight.destination.iata}</p>
                </div>
            </div>

            {/* Price & Action */}
            <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                <div className="text-left md:text-right">
                    <p className="text-2xl font-black text-blue-600">${flight.price.amount}</p>
                    <p className="text-[10px] text-gray-400">incl. taxes & fees</p>
                </div>

                <button
                    onClick={handleBooking}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-5 rounded-lg transition-colors flex items-center space-x-1"
                >
                    <span>Select Deal</span>
                    <span>→</span>
                </button>
            </div>
        </div>
    );
}