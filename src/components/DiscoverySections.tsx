import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Clock, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useCart, CartProduct } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { eventPackages, isEventUpcoming } from "@/lib/events-data";
import { deals } from "@/lib/data";
import { Link, useNavigate } from "react-router-dom";
import SmartImage from "@/components/SmartImage";

const DiscoverySections = () => {
  const { t, locale } = useI18n();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const upcomingPkgs = eventPackages.filter((p) => isEventUpcoming(p));

  // "Em alta" — most popular (highest discount)
  const trending = [...upcomingPkgs]
    .sort((a, b) => (1 - b.price / b.originalPrice) - (1 - a.price / a.originalPrice))
    .slice(0, 4);

  // "Baratos agora" — cheapest packages
  const cheapNow = [...upcomingPkgs]
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);

  // "Última chance" — deals with biggest discounts
  const lastChance = [...deals]
    .sort((a, b) => (1 - b.price / b.originalPrice) - (1 - a.price / a.originalPrice))
    .slice(0, 4);

  const handleAddPackage = (pkg: typeof eventPackages[0]) => {
    if (!user) {
      navigate(`/auth?redirect=/packages/${pkg.id}`);
      return;
    }
    const product: CartProduct = {
      id: pkg.id,
      type: "event",
      name: locale === "pt" ? pkg.event : pkg.eventEn,
      image: pkg.image,
      price: pkg.price,
      description: `${pkg.location} — ${locale === "pt" ? pkg.date : pkg.dateEn}`,
    };
    addItem(product);
    toast({ title: t("cart.added"), description: product.name });
  };

  const handleAddDeal = (deal: typeof deals[0]) => {
    if (!user) {
      navigate("/auth?redirect=/deals");
      return;
    }
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

  const SectionHeader = ({ icon: Icon, label, title, linkTo }: { icon: React.ElementType; label: string; title: string; linkTo: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-between mb-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">{label}</span>
        </div>
        <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">{title}</h3>
      </div>
      <Link to={linkTo}>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          {t("index.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </motion.div>
  );

  const PackageCard = ({ pkg, i }: { pkg: typeof eventPackages[0]; i: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1"
    >
      <Link to={`/packages/${pkg.id}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <SmartImage src={pkg.image} alt={locale === "pt" ? pkg.event : pkg.eventEn} category="event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <Badge className="absolute top-2.5 left-2.5 bg-accent text-accent-foreground border-0 text-xs">{pkg.badge}</Badge>
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
          onClick={() => handleAddPackage(pkg)}
        >
          <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t("cart.addToCart")}</span>
        </Button>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Trending */}
      <section className="py-10 md:py-14">
        <div className="container">
          <SectionHeader
            icon={TrendingUp}
            label={locale === "pt" ? "Em Alta" : "Trending"}
            title={locale === "pt" ? "Mais Procurados" : "Most Popular"}
            linkTo="/packages"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trending.map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} i={i} />)}
          </div>
        </div>
      </section>

      {/* Cheap Now */}
      <section className="py-10 md:py-14 bg-muted/30">
        <div className="container">
          <SectionHeader
            icon={DollarSign}
            label={locale === "pt" ? "Economia" : "Budget"}
            title={locale === "pt" ? "Baratos Agora" : "Best Prices Now"}
            linkTo="/packages"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cheapNow.map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} i={i} />)}
          </div>
        </div>
      </section>

      {/* Last Chance */}
      <section className="py-10 md:py-14">
        <div className="container">
          <SectionHeader
            icon={Clock}
            label={locale === "pt" ? "Corra!" : "Hurry!"}
            title={locale === "pt" ? "Última Chance" : "Last Chance"}
            linkTo="/deals"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {lastChance.map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <SmartImage src={deal.image} alt={locale === "pt" ? deal.title : deal.titleEn} category="deal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <Badge className="absolute top-2.5 left-2.5 bg-accent text-accent-foreground border-0 text-xs">
                    {Math.round((1 - deal.price / deal.originalPrice) * 100)}% {t("deals.off")}
                  </Badge>
                </div>
                <div className="p-3.5">
                  <h4 className="font-display font-bold text-card-foreground text-sm mb-0.5 line-clamp-1">
                    {locale === "pt" ? deal.title : deal.titleEn}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{locale === "pt" ? deal.description : deal.descriptionEn}</p>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-base font-bold text-primary">R$ {deal.price.toLocaleString("pt-BR")}</span>
                    <span className="text-xs text-muted-foreground line-through">R$ {deal.originalPrice.toLocaleString("pt-BR")}</span>
                  </div>
                  <Button size="sm" className="w-full gap-1.5 text-xs h-8" onClick={() => handleAddDeal(deal)}>
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {t("cart.addToCart")}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DiscoverySections;
