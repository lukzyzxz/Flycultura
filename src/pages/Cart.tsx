import { useCart, CartProduct } from "@/contexts/CartContext";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Clock, ShieldCheck, Tag, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { eventPackages } from "@/lib/events-data";
import { useState } from "react";
import SmartImage from "@/components/SmartImage";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate total savings
  const totalOriginal = items.reduce((sum, item) => {
    const pkg = eventPackages.find((p) => p.id === item.product.id);
    const origPrice = pkg ? pkg.originalPrice : item.product.price * 1.3;
    return sum + origPrice * item.quantity;
  }, 0);
  const totalSavings = totalOriginal - totalPrice;

  // Upsell suggestions: packages not in cart
  const cartIds = new Set(items.map((i) => i.product.id));
  const upsell = eventPackages.filter((p) => !cartIds.has(p.id)).slice(0, 3);

  const { addItem } = useCart();
  const handleAddUpsell = (pkg: typeof eventPackages[0]) => {
    const product: CartProduct = {
      id: pkg.id,
      type: "event",
      name: locale === "pt" ? pkg.event : pkg.eventEn,
      image: pkg.image,
      price: pkg.price,
      description: `${pkg.location} — ${locale === "pt" ? pkg.date : pkg.dateEn}`,
    };
    addItem(product);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container py-20 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">{t("cart.empty")}</h1>
          <p className="text-muted-foreground mb-6">{t("cart.emptySubtitle")}</p>
          <Link to="/packages">
            <Button className="gap-2">{t("cart.browsePackages")} <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">{t("cart.title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 rounded-xl bg-card card-shadow p-4 hover:card-shadow-hover transition-shadow"
              >
                <div className="shrink-0 w-28 h-20">
                  <SmartImage src={item.product.image} alt={item.product.name} category={item.product.type === "event" ? "event" : "deal"} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-card-foreground truncate">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.product.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 border border-border rounded-lg">
                      <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-muted rounded-l-lg transition-colors active:scale-95">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-muted rounded-r-lg transition-colors active:scale-95">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.product.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-primary">R$ {(item.product.price * item.quantity).toLocaleString("pt-BR")}</span>
                  {item.quantity > 1 && (
                    <p className="text-xs text-muted-foreground">R$ {item.product.price.toLocaleString("pt-BR")} {t("events.perPerson")}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Guide Upsell */}
            {items.some((i) => i.product.type === "event") && !items.some((i) => i.product.type === "guide") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 mt-4"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-foreground mb-1">
                      {locale === "pt" ? "Adicionar Guia Profissional?" : "Add a Professional Guide?"}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {locale === "pt"
                        ? "Um guia local que fala seu idioma para tours e experiências personalizadas. Inclui dicas de transporte e restaurantes."
                        : "A local guide who speaks your language for personalized tours. Includes transport tips and restaurant recommendations."}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-primary">R$ 350<span className="text-xs font-normal text-muted-foreground">/{locale === "pt" ? "dia" : "day"}</span></span>
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                          addItem({
                            id: "professional-guide",
                            type: "guide",
                            name: locale === "pt" ? "Guia Profissional Local" : "Professional Local Guide",
                            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
                            price: 350,
                            description: locale === "pt" ? "Guia especializado — R$ 350/dia" : "Expert guide — R$ 350/day",
                          });
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {locale === "pt" ? "Adicionar" : "Add"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Upsell */}
            {upsell.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-accent" />
                  {locale === "pt" ? "Você também pode gostar" : "You might also like"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {upsell.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-muted/50 p-3 flex gap-3 items-center"
                    >
                      <div className="w-16 h-12 shrink-0"><SmartImage src={pkg.image} alt={locale === "pt" ? pkg.event : pkg.eventEn} category="event" className="w-full h-full rounded-md object-cover" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-1">{locale === "pt" ? pkg.event : pkg.eventEn}</p>
                        <p className="text-xs text-primary font-bold">R$ {pkg.price.toLocaleString("pt-BR")}</p>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs" onClick={() => handleAddUpsell(pkg)}>+</Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-card card-shadow p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-card-foreground">{t("cart.summary")}</h2>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-muted-foreground">
                    <span className="truncate mr-2">{item.product.name} x{item.quantity}</span>
                    <span>R$ {(item.product.price * item.quantity).toLocaleString("pt-BR")}</span>
                  </div>
                ))}
              </div>

              {/* Savings badge */}
              {totalSavings > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-600 shrink-0" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {locale === "pt" ? "Você economiza" : "You save"} R$ {totalSavings.toLocaleString("pt-BR")}
                  </span>
                </div>
              )}

              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-foreground">{t("cart.total")}</span>
                <span className="font-bold text-primary text-xl">R$ {totalPrice.toLocaleString("pt-BR")}</span>
              </div>

              {/* Urgency */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-orange-500" />
                <span>{locale === "pt" ? "Preços podem mudar — garanta agora!" : "Prices may change — book now!"}</span>
              </div>

              {!user ? (
                <div className="space-y-2">
                  <Button onClick={() => navigate("/auth?redirect=/cart")} className="w-full" size="lg">{t("cart.loginToBook")}</Button>
                  <p className="text-xs text-muted-foreground text-center">{t("cart.loginRequired")}</p>
                </div>
              ) : (
                <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>{t("cart.checkout")}</Button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{locale === "pt" ? "Pagamento seguro e protegido" : "Secure & protected payment"}</span>
              </div>

              <button type="button" onClick={clearCart} className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center">
                {t("cart.clearCart")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
