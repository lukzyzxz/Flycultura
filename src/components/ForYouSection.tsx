import { motion } from "framer-motion";
import { Sparkles, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useCart, CartProduct } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { eventPackages, isEventUpcoming } from "@/lib/events-data";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import SmartImage from "@/components/SmartImage";

const ForYouSection = () => {
  const { locale } = useI18n();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const { items: recentItems } = useRecentlyViewed();

  const recommendations = useMemo(() => {
    if (recentItems.length === 0) return [];

    // Get categories/tags from recently viewed items
    const viewedIds = new Set(recentItems.map((r) => r.id));
    const upcoming = eventPackages.filter((p) => isEventUpcoming(p));
    const viewedPkgs = upcoming.filter((p) => viewedIds.has(p.id));
    const viewedCategories = new Set(viewedPkgs.map((p) => p.category));
    const viewedCountries = new Set(viewedPkgs.map((p) => p.country));

    // Recommend packages in same categories/countries but not already viewed
    let recs = upcoming.filter(
      (p) => !viewedIds.has(p.id) && (viewedCategories.has(p.category) || viewedCountries.has(p.country))
    );

    // If not enough, fill with popular ones
    if (recs.length < 4) {
      const recIds = new Set(recs.map((r) => r.id));
      const extras = upcoming.filter((p) => !viewedIds.has(p.id) && !recIds.has(p.id));
      recs = [...recs, ...extras].slice(0, 4);
    }

    return recs.slice(0, 4);
  }, [recentItems]);

  if (recommendations.length === 0 && !user) return null;
  if (recommendations.length === 0) return null;

  const handleAdd = (pkg: typeof eventPackages[0]) => {
    const product: CartProduct = {
      id: pkg.id,
      type: "event",
      name: locale === "pt" ? pkg.event : pkg.eventEn,
      image: pkg.image,
      price: pkg.price,
      description: `${pkg.location} — ${locale === "pt" ? pkg.date : pkg.dateEn}`,
    };
    addItem(product);
    toast({ title: locale === "pt" ? "Adicionado ao carrinho!" : "Added to cart!", description: product.name });
  };

  return (
    <section className="py-10 md:py-14 bg-muted/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {locale === "pt" ? "Personalizado" : "Personalized"}
            </span>
          </div>
          <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
            {locale === "pt" ? "Para Você" : "For You"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "pt"
              ? "Baseado no que você visualizou recentemente"
              : "Based on what you've recently viewed"}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1"
            >
              <Link to={`/packages/${pkg.id}`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <SmartImage
                    src={pkg.image}
                    alt={locale === "pt" ? pkg.event : pkg.eventEn}
                    category="event"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-2.5 left-2.5 bg-primary text-primary-foreground border-0 text-xs">
                    {locale === "pt" ? "Para Você" : "For You"}
                  </Badge>
                </div>
              </Link>
              <div className="p-3 sm:p-3.5">
                <Link to={`/packages/${pkg.id}`}>
                  <h4 className="font-display font-bold text-card-foreground text-sm mb-0.5 hover:text-primary transition-colors line-clamp-1">
                    {locale === "pt" ? pkg.event : pkg.eventEn}
                  </h4>
                </Link>
                <p className="text-xs text-muted-foreground mb-2">{pkg.location}</p>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0 mb-2.5">
                  <span className="text-base font-bold text-primary">R$ {pkg.price.toLocaleString("pt-BR")}</span>
                  <span className="text-xs text-muted-foreground line-through">R$ {pkg.originalPrice.toLocaleString("pt-BR")}</span>
                </div>
                <Button
                  size="sm"
                  className="w-full gap-1.5 text-[11px] sm:text-xs h-8 px-2 whitespace-normal leading-tight"
                  onClick={() => handleAdd(pkg)}
                >
                  <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {locale === "pt" ? "Adicionar" : "Add to Cart"}
                  </span>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForYouSection;
