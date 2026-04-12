import { generateFlights } from "@/lib/generated-flights";

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

export async function searchFlights(params: {
  from?: string;
  to?: string;
  departDate?: string;
  adults?: number;
}): Promise<FlightResult[]> {
  // Simulate brief network delay
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
  const fromCode = params.from || "GRU.AIRPORT";
  const toCode = params.to || "JFK.AIRPORT";
  if (fromCode === toCode) return [];
  return generateFlights(fromCode, toCode);
}

export async function searchHotels(params: {
  dest_id?: string;
  search_type?: string;
  checkin?: string;
  checkout?: string;
  adults?: number;
}): Promise<HotelResult[]> {
  // Return empty — hotels not used in main flow
  return [];
}

export async function searchDestination(query: string) {
  return [];
}
