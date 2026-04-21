import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle, ArrowLeft, ShieldCheck, AlertCircle, QrCode, Barcode, Copy, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PaymentMethod = "card" | "pix" | "boleto";
type CardBrand = "visa" | "mastercard" | "amex" | "elo" | "hipercard" | "diners" | "discover" | "aura" | "unknown";

// Detect card brand from number
const detectBrand = (num: string): CardBrand => {
  const n = num.replace(/\D/g, "");
  // Brazilian-issued brands first (more specific BIN ranges)
  if (/^(4011|4312|4389|4514|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(n)) return "elo";
  if (/^(606282|3841)/.test(n)) return "hipercard";
  if (/^50/.test(n)) return "aura";
  if (/^3(0[0-5]|095|6|8|9)/.test(n)) return "diners";
  if (/^(6011|65|64[4-9]|622)/.test(n)) return "discover";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^4/.test(n)) return "visa";
  return "unknown";
};

// Luhn algorithm for card validation
const luhnCheck = (num: string): boolean => {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const validateExpiry = (exp: string): boolean => {
  const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1]);
  const year = 2000 + parseInt(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp2 = new Date(year, month, 0, 23, 59, 59);
  return exp2 >= now;
};

const BrandLogo = ({ brand, active }: { brand: CardBrand; active?: boolean }) => {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    visa: { bg: "bg-[#1A1F71]", text: "text-white", label: "VISA" },
    mastercard: { bg: "bg-gradient-to-r from-[#EB001B] to-[#F79E1B]", text: "text-white", label: "MC" },
    amex: { bg: "bg-[#006FCF]", text: "text-white", label: "AMEX" },
    elo: { bg: "bg-foreground", text: "text-background", label: "ELO" },
    hipercard: { bg: "bg-[#B3131B]", text: "text-white", label: "HIPER" },
    diners: { bg: "bg-[#0079BE]", text: "text-white", label: "DINERS" },
    discover: { bg: "bg-[#FF6000]", text: "text-white", label: "DISC" },
    aura: { bg: "bg-[#1F3A93]", text: "text-white", label: "AURA" },
    unknown: { bg: "bg-muted", text: "text-muted-foreground", label: "····" },
  };
  const s = styles[brand];
  return (
    <div
      className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${s.bg} ${s.text} transition-opacity ${
        active === false ? "opacity-30" : "opacity-100"
      }`}
    >
      {s.label}
    </div>
  );
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [installments, setInstallments] = useState(1);
  const [processingStep, setProcessingStep] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cpf: "",
  });

  // CPF validation using the official Brazilian algorithm
  const validateCPF = (cpf: string): boolean => {
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(digits[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(digits[10])) return false;
    return true;
  };

  const isCpfValid = useMemo(() => validateCPF(form.cpf), [form.cpf]);
  const cardBrand = useMemo(() => detectBrand(form.cardNumber), [form.cardNumber]);
  const isCardValid = useMemo(() => luhnCheck(form.cardNumber), [form.cardNumber]);
  const isExpiryValid = useMemo(() => validateExpiry(form.expiry), [form.expiry]);
  // Installment options (interest-free up to 6x, then 1.99% per installment)
  const installmentOptions = useMemo(() => {
    const opts: { n: number; value: number; total: number; interestFree: boolean }[] = [];
    for (let n = 1; n <= 12; n++) {
      const interestFree = n <= 6;
      const total = interestFree ? totalPrice : totalPrice * (1 + 0.0199 * (n - 1));
      opts.push({ n, value: total / n, total, interestFree });
    }
    return opts;
  }, [totalPrice]);

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (items.length === 0 && step !== "success") {
    navigate("/cart");
    return null;
  }

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const formatCPF = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    if (digits.length > 6) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    if (digits.length > 3) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    return digits;
  };

  // Normalize name for comparison (remove accents, lowercase, trim)
  const normalizeName = (name: string) =>
    name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");

  // Validate CPF and name match
  const cpfDigits = form.cpf.replace(/\D/g, "");
  const isCpfComplete = cpfDigits.length === 11;
  
  // Simple name validation: name must have at least 2 words (first + last name)
  const nameWords = normalizeName(form.cardName).split(" ").filter(w => w.length > 0);
  const isNameValid = nameWords.length >= 2 && form.cardName.trim().length >= 5;

  const cpfError = isCpfComplete && !isCpfValid ? t("checkout.invalidCpf") : "";
  const nameError = isCpfComplete && isCpfValid && form.cardName.length >= 3 && !isNameValid
    ? t("checkout.cpfNameMismatch") : "";
  const cardError = form.cardNumber.replace(/\s/g, "").length >= 13 && !isCardValid
    ? t("checkout.invalidCard") : "";
  const expiryError = form.expiry.length === 5 && !isExpiryValid
    ? t("checkout.invalidExpiry") : "";

  const isCardFormValid =
    isNameValid &&
    isCardValid &&
    isExpiryValid &&
    form.cvv.length >= 3 &&
    isCpfValid;

  const isValid =
    (method === "card" ? isCardFormValid : isCpfValid) && acceptedTerms;

  const finalTotal =
    method === "card"
      ? installmentOptions.find((o) => o.n === installments)?.total ?? totalPrice
      : method === "pix"
      ? totalPrice * 0.95 // 5% PIX discount
      : totalPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setStep("processing");
    setProcessingStep(0);

    // Simulate real processing steps
    const advance = (s: number, delay: number) =>
      new Promise<void>((res) => setTimeout(() => { setProcessingStep(s); res(); }, delay));

    await advance(1, 800);
    await advance(2, 900);
    await advance(3, 800);

    // Generate transaction ID
    const txId = `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setTransactionId(txId);

    // Save order to database
    try {
      await supabase.from("user_orders").insert({
        user_id: user.id,
        total_price: finalTotal,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          type: i.product.type,
        })),
        status: "completed",
      });
    } catch {
      // Continue even if save fails
    }

    await new Promise((res) => setTimeout(res, 400));
    clearCart();
    setStep("success");
    toast({
      title: t("checkout.successTitle"),
      description: t("checkout.successDesc"),
    });
  };

  if (step === "success") {
    return (
      <div className="min-h-screen">
        <div className="container py-20 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mx-auto mb-6"
            >
              <CheckCircle className="h-12 w-12 text-primary" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              {t("checkout.successTitle")}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t("checkout.successDesc")}
            </p>
            {transactionId && (
              <div className="inline-block rounded-lg bg-muted px-4 py-2 mb-8 font-mono text-xs text-muted-foreground">
                {t("checkout.transactionId")}: <span className="text-foreground">{transactionId}</span>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Link to="/profile">
                <Button variant="outline">{t("checkout.viewOrders")}</Button>
              </Link>
              <Link to="/packages">
                <Button>{t("cart.browsePackages")}</Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (step === "processing") {
    const steps = [
      t("checkout.processingStep1"),
      t("checkout.processingStep2"),
      t("checkout.processingStep3"),
    ];
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl bg-card card-shadow p-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <h2 className="font-display text-lg font-bold text-foreground">{t("checkout.processing")}</h2>
          </div>
          <ul className="space-y-3">
            {steps.map((label, i) => {
              const done = processingStep > i;
              const active = processingStep === i;
              return (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                      done ? "bg-primary text-primary-foreground" : active ? "bg-primary/20" : "bg-muted"
                    }`}
                  >
                    {done ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : active ? (
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{i + 1}</span>
                    )}
                  </div>
                  <span className={done || active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            <Lock className="inline h-3 w-3 mr-1" />
            {t("checkout.doNotClose")}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container py-10">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> {t("checkout.backToCart")}
        </Link>

        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          {t("checkout.title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-card card-shadow p-6 space-y-6"
            >
              <div>
                <h2 className="font-display text-lg font-bold text-card-foreground mb-3">
                  {t("checkout.method")}
                </h2>
                <Tabs value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="card" className="gap-2">
                      <CreditCard className="h-4 w-4" /> <span className="hidden sm:inline">{t("checkout.creditCard")}</span>
                      <span className="sm:hidden">Card</span>
                    </TabsTrigger>
                    <TabsTrigger value="pix" className="gap-2">
                      <QrCode className="h-4 w-4" /> {t("checkout.pix")}
                    </TabsTrigger>
                    <TabsTrigger value="boleto" className="gap-2">
                      <Barcode className="h-4 w-4" /> {t("checkout.boleto")}
                    </TabsTrigger>
                  </TabsList>

                  {/* CARD */}
                  <TabsContent value="card" className="space-y-5 mt-6">
                    {/* Visual card preview */}
                    <div className="relative h-44 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/70 p-5 text-primary-foreground overflow-hidden shadow-lg">
                      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                      <div className="absolute -left-4 -bottom-10 h-28 w-28 rounded-full bg-white/5" />
                      <div className="relative flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                          <div className="h-8 w-11 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-90" />
                          <div className="text-xs uppercase tracking-widest opacity-80">{cardBrand !== "unknown" ? cardBrand : "Card"}</div>
                        </div>
                        <div className="font-mono text-lg tracking-widest">
                          {form.cardNumber || "•••• •••• •••• ••••"}
                        </div>
                        <div className="flex justify-between items-end text-xs">
                          <div>
                            <div className="opacity-70 text-[10px] uppercase">{t("checkout.cardName")}</div>
                            <div className="uppercase tracking-wider">{form.cardName || "YOUR NAME"}</div>
                          </div>
                          <div>
                            <div className="opacity-70 text-[10px] uppercase">{t("checkout.expiry")}</div>
                            <div className="font-mono">{form.expiry || "MM/AA"}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">{t("checkout.cardNumber")}</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={form.cardNumber}
                          onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })}
                          maxLength={19}
                          inputMode="numeric"
                          aria-invalid={!!cardError}
                          className={`pr-16 ${cardError ? "border-destructive" : ""}`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <BrandLogo brand={cardBrand} />
                        </div>
                      </div>
                      {cardError && (
                        <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                          <AlertCircle className="h-3 w-3" /> {cardError}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cardName">{t("checkout.cardName")}</Label>
                      <Input
                        id="cardName"
                        placeholder="João Silva"
                        value={form.cardName}
                        onChange={(e) => setForm({ ...form, cardName: e.target.value.toUpperCase() })}
                        aria-invalid={!!nameError}
                        className={nameError ? "border-destructive" : ""}
                      />
                      {nameError && (
                        <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                          <AlertCircle className="h-3 w-3" /> {nameError}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiry">{t("checkout.expiry")}</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          value={form.expiry}
                          onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                          maxLength={5}
                          inputMode="numeric"
                          aria-invalid={!!expiryError}
                          className={expiryError ? "border-destructive" : ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={form.cvv}
                          onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          maxLength={4}
                          inputMode="numeric"
                          type="password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          value={form.cpf}
                          onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                          maxLength={14}
                          inputMode="numeric"
                          aria-invalid={!!cpfError}
                          className={cpfError ? "border-destructive" : ""}
                        />
                      </div>
                    </div>
                    {(expiryError || cpfError) && (
                      <div className="space-y-1">
                        {expiryError && (
                          <p className="flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" /> {expiryError}
                          </p>
                        )}
                        {cpfError && (
                          <p className="flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" /> {cpfError}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <Label>{t("checkout.installments")}</Label>
                      <Select value={String(installments)} onValueChange={(v) => setInstallments(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {installmentOptions.map((o) => (
                            <SelectItem key={o.n} value={String(o.n)}>
                              {o.n}x de R$ {o.value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              {" "}
                              <span className="text-muted-foreground text-xs">
                                ({o.interestFree ? t("checkout.installmentsInterestFree") : t("checkout.installmentsWithInterest")})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  {/* PIX */}
                  <TabsContent value="pix" className="mt-6 space-y-4">
                    <div className="rounded-xl border border-border p-6 text-center space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">
                        <QrCode className="h-3 w-3" /> 5% OFF no PIX
                      </div>
                      <h3 className="font-display text-lg font-bold text-card-foreground">{t("checkout.pixTitle")}</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">{t("checkout.pixDesc")}</p>
                      {/* Simulated QR code */}
                      <div className="mx-auto h-44 w-44 rounded-lg bg-foreground p-3">
                        <div
                          className="h-full w-full bg-background"
                          style={{
                            backgroundImage:
                              "repeating-conic-gradient(hsl(var(--foreground)) 0% 25%, hsl(var(--background)) 0% 50%)",
                            backgroundSize: "12px 12px",
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`00020126580014BR.GOV.BCB.PIX0136${transactionId || "flycultura-pix"}5204000053039865802BR6009SAO PAULO62070503***6304`);
                          toast({ title: t("checkout.pixCopied") });
                        }}
                      >
                        <Copy className="h-4 w-4" /> {t("checkout.pixCopy")}
                      </Button>
                      <p className="text-xs text-muted-foreground">{t("checkout.pixExpires")}</p>
                    </div>
                    <div>
                      <Label htmlFor="cpf-pix">CPF</Label>
                      <Input
                        id="cpf-pix"
                        placeholder="000.000.000-00"
                        value={form.cpf}
                        onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                        maxLength={14}
                        inputMode="numeric"
                        aria-invalid={!!cpfError}
                        className={cpfError ? "border-destructive" : ""}
                      />
                      {cpfError && (
                        <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                          <AlertCircle className="h-3 w-3" /> {cpfError}
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  {/* BOLETO */}
                  <TabsContent value="boleto" className="mt-6 space-y-4">
                    <div className="rounded-xl border border-border p-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <Barcode className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-display text-lg font-bold text-card-foreground">{t("checkout.boletoTitle")}</h3>
                          <p className="text-sm text-muted-foreground">{t("checkout.boletoDesc")}</p>
                        </div>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground bg-muted rounded p-3 break-all">
                        34191.79001 01043.510047 91020.150008 1 98760000{Math.floor(totalPrice * 100).toString().padStart(8, "0")}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cpf-boleto">CPF</Label>
                      <Input
                        id="cpf-boleto"
                        placeholder="000.000.000-00"
                        value={form.cpf}
                        onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                        maxLength={14}
                        inputMode="numeric"
                        aria-invalid={!!cpfError}
                        className={cpfError ? "border-destructive" : ""}
                      />
                      {cpfError && (
                        <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                          <AlertCircle className="h-3 w-3" /> {cpfError}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Lock className="h-4 w-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground leading-tight">{t("checkout.encryption")}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground leading-tight">{t("checkout.pciCompliant")}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground leading-tight">{t("checkout.moneyBack")}</span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={!isValid}>
                <Lock className="h-4 w-4" />
                {method === "boleto"
                  ? t("checkout.boletoGenerate")
                  : `${t("checkout.confirm")} • R$ ${finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="text-[10px] text-muted-foreground">{t("checkout.acceptedCards")}:</span>
                <BrandLogo brand="visa" />
                <BrandLogo brand="mastercard" />
                <BrandLogo brand="elo" />
                <BrandLogo brand="hipercard" />
                <BrandLogo brand="amex" />
                <BrandLogo brand="diners" />
                <BrandLogo brand="discover" />
                <BrandLogo brand="aura" />
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {t("checkout.prototype")}
              </p>
            </motion.form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-card card-shadow p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-card-foreground">{t("cart.summary")}</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary shrink-0">
                      R$ {(item.product.price * item.quantity).toLocaleString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">R$ {totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {method === "pix" && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Desconto PIX (5%)</span>
                    <span>− R$ {(totalPrice * 0.05).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                {method === "card" && installments > 6 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Juros ({installments}x)</span>
                    <span>+ R$ {(finalTotal - totalPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-bold text-foreground">{t("cart.total")}</span>
                  <div className="text-right">
                    <div className="font-bold text-primary text-xl leading-tight">
                      R$ {finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    {method === "card" && installments > 1 && (
                      <div className="text-[11px] text-muted-foreground">
                        em {installments}x de R$ {(finalTotal / installments).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
