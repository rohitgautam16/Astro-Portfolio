import React, { useState, useEffect, useRef } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  eager?: boolean;
}

export function LazyVideo({ src, poster, className, eager = false }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (eager) return;
    const node = videoRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={poster}
      preload={shouldLoad ? "metadata" : "none"}
      autoPlay={shouldLoad}
      loop
      muted
      playsInline
      className={className}
    />
  );
}
