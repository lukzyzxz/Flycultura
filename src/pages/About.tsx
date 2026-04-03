import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";
import { Plane, Globe, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const { locale } = useI18n();
  const isPt = locale === "pt";

  const values = [
    { icon: Globe, title: isPt ? "Alcance Global" : "Global Reach", desc: isPt ? "Conectamos viajantes a mais de 190 destinos em todo o mundo." : "We connect travelers to 190+ destinations worldwide." },
    { icon: Users, title: isPt ? "Foco no Cliente" : "Customer First", desc: isPt ? "Suporte 24/7 em português e inglês para cada etapa da viagem." : "24/7 support in Portuguese and English for every step of your trip." },
    { icon: Shield, title: isPt ? "Segurança Total" : "Total Security", desc: isPt ? "Pagamentos protegidos e garantia de melhor preço." : "Protected payments and best price guarantee." },
    { icon: Plane, title: isPt ? "Melhores Preços" : "Best Prices", desc: isPt ? "Negociamos diretamente com companhias aéreas e hotéis." : "We negotiate directly with airlines and hotels." },
  ];

  return (
    <div className="min-h-screen">
      <div className="hero-gradient py-16 text-center">
        <div className="container">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            {isPt ? "Sobre a FlyCultura" : "About FlyCultura"}
          </h1>
          <p className="text-primary-foreground/70 max-w-lg mx-auto">
            {isPt ? "Sua porta de entrada para explorar o mundo com as melhores ofertas." : "Your gateway to exploring the world with the best deals."}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            {isPt ? "Nossa Missão" : "Our Mission"}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isPt
              ? "A FlyCultura nasceu para democratizar o acesso a experiências de viagem incríveis. Combinamos tecnologia de ponta com curadoria humana para oferecer pacotes completos para os maiores eventos esportivos, culturais e musicais do mundo — tudo com a melhor relação custo-benefício."
              : "FlyCultura was born to democratize access to incredible travel experiences. We combine cutting-edge technology with human curation to offer complete packages for the world's biggest sports, cultural and music events — all with the best value for money."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 card-shadow text-center"
            >
              <v.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-semibold text-card-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            {isPt ? "Números que Falam" : "Numbers That Speak"}
          </h2>
          <div className="grid grid-cols-3 gap-8 mt-8">
            {[
              { num: "50K+", label: isPt ? "Viajantes atendidos" : "Travelers served" },
              { num: "190+", label: isPt ? "Destinos" : "Destinations" },
              { num: "98%", label: isPt ? "Satisfação" : "Satisfaction" },
            ].map((s) => (
              <div key={s.num}>
                <p className="text-3xl font-bold text-primary">{s.num}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
