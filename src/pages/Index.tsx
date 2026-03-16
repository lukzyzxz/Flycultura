import HeroSearch from "@/components/HeroSearch";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";
import { destinations, deals } from "@/lib/data";
import { eventPackages } from "@/lib/events-data";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

const Index = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      <HeroSearch />

      {/* Popular Destinations */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t("index.popularTitle")}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("index.popularSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d, i) => (
              <motion.div
                key={d.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <DestinationCard {...d} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Packages Preview */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-accent uppercase tracking-wide">{t("events.allInclusive")}</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {t("events.featured")}
              </h2>
            </div>
            <Link to="/packages">
              <Button variant="outline" className="gap-2">
                {t("index.viewAll")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventPackages.slice(0, 3).map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={pkg.image} alt={pkg.event} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">{pkg.badge}</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-card-foreground mb-1">{pkg.event}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{pkg.location} — {pkg.date}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">${pkg.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${pkg.originalPrice}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% {t("deals.off")}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-accent uppercase tracking-wide">{t("index.specialOffers")}</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {t("index.hotDeals")}
              </h2>
            </div>
            <Link to="/deals">
              <Button variant="outline" className="gap-2">
                {t("index.viewAll")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.slice(0, 3).map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">{deal.badge}</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-card-foreground mb-1">{deal.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{deal.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">${deal.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {Math.round((1 - deal.price / deal.originalPrice) * 100)}% {t("deals.off")}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hero-gradient rounded-2xl p-10 md:p-16 text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {t("index.ctaTitle")}
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-6">
              {t("index.ctaSubtitle")}
            </p>
            <Button size="lg" variant="secondary" className="font-semibold">
              {t("index.ctaBtn")}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
