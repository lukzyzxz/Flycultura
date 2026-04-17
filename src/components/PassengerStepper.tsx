import { Minus, Plus, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface PassengerStepperProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}

const PassengerStepper = ({ value, onChange, min = 1, max = 9 }: PassengerStepperProps) => {
  const { locale } = useI18n();
  const safeValue = Math.min(Math.max(value, min), max);

  const dec = () => onChange(Math.max(min, safeValue - 1));
  const inc = () => onChange(Math.min(max, safeValue + 1));

  const label =
    locale === "pt"
      ? `${safeValue} ${safeValue === 1 ? "adulto" : "adultos"}`
      : `${safeValue} ${safeValue === 1 ? "adult" : "adults"}`;

  return (
    <div
      className="flex h-10 w-full items-center rounded-md border border-input bg-background px-2 gap-1"
      role="group"
      aria-label={locale === "pt" ? "Número de adultos" : "Number of adults"}
    >
      <Users className="h-4 w-4 text-muted-foreground shrink-0 ml-1" aria-hidden="true" />
      <button
        type="button"
        onClick={dec}
        disabled={safeValue <= min}
        aria-label={locale === "pt" ? "Remover adulto" : "Remove adult"}
        className="h-7 w-7 rounded-md flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className="flex-1 text-center text-sm font-medium text-foreground select-none"
        aria-live="polite"
      >
        {label}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={safeValue >= max}
        aria-label={locale === "pt" ? "Adicionar adulto" : "Add adult"}
        className="h-7 w-7 rounded-md flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default PassengerStepper;
