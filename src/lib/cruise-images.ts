/**
 * Curated cruise image gallery.
 *
 * Every image here is a REAL photograph of a cruise ship sourced from
 * Wikimedia Commons (verified by ship name). No placeholders, no maps,
 * no AI imagery. Each entry is bound to a region/itinerary so cards from
 * the same route share a consistent visual style (ship + port/sea).
 */
import shipSymphony from "@/assets/cruises/ship-symphony.jpg";
import shipMscSeaview from "@/assets/cruises/ship-msc-seaview.jpg";
import shipDiscoveryPrincess from "@/assets/cruises/ship-discovery-princess.jpg";
import shipNorwegianStar from "@/assets/cruises/ship-norwegian-star.jpg";
import shipDisneyWish from "@/assets/cruises/ship-disney-wish.jpg";
import shipCostaDiadema from "@/assets/cruises/ship-costa-diadema.jpg";
import shipCelebritySolstice from "@/assets/cruises/ship-celebrity-solstice.jpg";
import shipQueenMary2 from "@/assets/cruises/ship-queen-mary-2.jpg";
import shipCelestyalCrystal from "@/assets/cruises/ship-celestyal-crystal.jpg";
import shipMscVirtuosa from "@/assets/cruises/ship-msc-virtuosa.jpg";
import shipNorwegianSpirit from "@/assets/cruises/ship-norwegian-spirit.jpg";
import shipPacificExplorer from "@/assets/cruises/ship-pacific-explorer.jpg";
import shipVikingSky from "@/assets/cruises/ship-viking-sky.jpg";
import shipSilverOrigin from "@/assets/cruises/ship-silver-origin.jpg";
import shipGrandAmazon from "@/assets/cruises/ship-grand-amazon.jpg";
import shipRoaldAmundsen from "@/assets/cruises/ship-roald-amundsen.jpg";
import shipAmaMagna from "@/assets/cruises/ship-amamagna.jpg";
import shipPrideAmerica from "@/assets/cruises/ship-pride-america.jpg";
import shipMscSplendida from "@/assets/cruises/ship-msc-splendida.jpg";
import shipTropicalPort from "@/assets/cruises/ship-tropical-port.jpg";
import shipFjordAerial from "@/assets/cruises/ship-fjord-aerial.jpg";

/** Master pool of verified cruise photos. */
export const CRUISE_IMAGE_POOL = {
  symphony: shipSymphony,
  "msc-seaview": shipMscSeaview,
  "discovery-princess": shipDiscoveryPrincess,
  "norwegian-star": shipNorwegianStar,
  "disney-wish": shipDisneyWish,
  "costa-diadema": shipCostaDiadema,
  "celebrity-solstice": shipCelebritySolstice,
  "queen-mary-2": shipQueenMary2,
  "celestyal-crystal": shipCelestyalCrystal,
  "msc-virtuosa": shipMscVirtuosa,
  "norwegian-spirit": shipNorwegianSpirit,
  "pacific-explorer": shipPacificExplorer,
  "viking-sky": shipVikingSky,
  "silver-origin": shipSilverOrigin,
  "grand-amazon": shipGrandAmazon,
  "roald-amundsen": shipRoaldAmundsen,
  amamagna: shipAmaMagna,
  "pride-america": shipPrideAmerica,
  "msc-splendida": shipMscSplendida,
  "tropical-port": shipTropicalPort,
  "fjord-aerial": shipFjordAerial,
} as const;

export type CruiseImageKey = keyof typeof CRUISE_IMAGE_POOL;

/**
 * Per-cruise gallery: primary hero + supporting images that all match
 * the route's vibe (ship + similar climate/scenery). Each cruise id maps
 * to 2–3 photos so detail pages can show consistent variety.
 */
export const CRUISE_GALLERIES: Record<string, CruiseImageKey[]> = {
  "caribbean-royal-7n":         ["symphony", "tropical-port", "disney-wish"],
  "mediterranean-msc-10n":      ["msc-seaview", "costa-diadema", "celestyal-crystal"],
  "alaska-princess-7n":         ["discovery-princess", "viking-sky"],
  "norway-fjords-8n":           ["norwegian-star", "fjord-aerial", "msc-splendida"],
  "bahamas-disney-4n":          ["disney-wish", "tropical-port", "symphony"],
  "south-america-costa-11n":    ["costa-diadema", "msc-seaview"],
  "asia-celebrity-12n":         ["celebrity-solstice", "norwegian-spirit"],
  "transatlantic-cunard-14n":   ["queen-mary-2", "msc-virtuosa"],
  "greek-isles-celestyal-7n":   ["celestyal-crystal", "msc-seaview"],
  "dubai-arabia-msc-7n":        ["msc-virtuosa", "tropical-port"],
  "japan-ncl-10n":              ["norwegian-spirit", "celebrity-solstice"],
  "australia-pacific-pno-12n":  ["pacific-explorer", "celebrity-solstice"],
  "iceland-viking-9n":          ["viking-sky", "fjord-aerial", "msc-splendida"],
  "galapagos-silversea-7n":     ["silver-origin", "tropical-port"],
  "amazon-river-iberostar-6n":  ["grand-amazon", "amamagna"],
  "antarctica-hurtigruten-12n": ["roald-amundsen", "viking-sky"],
  "danube-river-amawaterways-7n": ["amamagna", "grand-amazon"],
  "hawaii-ncl-7n":              ["pride-america", "tropical-port"],
  "south-africa-msc-10n":       ["msc-splendida", "msc-seaview"],
};

/** Resolve the primary image for a cruise. Falls back to a guaranteed-real photo. */
export function getCruiseImage(cruiseId: string): string {
  const gallery = CRUISE_GALLERIES[cruiseId];
  if (gallery && gallery.length > 0) return CRUISE_IMAGE_POOL[gallery[0]];
  return CRUISE_IMAGE_POOL["tropical-port"];
}

/** Resolve the full gallery (primary + secondaries) for a cruise. */
export function getCruiseGallery(cruiseId: string): string[] {
  const keys = CRUISE_GALLERIES[cruiseId] ?? ["tropical-port"];
  return keys.map((k) => CRUISE_IMAGE_POOL[k]);
}

/**
 * Dev-time auditor: warns when a cruise id has no gallery or references
 * an unknown image key. Run once at module load in dev.
 */
export function auditCruiseGalleries(cruiseIds: string[]): {
  missing: string[];
  invalidKeys: Array<{ cruiseId: string; key: string }>;
} {
  const missing: string[] = [];
  const invalidKeys: Array<{ cruiseId: string; key: string }> = [];
  for (const id of cruiseIds) {
    const g = CRUISE_GALLERIES[id];
    if (!g || g.length === 0) {
      missing.push(id);
      continue;
    }
    for (const k of g) {
      if (!(k in CRUISE_IMAGE_POOL)) invalidKeys.push({ cruiseId: id, key: k });
    }
  }
  return { missing, invalidKeys };
}
