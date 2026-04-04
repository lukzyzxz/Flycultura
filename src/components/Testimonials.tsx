import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const testimonials = [
  {
    name: "Mariana Silva",
    location: "São Paulo, BR",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Reservei meu pacote para a Copa do Mundo com a FlyCultura e foi incrível! Tudo organizado, voo confortável e hotel perfeito.",
    textEn: "I booked my World Cup package with FlyCultura and it was amazing! Everything organized, comfortable flight and perfect hotel.",
    trip: "Copa do Mundo 2026",
    tripEn: "World Cup 2026",
  },
  {
    name: "Carlos Mendes",
    location: "Lisboa, PT",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "A experiência do F1 em Mônaco foi inesquecível. O suporte da equipe durante toda a viagem fez toda a diferença.",
    textEn: "The F1 experience in Monaco was unforgettable. The team's support throughout the trip made all the difference.",
    trip: "F1 GP de Mônaco",
    tripEn: "F1 Monaco GP",
  },
  {
    name: "Ana Costa",
    location: "Rio de Janeiro, BR",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Viajei para Bali com minha família e foi a melhor viagem que já fizemos. Preço justo e atendimento excelente!",
    textEn: "I traveled to Bali with my family and it was the best trip we've ever taken. Fair price and excellent service!",
    trip: "Bali, Indonésia",
    tripEn: "Bali, Indonesia",
  },
  {
    name: "Pedro Almeida",
    location: "Porto, PT",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    text: "Encontrei ofertas incríveis para Cancún. O processo de reserva foi super simples e rápido. Recomendo!",
    textEn: "I found amazing deals for Cancún. The booking process was super simple and fast. Highly recommend!",
    trip: "Cancún, México",
    tripEn: "Cancún, Mexico",
  },
];

const Testimonials = () => {
  const { locale } = useI18n();

  return (
    <section className="py-14 md:py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Quote className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              {locale === "pt" ? "Depoimentos" : "Testimonials"}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {locale === "pt" ? "O Que Nossos Viajantes Dizem" : "What Our Travelers Say"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {locale === "pt"
              ? "Milhares de clientes satisfeitos em todo o mundo"
              : "Thousands of satisfied customers worldwide"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-display font-bold text-card-foreground text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`h-3.5 w-3.5 ${si < t.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-card-foreground/80 mb-3 leading-relaxed">
                "{locale === "pt" ? t.text : t.textEn}"
              </p>
              <span className="text-xs font-medium text-primary">
                ✈️ {locale === "pt" ? t.trip : t.tripEn}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
