import { useI18n } from "@/lib/i18n";

/**
 * Skip-to-content link for keyboard/screen-reader users (WCAG 2.4.1).
 * Hidden visually until it receives focus.
 */
const SkipLink = () => {
  const { locale } = useI18n();
  return (
    <a href="#main-content" className="skip-link">
      {locale === "pt" ? "Pular para o conteúdo principal" : "Skip to main content"}
    </a>
  );
};

export default SkipLink;