/**
 * Centralized Cloudflare Media CDN & Image Resizing Helper Utilities.
 */

const MEDIA_BASE_URL =
  (typeof process !== "undefined" && process.env.PUBLIC_MEDIA_BASE_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.PUBLIC_MEDIA_BASE_URL) ||
  "";

const ENABLE_CF_IMAGE_RESIZING =
  (typeof process !== "undefined" && process.env.PUBLIC_ENABLE_CF_IMAGE_RESIZING === "true") ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.PUBLIC_ENABLE_CF_IMAGE_RESIZING === "true") ||
  false;

interface CloudflareImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fit?: string;
}

/**
 * Resolves absolute media URL from R2 bucket CDN or local static server.
 * E.g. /hero/illustration.webp -> https://media.rohitgautam.site/hero/illustration.webp
 */
export function getMediaUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return MEDIA_BASE_URL ? `${MEDIA_BASE_URL}${cleanPath}` : cleanPath;
}

/**
 * Generates Cloudflare Image Resizing URL (/cdn-cgi/image/...) if enabled,
 * or returns clean R2 media URL directly.
 */
export function getCloudflareImageUrl(path: string, options: CloudflareImageOptions = {}): string {
  if (!path) return "";

  if (
    !ENABLE_CF_IMAGE_RESIZING ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.endsWith(".mp4") ||
    path.endsWith(".webm") ||
    path.endsWith(".svg") ||
    path.endsWith(".pdf")
  ) {
    return getMediaUrl(path);
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const quality = options.quality ?? 85;
  const format = options.format ?? "auto";
  const fit = options.fit ?? "cover";

  const params: string[] = [`format=${format}`, `quality=${quality}`, `fit=${fit}`];

  if (options.width) {
    params.push(`width=${options.width}`);
  }
  if (options.height) {
    params.push(`height=${options.height}`);
  }

  const transformationStr = params.join(",");
  const transformPath = `/cdn-cgi/image/${transformationStr}${cleanPath}`;
  return MEDIA_BASE_URL ? `${MEDIA_BASE_URL}${transformPath}` : transformPath;
}

/**
 * Generates multi-candidate srcset string using Cloudflare Image Resizing,
 * or falls back cleanly to the primary R2 URL when transformations are disabled.
 */
export function getCloudflareSrcSet(
  path: string,
  widths: number[],
  options: Omit<CloudflareImageOptions, "width"> = {}
): string {
  if (!path || !widths || widths.length === 0) return "";
  if (!ENABLE_CF_IMAGE_RESIZING) {
    return `${getMediaUrl(path)}`;
  }
  return widths
    .map((w) => `${getCloudflareImageUrl(path, { ...options, width: w })} ${w}w`)
    .join(", ");
}
