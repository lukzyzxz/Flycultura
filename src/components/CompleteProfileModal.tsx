// Forces any logged-in user without a saved home airport to choose one.
// Triggered automatically (e.g. after Google OAuth sign-up where no signup
// form was shown). Cannot be dismissed without selecting an airport.
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { AIRPORT_OPTIONS, getHomeAirport, setHomeAirport } from "@/lib/userOrigin";

const CompleteProfileModal = () => {
  const { user, loading } = useAuth();
  const { locale } = useI18n();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [airport, setAirport] = useState("");

  // When user logs in, check if their profile has a home airport.
  // If not, force the modal open until they pick one.
  useEffect(() => {
    if (loading || !user) {
      setOpen(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setChecking(true);
      try {
        const { data } = await supabase
          .from("profiles")
          .select("home_airport")
          .eq("user_id", user.id)
          .maybeSingle();
        if (cancelled) return;
        if (data?.home_airport) {
          setHomeAirport(data.home_airport);
          setOpen(false);
        } else {
          // No airport saved server-side; ignore any stale localStorage value
          // and ask again.
          setOpen(true);
        }
      } catch (e) {
        console.warn("[CompleteProfile] check failed:", e);
        // If we can't verify and there's no local value, ask anyway.
        if (!getHomeAirport()) setOpen(true);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  const handleSave = async () => {
    if (!user || !airport) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { user_id: user.id, home_airport: airport },
          { onConflict: "user_id" },
        );
      if (error) throw error;
      setHomeAirport(airport);
      toast({
        title: locale === "pt" ? "Perfil atualizado" : "Profile updated",
        description: locale === "pt"
          ? "Seu aeroporto de origem foi salvo."
          : "Your home airport has been saved.",
      });
      setOpen(false);
    } catch (e: any) {
      toast({
        title: locale === "pt" ? "Erro ao salvar" : "Could not save",
        description: e?.message || String(e),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (checking || !user) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Block closing without a selection — this is required for full access.
        if (!next && !airport) return;
        setOpen(next);
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
            {locale === "pt" ? "Complete seu perfil" : "Complete your profile"}
          </DialogTitle>
          <DialogDescription>
            {locale === "pt"
              ? "Para personalizar suas buscas, escolha o aeroporto mais próximo de você. Ele será usado como origem padrão nas suas viagens."
              : "To personalize your searches, pick the airport closest to you. It will be used as the default origin for your trips."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <label htmlFor="complete-airport" className="text-sm font-medium">
            {locale === "pt" ? "Aeroporto mais próximo" : "Nearest airport"}
          </label>
          <select
            id="complete-airport"
            value={airport}
            onChange={(e) => setAirport(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">
              {locale === "pt" ? "Selecione seu aeroporto" : "Select your airport"}
            </option>
            {AIRPORT_OPTIONS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.city} ({a.code})
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleSave}
          disabled={!airport || saving}
          className="w-full h-11 font-semibold"
        >
          {saving
            ? "..."
            : locale === "pt"
              ? "Salvar e continuar"
              : "Save and continue"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileModal;