import { Duffel } from '@duffel/api';

const duffel = new Duffel({
    token: process.env.DUFFEL_ACCESS_TOKEN || '',
});

export interface FlightSearchParams {
    origin: string;      // e.g., "JFK"
    destination: string; // e.g., "CDG"
    departureDate: string; // e.g., "2026-06-15"
    passengers?: number;
}

export async function searchFlights({ origin, destination, departureDate, passengers = 1 }: FlightSearchParams) {
    try {
        // 1. Create an Offer Request with Duffel
        const response = await duffel.offerRequests.create({
            slices: [
                {
                    origin,
                    destination,
                    departure_date: departureDate,
                },
            ],
            passengers: Array(passengers).fill({ type: 'adult' }),
            cabin_class: 'economy',
        });

        // 2. Fetch returned flight offers
        const offers = await duffel.offers.list({
            offer_request_id: response.data.id,
            sort: 'total_amount', // Sort by cheapest first
        });

        return offers.data;
    } catch (error: any) {
        // Log the specific Duffel API errors if available so it doesn't crash Next.js dev overlay
        const errorMessage = error?.errors?.[0]?.message || error.message || 'Unknown error';
        console.error('Error fetching flight offers:', errorMessage);
        throw new Error('Failed to query flight data');
    }
}