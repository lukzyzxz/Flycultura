// Real cruise data with photos of actual cruise ships / cruise scenes
export interface Cruise {
  id: string;
  name: string;
  nameEn: string;
  cruiseLine: string;
  ship: string;
  departurePort: string;
  departurePortEn: string;
  itinerary: string[];
  itineraryEn: string[];
  duration: number; // nights
  date: string;
  dateEn: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  tags: string[];
  region: string; // matches destination/country search
}

// All images are real cruise ships / cruise port photos from Unsplash
export const cruises: Cruise[] = [
  {
    id: "caribbean-royal-7n",
    name: "Caribe Encantado",
    nameEn: "Enchanted Caribbean",
    cruiseLine: "Royal Caribbean",
    ship: "Symphony of the Seas",
    departurePort: "Miami, EUA",
    departurePortEn: "Miami, USA",
    itinerary: ["Miami", "Cozumel", "Grand Cayman", "Jamaica", "Miami"],
    itineraryEn: ["Miami", "Cozumel", "Grand Cayman", "Jamaica", "Miami"],
    duration: 7,
    date: "15 - 22 Mar 2026",
    dateEn: "Mar 15 - 22, 2026",
    price: 6890,
    originalPrice: 8900,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&auto=format&fit=crop",
    rating: 4.8,
    tags: ["caribe", "caribbean", "miami", "praia", "beach", "familia", "family"],
    region: "miami",
  },
  {
    id: "mediterranean-msc-10n",
    name: "Mediterrâneo Clássico",
    nameEn: "Classic Mediterranean",
    cruiseLine: "MSC Cruises",
    ship: "MSC Seaview",
    departurePort: "Barcelona, Espanha",
    departurePortEn: "Barcelona, Spain",
    itinerary: ["Barcelona", "Marseille", "Génova", "Roma (Civitavecchia)", "Palermo", "Ibiza", "Barcelona"],
    itineraryEn: ["Barcelona", "Marseille", "Genoa", "Rome (Civitavecchia)", "Palermo", "Ibiza", "Barcelona"],
    duration: 10,
    date: "08 - 18 Mai 2026",
    dateEn: "May 8 - 18, 2026",
    price: 9450,
    originalPrice: 12200,
    image: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1200&auto=format&fit=crop",
    rating: 4.7,
    tags: ["mediterraneo", "mediterranean", "europa", "europe", "barcelona", "italia", "italy", "cultural"],
    region: "barcelona",
  },
  {
    id: "alaska-princess-7n",
    name: "Geleiras do Alasca",
    nameEn: "Alaska Glaciers",
    cruiseLine: "Princess Cruises",
    ship: "Discovery Princess",
    departurePort: "Seattle, EUA",
    departurePortEn: "Seattle, USA",
    itinerary: ["Seattle", "Juneau", "Skagway", "Glacier Bay", "Ketchikan", "Victoria", "Seattle"],
    itineraryEn: ["Seattle", "Juneau", "Skagway", "Glacier Bay", "Ketchikan", "Victoria", "Seattle"],
    duration: 7,
    date: "12 - 19 Jul 2026",
    dateEn: "Jul 12 - 19, 2026",
    price: 11200,
    originalPrice: 14500,
    image: "https://images.unsplash.com/photo-1531253450048-2a30b9af1c08?w=1200&auto=format&fit=crop",
    rating: 4.9,
    tags: ["alasca", "alaska", "natureza", "nature", "aventura", "adventure", "geleira", "glacier"],
    region: "seattle",
  },
  {
    id: "norway-fjords-8n",
    name: "Fiordes Noruegueses",
    nameEn: "Norwegian Fjords",
    cruiseLine: "Norwegian Cruise Line",
    ship: "Norwegian Star",
    departurePort: "Copenhague, Dinamarca",
    departurePortEn: "Copenhagen, Denmark",
    itinerary: ["Copenhague", "Geiranger", "Flam", "Bergen", "Stavanger", "Copenhague"],
    itineraryEn: ["Copenhagen", "Geiranger", "Flam", "Bergen", "Stavanger", "Copenhagen"],
    duration: 8,
    date: "20 - 28 Jun 2026",
    dateEn: "Jun 20 - 28, 2026",
    price: 13800,
    originalPrice: 17900,
    image: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=1200&auto=format&fit=crop",
    rating: 4.9,
    tags: ["noruega", "norway", "fiordes", "fjords", "europa", "europe", "natureza", "nature"],
    region: "copenhagen",
  },
  {
    id: "bahamas-disney-4n",
    name: "Bahamas Mágico Disney",
    nameEn: "Disney Magical Bahamas",
    cruiseLine: "Disney Cruise Line",
    ship: "Disney Wish",
    departurePort: "Port Canaveral, EUA",
    departurePortEn: "Port Canaveral, USA",
    itinerary: ["Port Canaveral", "Nassau", "Castaway Cay", "Port Canaveral"],
    itineraryEn: ["Port Canaveral", "Nassau", "Castaway Cay", "Port Canaveral"],
    duration: 4,
    date: "05 - 09 Fev 2026",
    dateEn: "Feb 5 - 9, 2026",
    price: 8990,
    originalPrice: 11500,
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1200&auto=format&fit=crop",
    rating: 4.9,
    tags: ["bahamas", "disney", "familia", "family", "praia", "beach", "caribe", "caribbean"],
    region: "miami",
  },
  {
    id: "south-america-costa-11n",
    name: "Costa da América do Sul",
    nameEn: "South American Coast",
    cruiseLine: "Costa Cruzeiros",
    ship: "Costa Diadema",
    departurePort: "Santos, Brasil",
    departurePortEn: "Santos, Brazil",
    itinerary: ["Santos", "Buenos Aires", "Montevidéu", "Punta del Este", "Ilhabela", "Santos"],
    itineraryEn: ["Santos", "Buenos Aires", "Montevideo", "Punta del Este", "Ilhabela", "Santos"],
    duration: 11,
    date: "22 Dez 2025 - 02 Jan 2026",
    dateEn: "Dec 22, 2025 - Jan 2, 2026",
    price: 5490,
    originalPrice: 7200,
    image: "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=1200&auto=format&fit=crop",
    rating: 4.6,
    tags: ["brasil", "brazil", "argentina", "uruguai", "uruguay", "ano novo", "new year"],
    region: "santos",
  },
  {
    id: "asia-celebrity-12n",
    name: "Maravilhas do Sudeste Asiático",
    nameEn: "Southeast Asia Wonders",
    cruiseLine: "Celebrity Cruises",
    ship: "Celebrity Solstice",
    departurePort: "Singapura",
    departurePortEn: "Singapore",
    itinerary: ["Singapura", "Bangkok", "Ho Chi Minh", "Hanói", "Hong Kong"],
    itineraryEn: ["Singapore", "Bangkok", "Ho Chi Minh", "Hanoi", "Hong Kong"],
    duration: 12,
    date: "18 - 30 Out 2026",
    dateEn: "Oct 18 - 30, 2026",
    price: 15400,
    originalPrice: 19800,
    image: "https://images.unsplash.com/photo-1566375638485-2dab01b9b56a?w=1200&auto=format&fit=crop",
    rating: 4.8,
    tags: ["asia", "tailandia", "thailand", "vietnam", "singapura", "singapore", "cultural"],
    region: "singapore",
  },
  {
    id: "transatlantic-cunard-14n",
    name: "Travessia Transatlântica",
    nameEn: "Transatlantic Crossing",
    cruiseLine: "Cunard",
    ship: "Queen Mary 2",
    departurePort: "Southampton, Reino Unido",
    departurePortEn: "Southampton, UK",
    itinerary: ["Southampton", "Travessia oceânica", "Nova York"],
    itineraryEn: ["Southampton", "Ocean crossing", "New York"],
    duration: 7,
    date: "10 - 17 Set 2026",
    dateEn: "Sep 10 - 17, 2026",
    price: 10800,
    originalPrice: 13900,
    image: "https://images.unsplash.com/photo-1561417096-d6e8e6cb6e80?w=1200&auto=format&fit=crop",
    rating: 4.9,
    tags: ["transatlantico", "transatlantic", "luxo", "luxury", "londres", "london", "new york", "nova york"],
    region: "london",
  },
];

export function searchCruises(query: string): Cruise[] {
  if (!query || query.trim().length === 0) return cruises;
  const q = query.toLowerCase().trim();
  const filtered = cruises.filter((c) => {
    const haystack = [
      c.name.toLowerCase(),
      c.nameEn.toLowerCase(),
      c.departurePort.toLowerCase(),
      c.departurePortEn.toLowerCase(),
      c.cruiseLine.toLowerCase(),
      c.ship.toLowerCase(),
      c.region.toLowerCase(),
      ...c.itinerary.map((i) => i.toLowerCase()),
      ...c.itineraryEn.map((i) => i.toLowerCase()),
      ...c.tags,
    ];
    return haystack.some((term) => term.includes(q) || q.includes(term));
  });
  // If no match, still return all cruises so user can see options
  return filtered.length > 0 ? filtered : cruises;
}
