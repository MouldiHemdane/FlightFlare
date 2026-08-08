// app/api/flights/email/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function POST(request: Request) {
    try {
        const { toEmail, passengerName, bookingReference, origin, destination, amount } = await request.json();

        if (!toEmail || !bookingReference) {
            return NextResponse.json({ error: 'Missing required email fields' }, { status: 400 });
        }

        const data = await resend.emails.send({
            from: 'FlightFlare <tickets@flightflare.com>',
            to: [toEmail],
            subject: `Your Flight Confirmation - Ref: ${bookingReference}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #2563eb; text-align: center;">FlightFlare Confirmation</h2>
          <p>Hi <strong>${passengerName}</strong>,</p>
          <p>Your flight booking has been successfully processed and confirmed.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Booking Reference:</strong> <span style="color: #2563eb;">${bookingReference}</span></p>
            <p style="margin: 4px 0;"><strong>Route:</strong> ${origin} ➔ ${destination}</p>
            <p style="margin: 4px 0;"><strong>Total Paid:</strong> $${amount} USD</p>
          </div>

          <p style="font-size: 12px; color: #64748b; text-align: center;">
            Thank you for flying with FlightFlare!
          </p>
        </div>
      `,
        });

        return NextResponse.json({ success: true, id: data.id });
    } catch (error: any) {
        console.error('Failed to send itinerary email:', error);
        return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
    }
}