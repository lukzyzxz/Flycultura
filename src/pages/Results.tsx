import { useSearchParams, Link } from "react-router-dom";
import { Star, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { destinations } from "@/lib/data";
import { motion } from "framer-motion";

const Results = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "flights";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  return (
    <div className="min-h-screen">
      <div className="bg-muted/50 py-8">
        <div className="container">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Search
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {type.charAt(0).toUpperCase() + type.slice(1)} Results
            {from && to && <span className="text-muted-foreground font-normal text-lg"> — {from} → {to}</span>}
          </h1>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d, i) => (
            <motion.div
              key={d.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-bold text-card-foreground">{d.name}</h3>
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-xs font-medium">{d.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{d.country}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">From ${d.price}</span>
                  <Button size="sm" className="gap-1">
                    View Deal <ExternalLink className="h-3 w-3" />
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

export default Results;
