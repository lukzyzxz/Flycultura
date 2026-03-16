import Footer from "@/components/Footer";
import { deals } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Deals = () => {
  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-12 md:py-16 text-center">
        <div className="container">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-primary-foreground/80 uppercase tracking-wide">Limited Time</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            Exclusive Deals
          </h1>
          <p className="text-primary-foreground/70 max-w-md mx-auto">
            Save big on flights, hotels, cruises and vacation packages
          </p>
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
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0">{deal.badge}</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-card-foreground mb-1">{deal.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{deal.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-primary">${deal.price}</span>
                  <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {Math.round((1 - deal.price / deal.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
                <Button className="w-full gap-2">
                  View Deal <ExternalLink className="h-4 w-4" />
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
