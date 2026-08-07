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

  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sort, setSort] = useState<SortOption>('cheapest');
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 2000,
    stops: 'all',
    selectedAirlines: [],
  });

  useEffect(() => {
    if (!origin || !destination || !departDate) {
      setLoading(false);
      return;
    }
    async function fetchFlights() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/flights/search?origin=${origin}&destination=${destination}&date=${departDate}`
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch flights');
        const data: FlightOffer[] = json.data || [];
        setFlights(data);
        if (data.length > 0) {
          const highestPrice = Math.max(...data.map((f) => f.price.amount));
          setFilters((prev) => ({ ...prev, maxPrice: highestPrice }));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, [origin, destination, departDate]);

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Pre-filled search bar */}
      <div className="mb-8">
        <SearchForm
          initialOrigin={origin}
          initialDestination={destination}
          initialDate={departDate}
        />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">
          Flights from {origin} to {destination}
        </h1>
        <p className="text-sm text-gray-500">Departure date: {departDate}</p>
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

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-semibold animate-pulse">
          Searching best flight deals...
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
          <div className="flex-1">
            <SortBar
              currentSort={sort}
              onSortChange={setSort}
              resultCount={filteredAndSortedFlights.length}
            />
            {filteredAndSortedFlights.length === 0 && !error ? (
              <div className="bg-white p-12 text-center rounded-xl border text-gray-500">
                No flights match your filter criteria. Try resetting filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} departDate={departDate} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
