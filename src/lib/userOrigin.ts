// Manage the user's "home airport" for flight searches.
// Stored locally so it works without DB schema changes.

export interface AirportOption {
  code: string;
  city: string;
  country: string;
}

export const AIRPORT_OPTIONS: AirportOption[] = [
  { code: "GRU", city: "São Paulo", country: "BR" },
  { code: "GIG", city: "Rio de Janeiro", country: "BR" },
  { code: "BSB", city: "Brasília", country: "BR" },
  { code: "CNF", city: "Belo Horizonte", country: "BR" },
  { code: "POA", city: "Porto Alegre", country: "BR" },
  { code: "CWB", city: "Curitiba", country: "BR" },
  { code: "REC", city: "Recife", country: "BR" },
  { code: "SSA", city: "Salvador", country: "BR" },
  { code: "FOR", city: "Fortaleza", country: "BR" },
  { code: "MAO", city: "Manaus", country: "BR" },
  { code: "FLN", city: "Florianópolis", country: "BR" },
  { code: "BEL", city: "Belém", country: "BR" },
  { code: "VCP", city: "Campinas", country: "BR" },
  { code: "GYN", city: "Goiânia", country: "BR" },
];

const KEY = "flycultura_home_airport";

export function getHomeAirport(): string {
  if (typeof window === "undefined") return "GRU";
  return localStorage.getItem(KEY) || "GRU";
}

export function setHomeAirport(code: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, code);
  window.dispatchEvent(new Event("home-airport-changed"));
}

export function getAirportLabel(code: string): string {
  const a = AIRPORT_OPTIONS.find((x) => x.code === code);
  return a ? `${a.city} (${a.code})` : code;
}
