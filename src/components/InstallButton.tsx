import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-ignore iOS Safari
    window.navigator.standalone === true);

const isIOS = () =>
  typeof navigator !== "undefined" &&
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !/CriOS|FxiOS|EdgiOS/i.test(navigator.userAgent);

const InstallButton = () => {
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

  if (installed) return null;
  // Show only when we have a native prompt (Android/desktop Chromium) or on iOS (instructions page)
  if (!deferred && !ios) return null;

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
    }
  };

  const label = locale === "pt" ? "Baixar app" : "Install app";
  const ariaLabel = locale === "pt" ? "Baixar o aplicativo FlyCultura" : "Install FlyCultura app";

  // iOS: navigate to /install for instructions
  if (!deferred && ios) {
    return (
      <Link to="/install" aria-label={ariaLabel}>
        {/* Mobile: icon only */}
        <Button variant="ghost" size="icon" className="rounded-full md:hidden" tabIndex={-1}>
          <Download className="h-4 w-4" aria-hidden="true" />
        </Button>
        {/* Desktop: icon + label */}
        <Button variant="default" size="sm" className="hidden md:inline-flex gap-2" tabIndex={-1}>
          <Download className="h-4 w-4" aria-hidden="true" />
          {label}
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className="rounded-full md:hidden"
        aria-label={ariaLabel}
        title={label}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={handleClick}
        className="hidden md:inline-flex gap-2"
        aria-label={ariaLabel}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {label}
      </Button>
    </>
  );
};

export default InstallButton;
