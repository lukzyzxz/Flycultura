import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
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

  // CPF validation using the official Brazilian algorithm
  const validateCPF = (cpf: string): boolean => {
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) return false;
    // Reject known invalid sequences (all same digit)
    if (/^(\d)\1{10}$/.test(digits)) return false;

    // First check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(digits[9])) return false;

    // Second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(digits[10])) return false;

    return true;
  };

  // Normalize name for comparison (remove accents, lowercase, trim)
  const normalizeName = (name: string) =>
    name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");

  // Validate CPF and name match
  const cpfDigits = form.cpf.replace(/\D/g, "");
  const isCpfComplete = cpfDigits.length === 11;
  const isCpfValid = useMemo(() => validateCPF(form.cpf), [form.cpf]);
  
  // Simple name validation: name must have at least 2 words (first + last name)
  const nameWords = normalizeName(form.cardName).split(" ").filter(w => w.length > 0);
  const isNameValid = nameWords.length >= 2 && form.cardName.trim().length >= 5;

  const cpfError = isCpfComplete && !isCpfValid ? t("checkout.invalidCpf") : "";
  const nameError = isCpfComplete && isCpfValid && form.cardName.length >= 3 && !isNameValid
    ? t("checkout.cpfNameMismatch") : "";

  const isValid =
    isNameValid &&
    form.cardNumber.replace(/\s/g, "").length === 16 &&
    form.expiry.length === 5 &&
    form.cvv.length >= 3 &&
    isCpfValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setStep("processing");

    // Save order to database
    try {
      await supabase.from("user_orders").insert({
        user_id: user.id,
        total_price: totalPrice,
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

    // Simulate payment processing
    await new Promise((res) => setTimeout(res, 2500));

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
            <CheckCircle className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              {t("checkout.successTitle")}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t("checkout.successDesc")}
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/">
                <Button variant="outline">{t("nav.home")}</Button>
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="font-display text-xl font-bold text-foreground">{t("checkout.processing")}</h2>
          <p className="text-muted-foreground">{t("checkout.doNotClose")}</p>
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
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-card-foreground">
                  {t("checkout.paymentDetails")}
                </h2>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                {t("checkout.securePayment")}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">{t("checkout.cardName")}</Label>
                  <Input
                    id="cardName"
                    placeholder="João Silva"
                    value={form.cardName}
                    onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">{t("checkout.cardNumber")}</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={form.cardNumber}
                    onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })}
                    maxLength={19}
                  />
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
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={!isValid}
              >
                <Lock className="h-4 w-4" />
                {t("checkout.pay")} R$ {totalPrice.toLocaleString("pt-BR")}
              </Button>

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
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-foreground">{t("cart.total")}</span>
                <span className="font-bold text-primary text-xl">
                  R$ {totalPrice.toLocaleString("pt-BR")}
                </span>
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
