import { useEffect, useState } from "react";
import { Download, Share, Plus, Smartphone, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { useI18n } from "@/lib/i18n";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const isIOS = () =>
  typeof navigator !== "undefined" &&
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !/CriOS|FxiOS|EdgiOS/i.test(navigator.userAgent);

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-ignore iOS Safari
    window.navigator.standalone === true);

const Install = () => {
  const { locale } = useI18n();
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone());
  const ios = isIOS();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferred(null);
  };

  const t = (pt: string, en: string) => (locale === "pt" ? pt : en);

  return (
    <div className="min-h-screen">
      <section className="container py-14 md:py-20 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Download className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {t("Instale o FlyCultura", "Install FlyCultura")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t(
              "Use o app direto do seu celular ou computador, sem abrir o navegador. Funciona offline em telas básicas.",
              "Use the app right from your phone or desktop — no browser tab needed. Works offline on basic screens.",
            )}
          </p>
        </div>

        {installed ? (
          <Card className="p-6 text-center border-primary/40 bg-primary/5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
              <Check className="h-6 w-6" />
            </div>
            <h2 className="font-semibold text-lg mb-1">
              {t("App já instalado!", "App already installed!")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(
                "Você está usando o FlyCultura como aplicativo. Bom proveito!",
                "You're using FlyCultura as an app. Enjoy!",
              )}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Desktop / Android Chrome / Edge */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">
                  {t("Desktop e Android", "Desktop & Android")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  "Chrome, Edge, Brave ou Opera. Clique abaixo para instalar.",
                  "Chrome, Edge, Brave or Opera. Click below to install.",
                )}
              </p>
              <Button
                onClick={triggerInstall}
                disabled={!deferred}
                className="w-full gap-2"
                size="lg"
              >
                <Download className="h-4 w-4" />
                {deferred
                  ? t("Instalar agora", "Install now")
                  : t("Aguarde o prompt do navegador…", "Waiting for browser prompt…")}
              </Button>
              {!deferred && (
                <p className="text-xs text-muted-foreground mt-3">
                  {t(
                    "Se o botão não ativar, abra o menu do navegador (⋮) e escolha “Instalar app” ou “Adicionar à tela inicial”.",
                    'If the button stays disabled, open the browser menu (⋮) and pick "Install app" or "Add to Home screen".',
                  )}
                </p>
              )}
            </Card>

            {/* iOS */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">{t("iPhone e iPad", "iPhone & iPad")}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  "No Safari, siga 3 passos rápidos:",
                  "In Safari, follow 3 quick steps:",
                )}
              </p>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    1
                  </span>
                  <span className="flex items-center gap-1">
                    {t("Toque em", "Tap")}{" "}
                    <Share className="inline h-4 w-4" />{" "}
                    {t("Compartilhar", "Share")}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    2
                  </span>
                  <span className="flex items-center gap-1">
                    {t("Escolha", "Choose")}{" "}
                    <Plus className="inline h-4 w-4" />{" "}
                    {t('"Adicionar à Tela de Início"', '"Add to Home Screen"')}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    3
                  </span>
                  <span>{t('Toque em "Adicionar"', 'Tap "Add"')}</span>
                </li>
              </ol>
              {ios && (
                <p className="text-xs text-primary mt-4 font-medium">
                  {t(
                    "Detectamos que você está no iOS — siga os passos acima.",
                    "We detected you're on iOS — follow the steps above.",
                  )}
                </p>
              )}
            </Card>
          </div>
        )}

        <div className="mt-10 text-center text-xs text-muted-foreground">
          {t(
            "Dica: o app instalado abre em tela cheia, sem barras do navegador.",
            "Tip: the installed app opens in full screen, without browser bars.",
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Install;
