// app/flights/booking-success/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const reference = searchParams.get('reference');

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg space-y-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                </div>

                <div>
                    <h1 className="text-2xl font-black text-gray-900">Flight Booking Confirmed!</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Your ticket has been booked via Duffel Test API.
                    </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-left text-sm border">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Order ID:</span>
                        <span className="font-mono font-bold text-gray-900">{orderId || 'ord_12345'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Booking Reference:</span>
                        <span className="font-mono font-bold text-blue-600">{reference || 'DUFFEL-TEST'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                            Confirmed (Paid)
                        </span>
                    </div>
                </div>

                <Link
                    href="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors text-sm"
                >
                    Back to Homepage
                </Link>
            </div>
        </div>
    );
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={<div className="text-center py-20">Loading confirmation...</div>}>
            <SuccessContent />
        </Suspense>
    );
}