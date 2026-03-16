import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { destinationDetails, destinations } from "@/lib/data";
import { motion } from "framer-motion";

const Destination = () => {
  const { slug } = useParams();
  const detail = destinationDetails[slug || ""];
  const dest = destinations.find((d) => d.slug === slug);

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Destination not found</h1>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px]">
        <img src={detail.image} alt={detail.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container pb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground mb-4">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">{detail.name}</h1>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {detail.country}</span>
              {dest && (
                <>
                  <span className="flex items-center gap-1 text-accent"><Star className="h-4 w-4 fill-current" /> {dest.rating}</span>
                  <span className="text-lg font-bold text-primary">From ${dest.price}</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">About {detail.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{detail.description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">Top Experiences</h2>
              <div className="flex flex-wrap gap-2">
                {detail.experiences.map((exp) => (
                  <Badge key={exp} variant="secondary" className="text-sm py-1.5 px-3">{exp}</Badge>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-card rounded-xl p-6 card-shadow sticky top-24">
              <h3 className="font-display font-bold text-card-foreground mb-4">Plan Your Trip</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                <span>Best time: {detail.bestTime}</span>
              </div>
              {dest && (
                <p className="text-2xl font-bold text-primary mb-4">From ${dest.price} <span className="text-sm font-normal text-muted-foreground">/ person</span></p>
              )}
              <Button className="w-full mb-2">Book Now</Button>
              <Button variant="outline" className="w-full">Compare Deals</Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Destination;
