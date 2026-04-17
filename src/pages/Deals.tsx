import Footer from "@/components/Footer";
import { deals } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useCart, CartProduct } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import SmartImage from "@/components/SmartImage";

const Deals = () => {
  const { t, locale } = useI18n();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (deal: typeof deals[0]) => {
    const product: CartProduct = {
      id: `deal-${deal.id}`,
      type: "deal",
      name: locale === "pt" ? deal.title : deal.titleEn,
      image: deal.image,
      price: deal.price,
      description: locale === "pt" ? deal.description : deal.descriptionEn,
    };
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-12 md:py-16 text-center">
        <div className="container">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground/80 uppercase tracking-wide">{t("deals.limitedTime")}</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            {t("deals.title")}
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto">{t("deals.subtitle")}</p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <SmartImage src={deal.image} alt={locale === "pt" ? deal.title : deal.titleEn} category="deal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">{locale === "pt" ? deal.badge : deal.badgeEn}</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-card-foreground mb-1">{locale === "pt" ? deal.title : deal.titleEn}</h3>
                <p className="text-sm text-muted-foreground mb-3">{locale === "pt" ? deal.description : deal.descriptionEn}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-primary">R$ {deal.price.toLocaleString("pt-BR")}</span>
                  <span className="text-sm text-muted-foreground line-through">R$ {deal.originalPrice.toLocaleString("pt-BR")}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {Math.round((1 - deal.price / deal.originalPrice) * 100)}% {t("deals.off")}
                  </Badge>
                </div>
                <Button className="w-full gap-2" onClick={() => handleAddToCart(deal)}>
                  <ShoppingCart className="h-4 w-4" />
                  {t("deals.addToCart")}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Deals;
