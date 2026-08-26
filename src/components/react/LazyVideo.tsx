import React, { useState, useEffect, useRef } from "react";
import { ResponsiveImage } from "@/components/react/ResponsiveImage";
import { getMediaUrl } from "@/lib/media";

interface ProjectMediaShowcaseProps {
  imageSrc: string;
  videoSrc?: string;
  alt: string;
  className?: string;
  widths?: number[];
  sizes?: string;
  eager?: boolean;
}

/**
 * Responsive Cloudflare preview image + Lazy Video progressive enhancement.
 * - Initial Visual: Cloudflare-delivered responsive <img> (480w, 720w, 960w).
 * - Video: Deferred via IntersectionObserver; mounted only when scrolled near.
 */
export function ProjectMediaShowcase({
  imageSrc,
  videoSrc,
  alt,
  className = "size-full object-cover",
  widths = [480, 720, 960],
  sizes = "(min-width: 1024px) 45vw, calc(100vw - 32px)",
  eager = false,
}: ProjectMediaShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    if (!videoSrc) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [videoSrc]);

  const cleanVideoUrl = videoSrc ? getMediaUrl(videoSrc) : "";

  return (
    <div ref={containerRef} className="relative size-full overflow-hidden">
      {/* 1. Initial visual: Responsive Cloudflare Image */}
      <ResponsiveImage
        src={imageSrc}
        widths={widths}
        sizes={sizes}
        width={712}
        height={400}
        quality={85}
        fit="cover"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        alt={alt}
        className={`${className} ${isVideoReady ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
      />

      {/* 2. Progressive enhancement: Video mounts & plays on scroll */}
      {videoSrc && shouldLoadVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlay={() => setIsVideoReady(true)}
          className={`absolute inset-0 ${className} ${isVideoReady ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
        >
          <source src={cleanVideoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

export { ProjectMediaShowcase as LazyVideo };
