import { NextRequest, NextResponse } from 'next/server';
import { Duffel } from '@duffel/api';
import { FlightOffer } from '@/types/flight';

const duffel = new Duffel({
    token: process.env.DUFFEL_ACCESS_TOKEN || '',
});

// Helper: convert ISO 8601 duration (e.g. "PT7H30M") to minutes
function durationToMinutes(iso: string): number {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 0;
    return (parseInt(match[1] || '0') * 60) + parseInt(match[2] || '0');
}

// Helper: format duration as "7h 30m"
function formatDuration(iso: string): string {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return 'N/A';
    const h = match[1] ? `${match[1]}h` : '';
    const m = match[2] ? ` ${match[2]}m` : '';
    return `${h}${m}`.trim();
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const passengersParam = searchParams.get('passengers') || '1';
    const cabinParam = searchParams.get('cabin') || 'economy';

    if (!origin || !destination || !date) {
        return NextResponse.json({ error: 'Missing required parameters: origin, destination, date' }, { status: 400 });
    }

    try {
        // 1. Create an Offer Request
        const numPassengers = parseInt(passengersParam, 10) || 1;
        const passengers = Array(numPassengers).fill({ type: 'adult' });
        
        const offerRequest = await duffel.offerRequests.create({
            slices: [{ origin, destination, departure_date: date, arrival_time: null, departure_time: null }],
            passengers,
            cabin_class: cabinParam as any,
        });

        // 2. List returned offers (sorted cheapest first)
        const offersResponse = await duffel.offers.list({
            offer_request_id: offerRequest.data.id,
            sort: 'total_amount',
        });

        // 3. Map Duffel offers to our FlightOffer type
        const offers: FlightOffer[] = offersResponse.data.map((offer: any) => {
            const slice = offer.slices[0];
            const firstSegment = slice.segments[0];
            const lastSegment = slice.segments[slice.segments.length - 1];
            const stops = slice.segments.length - 1;
            const duration = slice.duration || 'PT0H';

            return {
                id: offer.id,
                airline: offer.owner?.name || 'Unknown',
                airlineCode: offer.owner?.iata_code || '??',
                flightNumber: firstSegment?.marketing_carrier_flight_number
                    ? `${firstSegment.marketing_carrier?.iata_code}${firstSegment.marketing_carrier_flight_number}`
                    : 'N/A',
                origin: {
                    iata: firstSegment?.origin?.iata_code || origin,
                    name: firstSegment?.origin?.name || '',
                    city: firstSegment?.origin?.city_name || '',
                },
                destination: {
                    iata: lastSegment?.destination?.iata_code || destination,
                    name: lastSegment?.destination?.name || '',
                    city: lastSegment?.destination?.city_name || '',
                },
                departureTime: firstSegment?.departing_at || '',
                arrivalTime: lastSegment?.arriving_at || '',
                durationMinutes: durationToMinutes(duration),
                durationFormatted: formatDuration(duration),
                stops,
                price: {
                    amount: parseFloat(offer.total_amount),
                    currency: offer.total_currency,
                },
                passengerId: offer.passengers[0]?.id || '',
            };
        });

        return NextResponse.json({ data: offers });
    } catch (error: any) {
        const message = error?.errors?.[0]?.message || error.message || 'Failed to fetch flights';
        console.error('API route error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
