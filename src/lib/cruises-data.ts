// Real cruise data with photos of actual cruise ships / cruise scenes
import { getCruiseImage, auditCruiseGalleries } from "./cruise-images";
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
const cruisesRaw: Cruise[] = [
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
    image: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1505839673365-e3971f8d9184?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1531253450048-2a30b9af1c08?w=1200&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1473221326025-9183b464bb7e?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1569288063648-5a8d72e54ee8?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop",
    rating: 4.9,
    tags: ["transatlantico", "transatlantic", "luxo", "luxury", "londres", "london", "new york", "nova york"],
    region: "london",
  },
  {
    id: "greek-isles-celestyal-7n",
    name: "Ilhas Gregas Encantadoras",
    nameEn: "Enchanting Greek Isles",
    cruiseLine: "Celestyal Cruises",
    ship: "Celestyal Crystal",
    departurePort: "Atenas, Grécia",
    departurePortEn: "Athens, Greece",
    itinerary: ["Atenas (Piraeus)", "Mykonos", "Kusadasi", "Patmos", "Heraklion", "Santorini", "Atenas"],
    itineraryEn: ["Athens (Piraeus)", "Mykonos", "Kusadasi", "Patmos", "Heraklion", "Santorini", "Athens"],
    duration: 7,
    date: "03 - 10 Jun 2026",
    dateEn: "Jun 3 - 10, 2026",
    price: 8200,
    originalPrice: 10500,
    image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1200&auto=format&fit=crop",
    rating: 4.8,
    tags: ["grecia", "greece", "santorini", "mykonos", "mediterraneo", "mediterranean", "ilhas", "islands"],
    region: "athens",
  },
  {
    id: "dubai-arabia-msc-7n",
    name: "Emirados e Golfo Árabe",
    nameEn: "Emirates & Arabian Gulf",
    cruiseLine: "MSC Cruises",
    ship: "MSC Virtuosa",
    departurePort: "Dubai, EAU",
    departurePortEn: "Dubai, UAE",
    itinerary: ["Dubai", "Abu Dhabi", "Sir Bani Yas", "Doha", "Dubai"],
    itineraryEn: ["Dubai", "Abu Dhabi", "Sir Bani Yas", "Doha", "Dubai"],
    duration: 7,
    date: "14 - 21 Nov 2026",
    dateEn: "Nov 14 - 21, 2026",
    price: 7890,
    originalPrice: 10200,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&auto=format&fit=crop",
    rating: 4.7,
    tags: ["dubai", "emirados", "emirates", "arabia", "luxo", "luxury", "deserto", "desert"],
    region: "dubai",
  },
  {
    id: "japan-ncl-10n",
    name: "Japão e Coreia",
    nameEn: "Japan & Korea Discovery",
    cruiseLine: "Norwegian Cruise Line",
    ship: "Norwegian Spirit",
    departurePort: "Tóquio (Yokohama), Japão",
    departurePortEn: "Tokyo (Yokohama), Japan",
    itinerary: ["Tóquio", "Shimizu", "Kobe", "Hiroshima", "Busan", "Nagasaki", "Tóquio"],
    itineraryEn: ["Tokyo", "Shimizu", "Kobe", "Hiroshima", "Busan", "Nagasaki", "Tokyo"],
    duration: 10,
    date: "05 - 15 Abr 2026",
    dateEn: "Apr 5 - 15, 2026",
    price: 14200,
    originalPrice: 18500,
    image: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1200&auto=format&fit=crop",
    rating: 4.9,
    tags: ["japao", "japan", "asia", "coreia", "korea", "cultural", "tokyo", "toquio", "sakura"],
    region: "tokyo",
  },
  {
    id: "australia-pacific-pno-12n",
    name: "Austrália e Pacífico Sul",
    nameEn: "Australia & South Pacific",
    cruiseLine: "P&O Cruises",
    ship: "Pacific Explorer",
    departurePort: "Sydney, Austrália",
    departurePortEn: "Sydney, Australia",
    itinerary: ["Sydney", "Nouméa", "Port Vila", "Mystery Island", "Lifou", "Sydney"],
    itineraryEn: ["Sydney", "Nouméa", "Port Vila", "Mystery Island", "Lifou", "Sydney"],
    duration: 12,
    date: "08 - 20 Fev 2026",
    dateEn: "Feb 8 - 20, 2026",
    price: 12800,
    originalPrice: 16400,
    image: "https://images.unsplash.com/photo-1559599189-fe84dea4eb79?w=1200&auto=format&fit=crop",
    rating: 4.7,
    tags: ["australia", "sydney", "pacifico", "pacific", "vanuatu", "praia", "beach", "tropical"],
    region: "sydney",
  },
  {
    id: "iceland-viking-9n",
    name: "Islândia e Atlântico Norte",
    nameEn: "Iceland & North Atlantic",
    cruiseLine: "Viking Ocean Cruises",
    ship: "Viking Sky",
    departurePort: "Reykjavik, Islândia",
    departurePortEn: "Reykjavik, Iceland",
    itinerary: ["Reykjavik", "Akureyri", "Seyðisfjörður", "Tórshavn (Faroé)", "Lerwick", "Edimburgo"],
    itineraryEn: ["Reykjavik", "Akureyri", "Seyðisfjörður", "Tórshavn (Faroe)", "Lerwick", "Edinburgh"],
    duration: 9,
    date: "12 - 21 Ago 2026",
    dateEn: "Aug 12 - 21, 2026",
    price: 16900,
    originalPrice: 21800,
    image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1200&auto=format&fit=crop",
    rating: 4.9,
    tags: ["islandia", "iceland", "atlantico", "atlantic", "natureza", "nature", "aurora"],
    region: "reykjavik",
  },
  {
    id: "galapagos-silversea-7n",
    name: "Expedição Galápagos",
    nameEn: "Galápagos Expedition",
    cruiseLine: "Silversea",
    ship: "Silver Origin",
    departurePort: "Baltra, Equador",
    departurePortEn: "Baltra, Ecuador",
    itinerary: ["Baltra", "Santa Cruz", "Isabela", "Fernandina", "Floreana", "Baltra"],
    itineraryEn: ["Baltra", "Santa Cruz", "Isabela", "Fernandina", "Floreana", "Baltra"],
    duration: 7,
    date: "10 - 17 Set 2026",
    dateEn: "Sep 10 - 17, 2026",
    price: 22500,
    originalPrice: 28900,
    image: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=1200&auto=format&fit=crop",
    rating: 5.0,
    tags: ["galapagos", "equador", "ecuador", "expedicao", "expedition", "natureza", "nature", "luxo", "luxury"],
    region: "galapagos",
  },
  {
    id: "amazon-river-iberostar-6n",
    name: "Rio Amazonas Profundo",
    nameEn: "Deep Amazon River",
    cruiseLine: "Iberostar",
    ship: "Grand Amazon",
    departurePort: "Manaus, Brasil",
    departurePortEn: "Manaus, Brazil",
    itinerary: ["Manaus", "Encontro das Águas", "Rio Negro", "Anavilhanas", "Novo Airão", "Manaus"],
    itineraryEn: ["Manaus", "Meeting of Waters", "Rio Negro", "Anavilhanas", "Novo Airão", "Manaus"],
    duration: 6,
    date: "18 - 24 Jul 2026",
    dateEn: "Jul 18 - 24, 2026",
    price: 4890,
    originalPrice: 6400,
    image: "https://images.unsplash.com/photo-1566375638485-2dab01b9b56a?w=1200&auto=format&fit=crop",
    rating: 4.6,
    tags: ["amazonas", "amazon", "brasil", "brazil", "rio", "river", "natureza", "nature", "aventura", "adventure"],
    region: "manaus",
  },
  {
    id: "antarctica-hurtigruten-12n",
    name: "Expedição Antártica",
    nameEn: "Antarctica Expedition",
    cruiseLine: "Hurtigruten Expeditions",
    ship: "MS Roald Amundsen",
    departurePort: "Ushuaia, Argentina",
    departurePortEn: "Ushuaia, Argentina",
    itinerary: ["Ushuaia", "Passagem de Drake", "Península Antártica", "Ilhas Shetland do Sul", "Ushuaia"],
    itineraryEn: ["Ushuaia", "Drake Passage", "Antarctic Peninsula", "South Shetland Islands", "Ushuaia"],
    duration: 12,
    date: "05 - 17 Dez 2026",
    dateEn: "Dec 5 - 17, 2026",
    price: 39800,
    originalPrice: 48500,
    image: "https://images.unsplash.com/photo-1561417096-d6e8e6cb6e80?w=1200&auto=format&fit=crop",
    rating: 4.9,
    tags: ["antartica", "antarctica", "expedicao", "expedition", "aventura", "adventure", "geleira", "glacier", "luxo", "luxury"],
    region: "ushuaia",
  },
  {
    id: "danube-river-amawaterways-7n",
    name: "Cruzeiro pelo Danúbio",
    nameEn: "Danube River Cruise",
    cruiseLine: "AmaWaterways",
    ship: "AmaMagna",
    departurePort: "Budapeste, Hungria",
    departurePortEn: "Budapest, Hungary",
    itinerary: ["Budapeste", "Viena", "Dürnstein", "Linz", "Passau", "Vilshofen"],
    itineraryEn: ["Budapest", "Vienna", "Dürnstein", "Linz", "Passau", "Vilshofen"],
    duration: 7,
    date: "22 - 29 Mai 2026",
    dateEn: "May 22 - 29, 2026",
    price: 11500,
    originalPrice: 14800,
    image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=1200&auto=format&fit=crop",
    rating: 4.8,
    tags: ["europa", "europe", "danubio", "danube", "rio", "river", "viena", "vienna", "budapeste", "budapest", "cultural"],
    region: "budapest",
  },
  {
    id: "hawaii-ncl-7n",
    name: "Ilhas Havaianas",
    nameEn: "Hawaiian Islands",
    cruiseLine: "Norwegian Cruise Line",
    ship: "Pride of America",
    departurePort: "Honolulu, Havaí",
    departurePortEn: "Honolulu, Hawaii",
    itinerary: ["Honolulu (Oahu)", "Kahului (Maui)", "Hilo", "Kona", "Nawiliwili (Kauai)", "Honolulu"],
    itineraryEn: ["Honolulu (Oahu)", "Kahului (Maui)", "Hilo", "Kona", "Nawiliwili (Kauai)", "Honolulu"],
    duration: 7,
    date: "16 - 23 Abr 2026",
    dateEn: "Apr 16 - 23, 2026",
    price: 13400,
    originalPrice: 17200,
    image: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?w=1200&auto=format&fit=crop",
    rating: 4.8,
    tags: ["havai", "hawaii", "praia", "beach", "tropical", "pacifico", "pacific", "ilhas", "islands"],
    region: "honolulu",
  },
  {
    id: "south-africa-msc-10n",
    name: "Costa Sul-Africana",
    nameEn: "South African Coast",
    cruiseLine: "MSC Cruises",
    ship: "MSC Splendida",
    departurePort: "Cidade do Cabo, África do Sul",
    departurePortEn: "Cape Town, South Africa",
    itinerary: ["Cidade do Cabo", "Port Elizabeth", "Durban", "Maputo", "Ilha Portuguesa", "Cidade do Cabo"],
    itineraryEn: ["Cape Town", "Port Elizabeth", "Durban", "Maputo", "Portuguese Island", "Cape Town"],
    duration: 10,
    date: "12 - 22 Jan 2027",
    dateEn: "Jan 12 - 22, 2027",
    price: 9800,
    originalPrice: 12600,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&auto=format&fit=crop&sat=-20",
    rating: 4.7,
    tags: ["africa", "africa do sul", "south africa", "cape town", "cidade do cabo", "safari", "natureza", "nature"],
    region: "cape town",
  },
];

/**
 * Final exported catalog: every cruise's `image` is rebound to its curated
 * local gallery photo so we never serve broken/divergent stock images.
 */
export const cruises: Cruise[] = cruisesRaw.map((c) => ({
  ...c,
  image: getCruiseImage(c.id),
}));

if (import.meta.env.DEV) {
  const audit = auditCruiseGalleries(cruisesRaw.map((c) => c.id));
  if (audit.missing.length || audit.invalidKeys.length) {
    // eslint-disable-next-line no-console
    console.warn("[cruises-data] Gallery audit issues:", audit);
  }
}

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

/**
 * Build a normalized list of all stops/regions any cruise touches.
 * Used to detect "unknown" user-entered stops.
 */
export function getAllCruiseStops(): string[] {
  const set = new Set<string>();
  cruises.forEach((c) => {
    [...c.itinerary, ...c.itineraryEn, c.departurePort, c.departurePortEn, c.region]
      .forEach((s) => set.add(s.toLowerCase().trim()));
  });
  return Array.from(set);
}

const stopMatchesCruise = (stop: string, c: Cruise): boolean => {
  const s = stop.toLowerCase().trim();
  if (!s) return false;
  const haystack = [
    ...c.itinerary.map((i) => i.toLowerCase()),
    ...c.itineraryEn.map((i) => i.toLowerCase()),
    c.departurePort.toLowerCase(),
    c.departurePortEn.toLowerCase(),
    c.region.toLowerCase(),
    ...c.tags,
  ];
  return haystack.some((term) => term.includes(s) || s.includes(term));
};

export interface CruiseStopSearchResult {
  matched: Cruise[];
  unknownStops: string[];
  knownStops: string[];
  fallback: Cruise[];
}

/**
 * Find cruises that pass through ALL the requested stops.
 * Stops we can't recognize anywhere in the catalog are returned as `unknownStops`
 * and the matching is done with the remaining `knownStops`.
 * `fallback` is always the full catalog (used when nothing matches).
 */
export function searchCruisesByStops(stops: string[]): CruiseStopSearchResult {
  const cleaned = stops.map((s) => s.trim()).filter(Boolean);
  if (cleaned.length === 0) {
    return { matched: cruises, unknownStops: [], knownStops: [], fallback: cruises };
  }

  const unknownStops: string[] = [];
  const knownStops: string[] = [];
  cleaned.forEach((stop) => {
    const exists = cruises.some((c) => stopMatchesCruise(stop, c));
    if (exists) knownStops.push(stop);
    else unknownStops.push(stop);
  });

  const matched =
    knownStops.length > 0
      ? cruises.filter((c) => knownStops.every((s) => stopMatchesCruise(s, c)))
      : [];

  return { matched, unknownStops, knownStops, fallback: cruises };
}
