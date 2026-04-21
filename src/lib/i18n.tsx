import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

// eslint-disable-next-line react-refresh/only-export-components

export type Locale = "en" | "pt";

const translations = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.search": "Search",
    "nav.deals": "Deals",
    "nav.packages": "Event Packages",
    "nav.guides": "Travel Guide",
    "nav.signIn": "Sign In",
    "nav.signOut": "Sign Out",
    "nav.myAccount": "My Account",
    "nav.cart": "Cart",

    // Hero
    "hero.title1": "Explore the World",
    "hero.title2": "Your Way",
    "hero.subtitle": "Search flights, hotels, packages and cruises. Find the best deals and start your adventure.",
    "hero.searchBtn": "Search Trips",
    "hero.from": "From",
    "hero.to": "To / Destination",
    "hero.passengers": "Passengers",
    "hero.1adult": "1 Adult",
    "hero.flights": "Flights",
    "hero.hotels": "Hotels",
    "hero.packages": "Packages",
    "hero.cruises": "Cruises",

    // Index
    "index.popularTitle": "Popular Destinations",
    "index.popularSubtitle": "Discover the world's most sought-after travel destinations",
    "index.specialOffers": "Special Offers",
    "index.hotDeals": "Hot Deals",
    "index.viewAll": "View All",
    "index.ctaTitle": "Ready for Your Next Adventure?",
    "index.ctaSubtitle": "Join thousands of travelers who find the best deals with FlyCultura.",
    "index.ctaBtn": "Start Exploring",
    "index.fromPrice": "From",

    // Deals
    "deals.limitedTime": "Limited Time",
    "deals.title": "Exclusive Deals",
    "deals.subtitle": "Save big on flights, hotels, cruises and vacation packages",
    "deals.viewDeal": "View Deal",
    "deals.off": "OFF",
    "deals.addToCart": "Add to Cart",

    // Destination
    "dest.back": "Back",
    "dest.notFound": "Destination not found",
    "dest.goHome": "Go back home",
    "dest.about": "About",
    "dest.topExperiences": "Top Experiences",
    "dest.planTrip": "Plan Your Trip",
    "dest.bestTime": "Best time",
    "dest.perPerson": "/ person",
    "dest.bookNow": "Book Now",
    "dest.compareDeals": "Compare Deals",

    // Results
    "results.backToSearch": "Back to Search",
    "results.results": "Results",

    // Footer
    "footer.tagline": "Your gateway to exploring the world. Find the best flights, hotels, and packages.",
    "footer.explore": "Explore",
    "footer.company": "Company",
    "footer.support": "Support",
    "footer.rights": "© 2026 FlyCultura. All rights reserved.",
    "footer.newsletter": "Newsletter",
    "footer.newsletterDesc": "Get the best travel deals and tips straight to your inbox.",
    "footer.emailPlaceholder": "Your email",
    "footer.subscribe": "Subscribe",
    "footer.subscribeSuccess": "Subscribed successfully!",
    "footer.subscribeError": "Please enter a valid email.",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signUp": "Create Account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.signInBtn": "Sign In",
    "auth.signUpBtn": "Create Account",
    "auth.welcome": "Welcome to FlyCultura",
    "auth.welcomeSub": "Sign in to save trips and access exclusive deals",
    "auth.createSub": "Create your account and start exploring the world",
    "auth.forgotPassword": "Forgot password?",
    "auth.resetPassword": "Reset Password",
    "auth.resetSub": "Enter your email and we'll send a reset link",
    "auth.sendReset": "Send Reset Link",
    "auth.backToLogin": "Back to login",
    "auth.resetSent": "Password reset email sent! Check your inbox.",
    "auth.signUpSuccess": "Account created! Check your email to confirm.",
    "auth.confirmPassword": "Confirm Password",
    "auth.errorEmailRequired": "Email is required",
    "auth.errorEmailInvalid": "Enter a valid email address",
    "auth.errorPasswordRequired": "Password is required",
    "auth.errorPasswordMin": "Password must be at least 6 characters",
    "auth.errorNameRequired": "Full name is required",
    "auth.errorPasswordsMismatch": "Passwords do not match",
    "auth.googleSignIn": "Continue with Google",
    "auth.orContinueWith": "or continue with email",

    // Event Packages
    "events.title": "Event Packages",
    "events.subtitle": "Complete travel packages for the world's biggest events — flights, accommodation, and tickets included",
    "events.featured": "Featured Events",
    "events.includes": "Package Includes",
    "events.flight": "Round-trip Flight",
    "events.hotel": "Accommodation",
    "events.ticket": "Event Tickets",
    "events.transfer": "Airport Transfer",
    "events.from": "From",
    "events.perPerson": "/person",
    "events.viewPackage": "View Package",
    "events.allInclusive": "All-Inclusive",

    // Package Detail
    "package.whatsIncluded": "What's Included",
    "package.highlights": "Highlights",
    "package.noCommitment": "No commitment — free cancellation up to 30 days before",
    "package.touristSpots": "Tourist Spots Nearby",

    // Cart
    "cart.title": "Your Cart",
    "cart.empty": "Your cart is empty",
    "cart.emptySubtitle": "Browse our event packages and add them to your cart",
    "cart.browsePackages": "Browse Packages",
    "cart.addToCart": "Add to Cart",
    "cart.added": "Added to cart!",
    "cart.summary": "Order Summary",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",
    "cart.clearCart": "Clear cart",
    "cart.loginToBook": "Sign in to Book",
    "cart.loginRequired": "You need to be signed in to complete a booking",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.backToCart": "Back to cart",
    "checkout.paymentDetails": "Payment Details",
    "checkout.securePayment": "Your payment info is encrypted and secure (prototype)",
    "checkout.cardName": "Name on Card",
    "checkout.cardNumber": "Card Number",
    "checkout.expiry": "Expiry",
    "checkout.pay": "Pay",
    "checkout.processing": "Processing payment...",
    "checkout.doNotClose": "Please do not close this page",
    "checkout.successTitle": "Booking Confirmed!",
    "checkout.successDesc": "You will receive a confirmation email with all the details of your booking.",
    "checkout.prototype": "⚠️ This is a prototype — no real charges will be made.",
    "checkout.invalidCpf": "Invalid CPF. Please check the digits.",
    "checkout.cpfNameMismatch": "The name must match the CPF holder. Please verify.",
    "checkout.method": "Payment Method",
    "checkout.creditCard": "Credit Card",
    "checkout.pix": "PIX",
    "checkout.boleto": "Boleto",
    "checkout.installments": "Installments",
    "checkout.installmentsInterestFree": "interest-free",
    "checkout.installmentsWithInterest": "with interest",
    "checkout.invalidCard": "Invalid card number.",
    "checkout.invalidExpiry": "Invalid or expired date.",
    "checkout.cardBrand": "Card",
    "checkout.encryption": "256-bit SSL encryption",
    "checkout.pciCompliant": "PCI DSS Level 1",
    "checkout.moneyBack": "Buyer protection",
    "checkout.pixTitle": "Pay instantly with PIX",
    "checkout.pixDesc": "Scan the QR code with your bank app to confirm payment in seconds.",
    "checkout.pixCopy": "Copy PIX code",
    "checkout.pixCopied": "PIX code copied!",
    "checkout.pixExpires": "Code valid for 30 minutes",
    "checkout.boletoTitle": "Pay with Boleto Bancário",
    "checkout.boletoDesc": "Generate a boleto and pay at any bank, lottery agency or app within 3 business days.",
    "checkout.boletoGenerate": "Generate Boleto",
    "checkout.confirm": "Confirm Payment",
    "checkout.processingStep1": "Validating card data",
    "checkout.processingStep2": "Authorizing transaction",
    "checkout.processingStep3": "Confirming with issuer",
    "checkout.transactionId": "Transaction ID",
    "checkout.paidWith": "Paid with",
    "checkout.viewOrders": "View my orders",
    "checkout.acceptedCards": "Accepted cards",
    "checkout.acceptTerms": "I have read and accept the",
    "checkout.termsLink": "Terms of Use",

    // Guide
    "guide.title": "Travel Guide",
    "guide.subtitle": "Plan the perfect trip with a professional guide or AI-powered itinerary",
    "guide.humanTitle": "Professional Guide",
    "guide.humanDesc": "Book a local guide who speaks your language for personalized tours and experiences",
    "guide.aiTitle": "AI Travel Planner",
    "guide.aiDesc": "Get a personalized travel itinerary generated by AI based on your preferences",
    "guide.pricePerDay": "/day",
    "guide.destination": "Destination",
    "guide.days": "Number of days",
    "guide.interests": "Your interests",
    "guide.generatePlan": "Generate Travel Plan",
    "guide.bookGuide": "Book Guide",
    "guide.generating": "Generating your itinerary...",
    "guide.addGuideToCart": "Add Guide to Cart",
    "guide.humanPrice": "Professional guide — R$ 350/day",
    "guide.included": "Includes: local expert, transport tips, restaurant recommendations",
  },
  pt: {
    // Navbar
    "nav.home": "Início",
    "nav.search": "Buscar",
    "nav.deals": "Ofertas",
    "nav.packages": "Pacotes de Eventos",
    "nav.guides": "Guia de Viagem",
    "nav.signIn": "Entrar",
    "nav.signOut": "Sair",
    "nav.myAccount": "Minha Conta",
    "nav.cart": "Carrinho",

    // Hero
    "hero.title1": "Explore o Mundo",
    "hero.title2": "Do Seu Jeito",
    "hero.subtitle": "Busque voos, hotéis, pacotes e cruzeiros. Encontre as melhores ofertas e comece sua aventura.",
    "hero.searchBtn": "Buscar Viagens",
    "hero.from": "Origem",
    "hero.to": "Destino",
    "hero.passengers": "Passageiros",
    "hero.1adult": "1 Adulto",
    "hero.flights": "Voos",
    "hero.hotels": "Hotéis",
    "hero.packages": "Pacotes",
    "hero.cruises": "Cruzeiros",

    // Index
    "index.popularTitle": "Destinos Populares",
    "index.popularSubtitle": "Descubra os destinos mais procurados do mundo",
    "index.specialOffers": "Ofertas Especiais",
    "index.hotDeals": "Ofertas Imperdíveis",
    "index.viewAll": "Ver Todas",
    "index.ctaTitle": "Pronto para Sua Próxima Aventura?",
    "index.ctaSubtitle": "Junte-se a milhares de viajantes que encontram as melhores ofertas com FlyCultura.",
    "index.ctaBtn": "Comece a Explorar",
    "index.fromPrice": "A partir de",

    // Deals
    "deals.limitedTime": "Tempo Limitado",
    "deals.title": "Ofertas Exclusivas",
    "deals.subtitle": "Economize em voos, hotéis, cruzeiros e pacotes de férias",
    "deals.viewDeal": "Ver Oferta",
    "deals.off": "DESC",
    "deals.addToCart": "Adicionar ao Carrinho",

    // Destination
    "dest.back": "Voltar",
    "dest.notFound": "Destino não encontrado",
    "dest.goHome": "Voltar ao início",
    "dest.about": "Sobre",
    "dest.topExperiences": "Experiências Imperdíveis",
    "dest.planTrip": "Planeje Sua Viagem",
    "dest.bestTime": "Melhor época",
    "dest.perPerson": "/ pessoa",
    "dest.bookNow": "Reservar Agora",
    "dest.compareDeals": "Comparar Ofertas",

    // Results
    "results.backToSearch": "Voltar à Busca",
    "results.results": "Resultados",

    // Footer
    "footer.tagline": "Sua porta de entrada para explorar o mundo. Encontre os melhores voos, hotéis e pacotes.",
    "footer.explore": "Explorar",
    "footer.company": "Empresa",
    "footer.support": "Suporte",
    "footer.rights": "© 2026 FlyCultura. Todos os direitos reservados.",
    "footer.newsletter": "Newsletter",
    "footer.newsletterDesc": "Receba as melhores ofertas e dicas de viagem direto no seu email.",
    "footer.emailPlaceholder": "Seu email",
    "footer.subscribe": "Inscrever-se",
    "footer.subscribeSuccess": "Inscrito com sucesso!",
    "footer.subscribeError": "Por favor, insira um email válido.",

    // Auth
    "auth.signIn": "Entrar",
    "auth.signUp": "Criar Conta",
    "auth.email": "E-mail",
    "auth.password": "Senha",
    "auth.fullName": "Nome Completo",
    "auth.noAccount": "Não tem uma conta?",
    "auth.hasAccount": "Já tem uma conta?",
    "auth.signInBtn": "Entrar",
    "auth.signUpBtn": "Criar Conta",
    "auth.welcome": "Bem-vindo ao FlyCultura",
    "auth.welcomeSub": "Entre para salvar viagens e acessar ofertas exclusivas",
    "auth.createSub": "Crie sua conta e comece a explorar o mundo",
    "auth.forgotPassword": "Esqueceu a senha?",
    "auth.resetPassword": "Redefinir Senha",
    "auth.resetSub": "Digite seu e-mail e enviaremos um link de redefinição",
    "auth.sendReset": "Enviar Link",
    "auth.backToLogin": "Voltar ao login",
    "auth.resetSent": "E-mail de redefinição enviado! Verifique sua caixa de entrada.",
    "auth.signUpSuccess": "Conta criada! Verifique seu e-mail para confirmar.",
    "auth.confirmPassword": "Confirmar Senha",
    "auth.errorEmailRequired": "E-mail é obrigatório",
    "auth.errorEmailInvalid": "Digite um e-mail válido",
    "auth.errorPasswordRequired": "Senha é obrigatória",
    "auth.errorPasswordMin": "A senha deve ter pelo menos 6 caracteres",
    "auth.errorNameRequired": "Nome completo é obrigatório",
    "auth.errorPasswordsMismatch": "As senhas não coincidem",
    "auth.googleSignIn": "Continuar com Google",
    "auth.orContinueWith": "ou continue com e-mail",

    // Event Packages
    "events.title": "Pacotes de Eventos",
    "events.subtitle": "Pacotes completos para os maiores eventos do mundo — voo, hospedagem e ingressos inclusos",
    "events.featured": "Eventos em Destaque",
    "events.includes": "O Pacote Inclui",
    "events.flight": "Voo ida e volta",
    "events.hotel": "Hospedagem",
    "events.ticket": "Ingressos para o Evento",
    "events.transfer": "Transfer Aeroporto",
    "events.from": "A partir de",
    "events.perPerson": "/pessoa",
    "events.viewPackage": "Ver Pacote",
    "events.allInclusive": "Tudo Incluso",

    // Package Detail
    "package.whatsIncluded": "O que está incluído",
    "package.highlights": "Destaques",
    "package.noCommitment": "Sem compromisso — cancelamento gratuito até 30 dias antes",
    "package.touristSpots": "Pontos Turísticos Próximos",

    // Cart
    "cart.title": "Seu Carrinho",
    "cart.empty": "Seu carrinho está vazio",
    "cart.emptySubtitle": "Navegue pelos pacotes de eventos e adicione ao carrinho",
    "cart.browsePackages": "Ver Pacotes",
    "cart.addToCart": "Adicionar ao Carrinho",
    "cart.added": "Adicionado ao carrinho!",
    "cart.summary": "Resumo do Pedido",
    "cart.total": "Total",
    "cart.checkout": "Finalizar Reserva",
    "cart.clearCart": "Limpar carrinho",
    "cart.loginToBook": "Entre para Reservar",
    "cart.loginRequired": "Você precisa estar logado para concluir a reserva",

    // Checkout
    "checkout.title": "Finalizar Pagamento",
    "checkout.backToCart": "Voltar ao carrinho",
    "checkout.paymentDetails": "Dados de Pagamento",
    "checkout.securePayment": "Suas informações de pagamento são criptografadas e seguras (protótipo)",
    "checkout.cardName": "Nome no Cartão",
    "checkout.cardNumber": "Número do Cartão",
    "checkout.expiry": "Validade",
    "checkout.pay": "Pagar",
    "checkout.processing": "Processando pagamento...",
    "checkout.doNotClose": "Por favor, não feche esta página",
    "checkout.successTitle": "Reserva Confirmada!",
    "checkout.successDesc": "Você receberá um e-mail de confirmação com todos os detalhes da sua reserva.",
    "checkout.prototype": "⚠️ Este é um protótipo — nenhuma cobrança real será feita.",
    "checkout.invalidCpf": "CPF inválido. Verifique os dígitos.",
    "checkout.cpfNameMismatch": "O nome deve corresponder ao titular do CPF. Verifique.",
    "checkout.method": "Forma de Pagamento",
    "checkout.creditCard": "Cartão de Crédito",
    "checkout.pix": "PIX",
    "checkout.boleto": "Boleto",
    "checkout.installments": "Parcelamento",
    "checkout.installmentsInterestFree": "sem juros",
    "checkout.installmentsWithInterest": "com juros",
    "checkout.invalidCard": "Número de cartão inválido.",
    "checkout.invalidExpiry": "Data de validade inválida ou vencida.",
    "checkout.cardBrand": "Bandeira",
    "checkout.encryption": "Criptografia SSL 256 bits",
    "checkout.pciCompliant": "PCI DSS Nível 1",
    "checkout.moneyBack": "Proteção ao comprador",
    "checkout.pixTitle": "Pague na hora com PIX",
    "checkout.pixDesc": "Escaneie o QR code com o app do seu banco e confirme o pagamento em segundos.",
    "checkout.pixCopy": "Copiar código PIX",
    "checkout.pixCopied": "Código PIX copiado!",
    "checkout.pixExpires": "Código válido por 30 minutos",
    "checkout.boletoTitle": "Pague com Boleto Bancário",
    "checkout.boletoDesc": "Gere o boleto e pague em qualquer banco, lotérica ou app em até 3 dias úteis.",
    "checkout.boletoGenerate": "Gerar Boleto",
    "checkout.confirm": "Confirmar Pagamento",
    "checkout.processingStep1": "Validando dados do cartão",
    "checkout.processingStep2": "Autorizando transação",
    "checkout.processingStep3": "Confirmando com o emissor",
    "checkout.transactionId": "ID da Transação",
    "checkout.paidWith": "Pago com",
    "checkout.viewOrders": "Ver meus pedidos",
    "checkout.acceptedCards": "Cartões aceitos",
    "checkout.acceptTerms": "Li e aceito os",
    "checkout.termsLink": "Termos de Uso",

    // Guide
    "guide.title": "Guia de Viagem",
    "guide.subtitle": "Planeje a viagem perfeita com um guia profissional ou roteiro gerado por IA",
    "guide.humanTitle": "Guia Profissional",
    "guide.humanDesc": "Reserve um guia local que fala seu idioma para passeios e experiências personalizadas",
    "guide.aiTitle": "Planejador de Viagem IA",
    "guide.aiDesc": "Receba um roteiro de viagem personalizado gerado por IA baseado nas suas preferências",
    "guide.pricePerDay": "/dia",
    "guide.destination": "Destino",
    "guide.days": "Número de dias",
    "guide.interests": "Seus interesses",
    "guide.generatePlan": "Gerar Plano de Viagem",
    "guide.bookGuide": "Reservar Guia",
    "guide.generating": "Gerando seu roteiro...",
    "guide.addGuideToCart": "Adicionar Guia ao Carrinho",
    "guide.humanPrice": "Guia profissional — R$ 350/dia",
    "guide.included": "Inclui: especialista local, dicas de transporte, recomendações de restaurantes",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

// Attach context to globalThis so HMR-reloaded modules share the same instance.
// Without this, editing this file invalidates the context reference and any
// consumer rendered before HMR re-runs throws "must be used within Provider".
const GLOBAL_KEY = "__flycultura_i18n_ctx__";
const I18nContext: React.Context<I18nContextType | null> =
  (globalThis as any)[GLOBAL_KEY] ??
  ((globalThis as any)[GLOBAL_KEY] = createContext<I18nContextType | null>(null));

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(
    () => (localStorage.getItem("locale") as Locale) || "pt"
  );

  // Keep <html lang> in sync with the active locale (WCAG 3.1.1)
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] || key,
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
