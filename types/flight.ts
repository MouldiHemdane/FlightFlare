// src/types/flight.ts

export interface FlightOffer {
    id: string;
    airline: string;
    airlineCode: string;
    flightNumber: string;
    origin: { iata: string; name: string; city: string };
    destination: { iata: string; name: string; city: string };
    departureTime: string; // ISO String
    arrivalTime: string;   // ISO String
    durationMinutes: number;
    durationFormatted: string; // e.g. "7h 30m"
    stops: number;
    price: {
        amount: number;
        currency: string;
    };
    passengerId: string;
}

export type SortOption = 'cheapest' | 'fastest' | 'earliest';

export interface FilterState {
    maxPrice: number;
    stops: 'all' | 'direct' | '1stop';
    selectedAirlines: string[];
}