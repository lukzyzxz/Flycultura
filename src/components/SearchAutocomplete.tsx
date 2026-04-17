import { useState, useRef, useEffect, useMemo } from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { destinations } from "@/lib/data";
import { eventPackages } from "@/lib/events-data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

const SearchAutocomplete = ({ value, onChange, placeholder }: Props) => {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [suggestions, setSuggestions] = useState<{ label: string; sub: string }[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const { locale } = useI18n();

  // Pre-build the searchable index of all known terms (for unknown-input detection)
  const knownTerms = useMemo(() => {
    const terms: string[] = [];
    destinations.forEach((d) => {
      terms.push(d.name.toLowerCase(), d.country.toLowerCase(), ...d.tags);
    });
    eventPackages.forEach((p) => {
      terms.push(
        p.location.toLowerCase(),
        p.country.toLowerCase(),
        p.countryEn.toLowerCase(),
        p.event.toLowerCase(),
        p.eventEn.toLowerCase(),
        ...p.tags,
      );
    });
    return terms;
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }
    const q = value.toLowerCase();
    const destSugg = destinations
      .filter((d) => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q)))
      .slice(0, 4)
      .map((d) => ({ label: d.name, sub: d.country }));

    const eventSugg = eventPackages
      .filter((p) => {
        const name = locale === "pt" ? p.event : p.eventEn;
        return name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
      })
      .slice(0, 3)
      .map((p) => ({ label: locale === "pt" ? p.event : p.eventEn, sub: p.location }));

    const combined = [...destSugg, ...eventSugg].slice(0, 6);
    setSuggestions(combined);
    setOpen(combined.length > 0);
  }, [value, locale]);

  // Show warning when user has typed a term we can't find anywhere
  const isUnknown =
    touched &&
    value.trim().length >= 2 &&
    !knownTerms.some((term) => term.includes(value.toLowerCase()) || value.toLowerCase().includes(term));

  return (
    <div ref={ref} className="relative">
      <MapPin
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 z-10 transition-colors",
          isUnknown ? "text-warning" : "text-muted-foreground",
        )}
      />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTouched(true)}
        aria-invalid={isUnknown || undefined}
        className={cn(
          "pl-9",
          isUnknown && "border-warning focus-visible:ring-warning/40 pr-9",
        )}
      />
      {isUnknown && (
        <AlertTriangle
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warning z-10"
          aria-label={locale === "pt" ? "Destino não encontrado" : "Destination not found"}
        />
      )}
      {isUnknown && !open && (
        <p className="mt-1 text-xs text-warning flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {locale === "pt"
            ? "Não temos esse destino — mostraremos ofertas em destaque."
            : "We don't have that destination — featured offers will be shown."}
        </p>
      )}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg card-shadow border border-border z-30 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2.5 hover:bg-muted transition-colors flex items-center gap-2"
              onClick={() => {
                onChange(s.label);
                setOpen(false);
                setTouched(true);
              }}
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
