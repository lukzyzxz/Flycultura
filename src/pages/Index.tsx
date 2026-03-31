import HeroSearch from "@/components/HeroSearch";
import DestinationCard from "@/components/DestinationCard";
import DiscoverySections from "@/components/DiscoverySections";
import RecentlyViewed from "@/components/RecentlyViewed";
import ForYouSection from "@/components/ForYouSection";
import Footer from "@/components/Footer";
import { destinations } from "@/lib/data";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen">
      <HeroSearch />

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* For You - personalized */}
      <ForYouSection />

      {/* Discovery Feed */}
      <DiscoverySections />

      {/* Popular Destinations */}
      <section className="py-14 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t("index.popularTitle")}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t("index.popularSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 6).map((d, i) => (
              <motion.div
                key={d.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <DestinationCard {...d} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hero-gradient rounded-2xl p-10 md:p-16 text-center"
          >
            <Sparkles className="h-8 w-8 text-primary-foreground/80 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {t("index.ctaTitle")}
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-6">
              {t("index.ctaSubtitle")}
            </p>
            <Link to="/packages">
              <Button size="lg" variant="secondary" className="font-semibold gap-2">
                {t("index.ctaBtn")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
