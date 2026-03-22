import { useParams, Link } from "react-router-dom";
import { eventPackages } from "@/lib/events-data";
import { useCart } from "@/contexts/CartContext";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Plane, Hotel, Ticket, Car, ArrowLeft, ShoppingCart, Check, MapPin, Calendar, Star,
} from "lucide-react";

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { addItem } = useCart();
  const { toast } = useToast();

  const pkg = eventPackages.find((p) => p.id === id);

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{t("dest.notFound")}</h1>
        <Link to="/packages">
          <Button variant="outline">{t("dest.back")}</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(pkg);
    toast({ title: t("cart.added"), description: pkg.event });
  };

  const discount = Math.round((1 - pkg.price / pkg.originalPrice) * 100);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={pkg.image} alt={pkg.event} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container">
            <Link to="/packages" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-4">
              <ArrowLeft className="h-4 w-4" /> {t("dest.back")}
            </Link>
            <Badge className="bg-accent text-accent-foreground border-0 mb-3">{pkg.badge}</Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">{pkg.event}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {pkg.location}, {pkg.country}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {pkg.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">{t("dest.about")}</h2>
              <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">{t("events.includes")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Plane, label: `${pkg.flight.airline} — ${pkg.flight.from}` },
                  { icon: Hotel, label: `${pkg.accommodation.type} — ${pkg.accommodation.name}` },
                  { icon: Ticket, label: `${pkg.tickets.type} — ${pkg.tickets.section}` },
                  { icon: Car, label: `${t("events.transfer")} — ${pkg.accommodation.distance}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-card-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">{t("package.whatsIncluded")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pkg.includes.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-card-foreground">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">{t("package.highlights")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pkg.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm text-card-foreground">
                    <Star className="h-4 w-4 text-accent shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Pricing & CTA */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24 rounded-xl bg-card card-shadow p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">{discount}% {t("deals.off")}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground line-through">
                  R$ {pkg.originalPrice.toLocaleString("pt-BR")}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    R$ {pkg.price.toLocaleString("pt-BR")}
                  </span>
                  <span className="text-sm text-muted-foreground">{t("events.perPerson")}</span>
                </div>
              </div>
              <Button onClick={handleAddToCart} className="w-full gap-2" size="lg">
                <ShoppingCart className="h-5 w-5" />
                {t("cart.addToCart")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">{t("package.noCommitment")}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PackageDetail;
