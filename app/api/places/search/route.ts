import { NextRequest, NextResponse } from 'next/server';
import { Duffel } from '@duffel/api';

const duffel = new Duffel({
    token: process.env.DUFFEL_ACCESS_TOKEN || '',
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json({ data: [] });
    }

    try {
        // Use Duffel's Suggestions API to get live airport/city suggestions
        const response = await duffel.suggestions.list({ query });
        
        // Map it to a simpler format for our autocomplete component
        const places = response.data.map((place: any) => ({
            id: place.id,
            name: place.name,
            type: place.type, // 'airport' or 'city'
            iataCode: place.iata_code,
            city: place.city_name || place.name,
            country: place.iata_country_code
        })).filter((place: any) => place.iataCode); // Ensure we only return places with valid IATA codes

        return NextResponse.json({ data: places });
    } catch (error: any) {
        console.error('Duffel places search error:', error.message);
        return NextResponse.json({ error: 'Failed to search places' }, { status: 500 });
    }
}
