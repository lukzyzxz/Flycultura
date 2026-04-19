import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Testimonial {
  name: string;
  location: string;
  avatar: string;
  text: string;
  textEn: string;
  trip: string;
  tripEn: string;
}

// All testimonials are 5-star only on the homepage
const allTestimonials: Testimonial[] = [
  {
    name: "Mariana Silva",
    location: "São Paulo, BR",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "Reservei meu pacote para a Copa do Mundo e foi incrível! Tudo organizado, voo confortável e hotel perfeito.",
    textEn: "I booked my World Cup package and it was amazing! Everything organized, comfortable flight and perfect hotel.",
    trip: "Copa do Mundo 2026",
    tripEn: "World Cup 2026",
  },
  {
    name: "Carlos Mendes",
    location: "Lisboa, PT",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "A experiência do F1 em Mônaco foi inesquecível. O suporte da equipe durante toda a viagem fez toda a diferença.",
    textEn: "The F1 experience in Monaco was unforgettable. The team's support throughout the trip made all the difference.",
    trip: "F1 GP de Mônaco",
    tripEn: "F1 Monaco GP",
  },
  {
    name: "Ana Costa",
    location: "Rio de Janeiro, BR",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "Viajei para Bali com minha família e foi a melhor viagem que já fizemos. Preço justo e atendimento excelente!",
    textEn: "I traveled to Bali with my family and it was the best trip we've ever taken. Fair price and excellent service!",
    trip: "Bali, Indonésia",
    tripEn: "Bali, Indonesia",
  },
  {
    name: "Pedro Almeida",
    location: "Porto, PT",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    text: "Encontrei ofertas incríveis para Cancún. O processo de reserva foi super simples e rápido. Recomendo!",
    textEn: "I found amazing deals for Cancún. The booking process was super simple and fast. Highly recommend!",
    trip: "Cancún, México",
    tripEn: "Cancún, Mexico",
  },
  {
    name: "Juliana Rocha",
    location: "Belo Horizonte, BR",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    text: "O Tomorrowland foi um sonho realizado! Pacote completo com tudo que precisava. Inesquecível!",
    textEn: "Tomorrowland was a dream come true! Complete package with everything I needed. Unforgettable!",
    trip: "Tomorrowland 2026",
    tripEn: "Tomorrowland 2026",
  },
  {
    name: "Rafael Costa",
    location: "Curitiba, BR",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    text: "Oktoberfest em Munique foi sensacional! Hotel próximo à festa e cervejarias incríveis.",
    textEn: "Oktoberfest in Munich was amazing! Hotel near the festival and incredible breweries.",
    trip: "Oktoberfest Munique",
    tripEn: "Munich Oktoberfest",
  },
  {
    name: "Camila Ferreira",
    location: "Florianópolis, BR",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    text: "O Festival de Cannes superou todas as expectativas. Glamour, cinema e uma viagem perfeita.",
    textEn: "Cannes Film Festival exceeded all expectations. Glamour, cinema and a perfect trip.",
    trip: "Cannes 2027",
    tripEn: "Cannes 2027",
  },
  {
    name: "Bruno Martins",
    location: "Brasília, BR",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face",
    text: "GP de Mônaco foi a realização de um sonho! Vista perfeita da pista e hospedagem impecável.",
    textEn: "Monaco GP was a dream come true! Perfect track view and impeccable accommodation.",
    trip: "F1 GP Mônaco",
    tripEn: "F1 Monaco GP",
  },
  {
    name: "Larissa Souza",
    location: "Salvador, BR",
    avatar: "https://images.unsplash.com/photo-1557555187-23d685287bc3?w=100&h=100&fit=crop&crop=face",
    text: "Carnaval do Rio com a FlyCultura foi mágico. Camarote na Sapucaí e tudo perfeito!",
    textEn: "Rio Carnival with FlyCultura was magical. Box at Sapucaí and everything perfect!",
    trip: "Carnaval Rio 2027",
    tripEn: "Rio Carnival 2027",
  },
  {
    name: "Diego Almeida",
    location: "Porto Alegre, BR",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
    text: "Viagem para os Jogos Olímpicos 2028 já reservada. O atendimento é nota 10!",
    textEn: "Trip to the 2028 Olympics already booked. The service is top notch!",
    trip: "Olimpíadas LA 2028",
    tripEn: "LA Olympics 2028",
  },
  {
    name: "Patricia Lima",
    location: "Recife, BR",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
    text: "Festival Holi na Índia foi uma experiência transformadora. Tudo organizado de forma impecável.",
    textEn: "Holi Festival in India was a transformative experience. Everything organized impeccably.",
    trip: "Holi Índia 2027",
    tripEn: "Holi India 2027",
  },
  {
    name: "Gabriel Rodrigues",
    location: "Fortaleza, BR",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face",
    text: "Dia de los Muertos no México foi único. Cultura riquíssima e pacote completo.",
    textEn: "Day of the Dead in Mexico was unique. Rich culture and complete package.",
    trip: "México 2026",
    tripEn: "Mexico 2026",
  },
];

const ROTATION_INTERVAL = 6000; // 6s
const VISIBLE_COUNT = 4;

const Testimonials = () => {
  const { locale } = useI18n();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(allTestimonials.length / VISIBLE_COUNT);

  useEffect(() => {
    const id = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, ROTATION_INTERVAL);
    return () => clearInterval(id);
  }, [totalPages]);

  const visible = allTestimonials.slice(
    page * VISIBLE_COUNT,
    page * VISIBLE_COUNT + VISIBLE_COUNT,
  );
  // If last page has fewer items, fill from the start
  const filled =
    visible.length < VISIBLE_COUNT
      ? [...visible, ...allTestimonials.slice(0, VISIBLE_COUNT - visible.length)]
      : visible;

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
          <AnimatePresence mode="wait">
            {filled.map((t, i) => (
              <motion.div
                key={`${page}-${t.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
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
                    <Star key={si} className="h-3.5 w-3.5 fill-accent text-accent" />
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
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`${locale === "pt" ? "Página" : "Page"} ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === page ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
