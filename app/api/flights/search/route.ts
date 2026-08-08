// app/api/flights/search/route.ts
import { Duffel } from '@duffel/api';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

const duffel = new Duffel({
    token: process.env.DUFFEL_ACCESS_TOKEN || '',
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const origin = (searchParams.get('origin') || 'JFK').toUpperCase();
    const destination = (searchParams.get('destination') || 'CDG').toUpperCase();
    const date = searchParams.get('date') || '2026-09-15';
    const passengersCount = Math.max(1, parseInt(searchParams.get('passengers') || '1', 10));
    const cabin = (searchParams.get('cabin') || 'economy') as 'economy' | 'business' | 'first' | 'premium_economy';

    const cacheKey = `search:${origin}:${destination}:${date}:${passengersCount}:${cabin}`;

    try {
        // 1. Check Redis Cache First
        if (process.env.UPSTASH_REDIS_REST_URL) {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                return NextResponse.json({ data: cachedData, source: 'cache' });
            }
        }

        // 2. Fetch live data from Duffel if Cache Miss
        const passengers = Array.from({ length: passengersCount }, () => ({ type: 'adult' as const }));
        const offerRequest = await duffel.offerRequests.create({
            slices: [{ origin, destination, departure_date: date }],
            passengers,
            cabin_class: cabin,
        });

        const offersResponse = await duffel.offers.list({
            offer_request_id: offerRequest.data.id,
            limit: 20,
        });

        const formattedFlights = offersResponse.data.map((offer) => {
            const slice = offer.slices[0];
            const firstSegment = slice.segments[0];
            const lastSegment = slice.segments[slice.segments.length - 1];
            const owner = offer.owner;

            // Use segment-level times — slice does NOT have departing_at/arriving_at
            const departureTime = firstSegment.departing_at;
            const arrivalTime = lastSegment.arriving_at;

            const totalMinutes = slice.segments.reduce((acc, seg) => {
                const dep = new Date(seg.departing_at).getTime();
                const arr = new Date(seg.arriving_at).getTime();
                return acc + Math.round((arr - dep) / (1000 * 60));
            }, 0);

            return {
                id: offer.id,
                passengerId: offer.passengers[0]?.id,
                airline: owner.name,
                airlineCode: owner.iata_code || 'YY',
                flightNumber: `${owner.iata_code || 'YY'}-${firstSegment.marketing_flight_number}`,
                origin: { iata: slice.origin.iata_code, city: (slice.origin as any).city_name || slice.origin.name },
                destination: { iata: slice.destination.iata_code, city: (slice.destination as any).city_name || slice.destination.name },
                departureTime,
                arrivalTime,
                durationMinutes: totalMinutes,
                durationFormatted: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
                stops: slice.segments.length - 1,
                price: { amount: parseFloat(offer.total_amount), currency: offer.total_currency },
            };
        });

        // 3. Save to Redis Cache with a 15-minute (900 seconds) Expiration
        if (process.env.UPSTASH_REDIS_REST_URL) {
            await redis.set(cacheKey, JSON.stringify(formattedFlights), { ex: 900 });
        }

        return NextResponse.json({ data: formattedFlights, source: 'live' });
    } catch (error: any) {
        console.error('Duffel API Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch flight offers' }, { status: 500 });
    }
}