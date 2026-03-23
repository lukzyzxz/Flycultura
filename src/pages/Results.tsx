import { useSearchParams, Link } from "react-router-dom";
import { Star, ArrowLeft, Plane, Hotel as HotelIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { destinations } from "@/lib/data";
import { searchFlights, searchHotels, FlightResult, HotelResult } from "@/lib/api";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";

const Results = () => {
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const type = searchParams.get("type") || "flights";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const flightsQuery = useQuery({
    queryKey: ["flights", from, to],
    queryFn: () => searchFlights({ originSkyId: from || "SAOP", destinationSkyId: to || "NYCA" }),
    enabled: type === "flights",
    staleTime: 5 * 60 * 1000,
  });

  const hotelsQuery = useQuery({
    queryKey: ["hotels", to],
    queryFn: () => searchHotels({ dest_id: to || "20088325" }),
    enabled: type === "hotels",
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = (type === "flights" && flightsQuery.isLoading) || (type === "hotels" && hotelsQuery.isLoading);
  const isError = (type === "flights" && flightsQuery.isError) || (type === "hotels" && hotelsQuery.isError);

  const typeLabel = type === "flights" ? "Voos" : type === "hotels" ? "Hotéis" : type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="min-h-screen">
      <div className="bg-muted/50 py-8">
        <div className="container">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> {t("results.backToSearch")}
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {typeLabel} {t("results.results")}
            {from && to && <span className="text-muted-foreground font-normal text-lg"> — {from} → {to}</span>}
          </h1>
        </div>
      </div>

      <div className="container py-10">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Buscando os melhores preços...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">Erro ao buscar resultados. Tente novamente.</p>
            <Button onClick={() => type === "flights" ? flightsQuery.refetch() : hotelsQuery.refetch()}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Flight results */}
        {type === "flights" && !isLoading && !isError && (
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
                    {flight.logo && <img src={flight.logo} alt={flight.airline} className="h-8 w-8 object-contain" />}
                    <span className="font-medium text-card-foreground">{flight.airline}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="text-center">
                      <p className="font-bold text-card-foreground">{flight.departure ? new Date(flight.departure).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--"}</p>
                      <p className="text-xs">{flight.origin}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-xs">{flight.duration}</p>
                      <div className="w-full border-t border-border relative">
                        <Plane className="h-3 w-3 text-primary absolute -top-1.5 right-0" />
                      </div>
                      <p className="text-xs">{flight.stops === 0 ? "Direto" : `${flight.stops} parada${flight.stops > 1 ? "s" : ""}`}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-card-foreground">{flight.arrival ? new Date(flight.arrival).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--"}</p>
                      <p className="text-xs">{flight.destination}</p>
                    </div>
                  </div>
                  <div className="text-right md:w-1/5">
                    <p className="text-xl font-bold text-primary">R$ {flight.price.toLocaleString("pt-BR")}</p>
                    <Button size="sm" className="mt-1">Selecionar</Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <FallbackDestinations />
            )}
          </div>
        )}

        {/* Hotel results */}
        {type === "hotels" && !isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(hotelsQuery.data?.length ?? 0) > 0 ? (
              hotelsQuery.data!.map((hotel, i) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {hotel.image ? (
                      <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><HotelIcon className="h-10 w-10 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-card-foreground mb-1 line-clamp-1">{hotel.name}</h3>
                    {hotel.address && <p className="text-xs text-muted-foreground mb-1">{hotel.address}</p>}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3.5 w-3.5 fill-current text-accent" />
                      <span className="text-xs font-medium text-accent">{hotel.rating || "–"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">R$ {hotel.price.toLocaleString("pt-BR")}</span>
                      <Button size="sm">Reservar</Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <FallbackDestinations />
            )}
          </div>
        )}

        {/* Fallback for packages/cruises */}
        {type !== "flights" && type !== "hotels" && <FallbackDestinations />}
      </div>

      <Footer />
    </div>
  );
};

const FallbackDestinations = () => {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((d, i) => (
        <motion.div
          key={d.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
        >
          <div className="aspect-[4/3] overflow-hidden">
            <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
              <span className="text-lg font-bold text-primary">{t("index.fromPrice")} R$ {(d.price * 5).toLocaleString("pt-BR")}</span>
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
