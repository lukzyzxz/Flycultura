import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Link } from "react-router-dom";
import SmartImage, { SmartImageCategory } from "@/components/SmartImage";

const RecentlyViewed = () => {
  const { locale } = useI18n();
  const { items } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 mb-6"
        >
          <Clock className="h-4 w-4 text-accent" />
          <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
            {locale === "pt" ? "Vistos Recentemente" : "Recently Viewed"}
          </h3>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.slice(0, 8).map((item, i) => {
            const href = item.type === "destination"
              ? `/destination/${item.slug}`
              : item.type === "event"
                ? `/packages/${item.id}`
                : "/deals";

            return (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="shrink-0"
              >
                <Link to={href} className="group block w-40">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  {item.price && (
                    <p className="text-xs text-primary font-semibold">
                      R$ {item.price.toLocaleString("pt-BR")}
                    </p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
