'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlightOffer, FilterState, SortOption } from '@/types/flight';
import FilterSidebar from '@/components/filterSidebar';
import SortBar from '@/components/sortBar';
import FlightCard from '@/components/FlightCard';
import SearchForm from '@/components/SearchForm';

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departDate = searchParams.get('date') || '';
  const passengersParam = searchParams.get('passengers') || '1';
  const cabinParam = searchParams.get('cabin') || 'economy';

  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sort, setSort] = useState<SortOption>('cheapest');
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 2000,
    stops: 'all',
    selectedAirlines: [],
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFlights = async (showFullSpinner = false) => {
    if (!origin || !destination || !departDate) {
      setLoading(false);
      return;
    }
    if (showFullSpinner) setLoading(true);
    else setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/flights/search?origin=${origin}&destination=${destination}&date=${departDate}&passengers=${passengersParam}&cabin=${cabinParam}`,
        { cache: 'no-store' }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch flights');
      const data: FlightOffer[] = json.data || [];
      setFlights(data);
      if (data.length > 0) {
        const highestPrice = Math.max(...data.map((f) => f.price.amount));
        setFilters((prev) => ({ ...prev, maxPrice: Math.max(prev.maxPrice, highestPrice) }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFlights(true);
  }, [origin, destination, departDate, passengersParam, cabinParam]);

  const availableAirlines = useMemo(
    () => Array.from(new Set(flights.map((f) => f.airline))),
    [flights]
  );

  const maxPossiblePrice = useMemo(
    () => (flights.length > 0 ? Math.max(...flights.map((f) => f.price.amount)) : 2000),
    [flights]
  );

  const filteredAndSortedFlights = useMemo(() => {
    return flights
      .filter((flight) => {
        if (flight.price.amount > filters.maxPrice) return false;
        if (filters.stops === 'direct' && flight.stops !== 0) return false;
        if (filters.stops === '1stop' && flight.stops > 1) return false;
        if (
          filters.selectedAirlines.length > 0 &&
          !filters.selectedAirlines.includes(flight.airline)
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'cheapest') return a.price.amount - b.price.amount;
        if (sort === 'fastest') return a.durationMinutes - b.durationMinutes;
        if (sort === 'earliest')
          return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
        return 0;
      });
  }, [flights, filters, sort]);

  const handleResetFilters = () => {
    setFilters({ maxPrice: maxPossiblePrice, stops: 'all', selectedAirlines: [] });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar area */}
      <div className="bg-[#0f172a] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <SearchForm
            initialOrigin={origin}
            initialDestination={destination}
            initialDate={departDate}
            initialPassengers={passengersParam}
            initialCabin={cabinParam}
          />
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">
            {origin && destination ? `${origin} → ${destination}` : 'Flight Search Results'}
          </h1>
          {departDate && (
            <p className="text-sm text-gray-500 mt-1">
              Departure: {new Date(departDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}{passengersParam} passenger{Number(passengersParam) > 1 ? 's' : ''}
              {' · '}<span className="capitalize">{cabinParam.replace('_', ' ')}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold">Error fetching flights</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Searching best flight deals for you...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <FilterSidebar
              filters={filters}
              availableAirlines={availableAirlines}
              maxPossiblePrice={maxPossiblePrice}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
            <div className="flex-1 min-w-0">
              <SortBar
                currentSort={sort}
                onSortChange={setSort}
                resultCount={filteredAndSortedFlights.length}
                onRefresh={() => fetchFlights(false)}
                isRefreshing={isRefreshing}
              />
              {filteredAndSortedFlights.length === 0 && !error ? (
                <div className="bg-white p-16 text-center rounded-2xl border border-gray-200 text-gray-400">
                  <div className="flex justify-center mb-4">
                    <svg className="w-14 h-14 text-gray-200" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-600 mb-2">No flights found</h3>
                  <p className="text-sm">No flights match your current filters. Try resetting your filters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAndSortedFlights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} departDate={departDate} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
