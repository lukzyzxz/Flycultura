import { FlightResult } from "@/lib/api";

const airlines = [
  { name: "LATAM Airlines", logo: "" },
  { name: "GOL", logo: "" },
  { name: "Azul", logo: "" },
  { name: "American Airlines", logo: "" },
  { name: "Delta Airlines", logo: "" },
  { name: "United Airlines", logo: "" },
  { name: "Emirates", logo: "" },
  { name: "Air France", logo: "" },
  { name: "British Airways", logo: "" },
  { name: "Lufthansa", logo: "" },
  { name: "Turkish Airlines", logo: "" },
  { name: "Qatar Airways", logo: "" },
  { name: "KLM", logo: "" },
  { name: "Iberia", logo: "" },
  { name: "TAP Portugal", logo: "" },
];

const cityNames: Record<string, string> = {
  "GRU": "São Paulo (GRU)", "JFK": "New York (JFK)", "MIA": "Miami (MIA)",
  "LAX": "Los Angeles (LAX)", "CDG": "Paris (CDG)", "LHR": "London (LHR)",
  "NRT": "Tokyo (NRT)", "FCO": "Roma (FCO)", "BCN": "Barcelona (BCN)",
  "DXB": "Dubai (DXB)", "CUN": "Cancún (CUN)", "EZE": "Buenos Aires (EZE)",
  "GIG": "Rio de Janeiro (GIG)", "YYZ": "Toronto (YYZ)", "MUC": "Munique (MUC)",
  "MEX": "Cidade do México (MEX)", "NCE": "Nice (NCE)", "DPS": "Bali (DPS)",
  "IST": "Istambul (IST)", "RAK": "Marraquexe (RAK)", "SYD": "Sydney (SYD)",
  "PRG": "Praga (PRG)", "CTG": "Cartagena (CTG)", "ICN": "Seul (ICN)",
  "LIS": "Lisboa (LIS)", "AMS": "Amsterdam (AMS)", "BKK": "Bangkok (BKK)",
  "SIN": "Singapura (SIN)", "DEL": "Nova Deli (DEL)", "BOM": "Mumbai (BOM)",
  "HND": "Tokyo (HND)", "ORD": "Chicago (ORD)", "ATL": "Atlanta (ATL)",
  "BRU": "Bruxelas (BRU)", "CPH": "Copenhague (CPH)", "HEL": "Helsinque (HEL)",
};

// Estimated flight hours from GRU to destinations
const routeDurations: Record<string, [number, number]> = {
  "GRU-JFK": [9, 11], "GRU-MIA": [8, 10], "GRU-LAX": [12, 14],
  "GRU-CDG": [11, 12], "GRU-LHR": [11, 13], "GRU-NRT": [23, 26],
  "GRU-FCO": [11, 13], "GRU-BCN": [10, 12], "GRU-DXB": [14, 16],
  "GRU-CUN": [8, 10], "GRU-EZE": [2, 3], "GRU-GIG": [1, 1],
  "GRU-YYZ": [10, 12], "GRU-MUC": [12, 13], "GRU-MEX": [9, 11],
  "GRU-NCE": [11, 13], "GRU-DPS": [22, 26], "GRU-IST": [13, 15],
  "GRU-RAK": [10, 12], "GRU-SYD": [20, 24], "GRU-PRG": [12, 14],
  "GRU-CTG": [6, 8], "GRU-ICN": [24, 27], "GRU-LIS": [9, 11],
  "GRU-AMS": [11, 13], "GRU-BKK": [20, 24], "GRU-SIN": [21, 25],
  "GRU-DEL": [18, 22], "GRU-BOM": [17, 20],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateFlights(fromCode: string, toCode: string): FlightResult[] {
  const from3 = fromCode.replace(".AIRPORT", "");
  const to3 = toCode.replace(".AIRPORT", "");
  const originName = cityNames[from3] || from3;
  const destName = cityNames[to3] || to3;

  // Use current date as part of seed so it changes daily
  const dateSeed = new Date().toISOString().split("T")[0];
  const seedStr = `${from3}-${to3}-${dateSeed}`;
  let seedNum = 0;
  for (let i = 0; i < seedStr.length; i++) seedNum = ((seedNum << 5) - seedNum + seedStr.charCodeAt(i)) | 0;
  const rand = seededRandom(Math.abs(seedNum));

  const routeKey = `${from3}-${to3}`;
  const reverseKey = `${to3}-${from3}`;
  const durations = routeDurations[routeKey] || routeDurations[reverseKey] || [10, 14];

  const numFlights = 5 + Math.floor(rand() * 3); // 5-7 flights
  const flights: FlightResult[] = [];

  // Pick airlines for this route
  const shuffled = [...airlines].sort(() => rand() - 0.5);
  const routeAirlines = shuffled.slice(0, numFlights);

  for (let i = 0; i < numFlights; i++) {
    const airline = routeAirlines[i];
    const depHour = Math.floor(rand() * 24);
    const depMin = Math.floor(rand() * 12) * 5;
    const baseDuration = durations[0] + rand() * (durations[1] - durations[0]);
    const stops = baseDuration > 15 ? (rand() > 0.4 ? 1 : 0) : (rand() > 0.7 ? 1 : 0);
    const totalMinutes = Math.round(baseDuration * 60) + (stops * Math.round(60 + rand() * 120));
    const durationH = Math.floor(totalMinutes / 60);
    const durationM = totalMinutes % 60;

    const arrHour = (depHour + durationH) % 24;
    const arrMin = (depMin + durationM) % 60;

    // Price range based on distance
    const basePrice = Math.round(1500 + baseDuration * 200 + rand() * 1500);
    const price = stops > 0 ? Math.round(basePrice * 0.75) : basePrice;

    flights.push({
      id: `gen-${from3}-${to3}-${i}`,
      airline: airline.name,
      logo: airline.logo,
      departure: `${String(depHour).padStart(2, "0")}:${String(depMin).padStart(2, "0")}`,
      arrival: `${String(arrHour).padStart(2, "0")}:${String(arrMin).padStart(2, "0")}`,
      duration: `${durationH}h ${String(durationM).padStart(2, "0")}m`,
      stops,
      price,
      currency: "BRL",
      origin: originName,
      destination: destName,
    });
  }

  return flights.sort((a, b) => a.price - b.price);
}
