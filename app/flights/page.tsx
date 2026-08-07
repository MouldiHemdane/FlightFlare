import { searchFlights } from '@/services/flightProvider';
import FlightCard from '@/components/FlightCard';
import Link from 'next/link';

interface FlightsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FlightsPage({ searchParams }: FlightsPageProps) {
    const params = await searchParams;
    const origin = params.origin as string;
    const destination = params.destination as string;
    const date = params.date as string;

    if (!origin || !destination || !date) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center pt-24">
                <h1 className="text-2xl font-bold mb-4">Invalid Search</h1>
                <p className="mb-4">Please provide an origin, destination, and departure date.</p>
                <Link href="/" className="text-blue-600 font-semibold hover:underline">Return to Search</Link>
            </div>
        );
    }

    let offers: any[] = [];
    let error = null;
    
    try {
        offers = await searchFlights({ origin, destination, departureDate: date });
    } catch (e: any) {
        error = e.message;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Flights: <span className="text-blue-600">{origin}</span> ➔ <span className="text-blue-600">{destination}</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Departing on {date}</p>
                    </div>
                    <Link href="/" className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        New Search
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <h3 className="font-bold">Error fetching flights</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {!error && offers.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                        <div className="text-4xl mb-4">🛫</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No flights available</h2>
                        <p className="text-gray-500">We couldn't find any flights for this route on {date}. Try adjusting your search criteria.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {offers.map((offer: any) => (
                        <FlightCard
                            key={offer.id}
                            airline={offer.owner?.name || 'Unknown Airline'}
                            price={offer.total_amount}
                            currency={offer.total_currency}
                            duration={offer.slices[0]?.duration}
                            slices={offer.slices}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
