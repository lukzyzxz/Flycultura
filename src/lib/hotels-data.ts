import { eventPackages } from "@/lib/events-data";

export interface Hotel {
  id: string;
  name: string;
  city: string;
  cityEn: string;
  country: string;
  countryEn: string;
  address: string;
  rating: number;
  reviewScore: string;
  pricePerNight: number;
  originalPrice: number;
  image: string;
  amenities: string[];
  amenitiesEn: string[];
  tags: string[];
}

export const hotels: Hotel[] = [
  {
    id: "ny-plaza",
    name: "The Plaza Hotel",
    city: "Nova York",
    cityEn: "New York",
    country: "EUA",
    countryEn: "USA",
    address: "768 5th Ave, Manhattan",
    rating: 4.7,
    reviewScore: "Excelente",
    pricePerNight: 2890,
    originalPrice: 3500,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&auto=format&fit=crop",
    amenities: ["Spa", "Restaurante 5★", "Wi-Fi", "Concierge 24h"],
    amenitiesEn: ["Spa", "5★ Restaurant", "Wi-Fi", "24h Concierge"],
    tags: ["nova york", "new york", "luxo", "luxury", "manhattan"],
  },
  {
    id: "ny-pod-times",
    name: "Pod Times Square",
    city: "Nova York",
    cityEn: "New York",
    country: "EUA",
    countryEn: "USA",
    address: "400 W 42nd St, Manhattan",
    rating: 4.3,
    reviewScore: "Muito bom",
    pricePerNight: 890,
    originalPrice: 1100,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop",
    amenities: ["Wi-Fi", "Academia", "Bar no rooftop"],
    amenitiesEn: ["Wi-Fi", "Gym", "Rooftop bar"],
    tags: ["nova york", "new york", "barato", "budget", "times square"],
  },
  {
    id: "miami-fontainebleau",
    name: "Fontainebleau Miami Beach",
    city: "Miami",
    cityEn: "Miami",
    country: "EUA",
    countryEn: "USA",
    address: "4441 Collins Ave, Miami Beach",
    rating: 4.6,
    reviewScore: "Excelente",
    pricePerNight: 1990,
    originalPrice: 2600,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop",
    amenities: ["Praia privativa", "Piscina", "Spa", "Cassino"],
    amenitiesEn: ["Private beach", "Pool", "Spa", "Casino"],
    tags: ["miami", "praia", "beach", "luxo", "luxury"],
  },
  {
    id: "la-beverly-wilshire",
    name: "Beverly Wilshire, A Four Seasons Hotel",
    city: "Los Angeles",
    cityEn: "Los Angeles",
    country: "EUA",
    countryEn: "USA",
    address: "9500 Wilshire Blvd, Beverly Hills",
    rating: 4.8,
    reviewScore: "Excepcional",
    pricePerNight: 3290,
    originalPrice: 4100,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&auto=format&fit=crop",
    amenities: ["Spa", "Piscina aquecida", "Wi-Fi", "Restaurante Wolfgang Puck"],
    amenitiesEn: ["Spa", "Heated pool", "Wi-Fi", "Wolfgang Puck restaurant"],
    tags: ["los angeles", "california", "luxo", "luxury", "beverly hills"],
  },
  {
    id: "paris-ritz",
    name: "Ritz Paris",
    city: "Paris",
    cityEn: "Paris",
    country: "França",
    countryEn: "France",
    address: "15 Place Vendôme",
    rating: 4.9,
    reviewScore: "Excepcional",
    pricePerNight: 4500,
    originalPrice: 5800,
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&auto=format&fit=crop",
    amenities: ["Spa Chanel", "Restaurante estrelado", "Bar Hemingway"],
    amenitiesEn: ["Chanel Spa", "Michelin restaurant", "Hemingway Bar"],
    tags: ["paris", "frança", "france", "luxo", "luxury"],
  },
  {
    id: "paris-generator",
    name: "Generator Paris",
    city: "Paris",
    cityEn: "Paris",
    country: "França",
    countryEn: "France",
    address: "9-11 Place du Colonel Fabien",
    rating: 4.2,
    reviewScore: "Muito bom",
    pricePerNight: 420,
    originalPrice: 590,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop",
    amenities: ["Wi-Fi", "Bar", "Café da manhã"],
    amenitiesEn: ["Wi-Fi", "Bar", "Breakfast"],
    tags: ["paris", "frança", "france", "barato", "budget"],
  },
  {
    id: "london-savoy",
    name: "The Savoy",
    city: "Londres",
    cityEn: "London",
    country: "Reino Unido",
    countryEn: "UK",
    address: "Strand, Westminster",
    rating: 4.8,
    reviewScore: "Excepcional",
    pricePerNight: 3890,
    originalPrice: 4900,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop",
    amenities: ["Spa", "Restaurante Gordon Ramsay", "Wi-Fi", "Mordomo"],
    amenitiesEn: ["Spa", "Gordon Ramsay restaurant", "Wi-Fi", "Butler"],
    tags: ["londres", "london", "luxo", "luxury"],
  },
  {
    id: "tokyo-park-hyatt",
    name: "Park Hyatt Tokyo",
    city: "Tóquio",
    cityEn: "Tokyo",
    country: "Japão",
    countryEn: "Japan",
    address: "3-7-1-2 Nishi Shinjuku",
    rating: 4.8,
    reviewScore: "Excepcional",
    pricePerNight: 2790,
    originalPrice: 3500,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop",
    amenities: ["Vista para Monte Fuji", "Spa", "Bar New York", "Piscina"],
    amenitiesEn: ["Mt Fuji view", "Spa", "New York Bar", "Pool"],
    tags: ["tokyo", "tóquio", "japão", "japan", "luxo", "luxury"],
  },
  {
    id: "rome-hassler",
    name: "Hotel Hassler Roma",
    city: "Roma",
    cityEn: "Rome",
    country: "Itália",
    countryEn: "Italy",
    address: "Piazza Trinità dei Monti, 6",
    rating: 4.7,
    reviewScore: "Excelente",
    pricePerNight: 2390,
    originalPrice: 3000,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop",
    amenities: ["Vista da Escadaria Espanhola", "Spa", "Restaurante panorâmico"],
    amenitiesEn: ["Spanish Steps view", "Spa", "Rooftop restaurant"],
    tags: ["roma", "rome", "italia", "italy", "luxo", "luxury"],
  },
  {
    id: "barcelona-w",
    name: "W Barcelona",
    city: "Barcelona",
    cityEn: "Barcelona",
    country: "Espanha",
    countryEn: "Spain",
    address: "Plaça de la Rosa dels Vents, 1",
    rating: 4.6,
    reviewScore: "Excelente",
    pricePerNight: 1690,
    originalPrice: 2200,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop",
    amenities: ["Praia", "Piscina infinita", "Spa", "Restaurantes"],
    amenitiesEn: ["Beach", "Infinity pool", "Spa", "Restaurants"],
    tags: ["barcelona", "espanha", "spain", "praia", "beach"],
  },
  {
    id: "dubai-burj-al-arab",
    name: "Burj Al Arab Jumeirah",
    city: "Dubai",
    cityEn: "Dubai",
    country: "Emirados Árabes",
    countryEn: "UAE",
    address: "Jumeirah St",
    rating: 4.9,
    reviewScore: "Excepcional",
    pricePerNight: 8900,
    originalPrice: 11200,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop",
    amenities: ["Suítes duplex", "Praia privativa", "9 restaurantes", "Helipad"],
    amenitiesEn: ["Duplex suites", "Private beach", "9 restaurants", "Helipad"],
    tags: ["dubai", "emirados", "luxo", "luxury", "praia", "beach"],
  },
  {
    id: "munich-bayerischer",
    name: "Hotel Bayerischer Hof",
    city: "Munique",
    cityEn: "Munich",
    country: "Alemanha",
    countryEn: "Germany",
    address: "Promenadeplatz 2-6",
    rating: 4.7,
    reviewScore: "Excelente",
    pricePerNight: 1990,
    originalPrice: 2600,
    image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=1200&auto=format&fit=crop",
    amenities: ["Spa Blue Spa", "5 restaurantes", "Piscina rooftop"],
    amenitiesEn: ["Blue Spa", "5 restaurants", "Rooftop pool"],
    tags: ["munique", "munich", "alemanha", "germany", "luxo", "luxury"],
  },
  {
    id: "ba-alvear-palace",
    name: "Alvear Palace Hotel",
    city: "Buenos Aires",
    cityEn: "Buenos Aires",
    country: "Argentina",
    countryEn: "Argentina",
    address: "Av. Alvear 1891, Recoleta",
    rating: 4.7,
    reviewScore: "Excelente",
    pricePerNight: 1290,
    originalPrice: 1700,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop",
    amenities: ["Spa", "Restaurante francês", "Mordomo", "Salão de chá"],
    amenitiesEn: ["Spa", "French restaurant", "Butler", "Tea room"],
    tags: ["buenos aires", "argentina", "luxo", "luxury", "recoleta"],
  },
];

const CITY_KEYWORDS: { city: string; matches: string[] }[] = [
  { city: "Nova York", matches: ["nova york", "new york", "ny", "manhattan", "new jersey"] },
  { city: "Miami", matches: ["miami", "south beach"] },
  { city: "Los Angeles", matches: ["los angeles", "california", "indio", "beverly"] },
  { city: "Paris", matches: ["paris", "frança", "france"] },
  { city: "Londres", matches: ["londres", "london", "uk", "reino unido"] },
  { city: "Tóquio", matches: ["tokyo", "tóquio", "toquio", "japão", "japan"] },
  { city: "Roma", matches: ["roma", "rome", "italia", "italy", "itália"] },
  { city: "Barcelona", matches: ["barcelona", "espanha", "spain"] },
  { city: "Dubai", matches: ["dubai", "emirados", "uae"] },
  { city: "Munique", matches: ["munique", "munich", "alemanha", "germany"] },
  { city: "Buenos Aires", matches: ["buenos aires", "argentina"] },
];

export function searchHotelsByQuery(query: string): Hotel[] {
  if (!query || query.trim().length === 0) {
    return [...hotels].sort((a, b) => b.rating - a.rating).slice(0, 9);
  }
  const q = query.toLowerCase().trim();

  const matchedCities = CITY_KEYWORDS.filter((c) =>
    c.matches.some((m) => m.includes(q) || q.includes(m))
  ).map((c) => c.city);

  if (matchedCities.length > 0) {
    return hotels.filter((h) => matchedCities.includes(h.city));
  }

  const filtered = hotels.filter((h) => {
    const haystack = [
      h.name.toLowerCase(),
      h.city.toLowerCase(),
      h.cityEn.toLowerCase(),
      h.country.toLowerCase(),
      h.countryEn.toLowerCase(),
      ...h.tags,
    ];
    return haystack.some((term) => term.includes(q) || q.includes(term));
  });

  return filtered.length > 0 ? filtered : [...hotels].sort((a, b) => b.rating - a.rating).slice(0, 9);
}

export function getCitiesWithPackages(): Set<string> {
  const cities = new Set<string>();
  eventPackages.forEach((p) => cities.add(p.location.toLowerCase()));
  return cities;
}
