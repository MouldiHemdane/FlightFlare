// app/api/flights/order/[id]/route.ts
import { Duffel } from '@duffel/api';
import { NextResponse } from 'next/server';

const duffel = new Duffel({
    token: process.env.DUFFEL_ACCESS_TOKEN || '',
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: orderId } = await params;

    if (!orderId) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        // Retrieve full order object from Duffel
        const order = await duffel.orders.get(orderId);

        return NextResponse.json({ data: order.data });
    } catch (error: any) {
        console.error('Error retrieving Duffel Order:', error?.errors || error);
        return NextResponse.json(
            { error: error?.errors?.[0]?.message || 'Order not found' },
            { status: 404 }
        );
    }
}