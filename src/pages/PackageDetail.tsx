import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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
import { generateReviews } from "@/lib/generated-reviews";
import { AIRPORT_OPTIONS, getHomeAirport, setHomeAirport, getAirportLabel } from "@/lib/userOrigin";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plane, Hotel, Ticket, Car, ArrowLeft, ShoppingCart, Check, MapPin, Calendar, Star, Heart, Loader2, RefreshCw, MessageCircle,
} from "lucide-react";
import SmartImage from "@/components/SmartImage";

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const { addItem, removeItem, items } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { addItem: addRecent } = useRecentlyViewed();
  const [selectedFlight, setSelectedFlight] = useState<FlightResult | null>(null);
  const [originCode, setOriginCode] = useState<string>(() => getHomeAirport());

  // Sync if user updates home airport elsewhere
  useEffect(() => {
    const onChange = () => setOriginCode(getHomeAirport());
    window.addEventListener("home-airport-changed", onChange);
    return () => window.removeEventListener("home-airport-changed", onChange);
  }, []);

  const pkg = eventPackages.find((p) => p.id === id);

  useEffect(() => {
    if (pkg) {
      addRecent({ id: pkg.id, type: "event", name: locale === "pt" ? pkg.event : pkg.eventEn, image: pkg.image, price: pkg.price });
    }
  }, [id]);

  // Fetch real flight prices for this package's route, using user's origin
  const flightQuery = useQuery({
    queryKey: ["package-flights", originCode, pkg?.flight.toCode],
    queryFn: () => searchFlights({
      from: `${originCode}.AIRPORT`,
      to: `${pkg!.flight.toCode}.AIRPORT`,
    }),
    enabled: !!pkg && originCode !== pkg.flight.toCode,
    staleTime: 10 * 60 * 1000,
  });

  const cheapestFlight = flightQuery.data?.length
    ? flightQuery.data.reduce((min, f) => f.price < min.price ? f : min, flightQuery.data[0])
    : null;

  // Auto-select cheapest flight when data loads or origin changes
  useEffect(() => {
    if (cheapestFlight) {
      setSelectedFlight(cheapestFlight);
    }
    // Reset selected flight when origin changes so we don't keep stale price
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cheapestFlight?.id, originCode]);

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

  // ---- Pricing model ----
  // pkg.price = full package price WITH the cheapest flight already included (free upgrade)
  // If user picks a different flight, they pay only the *difference* vs. cheapest.
  const flightUpgradeCost =
    selectedFlight && cheapestFlight && selectedFlight.id !== cheapestFlight.id
      ? Math.max(0, selectedFlight.price - cheapestFlight.price)
      : 0;
  const finalPrice = pkg.price + flightUpgradeCost;

  const handleAddToCart = () => {
    if (!user) {
      navigate(`/auth?redirect=/packages/${pkg.id}`);
      return;
    }
    const activeFlight = selectedFlight || cheapestFlight;
    const flightInfo = activeFlight ? ` ✈ ${activeFlight.airline}` : "";
    const product: CartProduct = {
      id: activeFlight ? `${pkg.id}__flight-${activeFlight.id}` : pkg.id,
      type: "event",
      name: `${locale === "pt" ? pkg.event : pkg.eventEn}${flightInfo}`,
      image: pkg.image,
      price: finalPrice,
      description: `${pkg.location} — ${locale === "pt" ? pkg.date : pkg.dateEn}`,
      meta: { location: pkg.location, date: pkg.date, country: pkg.country },
    };
    // Remove any previous version of this package from cart
    const existingIds = items.filter(i => i.product.id.startsWith(pkg.id)).map(i => i.product.id);
    existingIds.forEach(eid => removeItem(eid));
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  const handleSelectFlight = (flight: FlightResult) => {
    // Always must have a flight selected — only swap, never deselect
    setSelectedFlight(flight);
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
        <SmartImage src={pkg.image} alt={eventName} category="event" className="w-full h-full object-cover" />
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
            <motion.div id="flights-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  {locale === "pt" ? "Seu Voo" : "Your Flight"}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {locale === "pt" ? "Saindo de:" : "Departing from:"}
                  </span>
                  <Select
                    value={originCode}
                    onValueChange={(v) => { setOriginCode(v); setHomeAirport(v); }}
                  >
                    <SelectTrigger className="h-9 w-[200px] text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AIRPORT_OPTIONS.map((a) => (
                        <SelectItem key={a.code} value={a.code}>
                          {a.city} ({a.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {locale === "pt"
                  ? "✓ O voo mais barato já está incluído no pacote. Faça upgrade pagando apenas a diferença."
                  : "✓ The cheapest flight is already included in the package. Upgrade by paying only the difference."}
              </p>

              {flightQuery.isLoading && (
                <div className="flex items-center gap-3 py-6 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{locale === "pt" ? "Buscando voos em tempo real..." : "Searching real-time flights..."}</span>
                </div>
              )}

              {flightQuery.data && flightQuery.data.length > 0 && (
                <div className="space-y-3">
                  {flightQuery.data.slice(0, 5).map((flight) => {
                    const isSelected = selectedFlight?.id === flight.id;
                    const isCheapest = cheapestFlight?.id === flight.id;
                    const upgradeDiff = cheapestFlight ? Math.max(0, flight.price - cheapestFlight.price) : 0;
                    return (
                      <div
                        key={flight.id}
                        className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary ring-1 ring-primary/30"
                            : "bg-muted/50 border-border/50 hover:border-primary/30"
                        }`}
                        onClick={() => handleSelectFlight(flight)}
                      >
                        <div className="flex items-center gap-2 sm:w-1/4 w-full">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Plane className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-card-foreground truncate">{flight.airline}</span>
                          {isCheapest && (
                            <Badge variant="secondary" className="text-[10px] ml-auto sm:ml-0">
                              {locale === "pt" ? "Incluso" : "Included"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 flex items-center gap-3 text-xs text-muted-foreground w-full">
                          <span className="font-semibold text-card-foreground">
                            {flight.departure || "--"}
                          </span>
                          <div className="flex-1 text-center">
                            <span>{flight.duration}</span>
                            <div className="border-t border-border mx-2" />
                            <span>{flight.stops === 0 ? (locale === "pt" ? "Direto" : "Direct") : `${flight.stops} ${locale === "pt" ? "parada(s)" : "stop(s)"}`}</span>
                          </div>
                          <span className="font-semibold text-card-foreground">
                            {flight.arrival || "--"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-base sm:text-lg font-bold text-primary whitespace-nowrap">
                            {isCheapest
                              ? (locale === "pt" ? "Grátis" : "Free")
                              : `+ R$ ${upgradeDiff.toLocaleString("pt-BR")}`}
                          </span>
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={(e) => { e.stopPropagation(); handleSelectFlight(flight); }}
                            className="gap-1 shrink-0"
                          >
                            {isSelected ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">{locale === "pt" ? "Selecionado" : "Selected"}</span>
                              </>
                            ) : (
                              <>
                                <Plane className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">{locale === "pt" ? "Selecionar" : "Select"}</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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

              {/* Selected flight price */}
              {selectedFlight && (
                <div className="rounded-lg bg-primary/5 p-3 border border-primary/20">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground">
                      ✈️ {locale === "pt" ? "Voo incluído" : "Included flight"}
                    </p>
                    <a
                      href="#flights-section"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      {locale === "pt" ? "Trocar voo" : "Change flight"}
                    </a>
                  </div>
                  <p className="text-sm font-semibold text-card-foreground">
                    {selectedFlight.airline} — <span className="text-primary">+ R$ {selectedFlight.price.toLocaleString("pt-BR")}</span>
                  </p>
                </div>
              )}

              {flightQuery.isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> {locale === "pt" ? "Buscando voos..." : "Searching flights..."}
                </div>
              )}

              {/* Total with flight */}
              {selectedFlight && (
                <div className="rounded-lg bg-accent/10 p-3 border border-accent/20">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{locale === "pt" ? "Pacote" : "Package"}</span>
                    <span>R$ {pkg.price.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{locale === "pt" ? "Voo" : "Flight"}</span>
                    <span>R$ {selectedFlight.price.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="border-t border-border mt-2 pt-2 flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-primary text-lg">R$ {(pkg.price + selectedFlight.price).toLocaleString("pt-BR")}</span>
                  </div>
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
        {/* Reviews Section */}
        <ReviewsSection packageId={pkg.id} locale={locale} />
      </div>

      <Footer />
    </div>
  );
};

const ReviewsSection = ({ packageId, locale }: { packageId: string; locale: string }) => {
  const reviews = useMemo(() => generateReviews(packageId, 6), [packageId]);
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className="font-display text-2xl font-bold text-foreground">
          {locale === "pt" ? "Avaliações dos Viajantes" : "Traveler Reviews"}
        </h2>
        <div className="flex items-center gap-1 ml-auto">
          <Star className="h-5 w-5 fill-current text-accent" />
          <span className="text-lg font-bold text-foreground">{avgRating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviews.length} {locale === "pt" ? "avaliações" : "reviews"})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-card card-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={review.avatar}
                alt={review.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-card-foreground text-sm">{review.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`h-3.5 w-3.5 ${si < review.rating ? "fill-current text-accent" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {locale === "pt" ? review.comment : review.commentEn}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PackageDetail;
