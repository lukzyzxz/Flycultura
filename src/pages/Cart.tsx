import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

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
                className="flex gap-4 rounded-xl bg-card card-shadow p-4"
              >
                <div className="shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-28 h-20 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-card-foreground truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.product.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 border border-border rounded-lg">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-muted rounded-l-lg transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-muted rounded-r-lg transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-primary">
                    R$ {(item.product.price * item.quantity).toLocaleString("pt-BR")}
                  </span>
                  {item.quantity > 1 && (
                    <p className="text-xs text-muted-foreground">
                      R$ {item.product.price.toLocaleString("pt-BR")} {t("events.perPerson")}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
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
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-foreground">{t("cart.total")}</span>
                <span className="font-bold text-primary text-xl">R$ {totalPrice.toLocaleString("pt-BR")}</span>
              </div>
              {!user ? (
                <div className="space-y-2">
                  <Button onClick={() => navigate("/auth")} className="w-full" size="lg">
                    {t("cart.loginToBook")}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">{t("cart.loginRequired")}</p>
                </div>
              ) : (
                <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
                  {t("cart.checkout")}
                </Button>
              )}
              <button
                type="button"
                onClick={clearCart}
                className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center"
              >
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
