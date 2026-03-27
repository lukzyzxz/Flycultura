import { useState } from "react";
import { useCart, CartProduct } from "@/contexts/CartContext";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MapPin, Calendar, Sparkles, User, ShoppingCart, Loader2, Check, Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GUIDE_PRICE_PER_DAY = 350;

const TravelGuide = () => {
  const { t, locale } = useI18n();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async () => {
    if (!destination) return;
    setLoading(true);
    setItinerary("");

    try {
      const prompt = locale === "pt"
        ? `Crie um roteiro de viagem detalhado para ${destination} com ${days} dias. Interesses: ${interests || "cultura, gastronomia, pontos turísticos"}. Inclua: manhã, tarde e noite de cada dia, restaurantes recomendados, dicas de transporte e estimativa de custos em Reais (R$). Formato em Markdown.`
        : `Create a detailed travel itinerary for ${destination} with ${days} days. Interests: ${interests || "culture, food, tourist spots"}. Include: morning, afternoon and evening for each day, recommended restaurants, transport tips and cost estimates in BRL (R$). Format in Markdown.`;

      const { data, error } = await supabase.functions.invoke("generate-itinerary", {
        body: { prompt, destination, days, interests },
      });

      if (error) throw error;
      setItinerary(data?.itinerary || (locale === "pt" ? "Não foi possível gerar o roteiro. Tente novamente." : "Could not generate itinerary. Please try again."));
    } catch {
      setItinerary(generateFallbackItinerary(destination, days, locale));
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuideToCart = () => {
    const product: CartProduct = {
      id: `guide-${destination}-${days}d-${Date.now()}`,
      type: "guide",
      name: locale === "pt" ? `Guia Profissional — ${destination}` : `Professional Guide — ${destination}`,
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
      price: GUIDE_PRICE_PER_DAY * days,
      description: `${days} ${locale === "pt" ? "dias" : "days"} — ${destination}`,
      meta: { destination, days: String(days) },
    };
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="hero-gradient py-12 md:py-16 text-center">
        <div className="container">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground/80 uppercase tracking-wide">{t("guide.title")}</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            {t("guide.title")}
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto">{t("guide.subtitle")}</p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Human Guide */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card card-shadow p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-card-foreground">{t("guide.humanTitle")}</h2>
                <p className="text-sm text-muted-foreground">{t("guide.humanDesc")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label>{t("guide.destination")}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={locale === "pt" ? "Ex: Paris, Tokyo, Rio..." : "E.g: Paris, Tokyo, Rio..."}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label>{t("guide.days")}</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Math.min(30, Number(e.target.value))))}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">{t("guide.humanPrice")}</span>
                <span className="text-2xl font-bold text-primary">
                  R$ {(GUIDE_PRICE_PER_DAY * days).toLocaleString("pt-BR")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{t("guide.included")}</p>
              <Button onClick={handleAddGuideToCart} className="w-full gap-2" disabled={!destination}>
                <ShoppingCart className="h-4 w-4" />
                {t("guide.addGuideToCart")}
              </Button>
            </div>
          </motion.div>

          {/* AI Planner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl bg-card card-shadow p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-card-foreground">{t("guide.aiTitle")}</h2>
                <p className="text-sm text-muted-foreground">{t("guide.aiDesc")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label>{t("guide.destination")}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={locale === "pt" ? "Ex: Paris, Tokyo, Rio..." : "E.g: Paris, Tokyo, Rio..."}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label>{t("guide.days")}</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Math.min(30, Number(e.target.value))))}
                />
              </div>
              <div>
                <Label>{t("guide.interests")}</Label>
                <Textarea
                  placeholder={locale === "pt" ? "Gastronomia, museus, aventura, vida noturna..." : "Food, museums, adventure, nightlife..."}
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <Button onClick={handleGeneratePlan} className="w-full gap-2" disabled={!destination || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? t("guide.generating") : t("guide.generatePlan")}
            </Button>

            <Badge variant="secondary" className="text-xs">
              {locale === "pt" ? "Gratuito — Gerado por IA" : "Free — AI Generated"}
            </Badge>
          </motion.div>
        </div>

        {/* Itinerary Result */}
        {itinerary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-xl bg-card card-shadow p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Check className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold text-card-foreground">
                {locale === "pt" ? `Roteiro para ${destination}` : `Itinerary for ${destination}`}
              </h2>
            </div>
            <div className="prose prose-sm max-w-none text-card-foreground whitespace-pre-wrap">
              {itinerary}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

function generateFallbackItinerary(destination: string, days: number, locale: string): string {
  const dayLabels = Array.from({ length: days }, (_, i) => i + 1);
  if (locale === "pt") {
    return dayLabels.map(d => `## Dia ${d}\n\n🌅 **Manhã:** Explore os principais pontos turísticos de ${destination}. Visite monumentos, praças e mercados locais.\n\n☀️ **Tarde:** Almoço em restaurante local típico. Passeio por bairros históricos e compras de souvenirs.\n\n🌙 **Noite:** Jantar em restaurante recomendado. Passeio noturno pelos pontos iluminados da cidade.\n\n💰 **Estimativa:** R$ 350-500/dia (alimentação + transporte + ingressos)`).join("\n\n---\n\n");
  }
  return dayLabels.map(d => `## Day ${d}\n\n🌅 **Morning:** Explore the main tourist spots of ${destination}. Visit monuments, squares and local markets.\n\n☀️ **Afternoon:** Lunch at a typical local restaurant. Walk through historic neighborhoods and souvenir shopping.\n\n🌙 **Evening:** Dinner at a recommended restaurant. Night stroll through the city's illuminated landmarks.\n\n💰 **Estimate:** R$ 350-500/day (food + transport + tickets)`).join("\n\n---\n\n");
}

export default TravelGuide;
