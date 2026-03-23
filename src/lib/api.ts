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
  reviewScore: number;
  price: number;
  currency: string;
  address: string;
  distance: string;
}

export async function searchFlights(params: {
  originSkyId?: string;
  destinationSkyId?: string;
  originEntityId?: string;
  destinationEntityId?: string;
  date?: string;
  adults?: number;
}): Promise<FlightResult[]> {
  const { data, error } = await supabase.functions.invoke("search-flights", {
    body: params,
  });

  if (error) throw error;

  try {
    const itineraries = data?.data?.itineraries || [];
    return itineraries.slice(0, 10).map((it: any, idx: number) => {
      const leg = it.legs?.[0] || {};
      const carrier = leg.carriers?.marketing?.[0] || {};
      return {
        id: it.id || String(idx),
        airline: carrier.name || "Airline",
        logo: carrier.logoUrl || "",
        departure: leg.departure || "",
        arrival: leg.arrival || "",
        duration: `${Math.floor((leg.durationInMinutes || 0) / 60)}h ${(leg.durationInMinutes || 0) % 60}m`,
        stops: leg.stopCount || 0,
        price: it.price?.raw || 0,
        currency: "BRL",
        origin: leg.origin?.name || params.originSkyId || "",
        destination: leg.destination?.name || params.destinationSkyId || "",
      };
    });
  } catch {
    return [];
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
      id: String(h.hotel_id || h.property?.id || ""),
      name: h.property?.name || h.hotel_name || "Hotel",
      image: h.property?.photoUrls?.[0] || h.max_photo_url || "",
      rating: h.property?.reviewScore || h.review_score || 0,
      reviewScore: h.property?.reviewScoreWord || "",
      price: h.property?.priceBreakdown?.grossPrice?.value || h.min_total_price || 0,
      currency: "BRL",
      address: h.property?.wishlistName || "",
      distance: h.property?.distanceFromSearch || "",
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
