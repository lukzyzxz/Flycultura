import { useState, useRef, useEffect, useMemo, useId, KeyboardEvent } from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { destinations } from "@/lib/data";
import { eventPackages } from "@/lib/events-data";
import { worldCities } from "@/lib/world-cities";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  /** Value to exclude from suggestions and trigger immediate "same as other field" error. */
  excludeValue?: string;
  /** Optional accessible name for the conflicting field (e.g. "origin", "destination"). */
  excludeLabel?: string;
}

const SearchAutocomplete = ({ value, onChange, placeholder, excludeValue, excludeLabel }: Props) => {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [suggestions, setSuggestions] = useState<{ label: string; sub: string }[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const { locale } = useI18n();
  const listboxId = useId();

  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const excludeNorm = excludeValue ? norm(excludeValue) : "";
  const isSameAsExclude =
    !!excludeNorm && !!value && norm(value) === excludeNorm;

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
    worldCities.forEach((c) => {
      terms.push(c.name.toLowerCase(), c.country.toLowerCase(), ...(c.aliases || []));
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
      setActiveIndex(-1);
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

    // Cidades mundiais como fallback genérico (origem/destino global)
    const citySugg = worldCities
      .filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        (c.aliases || []).some((a) => a.includes(q)),
      )
      .slice(0, 8)
      .map((c) => ({ label: c.name, sub: c.country }));

    // Dedup por label
    const seen = new Set<string>();
    const combined = [...destSugg, ...eventSugg, ...citySugg]
      .filter((s) => {
        const k = s.label.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      // Remove the value already selected in the paired field
      .filter((s) => !excludeNorm || norm(s.label) !== excludeNorm)
      .slice(0, 10);
    setSuggestions(combined);
    setOpen(combined.length > 0);
    setActiveIndex(combined.length > 0 ? 0 : -1);
  }, [value, locale, excludeNorm]);

  // Show warning when user has typed a term we can't find anywhere
  const isUnknown =
    touched &&
    value.trim().length >= 2 &&
    !knownTerms.some((term) => term.includes(value.toLowerCase()) || value.toLowerCase().includes(term));

  const selectSuggestion = (s: { label: string; sub: string }) => {
    // Block selecting the same value as the paired field
    if (excludeNorm && norm(s.label) === excludeNorm) {
      setOpen(false);
      setTouched(true);
      return;
    }
    onChange(s.label);
    setOpen(false);
    setTouched(true);
    setActiveIndex(-1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        setOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(suggestions.length - 1);
    }
  };

  const activeOptionId =
    open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  return (
    <div ref={ref} className="relative">
      <MapPin
        aria-hidden="true"
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 z-10 transition-colors",
          isSameAsExclude
            ? "text-destructive"
            : isUnknown
              ? "text-warning"
              : "text-muted-foreground",
        )}
      />
      <Input
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTouched(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        aria-invalid={isSameAsExclude || isUnknown || undefined}
        className={cn(
          "pl-9",
          isSameAsExclude && "border-destructive focus-visible:ring-destructive/40 pr-9",
          isUnknown && "border-warning focus-visible:ring-warning/40 pr-9",
        )}
      />
      {isSameAsExclude ? (
        <AlertTriangle
          aria-hidden="true"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive z-10"
        />
      ) : isUnknown && (
        <AlertTriangle
          aria-hidden="true"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warning z-10"
        />
      )}
      {isSameAsExclude && (
        <p role="alert" className="mt-1 text-xs text-destructive flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
          {locale === "pt"
            ? `Igual ao campo ${excludeLabel || "outro"}. Escolha outra cidade.`
            : `Same as ${excludeLabel || "other"} field. Pick another city.`}
        </p>
      )}
      {!isSameAsExclude && isUnknown && !open && (
        <p role="alert" className="mt-1 text-xs text-warning flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
          {locale === "pt"
            ? "Não temos esse destino — mostraremos ofertas em destaque."
            : "We don't have that destination — featured offers will be shown."}
        </p>
      )}
      {open && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={locale === "pt" ? "Sugestões de destino" : "Destination suggestions"}
          className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg card-shadow border border-border z-30 overflow-hidden list-none p-0 m-0"
        >
          {suggestions.map((s, i) => {
            const selected = i === activeIndex;
            return (
              <li
                key={i}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(s);
                }}
                className={cn(
                  "px-3 py-2.5 cursor-pointer transition-colors flex items-center gap-2",
                  selected ? "bg-muted" : "hover:bg-muted",
                )}
              >
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchAutocomplete;
