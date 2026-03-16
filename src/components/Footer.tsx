import { Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const Footer = () => {
  const { t } = useI18n();

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
            { title: t("footer.explore"), links: ["Flights", "Hotels", "Packages", "Cruises"] },
            { title: t("footer.company"), links: ["About", "Blog", "Careers", "Press"] },
            { title: t("footer.support"), links: ["Help Center", "Contact", "Privacy", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-card-foreground mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">{l}</span>
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
