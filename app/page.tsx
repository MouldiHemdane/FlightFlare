// src/app/flights/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FlightOffer, FilterState, SortOption } from '@/types/flight';
import FilterSidebar from '@/components/filterSidebar';
import SortBar from '@/components/sortBar';
import FlightCard from '@/components/FlightCard';
import SearchForm from '@/components/SearchForm';

export default function FlightResultsPage() {
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin') || 'JFK';
  const destination = searchParams.get('destination') || 'CDG';
  const departDate = searchParams.get('date') || '2026-09-15';

  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [sort, setSort] = useState<SortOption>('cheapest');
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 2000,
    stops: 'all',
    selectedAirlines: [],
  });

  // Fetch flights on load
  useEffect(() => {
    async function fetchFlights() {
      setLoading(true);
      try {
        const res = await fetch(`/api/flights/search?origin=${origin}&destination=${destination}&date=${departDate}`);
        const json = await res.json();
        const data: FlightOffer[] = json.data || [];
        setFlights(data);

        // Dynamically set initial max price
        if (data.length > 0) {
          const highestPrice = Math.max(...data.map((f) => f.price.amount));
          setFilters((prev) => ({ ...prev, maxPrice: highestPrice }));
        }
      } catch (err) {
        console.error('Error fetching flight offers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, [origin, destination, departDate]);

  // Extract list of unique available airlines
  const availableAirlines = useMemo(() => {
    return Array.from(new Set(flights.map((f) => f.airline)));
  }, [flights]);

  const maxPossiblePrice = useMemo(() => {
    return flights.length > 0 ? Math.max(...flights.map((f) => f.price.amount)) : 2000;
  }, [flights]);

  // Filter & Sort Logic Pipeline
  const filteredAndSortedFlights = useMemo(() => {
    return flights
      .filter((flight) => {
        if (flight.price.amount > filters.maxPrice) return false;
        if (filters.stops === 'direct' && flight.stops !== 0) return false;
        if (filters.stops === '1stop' && flight.stops > 1) return false;
        if (
          filters.selectedAirlines.length > 0 &&
          !filters.selectedAirlines.includes(flight.airline)
        ) {
          return false;
        }
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
    setFilters({
      maxPrice: maxPossiblePrice,
      stops: 'all',
      selectedAirlines: [],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar pre-filled with current route */}
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

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-semibold">Searching best flight deals...</div>
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

            {filteredAndSortedFlights.length === 0 ? (
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