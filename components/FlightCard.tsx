'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlightOffer } from '@/types/flight';
import PassengerModal, { PassengerFormData } from './PassengerModal';

interface Props {
    flight: FlightOffer;
    departDate: string;
}

// Generate a consistent color for an airline based on its name
function airlineColor(airlineCode: string): { bg: string; text: string } {
    const colors = [
        { bg: 'bg-blue-600', text: 'text-white' },
        { bg: 'bg-red-600', text: 'text-white' },
        { bg: 'bg-emerald-600', text: 'text-white' },
        { bg: 'bg-purple-700', text: 'text-white' },
        { bg: 'bg-amber-500', text: 'text-white' },
        { bg: 'bg-sky-600', text: 'text-white' },
        { bg: 'bg-rose-600', text: 'text-white' },
        { bg: 'bg-indigo-700', text: 'text-white' },
    ];
    const hash = airlineCode.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colors[hash % colors.length];
}

export default function FlightCard({ flight, departDate }: Props) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBookingClick = () => setIsModalOpen(true);

    const handleModalSubmit = async (passengerData: PassengerFormData) => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/flights/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offerId: flight.id,
                    totalAmount: flight.price.amount,
                    currency: flight.price.currency,
                    passenger: {
                        id: flight.passengerId,
                        title: passengerData.title,
                        givenName: passengerData.givenName,
                        familyName: passengerData.familyName,
                        gender: passengerData.gender,
                        bornOn: passengerData.bornOn,
                        email: passengerData.email,
                        phoneNumber: passengerData.phoneNumber,
                    },
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to book flight');

            // Save to local storage for "My Bookings" dashboard
            const { saveBookingToStorage } = await import('@/lib/BookingStorage');
            saveBookingToStorage({
                orderId: data.order.id,
                bookingReference: data.order.booking_reference,
                passengerName: `${passengerData.givenName} ${passengerData.familyName}`,
                origin: flight.origin.iata,
                destination: flight.destination.iata,
                departureTime: flight.departureTime,
                totalAmount: flight.price.amount,
                currency: flight.price.currency,
                bookedAt: new Date().toISOString(),
            });

            router.push(`/booking-success?orderId=${data.order.id}&reference=${data.order.booking_reference}`);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const depTime = new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const arrTime = new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if arrival is next day
    const depDate = new Date(flight.departureTime);
    const arrDate = new Date(flight.arrivalTime);
    const dayDiff = Math.round((arrDate.getTime() - depDate.getTime()) / (1000 * 60 * 60 * 24));

    const { bg, text } = airlineColor(flight.airlineCode || flight.airline);

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                    {/* Airline Logo Block */}
                    <div className="flex items-center gap-4 md:w-48 shrink-0">
                        <div className={`w-12 h-12 rounded-xl ${bg} ${text} flex items-center justify-center font-black text-sm shrink-0 shadow-sm`}>
                            {flight.airlineCode || flight.airline.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm leading-tight">{flight.airline}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{flight.flightNumber}</p>
                            <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                flight.stops === 0
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-orange-50 text-orange-600'
                            }`}>
                                {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                            </span>
                        </div>
                    </div>

                    {/* Flight Timeline */}
                    <div className="flex-1 flex items-center justify-between md:justify-center gap-3">
                        {/* Departure */}
                        <div className="text-center">
                            <p className="text-2xl font-black text-gray-900 tabular-nums">{depTime}</p>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5">{flight.origin?.iata ?? flight.origin as unknown as string}</p>
                        </div>

                        {/* Duration line */}
                        <div className="flex-1 flex flex-col items-center gap-1 min-w-[80px] max-w-[160px]">
                            <span className="text-[10px] text-gray-400 font-medium">{flight.durationFormatted}</span>
                            <div className="w-full relative flex items-center">
                                <div className="h-px flex-1 bg-gray-200" />
                                {flight.stops > 0 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-orange-400 rounded-full border-2 border-white shadow-sm" />
                                )}
                                <div className="absolute right-0 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-gray-300" />
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                                {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                            </span>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                            <p className="text-2xl font-black text-gray-900 tabular-nums">
                                {arrTime}
                                {dayDiff > 0 && <sup className="text-xs text-orange-500 font-bold ml-0.5">+{dayDiff}</sup>}
                            </p>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5">{flight.destination?.iata ?? flight.destination as unknown as string}</p>
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:w-36 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <div className="text-right">
                            <p className="text-2xl font-black text-gray-900">
                                ${flight.price.amount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-gray-400">incl. taxes & fees</p>
                        </div>
                        <button
                            onClick={handleBookingClick}
                            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all duration-150 shadow-sm shadow-orange-200 whitespace-nowrap"
                        >
                            Select →
                        </button>
                    </div>
                </div>
            </div>

            <PassengerModal
                isOpen={isModalOpen}
                flightPrice={flight.price.amount}
                currency={flight.price.currency}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                isSubmitting={isSubmitting}
            />
        </>
    );
}