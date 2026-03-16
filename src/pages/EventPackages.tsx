import Footer from "@/components/Footer";
import { eventPackages } from "@/lib/events-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Ticket, Car, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const EventPackages = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-12 md:py-16 text-center">
        <div className="container">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Ticket className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground/80 uppercase tracking-wide">
              {t("events.allInclusive")}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            {t("events.title")}
          </h1>
          <p className="text-primary-foreground/70 max-w-lg mx-auto">
            {t("events.subtitle")}
          </p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventPackages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.event}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 text-sm">
                  {pkg.badge}
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4">
                  <h3 className="font-display text-xl font-bold text-foreground">{pkg.event}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.location}, {pkg.country} — {pkg.date}</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* What's included */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    {t("events.includes")}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-card-foreground">
                      <Plane className="h-4 w-4 text-primary shrink-0" />
                      <span>{pkg.flight.airline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-card-foreground">
                      <Hotel className="h-4 w-4 text-primary shrink-0" />
                      <span>{pkg.accommodation.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-card-foreground">
                      <Ticket className="h-4 w-4 text-primary shrink-0" />
                      <span>{pkg.tickets.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-card-foreground">
                      <Car className="h-4 w-4 text-primary shrink-0" />
                      <span>{t("events.transfer")}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {pkg.includes.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-sm text-muted-foreground line-through">${pkg.originalPrice}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                      <span className="text-sm text-muted-foreground">{t("events.perPerson")}</span>
                    </div>
                  </div>
                  <Button className="gap-2">
                    {t("events.viewPackage")} <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventPackages;
