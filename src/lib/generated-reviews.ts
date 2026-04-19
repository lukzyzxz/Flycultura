export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  commentEn: string;
}

const firstNames = [
  "Ana", "Pedro", "Maria", "Lucas", "Juliana", "Carlos", "Fernanda", "Rafael",
  "Camila", "Bruno", "Larissa", "Marcos", "Patricia", "Diego", "Amanda",
  "Gabriel", "Beatriz", "Thiago", "Letícia", "Rodrigo", "Isabella", "Felipe",
  "Mariana", "André", "Natália", "Vinícius", "Lúcia", "Gustavo", "Carolina", "Eduardo",
];

const lastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Rodrigues",
  "Almeida", "Nascimento", "Lima", "Araújo", "Fernandes", "Carvalho",
  "Gomes", "Martins", "Rocha", "Ribeiro", "Melo", "Barbosa", "Cardoso",
];

const commentTemplates = [
  { pt: "Experiência incrível! O pacote superou todas as minhas expectativas. A organização foi impecável e cada detalhe foi pensado com cuidado.", en: "Incredible experience! The package exceeded all my expectations. The organization was impeccable and every detail was carefully planned." },
  { pt: "Viagem maravilhosa! O hotel era excelente e os ingressos do evento foram entregues sem nenhum problema. Recomendo muito!", en: "Wonderful trip! The hotel was excellent and the event tickets were delivered without any issues. Highly recommend!" },
  { pt: "Muito bom! A equipe de suporte foi atenciosa e o roteiro foi muito bem planejado. Voltaria com certeza.", en: "Very good! The support team was attentive and the itinerary was very well planned. Would definitely go again." },
  { pt: "Adorei cada momento! O voo foi confortável, o hotel tinha uma localização perfeita e o evento foi inesquecível.", en: "Loved every moment! The flight was comfortable, the hotel had a perfect location and the event was unforgettable." },
  { pt: "Superou minhas expectativas! Preço justo pelo que foi oferecido. Os transfers foram pontuais e o guia local foi excelente.", en: "Exceeded my expectations! Fair price for what was offered. Transfers were punctual and the local guide was excellent." },
  { pt: "Pacote completo e bem organizado. A única sugestão seria incluir mais tempo livre para explorar a cidade.", en: "Complete and well-organized package. The only suggestion would be to include more free time to explore the city." },
  { pt: "Foi minha primeira viagem internacional e não poderia ter sido melhor! Me senti segura e bem assistida durante toda a viagem.", en: "It was my first international trip and it couldn't have been better! I felt safe and well-assisted throughout the trip." },
  { pt: "Que experiência fantástica! O evento em si já vale a viagem, mas o pacote completo torna tudo muito mais fácil e agradável.", en: "What a fantastic experience! The event itself is worth the trip, but the complete package makes everything much easier and enjoyable." },
  { pt: "Excelente custo-benefício! Comparei com outras agências e este foi o melhor preço com a melhor qualidade de serviço.", en: "Excellent value for money! I compared with other agencies and this was the best price with the best quality of service." },
  { pt: "A viagem foi perfeita do início ao fim. Todos os detalhes foram cuidados e pudemos aproveitar sem preocupações.", en: "The trip was perfect from start to finish. Every detail was taken care of and we could enjoy without worries." },
  { pt: "Recomendo de olhos fechados! Já é a terceira vez que compro um pacote e nunca me decepcionei.", en: "Recommend with eyes closed! It's the third time I've bought a package and I've never been disappointed." },
  { pt: "Boa experiência no geral. Hotel poderia ser um pouco melhor, mas o evento compensou tudo. Nota 4 de 5!", en: "Good experience overall. Hotel could be a bit better, but the event made up for everything. 4 out of 5!" },
  { pt: "Simplesmente perfeito! O atendimento personalizado fez toda a diferença. Já estou planejando a próxima viagem.", en: "Simply perfect! The personalized service made all the difference. Already planning the next trip." },
  { pt: "Viajei com a família e todos adoraram! O pacote familiar foi muito bem pensado, com atividades para crianças e adultos.", en: "Traveled with the family and everyone loved it! The family package was very well designed, with activities for children and adults." },
  { pt: "Incrível! Os ingressos eram em uma localização privilegiada e a vista do evento era espetacular. Valeu cada centavo!", en: "Amazing! The tickets were in a prime location and the view of the event was spectacular. Worth every penny!" },
];

function seededRandom(seed: number): () => number {
  let s = Math.abs(seed) || 1;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateReviews(packageId: string, count: number = 6): Review[] {
  // Seed changes with each page load (session-unique)
  const sessionSeed = typeof window !== "undefined"
    ? (window as any).__reviewSeed || ((window as any).__reviewSeed = Date.now())
    : Date.now();

  let seedNum = sessionSeed;
  for (let i = 0; i < packageId.length; i++) {
    seedNum = ((seedNum << 5) - seedNum + packageId.charCodeAt(i)) | 0;
  }
  const rand = seededRandom(seedNum);

  const reviews: Review[] = [];
  const usedNames = new Set<string>();
  const usedComments = new Set<number>();

  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      const first = firstNames[Math.floor(rand() * firstNames.length)];
      const last = lastNames[Math.floor(rand() * lastNames.length)];
      name = `${first} ${last}`;
    } while (usedNames.has(name));
    usedNames.add(name);

    let commentIdx: number;
    do {
      commentIdx = Math.floor(rand() * commentTemplates.length);
    } while (usedComments.has(commentIdx) && usedComments.size < commentTemplates.length);
    usedComments.add(commentIdx);

    const template = commentTemplates[commentIdx];
    // Only 4 or 5 stars (mostly 5)
    const rating = rand() > 0.25 ? 5 : 4;
    const daysAgo = Math.floor(rand() * 90) + 1;
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString().split("T")[0];

    // Generate avatar with initials
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
    const avatarColors = ["4F46E5", "7C3AED", "2563EB", "0891B2", "059669", "D97706", "DC2626", "DB2777"];
    const color = avatarColors[Math.floor(rand() * avatarColors.length)];
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=fff&size=80`;

    reviews.push({
      id: `review-${packageId}-${i}`,
      name,
      avatar,
      rating,
      date,
      comment: template.pt,
      commentEn: template.en,
    });
  }

  return reviews;
}
