import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, MapPin, Calendar, DollarSign, Heart, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { MAX_DATE, getMinDate, isValidFutureDate, dateErrorMessage, sanitizeNumber, isNumberInRange } from "@/lib/dateLimits";

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
  const [startDate, setStartDate] = useState("");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [destError, setDestError] = useState("");
  const [daysError, setDaysError] = useState("");
  const [dateError, setDateError] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLInputElement>(null);

  const today = getMinDate();
  const MIN_BUDGET = 500;
  const MAX_BUDGET = 1_000_000;
  const MAX_DAYS = 30;

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
        body: { destination, days: parseInt(dates) || 7, startDate, interests: preferences.join(", "), budget, locale },
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
    setStartDate("");
    setBudget("");
    setPreferences([]);
    setCustomInterest("");
    setResult("");
    setDestError("");
    setDaysError("");
    setDateError("");
    setBudgetError("");
  };

  // Close on Escape and focus first input on open
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        reset();
      }
    };
    window.addEventListener("keydown", handleKey);
    // Focus first interactive element shortly after open
    const timer = setTimeout(() => firstFocusableRef.current?.focus(), 50);
    return () => {
      window.removeEventListener("keydown", handleKey);
      clearTimeout(timer);
    };
  }, [open, onClose]);

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
                    ref={firstFocusableRef}
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
                    {locale === "pt" ? "Quantos dias? (máx. 30)" : "How many days? (max 30)"}
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    placeholder={locale === "pt" ? "Ex: 7" : "E.g.: 7"}
                    value={dates}
                    onChange={(e) => {
                      const v = sanitizeNumber(e.target.value, 1, MAX_DAYS);
                      setDates(v);
                      if (v && !isNumberInRange(v, 1, MAX_DAYS)) {
                        setDaysError(locale === "pt" ? "Informe entre 1 e 30 dias." : "Enter between 1 and 30 days.");
                      } else {
                        setDaysError("");
                      }
                    }}
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-", ".", ","].includes(e.key)) e.preventDefault();
                    }}
                    aria-invalid={!!daysError}
                    className={daysError ? "border-destructive focus-visible:ring-destructive/40" : ""}
                  />
                  {daysError && (
                    <p role="alert" className="mt-1.5 text-xs text-destructive">{daysError}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {locale === "pt" ? "Data de início" : "Start date"}
                  </label>
                  <Input
                    type="date"
                    min={today}
                    max={MAX_DATE}
                    value={startDate}
                    onChange={(e) => {
                      const v = e.target.value;
                      setStartDate(v);
                      if (v && !isValidFutureDate(v)) {
                        setDateError(dateErrorMessage(locale));
                      } else {
                        setDateError("");
                      }
                    }}
                    aria-invalid={!!dateError}
                    className={dateError ? "border-destructive focus-visible:ring-destructive/40" : ""}
                  />
                  {dateError && (
                    <p role="alert" className="mt-1.5 text-xs text-destructive">{dateError}</p>
                  )}
                </div>
                <Button
                  className="w-full"
                  disabled={
                    !destination ||
                    !dates ||
                    !startDate ||
                    !!daysError ||
                    !!dateError ||
                    !isNumberInRange(dates, 1, MAX_DAYS) ||
                    !isValidFutureDate(startDate)
                  }
                  onClick={() => setStep(1)}
                >
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
                    {locale === "pt"
                      ? "Qual seu orçamento total? (R$ 500 a R$ 1.000.000)"
                      : "What's your total budget? (R$ 500 to R$ 1,000,000)"}
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={locale === "pt" ? "Ex: 5000" : "E.g.: 5000"}
                    value={budget}
                    onChange={(e) => {
                      const v = sanitizeNumber(e.target.value, MIN_BUDGET, MAX_BUDGET);
                      setBudget(v);
                      if (v && !isNumberInRange(v, MIN_BUDGET, MAX_BUDGET)) {
                        setBudgetError(
                          locale === "pt"
                            ? "Orçamento entre R$ 500 e R$ 1.000.000."
                            : "Budget between R$ 500 and R$ 1,000,000.",
                        );
                      } else {
                        setBudgetError("");
                      }
                    }}
                    aria-invalid={!!budgetError}
                    className={budgetError ? "border-destructive focus-visible:ring-destructive/40" : ""}
                  />
                  {budgetError && (
                    <p role="alert" className="mt-1.5 text-xs text-destructive">{budgetError}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                    {locale === "pt" ? "Voltar" : "Back"}
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={
                      !budget ||
                      !!budgetError ||
                      !isNumberInRange(budget, MIN_BUDGET, MAX_BUDGET)
                    }
                    onClick={() => setStep(2)}
                  >
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
