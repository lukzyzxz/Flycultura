import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Plane, Hotel as HotelIcon, Loader2, ShoppingCart, SearchX, Ship, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { destinations } from "@/lib/data";
import { eventPackages, isEventUpcoming } from "@/lib/events-data";
import { searchFlights, FlightResult } from "@/lib/api";
import { searchHotelsByQuery, Hotel } from "@/lib/hotels-data";
import { searchCruises, searchCruisesByStops, Cruise } from "@/lib/cruises-data";
import { useCart, CartProduct } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import SmartImage from "@/components/SmartImage";
import { commissionLabel } from "@/lib/pricing";
import { dateInvalidReason, isValidFutureDate } from "@/lib/dateLimits";

const Results = () => {
  const [searchParams] = useSearchParams();
  const { t, locale } = useI18n();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const type = searchParams.get("type") || "flights";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const dateParam = searchParams.get("date") || "";
  const stopsParam = searchParams.get("stops") || "";
  const cruiseStops = stopsParam
    ? stopsParam.split("|").map((s) => s.trim()).filter(Boolean)
    : [];
  const query = to.toLowerCase().trim();

  // Hard date gate — block API/data calls for ALL search types when date is bad.
  const dateError = dateParam ? dateInvalidReason(dateParam, locale) : "";
  const hasDateError = !!dateError || (!!dateParam && !isValidFutureDate(dateParam));

  // Only consider upcoming packages
  const upcomingPackages = eventPackages.filter((p) => isEventUpcoming(p));

  // Filter matching event packages — STRICT: must match the package's city (location),
  // OR the user typed the exact event name. We no longer match by country/tags so a
  // search for "Miami" doesn't surface Los Angeles or generic "USA" packages.
  const matchingPackages = upcomingPackages.filter((pkg) => {
    if (!query) return false;
    // Split multi-city locations like "New York / New Jersey" or "Tóquio / Kyoto"
    const cityTokens = pkg.location
      .toLowerCase()
      .split(/[\/,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const cityMatch = cityTokens.some(
      (city) => city.includes(query) || query.includes(city),
    );
    const eventMatch =
      pkg.event.toLowerCase().includes(query) ||
      pkg.eventEn.toLowerCase().includes(query);
    return cityMatch || eventMatch;
  });

  // Featured upcoming packages used as fallback when nothing matches
  const featuredOffers = [...upcomingPackages]
    .sort((a, b) => (1 - b.price / b.originalPrice) - (1 - a.price / a.originalPrice))
    .slice(0, 6);

  // Filter matching destinations — strict: only return matches when there's a query
  const matchingDestinations = destinations.filter((d) => {
    if (!query) return true;
    const searchTerms = [d.name.toLowerCase(), d.country.toLowerCase(), ...d.tags];
    return searchTerms.some((term) => term.includes(query) || query.includes(term));
  });
  const queryHasStrictDestinationMatch =
    !!query &&
    destinations.some((d) => {
      const terms = [d.name.toLowerCase(), d.country.toLowerCase(), ...d.tags];
      return terms.some((term) => term.includes(query) || query.includes(term));
    });

  // True if the user typed a destination but nothing matched
  const noMatchAtAll =
    !!query && matchingPackages.length === 0 && !queryHasStrictDestinationMatch;

  // Resolve airport codes for flight search
  const resolveAirportCode = (input: string, fallback?: string): string => {
    if (!input) return fallback || "GRU.AIRPORT";
    const lower = input.toLowerCase();
    const airportMap: Record<string, string> = {
      "são paulo": "GRU.AIRPORT", "sao paulo": "GRU.AIRPORT", "guarulhos": "GRU.AIRPORT", "gru": "GRU.AIRPORT",
      "new york": "JFK.AIRPORT", "nova york": "JFK.AIRPORT", "jfk": "JFK.AIRPORT", "new jersey": "JFK.AIRPORT",
      "miami": "MIA.AIRPORT", "mia": "MIA.AIRPORT",
      "los angeles": "LAX.AIRPORT", "lax": "LAX.AIRPORT", "indio": "LAX.AIRPORT", "california": "LAX.AIRPORT",
      "paris": "CDG.AIRPORT", "cdg": "CDG.AIRPORT",
      "londres": "LHR.AIRPORT", "london": "LHR.AIRPORT", "lhr": "LHR.AIRPORT",
      "tokyo": "NRT.AIRPORT", "tóquio": "NRT.AIRPORT", "nrt": "NRT.AIRPORT", "japão": "NRT.AIRPORT", "japan": "NRT.AIRPORT",
      "roma": "FCO.AIRPORT", "rome": "FCO.AIRPORT", "fco": "FCO.AIRPORT",
      "barcelona": "BCN.AIRPORT", "bcn": "BCN.AIRPORT",
      "dubai": "DXB.AIRPORT", "dxb": "DXB.AIRPORT",
      "cancun": "CUN.AIRPORT", "cancún": "CUN.AIRPORT", "cun": "CUN.AIRPORT",
      "buenos aires": "EZE.AIRPORT", "eze": "EZE.AIRPORT",
      "rio de janeiro": "GIG.AIRPORT", "rio": "GIG.AIRPORT", "gig": "GIG.AIRPORT",
      "toronto": "YYZ.AIRPORT", "yyz": "YYZ.AIRPORT",
      "munique": "MUC.AIRPORT", "munich": "MUC.AIRPORT", "muc": "MUC.AIRPORT",
      "mexico": "MEX.AIRPORT", "cidade do mexico": "MEX.AIRPORT", "mexico city": "MEX.AIRPORT",
      "monte carlo": "NCE.AIRPORT", "monaco": "NCE.AIRPORT", "nice": "NCE.AIRPORT",
      "bali": "DPS.AIRPORT", "dps": "DPS.AIRPORT",
      "istanbul": "IST.AIRPORT", "istambul": "IST.AIRPORT", "ist": "IST.AIRPORT",
      "marrakech": "RAK.AIRPORT", "marraquexe": "RAK.AIRPORT", "rak": "RAK.AIRPORT",
      "sydney": "SYD.AIRPORT", "syd": "SYD.AIRPORT",
      "prague": "PRG.AIRPORT", "praga": "PRG.AIRPORT", "prg": "PRG.AIRPORT",
      "cartagena": "CTG.AIRPORT", "ctg": "CTG.AIRPORT",
      "seoul": "ICN.AIRPORT", "seul": "ICN.AIRPORT", "icn": "ICN.AIRPORT",
      "lisbon": "LIS.AIRPORT", "lisboa": "LIS.AIRPORT", "lis": "LIS.AIRPORT",
      "amsterdam": "AMS.AIRPORT", "ams": "AMS.AIRPORT",
      "bangkok": "BKK.AIRPORT", "bkk": "BKK.AIRPORT",
      "singapore": "SIN.AIRPORT", "cingapura": "SIN.AIRPORT", "sin": "SIN.AIRPORT",
      "india": "DEL.AIRPORT", "índia": "DEL.AIRPORT", "delhi": "DEL.AIRPORT", "nova deli": "DEL.AIRPORT", "new delhi": "DEL.AIRPORT", "del": "DEL.AIRPORT",
      "mumbai": "BOM.AIRPORT", "bom": "BOM.AIRPORT",
    };
    for (const [key, code] of Object.entries(airportMap)) {
      if (lower.includes(key)) return code;
    }
    return `${input.toUpperCase().slice(0, 3)}.AIRPORT`;
  };

  const fromCode = resolveAirportCode(from, "GRU.AIRPORT");
  const toCode = resolveAirportCode(to, "JFK.AIRPORT");

  // Detect same origin/destination (by raw text or resolved airport code)
  const normTxt = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const sameOriginDest =
    (!!from && !!to && normTxt(from) === normTxt(to)) || toCode === fromCode;
  const safeToCode = sameOriginDest ? "JFK.AIRPORT" : toCode;

  const flightsQuery = useQuery({
    queryKey: ["flights", fromCode, safeToCode],
    queryFn: () => searchFlights({ from: fromCode, to: safeToCode }),
    enabled: type === "flights" && !sameOriginDest && !hasDateError,
    staleTime: 5 * 60 * 1000,
  });

  // Hotels — local catalog filtered by destination query (only cities with packages)
  const hotelResults: Hotel[] = type === "hotels" && !hasDateError ? searchHotelsByQuery(to) : [];

  // Cruises — multi-stop search: show cruises that pass through ALL chosen stops.
  const cruiseSearch =
    type === "cruises"
      ? cruiseStops.length > 0
        ? searchCruisesByStops(cruiseStops)
        : { matched: searchCruises(to), unknownStops: [], knownStops: [], fallback: searchCruises("") }
      : null;
  const cruiseResults: Cruise[] = cruiseSearch?.matched ?? [];
  const cruiseUnknownStops = cruiseSearch?.unknownStops ?? [];
  const cruiseFallback = cruiseSearch?.fallback ?? [];

  const isLoading = type === "flights" && flightsQuery.isLoading;
  const isError = type === "flights" && flightsQuery.isError;

  const handleAddFlight = (flight: FlightResult) => {
    if (!user) { navigate(`/auth?redirect=/results?${searchParams.toString()}`); return; }
    const product: CartProduct = {
      id: `flight-${flight.id}`,
      type: "flight",
      name: `${flight.airline} — ${flight.origin} → ${flight.destination}`,
      image: flight.logo || "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&h=300&fit=crop",
      price: flight.price,
      description: `${flight.departure} → ${flight.arrival} | ${flight.duration}`,
    };
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  const handleAddHotel = (hotel: Hotel) => {
    if (!user) { navigate(`/auth?redirect=/results?${searchParams.toString()}`); return; }
    const product: CartProduct = {
      id: `hotel-${hotel.id}`,
      type: "hotel",
      name: hotel.name,
      image: hotel.image,
      price: hotel.pricePerNight,
      description: `${locale === "pt" ? hotel.city : hotel.cityEn} — ${hotel.address}`,
    };
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  const handleAddCruise = (cruise: Cruise) => {
    if (!user) { navigate(`/auth?redirect=/results?${searchParams.toString()}`); return; }
    const product: CartProduct = {
      id: `cruise-${cruise.id}`,
      type: "hotel", // reuse existing cart type
      name: `${cruise.cruiseLine} — ${locale === "pt" ? cruise.name : cruise.nameEn}`,
      image: cruise.image,
      price: cruise.price,
      description: `${cruise.duration} ${locale === "pt" ? "noites" : "nights"} • ${locale === "pt" ? cruise.date : cruise.dateEn}`,
    };
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  const handleAddPackage = (pkg: typeof eventPackages[0]) => {
    if (!user) { navigate(`/auth?redirect=/packages/${pkg.id}`); return; }
    const product: CartProduct = {
      id: pkg.id,
      type: "event",
      name: locale === "pt" ? pkg.event : pkg.eventEn,
      image: pkg.image,
      price: pkg.price,
      description: `${pkg.location} — ${locale === "pt" ? pkg.date : pkg.dateEn}`,
    };
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  const typeLabel = type === "flights"
    ? t("hero.flights")
    : type === "hotels"
      ? t("hero.hotels")
      : type === "packages"
        ? t("hero.packages")
        : type === "cruises"
          ? t("hero.cruises")
          : type;

  return (
    <div className="min-h-screen">
      <div className="bg-muted/50 py-8">
        <div className="container">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> {t("results.backToSearch")}
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {typeLabel} {t("results.results")}
            {query && <span className="text-muted-foreground font-normal text-lg"> — "{to}"</span>}
          </h1>
        </div>
      </div>

      <div className="container py-10">
        {/* Hard date gate — applies to ALL search types */}
        {hasDateError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium text-foreground">
                {locale === "pt" ? "Data inválida" : "Invalid date"}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {dateError ||
                  (locale === "pt"
                    ? "Escolha uma data válida entre hoje e 31/12/2050."
                    : "Pick a valid date between today and 12/31/2050.")}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link to="/">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  {locale === "pt" ? "Refazer busca" : "Edit search"}
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Same origin/destination warning */}
        {sameOriginDest && !hasDateError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium text-foreground">
                {locale === "pt"
                  ? "Origem e destino são iguais."
                  : "Origin and destination are the same."}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {locale === "pt"
                  ? "Escolha cidades diferentes para ver resultados de voos."
                  : "Pick different cities to see flight results."}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-3">
                <Link to="/">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  {locale === "pt" ? "Refazer busca" : "Edit search"}
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Not found block — shown when query has zero matches */}
        {noMatchAtAll && !hasDateError && (
          <div className="mb-10">
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                {locale === "pt"
                  ? `Nada encontrado para "${to}"`
                  : `Nothing found for "${to}"`}
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {locale === "pt"
                  ? "Tente outro destino ou origem. Enquanto isso, confira nossas ofertas em destaque abaixo."
                  : "Try a different destination or origin. Meanwhile, check out our featured offers below."}
              </p>
            </div>

            <h3 className="font-display text-lg font-bold text-foreground mt-8 mb-4">
              {locale === "pt" ? "✨ Ofertas em destaque" : "✨ Featured offers"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredOffers.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl overflow-hidden bg-card card-shadow"
                >
                  <Link to={`/packages/${pkg.id}`}>
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      <SmartImage
                        src={pkg.image}
                        alt={locale === "pt" ? pkg.event : pkg.eventEn}
                        category="event"
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">
                        {pkg.badge}
                      </Badge>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/packages/${pkg.id}`}>
                      <h4 className="font-display font-bold text-card-foreground mb-1 hover:text-primary transition-colors">
                        {locale === "pt" ? pkg.event : pkg.eventEn}
                      </h4>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pkg.location} — {locale === "pt" ? pkg.date : pkg.dateEn}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        R$ {pkg.price.toLocaleString("pt-BR")}
                      </span>
                      <Button size="sm" onClick={() => handleAddPackage(pkg)} className="gap-1">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {t("cart.addToCart")}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground/80 mt-1">{commissionLabel(locale, pkg.price)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Matching Event Packages */}
        {matchingPackages.length > 0 && !hasDateError && (
          <div className="mb-10">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              {locale === "pt" ? "📦 Pacotes de Eventos Relacionados" : "📦 Related Event Packages"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchingPackages.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl overflow-hidden bg-card card-shadow"
                >
                  <Link to={`/packages/${pkg.id}`}>
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      <SmartImage src={pkg.image} alt={locale === "pt" ? pkg.event : pkg.eventEn} category="event" className="w-full h-full object-cover" />
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">{pkg.badge}</Badge>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/packages/${pkg.id}`}>
                      <h3 className="font-display font-bold text-card-foreground mb-1 hover:text-primary transition-colors">
                        {locale === "pt" ? pkg.event : pkg.eventEn}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pkg.location} — {locale === "pt" ? pkg.date : pkg.dateEn}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">R$ {pkg.price.toLocaleString("pt-BR")}</span>
                      <Button size="sm" onClick={() => handleAddPackage(pkg)} className="gap-1">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {t("cart.addToCart")}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground/80 mt-1">{commissionLabel(locale, pkg.price)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {isLoading && !hasDateError && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{locale === "pt" ? "Buscando os melhores preços..." : "Searching best prices..."}</p>
          </div>
        )}

        {isError && !hasDateError && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{locale === "pt" ? "Erro ao buscar resultados. Tente novamente." : "Error fetching results. Try again."}</p>
            <Button onClick={() => flightsQuery.refetch()}>
              {locale === "pt" ? "Tentar novamente" : "Try again"}
            </Button>
          </div>
        )}

        {/* Flight results */}
        {type === "flights" && !isLoading && !isError && !hasDateError && (
          <div className="space-y-4">
            {(flightsQuery.data?.length ?? 0) > 0 ? (
              flightsQuery.data!.map((flight, i) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl bg-card card-shadow"
                >
                  <div className="flex items-center gap-3 md:w-1/4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Plane className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-card-foreground">{flight.airline}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="text-center">
                      <p className="font-bold text-card-foreground">{flight.departure || "--"}</p>
                      <p className="text-xs">{flight.origin}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-xs">{flight.duration}</p>
                      <div className="w-full border-t border-border relative">
                        <Plane className="h-3 w-3 text-primary absolute -top-1.5 right-0" />
                      </div>
                      <p className="text-xs">{flight.stops === 0 ? (locale === "pt" ? "Direto" : "Direct") : `${flight.stops} ${locale === "pt" ? "parada" : "stop"}${flight.stops > 1 ? "s" : ""}`}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-card-foreground">{flight.arrival || "--"}</p>
                      <p className="text-xs">{flight.destination}</p>
                    </div>
                  </div>
                  <div className="text-right md:w-1/5">
                    <p className="text-xl font-bold text-primary">R$ {flight.price.toLocaleString("pt-BR")}</p>
                    <p className="text-[10px] text-muted-foreground/80">{commissionLabel(locale, flight.price)}</p>
                    <Button size="sm" className="mt-1 gap-1" onClick={() => handleAddFlight(flight)}>
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {locale === "pt" ? "Selecionar" : "Select"}
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              matchingPackages.length === 0 && <FallbackDestinations matchingDestinations={matchingDestinations} />
            )}
          </div>
        )}

        {/* Hotel results — local catalog (cities with packages) */}
        {type === "hotels" && !hasDateError && (
          <>
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <HotelIcon className="h-4 w-4" />
              <span>
                {hotelResults.length}{" "}
                {locale === "pt" ? "hotéis disponíveis" : "hotels available"}
                {to && ` ${locale === "pt" ? "para" : "for"} "${to}"`}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelResults.map((hotel, i) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <SmartImage src={hotel.image} alt={hotel.name} category="destination" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {hotel.originalPrice > hotel.pricePerNight && (
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">
                        -{Math.round((1 - hotel.pricePerNight / hotel.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-card-foreground mb-1 line-clamp-1">{hotel.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {locale === "pt" ? hotel.city : hotel.cityEn}, {locale === "pt" ? hotel.country : hotel.countryEn}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-current text-accent" />
                        <span className="text-xs font-medium text-accent">{hotel.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">• {hotel.reviewScore}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(locale === "pt" ? hotel.amenities : hotel.amenitiesEn).slice(0, 3).map((a) => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{a}</span>
                      ))}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        {hotel.originalPrice > hotel.pricePerNight && (
                          <p className="text-xs text-muted-foreground line-through">R$ {hotel.originalPrice.toLocaleString("pt-BR")}</p>
                        )}
                        <span className="text-lg font-bold text-primary">R$ {hotel.pricePerNight.toLocaleString("pt-BR")}</span>
                        <span className="text-xs text-muted-foreground"> /{locale === "pt" ? "noite" : "night"}</span>
                        <p className="text-[10px] text-muted-foreground/80">{commissionLabel(locale, hotel.pricePerNight)}</p>
                      </div>
                      <Button size="sm" onClick={() => handleAddHotel(hotel)} className="gap-1">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {locale === "pt" ? "Reservar" : "Book"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Cruise results — local catalog with real cruise photos */}
        {type === "cruises" && (
          <>
            {cruiseUnknownStops.length > 0 && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-medium">
                    {locale === "pt"
                      ? "Não temos cruzeiros para alguns destinos:"
                      : "We don't have cruises for some stops:"}
                  </p>
                  <p className="mt-0.5">
                    {cruiseUnknownStops.join(", ")}
                  </p>
                </div>
              </div>
            )}
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Ship className="h-4 w-4" />
              <span>
                {cruiseResults.length}{" "}
                {locale === "pt" ? "cruzeiros disponíveis" : "cruises available"}
                {cruiseStops.length > 0
                  ? ` ${locale === "pt" ? "passando por" : "visiting"} ${cruiseStops.join(" • ")}`
                  : to && ` ${locale === "pt" ? "para" : "for"} "${to}"`}
              </span>
            </div>
            {cruiseResults.length === 0 && cruiseFallback.length > 0 && (
              <div className="mb-6 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                {locale === "pt"
                  ? "Nenhum cruzeiro passa por todos os locais informados. Veja abaixo todas as opções disponíveis."
                  : "No cruise visits all the stops you listed. Browse all available options below."}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(cruiseResults.length > 0 ? cruiseResults : cruiseFallback).map((cruise, i) => (
                <motion.div
                  key={cruise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <SmartImage src={cruise.image} alt={locale === "pt" ? cruise.name : cruise.nameEn} category="destination" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-0 gap-1">
                      <Ship className="h-3 w-3" />
                      {cruise.duration} {locale === "pt" ? "noites" : "nights"}
                    </Badge>
                    {cruise.originalPrice > cruise.price && (
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground border-0">
                        -{Math.round((1 - cruise.price / cruise.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{cruise.cruiseLine} • {cruise.ship}</p>
                    <h3 className="font-display font-bold text-card-foreground mb-2 line-clamp-1">
                      {locale === "pt" ? cruise.name : cruise.nameEn}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">
                        {(locale === "pt" ? cruise.itinerary : cruise.itineraryEn).join(" → ")}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {locale === "pt" ? cruise.date : cruise.dateEn}
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3.5 w-3.5 fill-current text-accent" />
                      <span className="text-xs font-medium text-accent">{cruise.rating}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        {cruise.originalPrice > cruise.price && (
                          <p className="text-xs text-muted-foreground line-through">R$ {cruise.originalPrice.toLocaleString("pt-BR")}</p>
                        )}
                        <span className="text-lg font-bold text-primary">R$ {cruise.price.toLocaleString("pt-BR")}</span>
                        <p className="text-[10px] text-muted-foreground/80">{commissionLabel(locale, cruise.price)}</p>
                      </div>
                      <Button size="sm" onClick={() => handleAddCruise(cruise)} className="gap-1">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {locale === "pt" ? "Reservar" : "Book"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Fallback for packages only */}
        {type === "packages" && matchingPackages.length === 0 && !hasDateError && (
          <FallbackDestinations matchingDestinations={matchingDestinations} />
        )}

        {/* Matching Destinations */}
        {matchingDestinations.length > 0 && type === "packages" && !hasDateError && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              {locale === "pt" ? "🌍 Destinos Encontrados" : "🌍 Destinations Found"}
            </h2>
            <FallbackDestinations matchingDestinations={matchingDestinations} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const FallbackDestinations = ({ matchingDestinations }: { matchingDestinations?: typeof destinations }) => {
  const { t } = useI18n();
  const items = matchingDestinations && matchingDestinations.length > 0 ? matchingDestinations : destinations.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((d, i) => (
        <motion.div
          key={d.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
        >
          <div className="aspect-[4/3] overflow-hidden">
            <SmartImage src={d.image} alt={d.name} category="destination" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold text-card-foreground">{d.name}</h3>
              <div className="flex items-center gap-1 text-accent">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-xs font-medium">{d.rating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{d.country}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">{t("index.fromPrice")} R$ {d.price.toLocaleString("pt-BR")}</span>
              <Link to={`/destination/${d.slug}`}>
                <Button size="sm">{t("deals.viewDeal")}</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Results;
