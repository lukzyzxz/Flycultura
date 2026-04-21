import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, MapPin, Calendar, DollarSign, Heart, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onClose: () => void;
}

const prefOptionsPt = [
  "Aventura", "Cultura", "Praia", "Gastronomia", "Luxo", "Econômico",
  "Família", "Romântico", "Natureza", "Vida Noturna", "Compras",
  "Esportes", "Arte & Museus", "Relaxamento", "Mochilão", "Fotografia",
];
const prefOptionsEn = [
  "Adventure", "Culture", "Beach", "Gastronomy", "Luxury", "Budget",
  "Family", "Romantic", "Nature", "Nightlife", "Shopping",
  "Sports", "Art & Museums", "Relaxation", "Backpacking", "Photography",
];

/** Strip markdown formatting for clean display */
const stripMarkdown = (text: string): string => {
  return text
    .replace(/^#{1,6}\s+/gm, "")       // Remove # headers
    .replace(/\*\*(.+?)\*\*/g, "$1")    // **bold** → bold
    .replace(/\*(.+?)\*/g, "$1")        // *italic* → italic
    .replace(/^[-*]\s+/gm, "• ")        // - item → • item
    .replace(/^>\s+/gm, "")             // > blockquote
    .replace(/`(.+?)`/g, "$1")          // `code`
    .replace(/\n{3,}/g, "\n\n");        // Multiple blank lines
};

const TripPlannerModal = ({ open, onClose }: Props) => {
  const { locale } = useI18n();
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [destError, setDestError] = useState("");

  const prefOptions = locale === "pt" ? prefOptionsPt : prefOptionsEn;

  const togglePref = (p: string) =>
    setPreferences((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !preferences.includes(trimmed)) {
      setPreferences((prev) => [...prev, trimmed]);
      setCustomInterest("");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    setDestError("");
    try {
      const { data, error } = await supabase.functions.invoke("generate-itinerary", {
        body: { destination, days: parseInt(dates) || 7, interests: preferences.join(", "), budget, locale },
      });

      if (error) throw error;

      // Backend rejected the destination as invalid — show inline error and go back to step 0
      if (data?.valid === false) {
        setDestError(data.message || (locale === "pt" ? "Destino inválido." : "Invalid destination."));
        setStep(0);
        return;
      }

      const raw = data?.itinerary || (locale === "pt" ? "Erro ao gerar plano." : "Error generating plan.");
      setResult(stripMarkdown(raw));
      setStep(3);
    } catch {
      setResult(locale === "pt" ? "Não foi possível gerar o plano. Tente novamente." : "Could not generate plan. Please try again.");
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setDestination("");
    setDates("");
    setBudget("");
    setPreferences([]);
    setCustomInterest("");
    setResult("");
    setDestError("");
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-card rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto card-shadow"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trip-planner-title"
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 id="trip-planner-title" className="font-display text-lg font-bold text-foreground">
                {locale === "pt" ? "Planejar Minha Viagem" : "Plan My Trip"}
              </h2>
            </div>
            <button
              onClick={() => { onClose(); reset(); }}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              aria-label={locale === "pt" ? "Fechar" : "Close"}
              type="button"
            >
              <X className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {step < 3 && (
              <div className="flex gap-2">
                {[0, 1, 2].map((s) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
            )}

            {/* Step 0: Destination */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {locale === "pt" ? "Para onde você quer ir?" : "Where do you want to go?"}
                  </label>
                  <Input
                    placeholder={locale === "pt" ? "Ex: Paris, Tokyo, Rio de Janeiro..." : "E.g.: Paris, Tokyo, Rio de Janeiro..."}
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      if (destError) setDestError("");
                    }}
                    aria-invalid={!!destError}
                    className={`text-base ${destError ? "border-destructive focus-visible:ring-destructive/40" : ""}`}
                  />
                  {destError && (
                    <p role="alert" className="mt-1.5 text-xs text-destructive flex items-start gap-1">
                      <span aria-hidden="true">⚠️</span>
                      <span>{destError}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {locale === "pt" ? "Quantos dias?" : "How many days?"}
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    placeholder={locale === "pt" ? "Ex: 7" : "E.g.: 7"}
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                  />
                </div>
                <Button className="w-full" disabled={!destination || !dates} onClick={() => setStep(1)}>
                  {locale === "pt" ? "Próximo" : "Next"}
                </Button>
              </motion.div>
            )}

            {/* Step 1: Budget */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    {locale === "pt" ? "Qual seu orçamento total? (R$)" : "What's your total budget? (R$)"}
                  </label>
                  <Input
                    type="number"
                    min={500}
                    placeholder={locale === "pt" ? "Ex: 5000" : "E.g.: 5000"}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                    {locale === "pt" ? "Voltar" : "Back"}
                  </Button>
                  <Button className="flex-1" disabled={!budget} onClick={() => setStep(2)}>
                    {locale === "pt" ? "Próximo" : "Next"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Preferences */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Heart className="h-4 w-4 inline mr-1" />
                    {locale === "pt" ? "O que você curte? (selecione ou digite)" : "What do you enjoy? (select or type)"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {prefOptions.map((p) => (
                      <button
                        key={p}
                        onClick={() => togglePref(p)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          preferences.includes(p)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    {/* Show custom interests as chips */}
                    {preferences
                      .filter((p) => !prefOptions.includes(p))
                      .map((p) => (
                        <button
                          key={p}
                          onClick={() => togglePref(p)}
                          className="px-3 py-1.5 rounded-full text-sm font-medium bg-accent text-accent-foreground transition-all"
                        >
                          {p} ✕
                        </button>
                      ))}
                  </div>
                  {/* Custom interest input */}
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder={locale === "pt" ? "Digite outro interesse..." : "Type another interest..."}
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomInterest())}
                      className="text-sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addCustomInterest}
                      disabled={!customInterest.trim()}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    {locale === "pt" ? "Voltar" : "Back"}
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    disabled={loading || preferences.length === 0}
                    onClick={handleGenerate}
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {locale === "pt" ? "Gerando..." : "Generating..."}</>
                    ) : (
                      <><Sparkles className="h-4 w-4" /> {locale === "pt" ? "Gerar Plano" : "Generate Plan"}</>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Result */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4 max-h-96 overflow-y-auto">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
                    {result}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={reset} className="flex-1">
                    {locale === "pt" ? "Novo Plano" : "New Plan"}
                  </Button>
                  <Button onClick={() => { onClose(); reset(); }} className="flex-1">
                    {locale === "pt" ? "Fechar" : "Close"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TripPlannerModal;
