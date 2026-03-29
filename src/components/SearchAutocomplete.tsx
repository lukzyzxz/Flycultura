import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { destinations } from "@/lib/data";
import { eventPackages } from "@/lib/events-data";
import { useI18n } from "@/lib/i18n";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

const SearchAutocomplete = ({ value, onChange, placeholder }: Props) => {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ label: string; sub: string }[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const { locale } = useI18n();

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

  return (
    <div ref={ref} className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        className="pl-9"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg card-shadow border border-border z-30 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2.5 hover:bg-muted transition-colors flex items-center gap-2"
              onClick={() => {
                onChange(s.label);
                setOpen(false);
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
