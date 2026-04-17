import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import SmartImage from "@/components/SmartImage";

interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  slug: string;
}

const DestinationCard = ({ name, country, image, price, rating, slug }: DestinationCardProps) => {
  const { t } = useI18n();

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/destination/${slug}`}
        className="block group rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-shadow"
      >
        <div className="aspect-[4/3] overflow-hidden">
          <SmartImage src={image} alt={name} category="destination" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-bold text-card-foreground">{name}</h3>
            <div className="flex items-center gap-1 text-accent">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{country}</p>
          <p className="text-lg font-bold text-primary">
            {t("index.fromPrice")} R$ {price.toLocaleString("pt-BR")}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;
