export interface RedirectOptions {
    origin: string;
    destination: string;
    departDate: string;   // ISO format: YYYY-MM-DD
    airlineCode?: string; // 2-letter IATA airline code e.g. "AF", "BA"
    adults?: number;
}

/**
 * Build a Kayak deep-link for the specific flight.
 *
 * Format: https://www.kayak.com/flights/{ORIGIN}-{DESTINATION}/{DATE}?airline={CODE}&sort=price_a
 *
 * Kayak reliably supports route + date + airline filtering via URL params,
 * landing the user directly on the filtered results for that specific airline.
 */
export function buildAffiliateUrl(options: RedirectOptions): string {
    const { origin, destination, departDate, airlineCode, adults = 1 } = options;

    const route = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
    const url = new URL(`https://www.kayak.com/flights/${route}/${departDate}`);

    if (airlineCode) {
        url.searchParams.set('airline', airlineCode.toUpperCase());
    }
    url.searchParams.set('adults', String(adults));
    url.searchParams.set('sort', 'price_a');

    return url.toString();
}
