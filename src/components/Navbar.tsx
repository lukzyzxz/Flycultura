import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plane, Sun, Moon, Menu, X, LogOut, Globe, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import InstallButton from "@/components/InstallButton";

const Navbar = () => {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, locale, setLocale } = useI18n();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/packages", label: t("nav.packages") },
    { to: "/deals", label: t("nav.deals") },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav
      aria-label={locale === "pt" ? "Navegação principal" : "Main navigation"}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg"
    >
      <div className="container relative flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <Plane className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-gradient">FlyCultura</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={isActive ? "page" : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language toggle — desktop only, moved to hamburger on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocale(locale === "en" ? "pt" : "en")}
            className="hidden md:inline-flex rounded-full text-xs font-bold"
            title={locale === "en" ? "Mudar para Português" : "Switch to English"}
            aria-label={locale === "en" ? "Mudar idioma para Português" : "Switch language to English"}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="hidden md:inline text-xs font-semibold text-muted-foreground uppercase" aria-hidden="true">
            {locale}
          </span>
          {/* Theme toggle — desktop only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(!dark)}
            className="hidden md:inline-flex rounded-full"
            aria-label={
              dark
                ? locale === "pt" ? "Ativar modo claro" : "Switch to light mode"
                : locale === "pt" ? "Ativar modo escuro" : "Switch to dark mode"
            }
            aria-pressed={dark}
          >
            {dark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </Button>

          {/* Install app */}
          <InstallButton />

          {/* Cart */}
          <Link
            to="/cart"
            className="relative"
            aria-label={
              totalItems > 0
                ? locale === "pt"
                  ? `Carrinho com ${totalItems} ${totalItems === 1 ? "item" : "itens"}`
                  : `Cart with ${totalItems} ${totalItems === 1 ? "item" : "items"}`
                : locale === "pt" ? "Carrinho vazio" : "Empty cart"
            }
          >
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" tabIndex={-1} aria-hidden="true">
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            </Button>
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/profile" aria-label={locale === "pt" ? "Meu perfil" : "My profile"}>
                <Button variant="ghost" size="icon" className="rounded-full" tabIndex={-1}>
                  <User className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {t("nav.signOut")}
              </Button>
            </div>
          ) : (
            <Link to="/auth" aria-label={t("nav.signIn")}>
              <Button variant="default" size="sm" className="hidden md:inline-flex">
                {t("nav.signIn")}
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen
                ? locale === "pt" ? "Fechar menu" : "Close menu"
                : locale === "pt" ? "Abrir menu" : "Open menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

          {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-background p-4 space-y-2">
          {links.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`block px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
            {t("nav.cart")} {totalItems > 0 && `(${totalItems})`}
          </Link>
          <div className="flex items-center gap-2 px-2 pt-2 border-t border-border mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocale(locale === "en" ? "pt" : "en")}
              className="flex-1 gap-2"
              aria-label={locale === "en" ? "Mudar idioma para Português" : "Switch language to English"}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-bold uppercase">{locale}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDark(!dark)}
              className="flex-1 gap-2"
              aria-label={
                dark
                  ? locale === "pt" ? "Ativar modo claro" : "Switch to light mode"
                  : locale === "pt" ? "Ativar modo escuro" : "Switch to dark mode"
              }
              aria-pressed={dark}
            >
              {dark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
              <span className="text-xs">
                {dark
                  ? locale === "pt" ? "Claro" : "Light"
                  : locale === "pt" ? "Escuro" : "Dark"}
              </span>
            </Button>
          </div>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
                {t("nav.myAccount")}
              </Link>
              <Button variant="default" size="sm" className="w-full mt-2" onClick={handleSignOut}>
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMenuOpen(false)} aria-label={t("nav.signIn")}>
              <Button variant="default" size="sm" className="w-full mt-2">
                {t("nav.signIn")}
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
