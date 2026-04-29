import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Hotel, Package, Ship, Search, Calendar, Sparkles, RotateCcw, History, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import TripPlannerModal from "@/components/TripPlannerModal";
import PassengerStepper from "@/components/PassengerStepper";
import { getHomeAirport, getAirportLabel } from "@/lib/userOrigin";
import { MAX_DATE, getMinDate, isValidFutureDate, dateInvalidReason, dateHelpText } from "@/lib/dateLimits";
import { saveLastSearch, getLastSearch, clearLastSearch, LastSearch } from "@/lib/searchHistory";

const HeroSearch = () => {
  const last = getLastSearch();
  const [activeTab, setActiveTab] = useState(last?.type || "flights");
  const defaultOrigin = () => getAirportLabel(getHomeAirport());
  const [from, setFrom] = useState<string>(last?.from || defaultOrigin());
  const [to, setTo] = useState(last?.to || "");
  const [date, setDate] = useState(last?.date || "");
  const [dateError, setDateError] = useState("");
  const [sameError, setSameError] = useState("");
  const [adults, setAdults] = useState(last?.adults || 1);
  const [activeFilter, setActiveFilter] = useState<string | null>(last?.filter || null);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [restoredBanner, setRestoredBanner] = useState<LastSearch | null>(last);
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const { toast } = useToast();

  const today = getMinDate();

  // Re-sync default origin when the user changes their home airport elsewhere.
  useEffect(() => {
    const onChange = () => setFrom(defaultOrigin());
    window.addEventListener("home-airport-changed", onChange);
    return () => window.removeEventListener("home-airport-changed", onChange);
  }, []);

  // Compare from/to (case + spacing insensitive)
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const isSameOriginDest = !!from && !!to && norm(from) === norm(to);

  // Live "same location" error
  useEffect(() => {
    if (isSameOriginDest) {
      setSameError(
        locale === "pt"
          ? "Origem e destino não podem ser iguais."
          : "Origin and destination can't be the same.",
      );
    } else {
      setSameError("");
    }
  }, [isSameOriginDest, locale]);

  const tabs = [
    { id: "flights", label: t("hero.flights"), icon: Plane },
    { id: "hotels", label: t("hero.hotels"), icon: Hotel },
    { id: "packages", label: t("hero.packages"), icon: Package },
    { id: "cruises", label: t("hero.cruises"), icon: Ship },
  ];

  const quickFilters = locale === "pt"
    ? ["Barato", "Luxo", "Aventura", "Família", "Praia", "Cultural"]
    : ["Budget", "Luxury", "Adventure", "Family", "Beach", "Cultural"];

  const handleSearch = () => {
    // Date is REQUIRED and must be a real, future calendar date (≤ 2050).
    if (!date || !isValidFutureDate(date)) {
      const reason = !date
        ? (locale === "pt"
            ? "Selecione uma data válida para buscar."
            : "Pick a valid date to search.")
        : dateInvalidReason(date, locale);
      setDateError(reason);
      toast({
        title: locale === "pt" ? "Data inválida" : "Invalid date",
        description: reason,
        variant: "destructive",
      });
      return;
    }
    if (isSameOriginDest) {
      toast({
        title: locale === "pt" ? "Origem e destino iguais" : "Same origin and destination",
        description: locale === "pt"
          ? "Escolha cidades diferentes para origem e destino."
          : "Pick different cities for origin and destination.",
        variant: "destructive",
      });
      return;
    }
    // Persist last search
    saveLastSearch({
      type: activeTab,
      from,
      to,
      date,
      adults,
      filter: activeFilter,
    });
    const filterParam = activeFilter ? `&filter=${activeFilter}` : "";
    const dateParam = date ? `&date=${date}` : "";
    navigate(
      `/results?type=${activeTab}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&adults=${adults}${dateParam}${filterParam}`,
    );
  };

  const handleFilterClick = (f: string) => {
    if (activeFilter === f) {
      setActiveFilter(null);
    } else {
      setActiveFilter(f);
    }
  };

  const dismissRestored = () => setRestoredBanner(null);
  const clearRestored = () => {
    clearLastSearch();
    setRestoredBanner(null);
    setFrom(defaultOrigin());
    setTo("");
    setDate("");
    setAdults(1);
    setActiveFilter(null);
  };

  return (
    <>
      <section className="relative overflow-hidden hero-gradient py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4 leading-tight">
              {locale === "pt" ? "Planeje Sua Viagem" : "Plan Your Trip"}<br />
              <span className="opacity-80">{locale === "pt" ? "De Forma Inteligente" : "The Smart Way"}</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-6">
              {locale === "pt"
                ? "Encontre voos, hotéis e pacotes ou deixe a IA criar o roteiro perfeito para você."
                : "Find flights, hotels and packages or let AI create the perfect itinerary for you."}
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold gap-2 text-base px-8 shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => setPlannerOpen(true)}
              >
                <Sparkles className="h-5 w-5" />
                {locale === "pt" ? "Planejar Minha Viagem" : "Plan My Trip"}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div
              role="tablist"
              aria-label={locale === "pt" ? "Tipo de busca" : "Search type"}
              className="flex justify-center gap-1 mb-4"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls="search-tabpanel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                      selected
                        ? "bg-card text-foreground"
                        : "bg-primary-foreground/10 text-primary-foreground/70 hover:text-primary-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sr-only sm:hidden">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id="search-tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              className="bg-card rounded-xl p-4 md:p-6 card-shadow"
            >
              {restoredBanner && (
                <div className="mb-3 flex items-center gap-2 rounded-md bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-foreground">
                  <History className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span className="flex-1">
                    {locale === "pt"
                      ? "Restauramos sua última busca."
                      : "We restored your last search."}
                  </span>
                  <button
                    type="button"
                    onClick={clearRestored}
                    className="text-muted-foreground hover:text-destructive font-medium"
                  >
                    {locale === "pt" ? "Limpar" : "Clear"}
                  </button>
                  <button
                    type="button"
                    onClick={dismissRestored}
                    className="text-muted-foreground hover:text-foreground font-medium"
                  >
                    {locale === "pt" ? "Ok" : "Ok"}
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <SearchAutocomplete
                    value={from}
                    onChange={setFrom}
                    placeholder={t("hero.from")}
                    excludeValue={to}
                    excludeLabel={locale === "pt" ? "destino" : "destination"}
                  />
                </div>
                <div>
                  <SearchAutocomplete
                    value={to}
                    onChange={setTo}
                    placeholder={t("hero.to")}
                    excludeValue={from}
                    excludeLabel={locale === "pt" ? "origem" : "origin"}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                  <Input
                    type="date"
                    aria-label={locale === "pt" ? "Data de partida" : "Departure date"}
                    aria-invalid={!!dateError}
                    aria-describedby="hero-date-help"
                    className={`pl-9 ${dateError ? "border-destructive focus-visible:ring-destructive/40" : ""}`}
                    value={date}
                    min={today}
                    max={MAX_DATE}
                    onChange={(e) => {
                      const v = e.target.value;
                      setDate(v);
                      setDateError(dateInvalidReason(v, locale));
                    }}
                  />
                </div>
                <PassengerStepper value={adults} onChange={setAdults} />
              </div>
              {/* Always-visible date hint + dynamic error */}
              <p id="hero-date-help" className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Info className="h-3 w-3" aria-hidden="true" />
                {dateHelpText(locale)}
              </p>
              {dateError && (
                <p role="alert" className="mt-1 text-xs text-destructive flex items-start gap-1">
                  <span aria-hidden="true">⚠️</span>
                  <span>{dateError}</span>
                </p>
              )}
              {sameError && (
                <p role="alert" className="mt-1 text-xs text-destructive flex items-start gap-1">
                  <span aria-hidden="true">⚠️</span>
                  <span>{sameError}</span>
                </p>
              )}

              {/* Restore default origin */}
              {from !== defaultOrigin() && (
                <button
                  type="button"
                  onClick={() => setFrom(defaultOrigin())}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  {locale === "pt" ? "Restaurar origem padrão" : "Restore default origin"}
                </button>
              )}

              {/* Quick filters — toggle style, don't set destination */}
              <div
                role="group"
                aria-label={locale === "pt" ? "Filtros rápidos" : "Quick filters"}
                className="flex flex-wrap gap-2 mt-3"
              >
                {quickFilters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleFilterClick(f)}
                    aria-pressed={activeFilter === f}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeFilter === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleSearch}
                disabled={!!dateError || !!sameError}
                className="w-full mt-4 h-12 text-base font-semibold gap-2"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                {t("hero.searchBtn")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <TripPlannerModal open={plannerOpen} onClose={() => setPlannerOpen(false)} />
    </>
  );
};

export default HeroSearch;
