import { supabase } from "@/integrations/supabase/client";

export interface FlightResult {
  id: string;
  airline: string;
  logo: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  origin: string;
  destination: string;
}

export interface HotelResult {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewScore: string;
  price: number;
  currency: string;
  address: string;
  distance: string;
}

const fallbackFlights: FlightResult[] = [
  { id: "f1", airline: "LATAM Airlines", logo: "", departure: "08:30", arrival: "18:45", duration: "10h 15m", stops: 0, price: 3290, currency: "BRL", origin: "São Paulo (GRU)", destination: "New York (JFK)" },
  { id: "f2", airline: "GOL", logo: "", departure: "22:10", arrival: "06:30", duration: "10h 20m", stops: 1, price: 2890, currency: "BRL", origin: "São Paulo (GRU)", destination: "New York (JFK)" },
  { id: "f3", airline: "American Airlines", logo: "", departure: "11:00", arrival: "20:15", duration: "9h 15m", stops: 0, price: 4150, currency: "BRL", origin: "São Paulo (GRU)", destination: "New York (JFK)" },
  { id: "f4", airline: "Delta Airlines", logo: "", departure: "14:30", arrival: "23:50", duration: "9h 20m", stops: 0, price: 3890, currency: "BRL", origin: "São Paulo (GRU)", destination: "New York (JFK)" },
  { id: "f5", airline: "Azul", logo: "", departure: "01:15", arrival: "13:40", duration: "12h 25m", stops: 1, price: 2490, currency: "BRL", origin: "São Paulo (GRU)", destination: "New York (JFK)" },
  { id: "f6", airline: "United Airlines", logo: "", departure: "19:00", arrival: "05:20", duration: "10h 20m", stops: 0, price: 3590, currency: "BRL", origin: "São Paulo (GRU)", destination: "New York (JFK)" },
];

export async function searchFlights(params: {
  from?: string;
  to?: string;
  departDate?: string;
  adults?: number;
}): Promise<FlightResult[]> {
  try {
    const { data, error } = await supabase.functions.invoke("search-flights", {
      body: params,
    });

    if (error) throw error;

    // If fallback flag or no real offers, return mock
    if (data?.fallback) return fallbackFlights;

    const offers = data?.data?.flightOffers || [];
    if (offers.length === 0) return fallbackFlights;

    return offers.slice(0, 10).map((offer: any, idx: number) => {
      const seg = offer.segments?.[0] || {};
      const leg = seg.legs?.[0] || {};
      const carrier = leg.carriersData?.[0] || {};
      return {
        id: offer.token || String(idx),
        airline: carrier.name || seg.legs?.[0]?.carriersData?.[0]?.name || "Airline",
        logo: carrier.logo || "",
        departure: leg.departureTime || "",
        arrival: leg.arrivalTime || "",
        duration: `${Math.floor((seg.totalTime || 0) / 3600)}h ${Math.floor(((seg.totalTime || 0) % 3600) / 60)}m`,
        stops: (seg.legs?.length || 1) - 1,
        price: offer.priceBreakdown?.total?.units || 0,
        currency: "BRL",
        origin: leg.departureAirport?.name || params.from || "",
        destination: leg.arrivalAirport?.name || params.to || "",
      };
    });
  } catch {
    return fallbackFlights;
  }
}

export async function searchHotels(params: {
  dest_id?: string;
  search_type?: string;
  checkin?: string;
  checkout?: string;
  adults?: number;
}): Promise<HotelResult[]> {
  const { data, error } = await supabase.functions.invoke("search-hotels", {
    body: params,
  });

  if (error) throw error;

  try {
    const hotels = data?.data?.hotels || [];
    return hotels.slice(0, 12).map((h: any) => ({
      id: String(h.hotel_id || ""),
      name: h.property?.name || "Hotel",
      image: h.property?.photoUrls?.[0] || "",
      rating: h.property?.reviewScore || 0,
      reviewScore: h.property?.reviewScoreWord || "",
      price: Math.round(h.property?.priceBreakdown?.grossPrice?.value || 0),
      currency: h.property?.priceBreakdown?.grossPrice?.currency || "BRL",
      address: h.property?.wishlistName || "",
      distance: h.accessibilityLabel?.match(/(\d[\d.,]+ (?:km|m) from centre)/)?.[1] || "",
    }));
  } catch {
    return [];
  }
}

export async function searchDestination(query: string) {
  const { data, error } = await supabase.functions.invoke("search-destinations", {
    body: { query },
  });
  if (error) throw error;
  return data?.data || [];
}
