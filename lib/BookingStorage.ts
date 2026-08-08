// src/lib/bookingStorage.ts

export interface SavedBooking {
    orderId: string;
    bookingReference: string;
    passengerName: string;
    origin: string;
    destination: string;
    departureTime: string;
    totalAmount: number;
    currency: string;
    bookedAt: string;
}

const STORAGE_KEY = 'flightflare_user_bookings';

export function getSavedBookings(): SavedBooking[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error('Failed to parse saved bookings:', err);
        return [];
    }
}

export function saveBookingToStorage(booking: SavedBooking): void {
    if (typeof window === 'undefined') return;
    const existing = getSavedBookings();
    const updated = [booking, ...existing.filter((b) => b.orderId !== booking.orderId)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeBookingFromStorage(orderId: string): SavedBooking[] {
    if (typeof window === 'undefined') return [];
    const existing = getSavedBookings();
    const updated = existing.filter((b) => b.orderId !== orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

export function clearAllBookingsFromStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
