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
                    id: passenger.id,
                    title: passenger.title,
                    given_name: passenger.givenName,
                    family_name: passenger.familyName,
                    gender: passenger.gender,
                    born_on: passenger.bornOn,
                    email: passenger.email,
                    phone_number: passenger.phoneNumber,
                },
            ],
            type: 'instant',
            payments: [
                {
                    type: 'balance',
                    currency: currency || 'USD',
                    amount: typeof totalAmount === 'number' ? totalAmount.toFixed(2) : String(totalAmount),
                },
            ],
        });

        return NextResponse.json({ success: true, order: order.data });
    } catch (error: any) {
        console.error('Duffel Order Creation Error:', error?.errors || error);
        const errorMessage = error?.errors?.[0]?.message || error?.message || 'Failed to create booking order';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}