interface FlightProps {
    airline: string;
    price: string;
    currency: string;
    duration: string;
    slices: any[];
}

export default function FlightCard({ airline, price, currency, slices }: FlightProps) {
    const firstSlice = slices[0];
    const segment = firstSlice?.segments[0];

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition flex justify-between items-center my-3">
            <div>
                <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">{airline}</span>
                <div className="text-lg font-semibold mt-1">
                    {segment?.origin?.iata_code} ➔ {segment?.destination?.iata_code}
                </div>
                <div className="text-xs text-gray-500">
                    Depart: {new Date(segment?.departing_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">{price} {currency}</div>
                <button className="mt-2 bg-blue-600 text-white text-xs px-4 py-2 rounded-md hover:bg-blue-700">
                    Select Flight
                </button>
            </div>
        </div>
    );
}