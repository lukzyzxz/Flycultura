import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Hotel, Package, Ship, Search, Calendar, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import TripPlannerModal from "@/components/TripPlannerModal";

const HeroSearch = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [plannerOpen, setPlannerOpen] = useState(false);
  const navigate = useNavigate();
  const { t, locale } = useI18n();

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
    navigate(`/results?type=${activeTab}&from=${from}&to=${to}`);
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
            <div className="flex justify-center gap-1 mb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-card text-foreground"
                        : "bg-primary-foreground/10 text-primary-foreground/70 hover:text-primary-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-card rounded-xl p-4 md:p-6 card-shadow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SearchAutocomplete value={from} onChange={setFrom} placeholder={t("hero.from")} />
                <SearchAutocomplete value={to} onChange={setTo} placeholder={t("hero.to")} />
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-9" />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t("hero.passengers")} defaultValue={t("hero.1adult")} className="pl-9" />
                </div>
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2 mt-3">
                {quickFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setTo(f)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {f}
                  </button>
                ))}
              </div>

              <Button onClick={handleSearch} className="w-full mt-4 h-12 text-base font-semibold gap-2">
                <Search className="h-5 w-5" />
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
