// app/api/webhooks/duffel/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const eventType = body.type || body.event?.type;

        console.log(`[Duffel Webhook] Event Received: ${eventType}`);

        switch (eventType) {
            case 'ping':
                console.log('[Duffel Webhook] Ping event received - Webhook endpoint active!');
                return NextResponse.json({ message: 'pong' }, { status: 200 });

            case 'order.created':
                console.log('[Duffel Webhook] Order created successfully:', body.data?.id || body.data);
                break;

            case 'order.airline_initiated_change':
                console.warn('[Duffel Webhook] Airline schedule change alert for order:', body.data?.id || body.data);
                break;

            case 'order.cancelled':
                console.warn('[Duffel Webhook] Order cancelled:', body.data?.id || body.data);
                break;

            default:
                console.log(`[Duffel Webhook] Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ received: true, event: eventType }, { status: 200 });
    } catch (error: any) {
        console.error('[Duffel Webhook] Processing Error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
    }
}