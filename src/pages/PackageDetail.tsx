import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { eventPackages } from "@/lib/events-data";
import { useCart, CartProduct } from "@/contexts/CartContext";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { searchFlights, FlightResult } from "@/lib/api";
import {
  Plane, Hotel, Ticket, Car, ArrowLeft, ShoppingCart, Check, MapPin, Calendar, Star, Heart, Loader2,
} from "lucide-react";

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { addItem: addRecent } = useRecentlyViewed();

  const pkg = eventPackages.find((p) => p.id === id);

  useEffect(() => {
    if (pkg) {
      addRecent({ id: pkg.id, type: "event", name: locale === "pt" ? pkg.event : pkg.eventEn, image: pkg.image, price: pkg.price });
    }
  }, [id]);

  // Fetch real flight prices for this package's route
  const flightQuery = useQuery({
    queryKey: ["package-flights", pkg?.flight.fromCode, pkg?.flight.toCode],
    queryFn: () => searchFlights({
      from: `${pkg!.flight.fromCode}.AIRPORT`,
      to: `${pkg!.flight.toCode}.AIRPORT`,
    }),
    enabled: !!pkg && pkg.flight.fromCode !== pkg.flight.toCode,
    staleTime: 10 * 60 * 1000,
  });

  const cheapestFlight = flightQuery.data?.length
    ? flightQuery.data.reduce((min, f) => f.price < min.price ? f : min, flightQuery.data[0])
    : null;

  const { data: isFavorite = false } = useQuery({
    queryKey: ["favorite", user?.id, id],
    queryFn: async () => {
      if (!user || !id) return false;
      const { data } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_id", id)
        .eq("item_type", "event");
      return (data?.length ?? 0) > 0;
    },
    enabled: !!user && !!id,
  });

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (!user || !id) throw new Error("Not logged in");
      if (isFavorite) {
        await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("item_id", id);
      } else {
        await supabase.from("user_favorites").insert({ user_id: user.id, item_id: id, item_type: "event" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", user?.id, id] });
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
    },
  });

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{t("dest.notFound")}</h1>
        <Link to="/packages">
          <Button variant="outline">{t("dest.back")}</Button>
        </Link>
      </div>
    );
  }

  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      navigate(`/auth?redirect=/packages/${pkg.id}`);
      return;
    }
    const product: CartProduct = {
      id: pkg.id,
      type: "event",
      name: locale === "pt" ? pkg.event : pkg.eventEn,
      image: pkg.image,
      price: pkg.price,
      description: `${pkg.location} — ${locale === "pt" ? pkg.date : pkg.dateEn}`,
      meta: { location: pkg.location, date: pkg.date, country: pkg.country },
    };
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  const handleAddFlight = (flight: FlightResult) => {
    if (!user) {
      navigate(`/auth?redirect=/packages/${pkg.id}`);
      return;
    }
    const product: CartProduct = {
      id: `flight-${flight.id}-${pkg.id}`,
      type: "flight",
      name: `${flight.airline} — ${flight.origin} → ${flight.destination}`,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=400&h=300&fit=crop",
      price: flight.price,
      description: `${flight.departure ? new Date(flight.departure).toLocaleTimeString(locale === "pt" ? "pt-BR" : "en-US", { hour: "2-digit", minute: "2-digit" }) : ""} | ${flight.duration}`,
    };
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  const discount = Math.round((1 - pkg.price / pkg.originalPrice) * 100);
  const eventName = locale === "pt" ? pkg.event : pkg.eventEn;
  const description = locale === "pt" ? pkg.description : pkg.descriptionEn;
  const includes = locale === "pt" ? pkg.includes : pkg.includesEn;
  const highlights = locale === "pt" ? pkg.highlights : pkg.highlightsEn;
  const date = locale === "pt" ? pkg.date : pkg.dateEn;
  const country = locale === "pt" ? pkg.country : pkg.countryEn;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden bg-muted">
        <img src={pkg.image} alt={eventName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container">
            <Link to="/packages" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-4">
              <ArrowLeft className="h-4 w-4" /> {t("dest.back")}
            </Link>
            <Badge className="bg-accent text-accent-foreground border-0 mb-3">{pkg.badge}</Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">{eventName}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {pkg.location}, {country}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">{t("dest.about")}</h2>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">{t("events.includes")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Plane, label: `${pkg.flight.airline} — ${pkg.flight.from}` },
                  { icon: Hotel, label: `${pkg.accommodation.type} — ${pkg.accommodation.name}` },
                  { icon: Ticket, label: `${pkg.tickets.type} — ${pkg.tickets.section}` },
                  { icon: Car, label: `${t("events.transfer")} — ${pkg.accommodation.distance}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-card-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">{t("package.whatsIncluded")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {includes.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-card-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">{t("package.highlights")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm text-card-foreground">
                    <Star className="h-4 w-4 text-accent shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {pkg.touristSpots && pkg.touristSpots.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">{t("package.touristSpots")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.touristSpots.map((spot) => (
                    <div key={spot} className="flex items-center gap-2 text-sm text-card-foreground">
                      <MapPin className="h-4 w-4 text-accent shrink-0" />
                      <span>{spot}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Real Flight Prices Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Plane className="h-5 w-5 text-primary" />
                {locale === "pt" ? "Voos Disponíveis" : "Available Flights"}
                <span className="text-sm font-normal text-muted-foreground">
                  ({pkg.flight.from} → {pkg.location})
                </span>
              </h2>

              {flightQuery.isLoading && (
                <div className="flex items-center gap-3 py-6 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{locale === "pt" ? "Buscando voos em tempo real..." : "Searching real-time flights..."}</span>
                </div>
              )}

              {flightQuery.data && flightQuery.data.length > 0 && (
                <div className="space-y-3">
                  {flightQuery.data.slice(0, 5).map((flight, i) => (
                    <div key={flight.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                      <div className="flex items-center gap-2 sm:w-1/4">
                        {flight.logo && <img src={flight.logo} alt={flight.airline} className="h-6 w-6 object-contain" />}
                        <span className="text-sm font-medium text-card-foreground">{flight.airline}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-card-foreground">
                          {flight.departure ? new Date(flight.departure).toLocaleTimeString(locale === "pt" ? "pt-BR" : "en-US", { hour: "2-digit", minute: "2-digit" }) : "--"}
                        </span>
                        <div className="flex-1 text-center">
                          <span>{flight.duration}</span>
                          <div className="border-t border-border mx-2" />
                          <span>{flight.stops === 0 ? (locale === "pt" ? "Direto" : "Direct") : `${flight.stops} ${locale === "pt" ? "parada(s)" : "stop(s)"}`}</span>
                        </div>
                        <span className="font-semibold text-card-foreground">
                          {flight.arrival ? new Date(flight.arrival).toLocaleTimeString(locale === "pt" ? "pt-BR" : "en-US", { hour: "2-digit", minute: "2-digit" }) : "--"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary">R$ {flight.price.toLocaleString("pt-BR")}</span>
                        <Button size="sm" variant="outline" onClick={() => handleAddFlight(flight)} className="gap-1">
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {locale === "pt" ? "Adicionar" : "Add"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {flightQuery.data && flightQuery.data.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">
                  {locale === "pt" ? "Nenhum voo encontrado para esta rota no momento." : "No flights found for this route at the moment."}
                </p>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Pricing & CTA */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24 rounded-xl bg-card card-shadow p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-sm">{discount}% {t("deals.off")}</Badge>
                <button
                  onClick={() => {
                    if (!user) {
                      toast({ title: locale === "pt" ? "Faça login para favoritar" : "Sign in to favorite", variant: "destructive" });
                      return;
                    }
                    toggleFav.mutate();
                  }}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </button>
              </div>
              <div>
                <span className="text-sm text-muted-foreground line-through">
                  R$ {pkg.originalPrice.toLocaleString("pt-BR")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    R$ {pkg.price.toLocaleString("pt-BR")}
                  </span>
                  <span className="text-sm text-muted-foreground">{t("events.perPerson")}</span>
                </div>
              </div>

              {/* Real flight price indicator */}
              {cheapestFlight && (
                <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">
                    {locale === "pt" ? "✈️ Voo mais barato encontrado" : "✈️ Cheapest flight found"}
                  </p>
                  <p className="text-sm font-semibold text-card-foreground">
                    {cheapestFlight.airline} — <span className="text-primary">R$ {cheapestFlight.price.toLocaleString("pt-BR")}</span>
                  </p>
                </div>
              )}
              {flightQuery.isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> {locale === "pt" ? "Buscando voos..." : "Searching flights..."}
                </div>
              )}

              <Button onClick={handleAddToCart} className="w-full gap-2" size="lg">
                <ShoppingCart className="h-5 w-5" />
                {t("cart.addToCart")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">{t("package.noCommitment")}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PackageDetail;
