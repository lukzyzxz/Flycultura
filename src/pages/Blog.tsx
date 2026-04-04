import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";

const blogPosts = [
  {
    id: "melhores-destinos-2026",
    title: "10 Melhores Destinos para Visitar em 2026",
    titleEn: "10 Best Destinations to Visit in 2026",
    excerpt: "De praias paradisíacas a cidades históricas, descubra os destinos que estão em alta para o próximo ano.",
    excerptEn: "From paradise beaches to historic cities, discover the trending destinations for next year.",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=500&fit=crop",
    category: "Destinos",
    categoryEn: "Destinations",
    date: "2026-03-15",
    readTime: 8,
  },
  {
    id: "como-economizar-viagens",
    title: "Como Economizar nas Suas Viagens Internacionais",
    titleEn: "How to Save Money on International Travel",
    excerpt: "Dicas práticas para encontrar voos baratos, hospedagem acessível e aproveitar ao máximo seu orçamento.",
    excerptEn: "Practical tips to find cheap flights, affordable accommodation and make the most of your budget.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109db56?w=800&h=500&fit=crop",
    category: "Dicas",
    categoryEn: "Tips",
    date: "2026-03-10",
    readTime: 6,
  },
  {
    id: "copa-do-mundo-2026-guia",
    title: "Guia Completo: Copa do Mundo FIFA 2026",
    titleEn: "Complete Guide: FIFA World Cup 2026",
    excerpt: "Tudo o que você precisa saber sobre sedes, ingressos, hospedagem e como planejar sua viagem.",
    excerptEn: "Everything you need to know about venues, tickets, accommodation and how to plan your trip.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=500&fit=crop",
    category: "Eventos",
    categoryEn: "Events",
    date: "2026-03-05",
    readTime: 12,
  },
  {
    id: "roteiro-europa-15-dias",
    title: "Roteiro pela Europa em 15 Dias: O Guia Definitivo",
    titleEn: "15-Day Europe Itinerary: The Ultimate Guide",
    excerpt: "Paris, Roma, Barcelona e mais: um roteiro otimizado para aproveitar o melhor da Europa em duas semanas.",
    excerptEn: "Paris, Rome, Barcelona and more: an optimized itinerary to enjoy the best of Europe in two weeks.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=500&fit=crop",
    category: "Roteiros",
    categoryEn: "Itineraries",
    date: "2026-02-28",
    readTime: 15,
  },
  {
    id: "melhores-festivais-musica",
    title: "Os Maiores Festivais de Música do Mundo em 2026",
    titleEn: "The Biggest Music Festivals in the World in 2026",
    excerpt: "Coachella, Tomorrowland, Rock in Rio: descubra os festivais imperdíveis e como garantir seu ingresso.",
    excerptEn: "Coachella, Tomorrowland, Rock in Rio: discover the must-attend festivals and how to get your ticket.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop",
    category: "Eventos",
    categoryEn: "Events",
    date: "2026-02-20",
    readTime: 10,
  },
  {
    id: "viagem-segura-dicas",
    title: "Viagem Segura: 12 Dicas Essenciais",
    titleEn: "Safe Travel: 12 Essential Tips",
    excerpt: "Seguro viagem, documentos, vacinas e cuidados de segurança para viajar tranquilo pelo mundo.",
    excerptEn: "Travel insurance, documents, vaccines and safety measures for worry-free world travel.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop",
    category: "Dicas",
    categoryEn: "Tips",
    date: "2026-02-15",
    readTime: 7,
  },
];

const Blog = () => {
  const { locale } = useI18n();

  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            {locale === "pt" ? "Blog de Viagens" : "Travel Blog"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary-foreground/70 max-w-lg mx-auto"
          >
            {locale === "pt"
              ? "Dicas, roteiros e inspirações para sua próxima aventura"
              : "Tips, itineraries and inspiration for your next adventure"}
          </motion.p>
        </div>
      </section>

      <div className="container py-12">
        {/* Featured Post */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group mb-12"
        >
          <Link to={`/blog/${featured.id}`} className="block rounded-2xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-all">
            <div className="grid md:grid-cols-2">
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                <img
                  src={featured.image}
                  alt={locale === "pt" ? featured.title : featured.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <Badge className="w-fit mb-3 bg-accent/10 text-accent border-0">
                  <Tag className="h-3 w-3 mr-1" />
                  {locale === "pt" ? featured.category : featured.categoryEn}
                </Badge>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                  {locale === "pt" ? featured.title : featured.titleEn}
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {locale === "pt" ? featured.excerpt : featured.excerptEn}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(featured.date).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime} min
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.article>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/blog/${post.id}`}
                className="group block rounded-xl overflow-hidden bg-card card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={post.image}
                    alt={locale === "pt" ? post.title : post.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <Badge className="mb-2 bg-accent/10 text-accent border-0 text-xs">
                    {locale === "pt" ? post.category : post.categoryEn}
                  </Badge>
                  <h3 className="font-display font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {locale === "pt" ? post.title : post.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {locale === "pt" ? post.excerpt : post.excerptEn}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", { day: "numeric", month: "short" })}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      {locale === "pt" ? "Ler mais" : "Read more"} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
