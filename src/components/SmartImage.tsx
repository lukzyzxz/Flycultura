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

  const [currentSrc, setCurrentSrc] = useState(src);
  const [errorStage, setErrorStage] = useState<0 | 1 | 2>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setErrorStage(0);
    setLoaded(false);
  }, [src]);

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
        srcSet={responsiveSrcSet}
        sizes={useResponsive ? sizes : undefined}
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
