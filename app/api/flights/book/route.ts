// app/api/flights/book/route.ts
import { Duffel } from '@duffel/api';
import { NextResponse } from 'next/server';

const duffel = new Duffel({
    token: process.env.DUFFEL_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { offerId, passenger, totalAmount, currency } = body;

        if (!offerId || !passenger) {
            return NextResponse.json(
                { error: 'Missing offerId or passenger details' },
                { status: 400 }
            );
        }

        // 1. Create the Duffel Order
        const order = await duffel.orders.create({
            selected_offers: [offerId],
            passengers: [
                {
                    id: passenger.id, // ID returned from offer request passenger schema
                    title: passenger.title, // 'mr', 'ms', 'mrs'
                    given_name: passenger.givenName,
                    family_name: passenger.familyName,
                    gender: passenger.gender, // 'm' or 'f'
                    born_on: passenger.bornOn, // 'YYYY-MM-DD'
                    email: passenger.email,
                    phone_number: passenger.phoneNumber, // e.g. '+16175551212'
                },
            ],
            type: 'instant', // Instant ticketing or holds if supported
            payments: [
                {
                    type: 'balance', // Pays using Duffel test credit balance
                    currency: currency || 'USD',
                    amount: totalAmount,
                },
            ],
        });

        return NextResponse.json({ success: true, order: order.data });
    } catch (error: any) {
        console.error('Duffel Order Creation Error:', error?.errors || error);
        return NextResponse.json(
            { error: error?.errors?.[0]?.message || 'Failed to create booking order' },
            { status: 500 }
        );
    }
}