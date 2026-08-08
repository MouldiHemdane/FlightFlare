// app/api/flights/email/route.ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { toEmail, passengerName, bookingReference, origin, destination, amount } = await request.json();

        if (!toEmail || !bookingReference) {
            return NextResponse.json({ error: 'Missing required email fields' }, { status: 400 });
        }

        const resendResult = await resend.emails.send({
            from: 'FlightFlare <tickets@flightflare.com>',
            to: [toEmail],
            subject: `Your Flight Confirmation - Ref: ${bookingReference}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>FlightFlare Confirmation</h2>
          <p>Hi <strong>${passengerName}</strong>,</p>
          <p>Your booking ref: <strong>${bookingReference}</strong> (${origin} ➔ ${destination}) for $${amount} is confirmed.</p>
        </div>
      `,
        });

        // Check if error exists on the result
        if (resendResult.error) {
            console.error('Resend API Error:', resendResult.error);
            return NextResponse.json({ error: resendResult.error.message }, { status: 400 });
        }

        // Safely extract the email ID using type casting to bypass the union check
        const emailId = (resendResult.data as { id: string } | null)?.id;

        return NextResponse.json({ success: true, id: emailId });
    } catch (error: any) {
        console.error('Failed to send itinerary email:', error);
        return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
    }
}