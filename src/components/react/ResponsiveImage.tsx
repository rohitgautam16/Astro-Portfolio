import React from "react";
import { getCloudflareImageUrl, getCloudflareSrcSet } from "@/lib/media";

export interface ResponsiveImageProps {
  src: string;
  widths?: number[];
  sizes?: string;
  width?: number;
  height?: number;
  quality?: number;
  fit?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "async" | "sync" | "auto";
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable ResponsiveImage component delivering Cloudflare Image Resizing variants
 * via auto-generated srcset + sizes attributes.
 */
export function ResponsiveImage({
  src,
  widths = [480, 720, 960],
  sizes = "(min-width: 1024px) 45vw, calc(100vw - 32px)",
  width,
  height,
  quality = 85,
  fit = "cover",
  loading = "lazy",
  fetchPriority,
  decoding = "async",
  alt = "",
  className = "",
  style,
}: ResponsiveImageProps) {
  // Use candidate width matching sizes or middle width as fallback src
  const fallbackWidth = widths.length > 1 ? widths[1]! : widths[0] ?? width;
  const defaultSrc = getCloudflareImageUrl(src, { width: fallbackWidth, height, quality, fit });
  const srcSet = getCloudflareSrcSet(src, widths, { height, quality, fit });

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      alt={alt}
      className={className}
      style={style}
    />
  );
}
