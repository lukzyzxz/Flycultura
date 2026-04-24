import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { eventPackages, isEventUpcoming } from "@/lib/events-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Ticket, Car, ExternalLink, Heart, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SmartImage from "@/components/SmartImage";

const categories = [
  { id: "all", labelPt: "Todos", labelEn: "All" },
  { id: "football", labelPt: "Futebol", labelEn: "Football" },
  { id: "f1", labelPt: "Fórmula 1", labelEn: "Formula 1" },
  { id: "tennis", labelPt: "Tênis", labelEn: "Tennis" },
  { id: "olympics", labelPt: "Olimpíadas", labelEn: "Olympics" },
  { id: "basketball", labelPt: "Basquete", labelEn: "Basketball" },
  { id: "music", labelPt: "Música", labelEn: "Music" },
  { id: "culture", labelPt: "Cultura", labelEn: "Culture" },
];

const sortOptions = [
  { id: "default", labelPt: "Padrão", labelEn: "Default" },
  { id: "price-asc", labelPt: "Menor preço", labelEn: "Lowest price" },
  { id: "price-desc", labelPt: "Maior preço", labelEn: "Highest price" },
  { id: "discount", labelPt: "Maior desconto", labelEn: "Biggest discount" },
];

const EventPackages = () => {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("user_favorites")
        .select("item_id")
        .eq("user_id", user.id)
        .eq("item_type", "event");
      return (data || []).map((f) => f.item_id);
    },
    enabled: !!user,
  });

  const toggleFav = useMutation({
    mutationFn: async (itemId: string) => {
      if (!user) throw new Error("Not logged in");
      const isFav = favorites.includes(itemId);
      if (isFav) {
        await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("item_id", itemId);
      } else {
        await supabase.from("user_favorites").insert({ user_id: user.id, item_id: itemId, item_type: "event" });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] }),
    onError: () => toast({ title: locale === "pt" ? "Faça login para favoritar" : "Sign in to favorite", variant: "destructive" }),
  });

  const upcoming = eventPackages.filter((p) => isEventUpcoming(p));
  let filtered = category === "all" ? [...upcoming] : upcoming.filter((p) => p.category === category);

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "discount") filtered.sort((a, b) => (1 - a.price / a.originalPrice) - (1 - b.price / b.originalPrice)).reverse();

  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-12 md:py-16 text-center">
        <div className="container">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Ticket className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground/80 uppercase tracking-wide">
              {t("events.allInclusive")}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            {t("events.title")}
          </h1>
          <p className="text-primary-foreground/70 max-w-lg mx-auto">
            {t("events.subtitle")}
          </p>
        </div>
      </div>

      <div className="container py-10">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                aria-pressed={category === c.id}
                aria-label={locale === "pt" ? `Filtrar por ${c.labelPt}` : `Filter by ${c.labelEn}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {locale === "pt" ? c.labelPt : c.labelEn}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sort-packages" className="sr-only">
              {locale === "pt" ? "Ordenar pacotes" : "Sort packages"}
            </label>
            <select
              id="sort-packages"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label={locale === "pt" ? "Ordenar pacotes" : "Sort packages"}
              className="bg-muted text-foreground text-sm rounded-lg px-3 py-1.5 border border-border"
            >
              {sortOptions.map((s) => (
                <option key={s.id} value={s.id}>{locale === "pt" ? s.labelPt : s.labelEn}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
            >
              <Link to={`/packages/${pkg.id}`}>
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <SmartImage
                    src={pkg.image}
                    alt={locale === "pt" ? pkg.event : pkg.eventEn}
                    category="event"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 text-sm">
                    {pkg.badge}
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4">
                    <h3 className="font-display text-xl font-bold text-foreground">{locale === "pt" ? pkg.event : pkg.eventEn}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pkg.location}, {locale === "pt" ? pkg.country : pkg.countryEn} — {locale === "pt" ? pkg.date : pkg.dateEn}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {t("events.includes")}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-card-foreground">
                      <Plane className="h-4 w-4 text-primary shrink-0" />
                      <span>{pkg.flight.airline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-card-foreground">
                      <Hotel className="h-4 w-4 text-primary shrink-0" />
                      <span>{pkg.accommodation.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-card-foreground">
                      <Ticket className="h-4 w-4 text-primary shrink-0" />
                      <span>{pkg.tickets.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-card-foreground">
                      <Car className="h-4 w-4 text-primary shrink-0" />
                      <span>{t("events.transfer")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(locale === "pt" ? pkg.includes : pkg.includesEn).slice(0, 4).map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-sm text-muted-foreground line-through">R$ {pkg.originalPrice.toLocaleString("pt-BR")}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">R$ {pkg.price.toLocaleString("pt-BR")}</span>
                      <span className="text-sm text-muted-foreground">{t("events.perPerson")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!user) {
                          toast({ title: locale === "pt" ? "Faça login para favoritar" : "Sign in to favorite", variant: "destructive" });
                          return;
                        }
                        toggleFav.mutate(pkg.id);
                      }}
                      aria-pressed={favorites.includes(pkg.id)}
                      aria-label={
                        favorites.includes(pkg.id)
                          ? (locale === "pt" ? "Remover dos favoritos" : "Remove from favorites")
                          : (locale === "pt" ? "Adicionar aos favoritos" : "Add to favorites")
                      }
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                      <Heart aria-hidden="true" className={`h-5 w-5 ${favorites.includes(pkg.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    </button>
                    <Link to={`/packages/${pkg.id}`}>
                      <Button className="gap-2">
                        {t("events.viewPackage")} <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{locale === "pt" ? "Nenhum pacote encontrado para esta categoria." : "No packages found for this category."}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventPackages;
