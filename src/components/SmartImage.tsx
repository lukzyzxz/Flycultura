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

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  category?: SmartImageCategory;
  wrapperClassName?: string;
  showSkeleton?: boolean;
  /** When true, eagerly load and prioritize (use for above-the-fold hero images). */
  priority?: boolean;
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
  ...rest
}: SmartImageProps) => {
  // Dev-time warning: catch missing alt early (WCAG 1.1.1)
  if (process.env.NODE_ENV !== "production" && alt === undefined) {
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
        src={currentSrc}
        alt={alt}
        loading={effectiveLoading}
        decoding="async"
        // @ts-expect-error – fetchpriority is valid HTML but not in React types yet
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={cn(
          className,
          "transition-opacity duration-300 ease-out",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
};

export default SmartImage;
