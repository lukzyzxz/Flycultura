import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plane, Sun, Moon, Menu, X, LogOut, Globe, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container relative flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <Plane className="h-6 w-6 text-primary" />
          <span className="text-gradient">FlyCultura</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocale(locale === "en" ? "pt" : "en")}
            className="rounded-full text-xs font-bold"
            title={locale === "en" ? "Mudar para Português" : "Switch to English"}
          >
            <Globe className="h-4 w-4" />
          </Button>
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            {locale}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(!dark)}
            className="rounded-full"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingCart className="h-4 w-4" />
            </Button>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1">
                <LogOut className="h-4 w-4" />
                {t("nav.signOut")}
              </Button>
            </div>
          ) : (
            <Link to="/auth">
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
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
            {t("nav.cart")} {totalItems > 0 && `(${totalItems})`}
          </Link>
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
            <Link to="/auth" onClick={() => setMenuOpen(false)}>
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
