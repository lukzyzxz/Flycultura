import { useState, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { logImageError } from "@/lib/imageErrorLog";

export type SmartImageCategory = "event" | "destination" | "deal" | "blog" | "generic";

const FALLBACKS: Record<SmartImageCategory, string> = {
  event:
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&auto=format&fit=crop",
  destination:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop",
  deal:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop",
  blog:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop",
  generic: "/placeholder.svg",
};

const LOCAL_FALLBACK = "/placeholder.svg";

/**
 * For Unsplash URLs we can request multiple sizes cheaply by overriding
 * the `w` query param. We build a srcset so the browser only downloads
 * the size that actually fits the layout slot.
 */
const UNSPLASH_WIDTHS = [400, 600, 900, 1200] as const;

const isUnsplash = (url: string) =>
  typeof url === "string" && url.includes("images.unsplash.com");

const withUnsplashWidth = (url: string, w: number) => {
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(w));
    // Lower quality = much smaller files, still looks great for cards
    u.searchParams.set("q", u.searchParams.get("q") ?? "60");
    u.searchParams.set("auto", "format");
    u.searchParams.set("fit", u.searchParams.get("fit") ?? "crop");
    return u.toString();
  } catch {
    return url;
  }
};

const buildSrcSet = (url: string) =>
  UNSPLASH_WIDTHS.map((w) => `${withUnsplashWidth(url, w)} ${w}w`).join(", ");

/**
 * Map of locally-bundled responsive variants for /src/assets/events/*.webp.
 * For each base file (e.g. `el-clasico.webp`) we look up `el-clasico-480.webp`,
 * `el-clasico-800.webp`, `el-clasico-1280.webp` and build a srcSet so mobile
 * devices download a tiny ~480w file instead of the full image.
 */
const LOCAL_VARIANT_WIDTHS = [480, 800, 1280] as const;
const localVariantModules = import.meta.glob(
  "/src/assets/events/*-{480,800,1280}.webp",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const localVariantBySize: Record<string, Record<number, string>> = {};
for (const [path, url] of Object.entries(localVariantModules)) {
  const match = path.match(/\/([^/]+?)-(480|800|1280)\.webp$/);
  if (!match) continue;
  const baseName = match[1];
  const w = Number(match[2]);
  (localVariantBySize[baseName] ||= {})[w] = url;
}

const getLocalBaseName = (url: string): string | null => {
  const m = url.match(/\/assets\/events\/([^/]+?)(?:-(?:480|800|1280))?\.[a-z0-9]+\.webp$/i)
    || url.match(/\/assets\/events\/([^/]+?)(?:-(?:480|800|1280))?\.webp$/i);
  return m ? m[1] : null;
};

const buildLocalSrcSet = (url: string): string | undefined => {
  const base = getLocalBaseName(url);
  if (!base) return undefined;
  const variants = localVariantBySize[base];
  if (!variants) return undefined;
  const parts = LOCAL_VARIANT_WIDTHS
    .map((w) => (variants[w] ? `${variants[w]} ${w}w` : null))
    .filter(Boolean) as string[];
  return parts.length >= 2 ? parts.join(", ") : undefined;
};

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  category?: SmartImageCategory;
  wrapperClassName?: string;
  showSkeleton?: boolean;
  /** When true, eagerly load and prioritize (use for above-the-fold hero images). */
  priority?: boolean;
  /** Hint for responsive images. Defaults to a sensible card layout sizing. */
  sizes?: string;
}

const SmartImage = ({
  src,
  alt,
  category = "generic",
  className,
  wrapperClassName,
  showSkeleton = true,
  loading,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  ...rest
}: SmartImageProps) => {
  // Dev-time warning: catch missing alt early (WCAG 1.1.1)
  if (import.meta.env.DEV && alt === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      "[SmartImage] Missing `alt` prop. Use alt=\"\" only for purely decorative images.",
      { src, category },
    );
  }

  // Guard against missing/invalid src (e.g. broken import) — start at fallback immediately.
  const isValidSrc = typeof src === "string" && src.trim().length > 0;
  const initialSrc = isValidSrc ? src : FALLBACKS[category];
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [errorStage, setErrorStage] = useState<0 | 1 | 2>(isValidSrc ? 0 : 1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const valid = typeof src === "string" && src.trim().length > 0;
    setCurrentSrc(valid ? src : FALLBACKS[category]);
    setErrorStage(valid ? 0 : 1);
    setLoaded(false);
    if (!valid && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[SmartImage] Empty/invalid src — using fallback.", { category, alt });
    }
  }, [src, category, alt]);

  const handleError = () => {
    if (errorStage === 0) {
      logImageError({
        src,
        category,
        page: typeof window !== "undefined" ? window.location.pathname : "unknown",
      });
      setErrorStage(1);
      setCurrentSrc(FALLBACKS[category]);
    } else if (errorStage === 1) {
      setErrorStage(2);
      setCurrentSrc(LOCAL_FALLBACK);
    }
  };

  const effectiveLoading = loading ?? (priority ? "eager" : "lazy");

  const useResponsive = isUnsplash(currentSrc);
  const responsiveSrcSet = useResponsive ? buildSrcSet(currentSrc) : undefined;
  const responsiveSrc = useResponsive
    ? withUnsplashWidth(currentSrc, priority ? 900 : 400)
    : currentSrc;

  // Local /src/assets/events responsive variants
  const localSrcSet = !useResponsive ? buildLocalSrcSet(currentSrc) : undefined;
  const finalSrcSet = responsiveSrcSet ?? localSrcSet;
  const finalSizes = (responsiveSrcSet || localSrcSet) ? sizes : undefined;

  return (
    <div className={cn("relative w-full h-full overflow-hidden", wrapperClassName)}>
      {showSkeleton && !loaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        {...rest}
        src={responsiveSrc}
        srcSet={finalSrcSet}
        sizes={finalSizes}
        alt={alt}
        loading={effectiveLoading}
        decoding="async"
        // @ts-expect-error – fetchpriority is valid HTML but not in React types yet
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={cn(
          className,
          "transition-opacity duration-200 ease-out",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
};

export default SmartImage;
