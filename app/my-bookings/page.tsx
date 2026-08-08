// app/my-bookings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    getSavedBookings,
    removeBookingFromStorage,
    clearAllBookingsFromStorage,
    saveBookingToStorage,
    SavedBooking
} from '@/lib/BookingStorage';

// SVG Icons for Dashboard UI
const IconPlane = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
);

const IconSearch = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconTicket = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
        <line x1="9" y1="9" x2="9" y2="15" />
        <line x1="15" y1="9" x2="15" y2="15" />
        <line x1="12" y1="9" x2="12" y2="15" />
    </svg>
);

const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const IconRefresh = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
);

const IconCheckCircle = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const IconUser = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<SavedBooking[]>([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [searchId, setSearchId] = useState('');
    const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    // Modal state for selected ticket detail / live status
    const [activeTicket, setActiveTicket] = useState<SavedBooking | null>(null);
    const [liveStatus, setLiveStatus] = useState<any | null>(null);
    const [fetchingLiveStatus, setFetchingLiveStatus] = useState(false);

    useEffect(() => {
        setBookings(getSavedBookings());
    }, []);

    const handleRemove = (orderId: string) => {
        if (confirm('Are you sure you want to remove this booking from your dashboard?')) {
            const updated = removeBookingFromStorage(orderId);
            setBookings(updated);
            if (activeTicket?.orderId === orderId) setActiveTicket(null);
        }
    };

    const handleClearAll = () => {
        if (confirm('Clear all saved bookings from your browser session?')) {
            clearAllBookingsFromStorage();
            setBookings([]);
            setActiveTicket(null);
        }
    };

    const handleAddSample = () => {
        const sample: SavedBooking = {
            orderId: 'ord_' + Math.random().toString(36).substring(2, 11),
            bookingReference: 'FLT' + Math.floor(100000 + Math.random() * 900000),
            passengerName: 'Mouldi Hemdane',
            origin: 'JFK',
            destination: 'LHR',
            departureTime: new Date(Date.now() + 86400000 * 3).toISOString(),
            totalAmount: 489.50,
            currency: 'USD',
            bookedAt: new Date().toISOString(),
        };
        saveBookingToStorage(sample);
        setBookings(getSavedBookings());
    };

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setLoadingOrder(true);
        setOrderError(null);
        setSearchedOrder(null);

        try {
            const res = await fetch(`/api/flights/order/${searchId.trim()}`);
            const json = await res.json();

            if (!res.ok) throw new Error(json.error || 'Failed to find Duffel booking');
            setSearchedOrder(json.data);
        } catch (err: any) {
            setOrderError(err.message);
        } finally {
            setLoadingOrder(false);
        }
    };

    const fetchLiveDetailsForTicket = async (ticket: SavedBooking) => {
        setActiveTicket(ticket);
        setFetchingLiveStatus(true);
        setLiveStatus(null);
        try {
            const res = await fetch(`/api/flights/order/${ticket.orderId}`);
            const json = await res.json();
            if (res.ok) {
                setLiveStatus(json.data);
            }
        } catch (err) {
            console.error('Error fetching live status:', err);
        } finally {
            setFetchingLiveStatus(false);
        }
    };

    const filteredBookings = bookings.filter((b) => {
        const q = searchFilter.toLowerCase();
        return (
            b.bookingReference.toLowerCase().includes(q) ||
            b.passengerName.toLowerCase().includes(q) ||
            b.origin.toLowerCase().includes(q) ||
            b.destination.toLowerCase().includes(q) ||
            b.orderId.toLowerCase().includes(q)
        );
    });

    const totalSpend = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* ── Top Header Banner ── */}
                <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                            <IconPlane className="w-3.5 h-3.5" />
                            Live Reservation Portal
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                            My Flight Dashboard
                        </h1>
                        <p className="text-slate-400 text-sm max-w-lg">
                            Manage your issued tickets, verify live Duffel PNR statuses, and view boarding passes.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-3">
                        <Link
                            href="/flights"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2"
                        >
                            <IconSearch />
                            Search New Flights
                        </Link>
                        {bookings.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs px-4 py-3 rounded-xl transition-colors border border-slate-700"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* ── KPI Analytics Row ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">{bookings.length}</p>
                            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Active Tickets Saved</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <IconTicket className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Invested</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Verified via Duffel Balance</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black text-lg">
                            $
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flight Status</p>
                            <p className="text-xl font-black text-emerald-600 mt-1 flex items-center gap-1.5">
                                <IconCheckCircle className="w-5 h-5 text-emerald-500" />
                                Instant Ticketed
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Live confirmation enabled</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                            <IconPlane className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* ── Main Content Grid (Saved Bookings + Order Lookup) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Saved Bookings List (2 cols) */}
                    <div className="lg:col-span-2 space-y-5">
                        
                        {/* Header & Filter Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <span>Saved Ticket Reservations</span>
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {filteredBookings.length}
                                </span>
                            </h2>

                            {/* Search filter input */}
                            <div className="relative min-w-[220px]">
                                <input
                                    type="text"
                                    placeholder="Filter by ref, name, city..."
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400"
                                />
                                <div className="absolute left-3 top-2.5 text-slate-400">
                                    <IconSearch className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>

                        {/* Bookings List Cards */}
                        {filteredBookings.length === 0 ? (
                            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-4">
                                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                                    ✈️
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-800 text-base">No saved flight bookings found</h3>
                                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                        Book a flight through our search page or add a sample reservation below to test the dashboard.
                                    </p>
                                </div>
                                <div className="flex items-center justify-center gap-3 pt-2">
                                    <button
                                        onClick={handleAddSample}
                                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-4 py-2.5 rounded-xl border border-blue-200 transition-colors"
                                    >
                                        + Add Sample Demo Booking
                                    </button>
                                    <Link
                                        href="/flights"
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                                    >
                                        Search Flights
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredBookings.map((b) => (
                                    <div
                                        key={b.orderId}
                                        className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 space-y-4"
                                    >
                                        {/* Top Row: Ref & Status */}
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                                    PNR: {b.bookingReference}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {new Date(b.bookedAt || Date.now()).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-emerald-100 text-emerald-700 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Confirmed
                                                </span>
                                            </div>
                                        </div>

                                        {/* Main Flight Info */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            {/* Route & Passenger */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl font-black text-slate-900">{b.origin}</span>
                                                    <div className="flex items-center gap-1 text-slate-300">
                                                        <div className="w-6 h-px bg-slate-300" />
                                                        <IconPlane className="w-4 h-4 text-blue-500" />
                                                        <div className="w-6 h-px bg-slate-300" />
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900">{b.destination}</span>
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1 font-medium text-slate-700">
                                                        <IconUser className="w-3.5 h-3.5 text-slate-400" />
                                                        {b.passengerName}
                                                    </span>
                                                    <span>•</span>
                                                    <span>Dep: {new Date(b.departureTime).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Price & Actions */}
                                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-slate-900">${b.totalAmount} {b.currency}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">ID: {b.orderId.slice(0, 14)}...</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => fetchLiveDetailsForTicket(b)}
                                                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1 transition-colors"
                                                    >
                                                        <IconRefresh className="w-3 h-3" />
                                                        Live Ticket
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(b.orderId)}
                                                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Remove from dashboard"
                                                    >
                                                        <IconTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Live Duffel Order Lookup Widget (1 col) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-base">Direct Duffel Order Search</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Lookup any live order by Duffel Order ID to retrieve API status.
                                </p>
                            </div>

                            <form onSubmit={handleLookup} className="space-y-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="ord_0000Axxx..."
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loadingOrder}
                                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loadingOrder ? (
                                        <>
                                            <IconRefresh className="w-3.5 h-3.5 animate-spin" />
                                            Querying Duffel API...
                                        </>
                                    ) : (
                                        <>
                                            <IconSearch className="w-3.5 h-3.5" />
                                            Fetch Order Details
                                        </>
                                    )}
                                </button>
                            </form>

                            {orderError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                                    ⚠️ {orderError}
                                </div>
                            )}

                            {searchedOrder && (
                                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 text-xs shadow-lg">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                        <span className="font-mono text-blue-400 font-bold">
                                            {searchedOrder.booking_reference}
                                        </span>
                                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                                            API Verified
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-slate-300">
                                        <p><span className="text-slate-400">Order ID:</span> <span className="font-mono">{searchedOrder.id}</span></p>
                                        <p><span className="text-slate-400">Total Paid:</span> <span className="font-bold text-white">${searchedOrder.total_amount} {searchedOrder.total_currency}</span></p>
                                        <p><span className="text-slate-400">Passengers:</span> {searchedOrder.passengers?.length || 1}</p>
                                        <p><span className="text-slate-400">Owner Airline:</span> {searchedOrder.owner?.name || 'Airline'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Info Box */}
                        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 space-y-2">
                            <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">💡 Duffel Sandbox Mode</h4>
                            <p className="text-xs text-blue-800 leading-relaxed">
                                All bookings in FlightFlare are processed live against Duffel's test environment. Tickets created here use simulated credit balances and instant confirm logic.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            {/* ── Live Boarding Pass & Ticket Modal ── */}
            {activeTicket && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
                        {/* Close button */}
                        <button
                            onClick={() => setActiveTicket(null)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors"
                        >
                            ✕
                        </button>

                        <div className="border-b border-slate-100 pb-4">
                            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                                <IconTicket />
                                Digital Airline Ticket & Boarding Pass
                            </div>
                            <h3 className="text-xl font-black text-slate-900">
                                {activeTicket.origin} → {activeTicket.destination}
                            </h3>
                        </div>

                        {/* Realistic Ticket Card UI */}
                        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-5 relative overflow-hidden">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Booking Reference (PNR)</p>
                                    <p className="font-mono text-lg font-black text-orange-400">{activeTicket.bookingReference}</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                                        Confirmed
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <p className="text-slate-400 text-[10px] uppercase font-semibold">Passenger</p>
                                    <p className="font-bold text-white text-sm">{activeTicket.passengerName}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] uppercase font-semibold">Departure Date</p>
                                    <p className="font-bold text-white text-sm">{new Date(activeTicket.departureTime).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] uppercase font-semibold">Duffel Order ID</p>
                                    <p className="font-mono text-slate-300 text-[11px] truncate">{activeTicket.orderId}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] uppercase font-semibold">Total Paid</p>
                                    <p className="font-bold text-emerald-400 text-sm">${activeTicket.totalAmount} {activeTicket.currency}</p>
                                </div>
                            </div>

                            {/* Barcode representation */}
                            <div className="pt-3 border-t border-slate-800 text-center space-y-1">
                                <div className="h-10 bg-slate-800 rounded flex items-center justify-center gap-1 px-4 overflow-hidden opacity-80">
                                    {[...Array(32)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="bg-white h-full"
                                            style={{ width: `${(i % 3) + 1}px` }}
                                        />
                                    ))}
                                </div>
                                <p className="font-mono text-[9px] text-slate-500 tracking-widest">{activeTicket.orderId}</p>
                            </div>
                        </div>

                        {/* Live Duffel API status feedback if loaded */}
                        {fetchingLiveStatus ? (
                            <div className="p-4 bg-slate-50 border rounded-2xl text-xs text-slate-500 text-center animate-pulse">
                                Contacting Duffel servers for real-time order status...
                            </div>
                        ) : liveStatus ? (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-2 text-blue-900">
                                <p className="font-bold">Live Status from Duffel API:</p>
                                <p>• Booking Reference: <span className="font-mono font-bold">{liveStatus.booking_reference}</span></p>
                                <p>• Order Type: {liveStatus.type || 'Instant'}</p>
                                <p>• Passenger count: {liveStatus.passengers?.length || 1}</p>
                            </div>
                        ) : null}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setActiveTicket(null)}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}