import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Tag, MapPin, CheckCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import SmartImage from "@/components/SmartImage";

interface BlogArticle {
  id: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  image: string;
  category: string;
  categoryEn: string;
  date: string;
  readTime: number;
  content: string[];
  contentEn: string[];
  tips: string[];
  tipsEn: string[];
  relatedImages: string[];
}

const blogArticles: Record<string, BlogArticle> = {
  "melhores-destinos-2026": {
    id: "melhores-destinos-2026",
    title: "10 Melhores Destinos para Visitar em 2026",
    titleEn: "10 Best Destinations to Visit in 2026",
    excerpt: "De praias paradisíacas a cidades históricas.",
    excerptEn: "From paradise beaches to historic cities.",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=600&fit=crop",
    category: "Destinos",
    categoryEn: "Destinations",
    date: "2026-03-15",
    readTime: 8,
    content: [
      "O ano de 2026 promete ser extraordinário para viajantes de todo o mundo. Com a Copa do Mundo acontecendo nos Estados Unidos, México e Canadá, e diversos festivais culturais espalhados pelo globo, há opções para todos os gostos e orçamentos.",
      "**1. Tóquio, Japão** — A capital japonesa continua sendo um dos destinos mais fascinantes do planeta. A combinação perfeita entre tradição milenar e tecnologia de ponta faz de Tóquio uma experiência única. Não deixe de visitar o bairro de Shibuya, o templo Senso-ji em Asakusa e experimentar a culinária local nos izakayas.",
      "**2. Lisboa, Portugal** — A capital portuguesa vive um momento de efervescência cultural. Com preços acessíveis para brasileiros, gastronomia excepcional e uma vida noturna vibrante, Lisboa é perfeita para quem busca história, cultura e boa comida. O bairro de Alfama e os pastéis de Belém são imperdíveis.",
      "**3. Istambul, Turquia** — Onde Oriente e Ocidente se encontram. Istambul oferece uma experiência sensorial incomparável: o Grand Bazaar, a Mesquita Azul, Santa Sofia e o Bósforo criam uma atmosfera mágica. A culinária turca é uma das mais ricas do Mediterrâneo.",
      "**4. Cartagena, Colômbia** — A joia do Caribe colombiano encanta com suas ruas coloridas, arquitetura colonial e praias cristalinas. A Cidade Amuralhada é Patrimônio da UNESCO e oferece uma imersão na história latino-americana.",
      "**5. Seul, Coreia do Sul** — A capital da Hallyu Wave combina palácios ancestrais com a modernidade dos bairros de Gangnam e Hongdae. A gastronomia coreana, dos BBQs aos street foods, é uma experiência imperdível.",
      "**6. Marraquexe, Marrocos** — A cidade vermelha surpreende com seus souks vibrantes, jardins exuberantes e a icônica Praça Jemaa el-Fnaa. Hospede-se em um riad tradicional para uma experiência autêntica.",
      "**7. Sydney, Austrália** — A combinação de praias espetaculares, vida urbana sofisticada e natureza exuberante faz de Sydney um destino completo. Bondi Beach, a Opera House e as Blue Mountains são paradas obrigatórias.",
      "**8. Praga, República Tcheca** — A Cidade das Cem Torres oferece arquitetura deslumbrante, cerveja artesanal excepcional e uma atmosfera romântica incomparável. O Castelo de Praga e a Ponte Carlos são cenários de conto de fadas.",
      "**9. Buenos Aires, Argentina** — O tango, a carne, o vinho e a paixão argentina criam uma experiência única. San Telmo, La Boca, Palermo e Recoleta oferecem diferentes facetas dessa cidade vibrante.",
      "**10. Bali, Indonésia** — A Ilha dos Deuses continua sendo o refúgio perfeito para quem busca espiritualidade, praias paradisíacas e uma cultura rica. Ubud, Seminyak e as Ilhas Gili são destinos imperdíveis.",
    ],
    contentEn: [
      "2026 promises to be extraordinary for travelers worldwide. With the World Cup happening in the US, Mexico, and Canada, plus various cultural festivals across the globe, there are options for every taste and budget.",
      "**1. Tokyo, Japan** — Japan's capital remains one of the most fascinating destinations on the planet. The perfect blend of ancient tradition and cutting-edge technology makes Tokyo a unique experience. Don't miss the Shibuya district, Senso-ji temple in Asakusa, and local cuisine at izakayas.",
      "**2. Lisbon, Portugal** — The Portuguese capital is experiencing a cultural renaissance. With affordable prices, exceptional gastronomy, and vibrant nightlife, Lisbon is perfect for those seeking history, culture, and great food. The Alfama district and Belém pastéis are must-visits.",
      "**3. Istanbul, Turkey** — Where East meets West. Istanbul offers an incomparable sensory experience: the Grand Bazaar, Blue Mosque, Hagia Sophia, and the Bosphorus create a magical atmosphere.",
      "**4. Cartagena, Colombia** — The jewel of the Colombian Caribbean enchants with its colorful streets, colonial architecture, and crystal-clear beaches. The Walled City is a UNESCO Heritage site.",
      "**5. Seoul, South Korea** — The capital of the Hallyu Wave combines ancestral palaces with the modernity of Gangnam and Hongdae districts. Korean cuisine is an unmissable experience.",
      "**6. Marrakech, Morocco** — The red city surprises with its vibrant souks, lush gardens, and the iconic Jemaa el-Fnaa Square. Stay in a traditional riad for an authentic experience.",
      "**7. Sydney, Australia** — Spectacular beaches, sophisticated urban life, and lush nature make Sydney a complete destination. Bondi Beach, the Opera House, and Blue Mountains are must-stops.",
      "**8. Prague, Czech Republic** — The City of a Hundred Towers offers stunning architecture, exceptional craft beer, and an incomparable romantic atmosphere.",
      "**9. Buenos Aires, Argentina** — Tango, steak, wine, and Argentine passion create a unique experience. San Telmo, La Boca, Palermo, and Recoleta offer different facets of this vibrant city.",
      "**10. Bali, Indonesia** — The Island of the Gods remains the perfect refuge for those seeking spirituality, paradise beaches, and rich culture.",
    ],
    tips: ["Reserve voos com antecedência para melhores preços", "Considere viajar na baixa temporada", "Faça seguro viagem internacional", "Pesquise sobre vistos necessários"],
    tipsEn: ["Book flights in advance for better prices", "Consider traveling in the off-season", "Get international travel insurance", "Research visa requirements"],
    relatedImages: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop",
    ],
  },
  "como-economizar-viagens": {
    id: "como-economizar-viagens",
    title: "Como Economizar nas Suas Viagens Internacionais",
    titleEn: "How to Save Money on International Travel",
    excerpt: "Dicas práticas para viajar mais gastando menos.",
    excerptEn: "Practical tips to travel more for less.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109db56?w=1200&h=600&fit=crop",
    category: "Dicas",
    categoryEn: "Tips",
    date: "2026-03-10",
    readTime: 6,
    content: [
      "Viajar pelo mundo não precisa ser sinônimo de gastar fortunas. Com planejamento inteligente e algumas estratégias comprovadas, é possível conhecer destinos incríveis gastando muito menos do que você imagina.",
      "**Use alertas de preços** — Ferramentas como Google Flights e Skyscanner permitem criar alertas para rotas específicas. Quando o preço cair, você será notificado automaticamente. Flexibilidade nas datas pode economizar até 40% no valor da passagem.",
      "**Viaje na baixa temporada** — Os preços de passagens e hospedagem podem cair drasticamente fora dos períodos de pico. Na Europa, por exemplo, viajar entre outubro e março pode custar metade do preço do verão europeu, e você ainda aproveita atrações menos lotadas.",
      "**Hospedagem alternativa** — Airbnb, hostels e guesthouses oferecem opções muito mais acessíveis que hotéis tradicionais. Em muitos destinos, um apartamento no Airbnb pode custar 60% menos que um hotel equivalente, além de oferecer cozinha para preparar refeições.",
      "**Cartões de crédito com milhas** — Concentre seus gastos em cartões que acumulam milhas aéreas. Com disciplina, é possível acumular milhas suficientes para uma viagem internacional em 12 a 18 meses.",
      "**Coma como os locais** — Fuja dos restaurantes turísticos e busque onde os moradores locais comem. Street food e mercados locais oferecem refeições autênticas e deliciosas por uma fração do preço.",
      "**Transporte local inteligente** — Use transporte público, apps de carona e bicicletas compartilhadas. Em muitas cidades europeias, passes de transporte de vários dias oferecem economia significativa.",
      "**Planeje com antecedência** — Reservar voos e hospedagem com 2-3 meses de antecedência geralmente garante os melhores preços. Atrações populares também oferecem desconto para compras antecipadas online.",
    ],
    contentEn: [
      "Traveling the world doesn't have to mean spending fortunes. With smart planning and proven strategies, you can visit incredible destinations for much less than you'd think.",
      "**Use price alerts** — Tools like Google Flights and Skyscanner let you create alerts for specific routes. When prices drop, you'll be notified automatically. Date flexibility can save up to 40%.",
      "**Travel in the off-season** — Prices for flights and accommodation can drop dramatically outside peak periods. In Europe, traveling between October and March can cost half the summer price.",
      "**Alternative accommodation** — Airbnb, hostels, and guesthouses offer much more affordable options than traditional hotels. An Airbnb apartment can cost 60% less than an equivalent hotel.",
      "**Credit cards with miles** — Focus spending on cards that accumulate air miles. With discipline, you can accumulate enough miles for an international trip in 12-18 months.",
      "**Eat like locals** — Avoid tourist restaurants and find where locals eat. Street food and local markets offer authentic, delicious meals at a fraction of the price.",
      "**Smart local transport** — Use public transport, ride-sharing apps, and shared bicycles. Multi-day transport passes offer significant savings in many European cities.",
      "**Plan ahead** — Booking flights and accommodation 2-3 months in advance generally secures the best prices.",
    ],
    tips: ["Sempre compare preços em múltiplos sites", "Use VPN para buscar preços em diferentes moedas", "Considere voos com escala", "Viaje com bagagem de mão"],
    tipsEn: ["Always compare prices on multiple sites", "Use VPN to search prices in different currencies", "Consider layover flights", "Travel with carry-on luggage"],
    relatedImages: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
    ],
  },
  "copa-do-mundo-2026-guia": {
    id: "copa-do-mundo-2026-guia",
    title: "Guia Completo: Copa do Mundo FIFA 2026",
    titleEn: "Complete Guide: FIFA World Cup 2026",
    excerpt: "Tudo sobre sedes, ingressos e hospedagem.",
    excerptEn: "Everything about venues, tickets, and accommodation.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&h=600&fit=crop",
    category: "Eventos",
    categoryEn: "Events",
    date: "2026-03-05",
    readTime: 12,
    content: [
      "A Copa do Mundo FIFA 2026 será a maior edição da história, com 48 seleções competindo em 16 cidades espalhadas pelos Estados Unidos, México e Canadá. Este guia completo traz tudo o que você precisa saber para planejar sua viagem.",
      "**As Sedes** — A competição será realizada em 16 estádios icônicos. Nos EUA: MetLife Stadium (NY/NJ), Hard Rock Stadium (Miami), SoFi Stadium (LA), AT&T Stadium (Dallas), NRG Stadium (Houston), Mercedes-Benz Stadium (Atlanta), Levi's Stadium (San Francisco), Lincoln Financial Field (Philadelphia), Lumen Field (Seattle), Arrowhead Stadium (Kansas City), Gillette Stadium (Boston). No México: Estadio Azteca. No Canadá: BMO Field (Toronto) e BC Place (Vancouver).",
      "**Ingressos** — As vendas de ingressos serão realizadas exclusivamente pelo site oficial da FIFA. Os preços variam de US$50 (fase de grupos, categoria 4) a US$1.600+ (final, categoria 1). Recomendamos se cadastrar no portal da FIFA para receber notificações sobre janelas de venda.",
      "**Hospedagem** — Reserve com máxima antecedência! Durante a Copa, os preços de hospedagem podem triplicar nas cidades-sede. Considere Airbnb, hostels e cidades vizinhas com fácil acesso por transporte público.",
      "**Transporte** — Os EUA são um país continental, então planeje voos internos entre as cidades-sede. Companhias como Southwest, JetBlue e Spirit oferecem tarifas domésticas acessíveis. Nos centros urbanos, use metrô e Uber.",
      "**Visto** — Brasileiros precisam de visto para os EUA (B1/B2), que deve ser solicitado com antecedência. Para o México, brasileiros não precisam de visto para estadas de até 180 dias. Para o Canadá, é necessário eTA.",
      "**Dicas de segurança** — Mantenha sempre seus documentos em local seguro, faça cópias digitais do passaporte, contrate seguro viagem e fique atento a golpes comuns em grandes eventos.",
      "**Orçamento estimado** — Para uma experiência de 10 dias assistindo 2-3 jogos, considere um orçamento de R$15.000 a R$40.000 por pessoa, incluindo voos, hospedagem, ingressos e alimentação.",
    ],
    contentEn: [
      "The 2026 FIFA World Cup will be the largest edition in history, with 48 teams competing across 16 cities in the United States, Mexico, and Canada. This complete guide covers everything you need to plan your trip.",
      "**The Venues** — The competition will take place in 16 iconic stadiums across the US (MetLife, Hard Rock, SoFi, AT&T, NRG, Mercedes-Benz, Levi's, Lincoln Financial, Lumen, Arrowhead, Gillette), Mexico (Estadio Azteca), and Canada (BMO Field, BC Place).",
      "**Tickets** — Sales will be exclusively through the official FIFA website. Prices range from $50 (group stage, category 4) to $1,600+ (final, category 1). Register on the FIFA portal for sale notifications.",
      "**Accommodation** — Book as early as possible! During the Cup, accommodation prices can triple in host cities. Consider Airbnb, hostels, and neighboring cities with easy public transport access.",
      "**Transportation** — The US is a continental country, so plan domestic flights between host cities. Airlines like Southwest, JetBlue, and Spirit offer affordable domestic fares.",
      "**Visa** — Check visa requirements for your nationality. Brazilians need a B1/B2 visa for the US, no visa for Mexico (up to 180 days), and eTA for Canada.",
      "**Safety tips** — Keep documents secure, make digital copies of your passport, get travel insurance, and watch for common scams at large events.",
      "**Estimated budget** — For a 10-day experience watching 2-3 games, budget $3,000-$8,000 per person including flights, accommodation, tickets, and meals.",
    ],
    tips: ["Cadastre-se no portal FIFA para alertas de ingressos", "Reserve hospedagem com pelo menos 6 meses de antecedência", "Solicite o visto americano o quanto antes", "Considere pacotes completos para economizar"],
    tipsEn: ["Register on the FIFA portal for ticket alerts", "Book accommodation at least 6 months in advance", "Apply for US visa as early as possible", "Consider complete packages to save money"],
    relatedImages: [
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=600&h=400&fit=crop",
    ],
  },
  "roteiro-europa-15-dias": {
    id: "roteiro-europa-15-dias",
    title: "Roteiro pela Europa em 15 Dias: O Guia Definitivo",
    titleEn: "15-Day Europe Itinerary: The Ultimate Guide",
    excerpt: "Paris, Roma, Barcelona e mais em duas semanas.",
    excerptEn: "Paris, Rome, Barcelona and more in two weeks.",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&h=600&fit=crop",
    category: "Roteiros",
    categoryEn: "Itineraries",
    date: "2026-02-28",
    readTime: 15,
    content: [
      "Um roteiro de 15 dias pela Europa é o sonho de muitos viajantes. Com planejamento adequado, é possível conhecer as principais capitais europeias aproveitando ao máximo cada momento. Aqui está nosso roteiro otimizado.",
      "**Dias 1-3: Paris, França** — Comece pela Cidade Luz. No primeiro dia, visite a Torre Eiffel e o Trocadéro. No segundo, explore o Louvre e o Musée d'Orsay. No terceiro, passeie por Montmartre, Sacré-Cœur e finalize com um cruzeiro pelo Sena ao pôr do sol.",
      "**Dias 4-5: Amsterdam, Holanda** — Pegue o trem de alta velocidade Thalys (3h15). Visite o Rijksmuseum, a Casa de Anne Frank e faça um passeio de barco pelos canais. Explore o Jordaan e experimente stroopwafels frescos nos mercados.",
      "**Dia 6: Bruxelas, Bélgica** — Parada de um dia no caminho. Visite a Grand Place, experimente waffles e chocolates belgas, e conheça o Atomium.",
      "**Dias 7-9: Roma, Itália** — Voe de Bruxelas para Roma. Visite o Coliseu, o Fórum Romano e o Panteão. No segundo dia, explore o Vaticano — Capela Sistina e Basílica de São Pedro. No terceiro, passeie pela Fontana di Trevi, Piazza Navona e Trastevere.",
      "**Dias 10-11: Florença, Itália** — Trem de alta velocidade (1h30). Visite a Galleria degli Uffizi, o Duomo e a Ponte Vecchio. Faça uma degustação de vinhos toscanos e experimente a bistecca alla fiorentina.",
      "**Dias 12-14: Barcelona, Espanha** — Voo para Barcelona. Visite a Sagrada Família, o Parque Güell e Las Ramblas. Explore o Bairro Gótico, a praia de Barceloneta e experimente tapas autênticas no El Born.",
      "**Dia 15: Dia livre** — Use este dia para revisitar seu lugar favorito, fazer compras ou simplesmente relaxar antes do voo de volta.",
    ],
    contentEn: [
      "A 15-day Europe itinerary is many travelers' dream. With proper planning, you can visit the main European capitals while making the most of every moment.",
      "**Days 1-3: Paris, France** — Start in the City of Light. Day 1: Eiffel Tower and Trocadéro. Day 2: Louvre and Musée d'Orsay. Day 3: Montmartre, Sacré-Cœur, and a sunset Seine cruise.",
      "**Days 4-5: Amsterdam, Netherlands** — Take the Thalys high-speed train (3h15). Visit the Rijksmuseum, Anne Frank House, and take a canal boat tour.",
      "**Day 6: Brussels, Belgium** — Day stop en route. Visit the Grand Place, try Belgian waffles and chocolates, and see the Atomium.",
      "**Days 7-9: Rome, Italy** — Fly from Brussels. Visit the Colosseum, Roman Forum, Pantheon, Vatican, Trevi Fountain, and Trastevere.",
      "**Days 10-11: Florence, Italy** — High-speed train (1h30). Visit the Uffizi Gallery, Duomo, and Ponte Vecchio. Enjoy Tuscan wine tasting.",
      "**Days 12-14: Barcelona, Spain** — Fly to Barcelona. Visit Sagrada Família, Park Güell, Las Ramblas, the Gothic Quarter, and Barceloneta beach.",
      "**Day 15: Free day** — Revisit your favorite spot, shop, or simply relax before your flight home.",
    ],
    tips: ["Compre o Eurail Pass para economizar em trens", "Reserve museus com antecedência online", "Leve um adaptador de tomada universal", "Use apps como Rome2Rio para planejar deslocamentos"],
    tipsEn: ["Buy a Eurail Pass to save on trains", "Book museums online in advance", "Bring a universal plug adapter", "Use apps like Rome2Rio to plan transfers"],
    relatedImages: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop",
    ],
  },
  "melhores-festivais-musica": {
    id: "melhores-festivais-musica",
    title: "Os Maiores Festivais de Música do Mundo em 2026",
    titleEn: "The Biggest Music Festivals in the World in 2026",
    excerpt: "Coachella, Tomorrowland, Rock in Rio e mais.",
    excerptEn: "Coachella, Tomorrowland, Rock in Rio and more.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop",
    category: "Eventos",
    categoryEn: "Events",
    date: "2026-02-20",
    readTime: 10,
    content: [
      "2026 será um ano espetacular para os amantes de música ao vivo. Os maiores festivais do mundo prometem line-ups históricos e experiências inesquecíveis. Confira os destaques.",
      "**Rock in Rio — Rio de Janeiro, Brasil (Setembro)** — O maior festival da América Latina retorna à Cidade Maravilhosa com 7 dias de festival espalhados em dois finais de semana. A Cidade do Rock recebe artistas de todos os gêneros, desde rock clássico até pop e eletrônica.",
      "**Coachella — Indio, Califórnia, EUA (Abril)** — O festival mais instagramável do mundo acontece no deserto da Califórnia durante dois finais de semana consecutivos. Além da música, as instalações artísticas e o clima do deserto criam uma atmosfera única.",
      "**Tomorrowland — Boom, Bélgica (Julho)** — O maior festival de música eletrônica do mundo transforma a pequena cidade belga em um reino de fantasia. Com cenários elaborados e os melhores DJs do planeta, é uma experiência imersiva sem igual.",
      "**Glastonbury — Somerset, Inglaterra (Junho)** — O festival mais tradicional do Reino Unido mistura música, teatro, circo e artes em uma fazenda de 360 hectares. Com mais de 100 palcos, é impossível ficar entediado.",
      "**Primavera Sound — Barcelona, Espanha (Maio-Junho)** — Um dos festivais mais ecléticos da Europa, com line-ups que misturam indie, pop, rock, hip-hop e eletrônica com vista para o Mediterrâneo.",
      "**Lollapalooza Brasil — São Paulo (Março)** — O Autódromo de Interlagos se transforma em palco para artistas nacionais e internacionais de primeira linha durante três dias de festival.",
    ],
    contentEn: [
      "2026 will be a spectacular year for live music lovers. The world's biggest festivals promise historic lineups and unforgettable experiences.",
      "**Rock in Rio — Rio de Janeiro, Brazil (September)** — Latin America's biggest festival returns with 7 festival days across two weekends, hosting artists from every genre.",
      "**Coachella — Indio, California, USA (April)** — The world's most Instagrammable festival takes place in the California desert across two consecutive weekends.",
      "**Tomorrowland — Boom, Belgium (July)** — The world's biggest electronic music festival transforms a small Belgian town into a fantasy kingdom.",
      "**Glastonbury — Somerset, England (June)** — The UK's most traditional festival mixes music, theater, circus, and arts across 900 acres.",
      "**Primavera Sound — Barcelona, Spain (May-June)** — One of Europe's most eclectic festivals with Mediterranean views.",
      "**Lollapalooza Brazil — São Paulo (March)** — Three days of top-tier national and international artists at Interlagos.",
    ],
    tips: ["Compre ingressos na pré-venda para garantir preços menores", "Leve protetor solar e garrafa de água reutilizável", "Reserve hospedagem próxima ao festival", "Use transporte público ou shuttles oficiais"],
    tipsEn: ["Buy pre-sale tickets for lower prices", "Bring sunscreen and reusable water bottle", "Book accommodation near the festival", "Use public transport or official shuttles"],
    relatedImages: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
    ],
  },
  "viagem-segura-dicas": {
    id: "viagem-segura-dicas",
    title: "Viagem Segura: 12 Dicas Essenciais",
    titleEn: "Safe Travel: 12 Essential Tips",
    excerpt: "Seguro viagem, documentos e cuidados essenciais.",
    excerptEn: "Travel insurance, documents, and essential care.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop",
    category: "Dicas",
    categoryEn: "Tips",
    date: "2026-02-15",
    readTime: 7,
    content: [
      "Viajar é uma das experiências mais enriquecedoras da vida, mas requer cuidados para garantir que tudo ocorra sem problemas. Aqui estão 12 dicas essenciais para uma viagem segura.",
      "**1. Contrate seguro viagem** — É o item mais importante da sua mala. Planos internacionais cobrem emergências médicas, extravio de bagagem, cancelamentos e muito mais. Não viaje sem um.",
      "**2. Faça cópias dos documentos** — Digitalize passaporte, RG, cartões de crédito e reservas. Salve na nuvem e envie cópias por e-mail para si mesmo.",
      "**3. Verifique vacinas obrigatórias** — Alguns destinos exigem vacinas específicas (febre amarela, por exemplo). Consulte o site da ANVISA e vacine-se com antecedência.",
      "**4. Registre-se no consulado** — O sistema e-Consular do Itamaraty permite que brasileiros no exterior sejam localizados em caso de emergência.",
      "**5. Diversifique o dinheiro** — Não concentre todo o dinheiro em um só lugar. Leve cartão de crédito internacional, dinheiro em espécie e um cartão pré-pago.",
      "**6. Informe o banco** — Antes de viajar, avise seu banco sobre o destino e as datas para evitar bloqueio do cartão por atividade suspeita.",
      "**7. Use VPN em Wi-Fi público** — Redes públicas são vulneráveis a ataques. Use uma VPN confiável para proteger seus dados em aeroportos, cafés e hotéis.",
      "**8. Compartilhe seu roteiro** — Envie seu itinerário para familiares ou amigos de confiança. Mantenha contato regular.",
      "**9. Pesquise sobre o destino** — Conheça as leis locais, costumes, áreas a evitar e formas de transporte seguras antes de chegar.",
      "**10. Tenha um kit de emergência** — Medicamentos básicos, carregador portátil, lanterna e um kit de primeiros socorros compacto.",
      "**11. Cuidado com golpes turísticos** — Pesquise os golpes mais comuns no destino. Desconfie de ofertas boas demais para ser verdade.",
      "**12. Mantenha cópias offline** — Baixe mapas offline, tradutor e informações do hotel para caso fique sem internet.",
    ],
    contentEn: [
      "Traveling is one of life's most enriching experiences, but it requires care to ensure everything goes smoothly. Here are 12 essential tips for safe travel.",
      "**1. Get travel insurance** — The most important item in your luggage. International plans cover medical emergencies, lost baggage, cancellations, and more.",
      "**2. Copy your documents** — Digitize your passport, ID, credit cards, and reservations. Save to the cloud and email copies to yourself.",
      "**3. Check required vaccines** — Some destinations require specific vaccines. Check requirements and get vaccinated in advance.",
      "**4. Register with your embassy** — Allows you to be located in case of emergency.",
      "**5. Diversify your money** — Don't keep all money in one place. Carry international credit card, cash, and a prepaid card.",
      "**6. Notify your bank** — Before traveling, tell your bank about your destination and dates to avoid card blocks.",
      "**7. Use VPN on public Wi-Fi** — Public networks are vulnerable. Use a reliable VPN to protect your data.",
      "**8. Share your itinerary** — Send your plans to family or trusted friends. Maintain regular contact.",
      "**9. Research your destination** — Know local laws, customs, areas to avoid, and safe transport before arriving.",
      "**10. Carry an emergency kit** — Basic medications, portable charger, flashlight, and compact first aid kit.",
      "**11. Watch for tourist scams** — Research common scams at your destination. Be wary of deals that seem too good.",
      "**12. Keep offline copies** — Download offline maps, translator, and hotel info in case you lose internet.",
    ],
    tips: ["Faça seguro viagem antes de comprar as passagens", "Leve uma cópia física do passaporte separada", "Cadastre-se no e-Consular antes de viajar", "Verifique a validade do passaporte (mínimo 6 meses)"],
    tipsEn: ["Get travel insurance before buying tickets", "Carry a separate physical copy of your passport", "Register with your embassy before traveling", "Check passport validity (minimum 6 months)"],
    relatedImages: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&h=400&fit=crop",
    ],
  },
};

const BlogPost = () => {
  const { id } = useParams();
  const { locale } = useI18n();

  const article = id ? blogArticles[id] : null;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {locale === "pt" ? "Artigo não encontrado" : "Article not found"}
        </h1>
        <Link to="/blog" className="text-primary hover:underline">
          {locale === "pt" ? "Voltar ao blog" : "Back to blog"}
        </Link>
      </div>
    );
  }

  const title = locale === "pt" ? article.title : article.titleEn;
  const content = locale === "pt" ? article.content : article.contentEn;
  const tips = locale === "pt" ? article.tips : article.tipsEn;
  const category = locale === "pt" ? article.category : article.categoryEn;

  const renderParagraph = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="text-foreground font-semibold">{part}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <SmartImage
          src={article.image}
          alt={title}
          category="blog"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === "pt" ? "Voltar ao blog" : "Back to blog"}
            </Link>
            <Badge className="mb-3 bg-accent/90 text-accent-foreground border-0">
              <Tag className="h-3 w-3 mr-1" />
              {category}
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl"
            >
              {title}
            </motion.h1>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(article.date).toLocaleDateString(
                  locale === "pt" ? "pt-BR" : "en-US",
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime} min {locale === "pt" ? "de leitura" : "read"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="container py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {content.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="text-muted-foreground leading-relaxed text-lg"
              >
                {renderParagraph(paragraph)}
              </motion.p>
            ))}
          </div>

          {/* Images gallery */}
          {article.relatedImages.length > 0 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {article.relatedImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="rounded-xl overflow-hidden aspect-[3/2]"
                >
                  <SmartImage src={img} alt="" category="blog" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Tips box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 rounded-xl bg-accent/5 border border-accent/20 p-6"
          >
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              {locale === "pt" ? "Dicas Importantes" : "Important Tips"}
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-accent mt-1 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Back link */}
          <div className="mt-10 pt-8 border-t border-border">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === "pt" ? "Ver todos os artigos" : "View all articles"}
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;