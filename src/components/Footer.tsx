import { useState } from "react";
import { Plane, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
        { label: "Instalar app", to: "/install" },
        { label: "Privacidade", to: "/privacy" },
        { label: "Termos", to: "/terms" },
      ]
    : [
        { label: "Help Center", to: "/help" },
        { label: "Contact", to: "/help" },
        { label: "Install app", to: "/install" },
        { label: "Privacy", to: "/privacy" },
        { label: "Terms", to: "/terms" },
      ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: t("footer.subscribeError"), variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: trimmed });

      if (error) {
        if (error.code === "23505") {
          toast({ title: t("footer.subscribeSuccess") });
        } else {
          throw error;
        }
      } else {
        toast({ title: t("footer.subscribeSuccess") });
      }
      setEmail("");
    } catch {
      toast({ title: t("footer.subscribeError"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container">
        {/* Newsletter Section */}
        <div className="mb-10 pb-10 border-b border-border">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-xl font-bold text-card-foreground mb-2">
              {t("footer.newsletter")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("footer.newsletterDesc")}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                {t("footer.emailPlaceholder")}
              </label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
                aria-required="true"
              />
              <Button type="submit" disabled={loading} className="gap-2 shrink-0" aria-label={t("footer.subscribe")}>
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>{t("footer.subscribe")}</span>
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold mb-3">
              <Plane className="h-5 w-5 text-primary" aria-hidden="true" />
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
