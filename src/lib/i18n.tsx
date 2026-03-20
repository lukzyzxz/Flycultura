import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Locale = "en" | "pt";

const translations = {
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.search": "Search",
    "nav.deals": "Deals",
    "nav.packages": "Event Packages",
    "nav.signIn": "Sign In",
    "nav.signOut": "Sign Out",
    "nav.myAccount": "My Account",

    // Hero
    "hero.title1": "Explore the World",
    "hero.title2": "Your Way",
    "hero.subtitle": "Search flights, hotels, packages and cruises. Find the best deals and start your adventure.",
    "hero.searchBtn": "Search Trips",
    "hero.from": "From",
    "hero.to": "To",
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
  },
  pt: {
    // Navbar
    "nav.home": "Início",
    "nav.search": "Buscar",
    "nav.deals": "Ofertas",
    "nav.packages": "Pacotes de Eventos",
    "nav.signIn": "Entrar",
    "nav.signOut": "Sair",
    "nav.myAccount": "Minha Conta",

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
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(
    () => (localStorage.getItem("locale") as Locale) || "pt"
  );

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
