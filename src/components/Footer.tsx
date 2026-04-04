import { Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const Footer = () => {
  const { t, locale } = useI18n();

  const exploreLinks = locale === "pt"
    ? [
        { label: "Voos", to: "/results?type=flights" },
        { label: "Hotéis", to: "/results?type=hotels" },
        { label: "Pacotes", to: "/packages" },
        { label: "Ofertas", to: "/deals" },
        { label: "Blog", to: "/blog" },
      ]
    : [
        { label: "Flights", to: "/results?type=flights" },
        { label: "Hotels", to: "/results?type=hotels" },
        { label: "Packages", to: "/packages" },
        { label: "Deals", to: "/deals" },
        { label: "Blog", to: "/blog" },
      ];

  const companyLinks = locale === "pt"
    ? [
        { label: "Sobre", to: "/about" },
        { label: "Carreiras", to: "/about" },
      ]
    : [
        { label: "About", to: "/about" },
        { label: "Careers", to: "/about" },
      ];

  const supportLinks = locale === "pt"
    ? [
        { label: "Central de Ajuda", to: "/help" },
        { label: "Contato", to: "/help" },
        { label: "Privacidade", to: "/privacy" },
        { label: "Termos", to: "/terms" },
      ]
    : [
        { label: "Help Center", to: "/help" },
        { label: "Contact", to: "/help" },
        { label: "Privacy", to: "/privacy" },
        { label: "Terms", to: "/terms" },
      ];

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold mb-3">
              <Plane className="h-5 w-5 text-primary" />
              <span className="text-gradient">FlyCultura</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
          </div>
          {[
            { title: t("footer.explore"), links: exploreLinks },
            { title: t("footer.company"), links: companyLinks },
            { title: t("footer.support"), links: supportLinks },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-card-foreground mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
