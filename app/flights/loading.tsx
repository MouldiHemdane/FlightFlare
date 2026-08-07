export default function LoadingFlights() {
    return (
        <div className="min-h-screen bg-gray-50 pt-12 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header Skeleton */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse mb-3"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Loading Indicator */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-12 text-center mb-8 flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-6">
                        {/* Radar / Pulse Animation */}
                        <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-blue-200 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
                            ✈️
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Scouring the skies...</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Flight searches take a moment because we're checking dozens of airline databases in real-time to find you the absolute best prices.
                    </p>
                </div>

                {/* Flight Card Skeletons */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 animate-pulse">
                            <div className="flex flex-col gap-3 w-full md:w-1/2">
                                <div className="h-3 w-16 bg-gray-200 rounded-full"></div>
                                <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="flex flex-col items-end gap-3 w-full md:w-1/4">
                                <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
                                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
