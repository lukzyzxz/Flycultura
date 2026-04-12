import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MailX, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "done" | "error">("loading");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then(r => r.json())
      .then(d => setStatus(d.valid ? "valid" : "invalid"))
      .catch(() => setStatus("error"));
  }, [token]);

  const handleUnsubscribe = async () => {
    setProcessing(true);
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
      setStatus(data?.success ? "done" : "error");
    } catch { setStatus("error"); }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full rounded-xl bg-card card-shadow p-8 text-center space-y-4">
        {status === "loading" && <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />}
        {status === "valid" && (
          <>
            <MailX className="h-12 w-12 text-primary mx-auto" />
            <h1 className="font-display text-xl font-bold text-foreground">Cancelar inscrição</h1>
            <p className="text-muted-foreground text-sm">Deseja cancelar o recebimento de emails da FlyCultura?</p>
            <Button onClick={handleUnsubscribe} disabled={processing} className="w-full">
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirmar cancelamento
            </Button>
          </>
        )}
        {status === "done" && (
          <>
            <CheckCircle className="h-12 w-12 text-primary mx-auto" />
            <h1 className="font-display text-xl font-bold text-foreground">Inscrição cancelada</h1>
            <p className="text-muted-foreground text-sm">Você não receberá mais emails promocionais.</p>
          </>
        )}
        {(status === "invalid" || status === "error") && (
          <>
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="font-display text-xl font-bold text-foreground">Link inválido</h1>
            <p className="text-muted-foreground text-sm">Este link expirou ou já foi utilizado.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
