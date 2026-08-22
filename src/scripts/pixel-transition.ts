/**
 * pixel-transition.ts - Single-tone Lavender Pixel Dissolve Page Transition.
 *
 * Smooth diagonal wave using signature Lavender tone oklch(0.795 0.11 300).
 * Hooks into Astro's <ClientRouter /> with fail-safe error handling.
 */

const COLS = 14;
const ROWS = 9;
const COVER_DURATION = 400;    // ms to cover the screen
const DISSOLVE_DURATION = 400; // ms to dissolve away

/** Signature Lavender tones matching design system */
const TONES = [
  "oklch(0.795 0.11 300)",
  "oklch(0.795 0.11 300 / 90%)",
  "oklch(0.795 0.11 300 / 80%)",
] as const;

function pickColor(i: number): string {
  return TONES[(i * 7 + ((i * i) % 5)) % TONES.length]!;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── State ────────────────────────────────────────────────────────────
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;
let isInitialized = false;

function init() {
  if (isInitialized) return;
  isInitialized = true;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  // Create persistent canvas overlay attached to documentElement
  canvas = document.createElement("canvas");
  canvas.id = "pixel-transition-canvas";
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    pointer-events: none;
    width: 100vw;
    height: 100vh;
    visibility: hidden;
  `;
  document.documentElement.appendChild(canvas);
  ctx = canvas.getContext("2d");

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  }
  resize();
  window.addEventListener("resize", resize);

  prefersReducedMotion.addEventListener("change", (e) => {
    if (e.matches && canvas) {
      canvas.style.visibility = "hidden";
    }
  });

  // ─── Lifecycle hooks ──────────────────────────────────────────────
  document.addEventListener("astro:before-preparation", (e: any) => {
    if (prefersReducedMotion.matches) return;
    if (!canvas || !ctx) return;
    const originalLoader = e.loader;

    e.loader = async () => {
      try {
        canvas.style.visibility = "visible";
        await Promise.race([
          animateCoverPromise(),
          new Promise((r) => setTimeout(r, COVER_DURATION + 100)),
        ]);
      } catch {
        // Ignore animation error
      } finally {
        await originalLoader();
      }
    };
  });

  document.addEventListener("astro:after-swap", () => {
    if (prefersReducedMotion.matches) return;
    if (!canvas || !ctx) return;
    animateDissolve();
  });

  // Safety net: always hide canvas on page load completion
  document.addEventListener("astro:page-load", () => {
    if (canvas && ctx) {
      canvas.style.visibility = "hidden";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
}

function animateCoverPromise(): Promise<void> {
  return new Promise((resolve) => {
    if (!canvas || !ctx) {
      resolve();
      return;
    }

    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    const w = canvas.width;
    const h = canvas.height;
    const cellW = w / COLS;
    const cellH = h / ROWS;
    const total = COLS * ROWS;
    const maxDiag = COLS + ROWS - 2;

    const start = performance.now();

    function frame(now: number) {
      if (!ctx || !canvas) {
        resolve();
        return;
      }
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);

      let allDone = true;

      for (let i = 0; i < total; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const diagonal = col + row;
        const staggerDelay = (diagonal / maxDiag) * (COVER_DURATION * 0.5);
        const localT = Math.max(0, Math.min(1, (elapsed - staggerDelay) / (COVER_DURATION * 0.5)));

        if (localT < 1) allDone = false;

        const scale = easeOutExpo(localT);
        const cx = col * cellW + cellW / 2;
        const cy = row * cellH + cellH / 2;
        const sw = cellW * scale;
        const sh = cellH * scale;

        ctx.fillStyle = pickColor(i);
        ctx.fillRect(cx - sw / 2, cy - sh / 2, sw + 1.5, sh + 1.5);
      }

      if (!allDone) {
        animationId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < total; i++) {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          ctx.fillStyle = pickColor(i);
          ctx.fillRect(col * cellW, row * cellH, cellW + 1.5, cellH + 1.5);
        }
        animationId = null;
        resolve();
      }
    }

    animationId = requestAnimationFrame(frame);
  });
}

function animateDissolve() {
  if (!canvas || !ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const cellW = w / COLS;
  const cellH = h / ROWS;
  const total = COLS * ROWS;
  const maxDiag = COLS + ROWS - 2;

  const start = performance.now();

  function frame(now: number) {
    if (!ctx || !canvas) return;
    const elapsed = now - start;
    ctx.clearRect(0, 0, w, h);

    let allDone = true;

    for (let i = 0; i < total; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const diagonal = col + row;
      const staggerDelay = (diagonal / maxDiag) * (DISSOLVE_DURATION * 0.5);
      const localT = Math.max(0, Math.min(1, (elapsed - staggerDelay) / (DISSOLVE_DURATION * 0.5)));

      if (localT < 1) allDone = false;

      const scale = 1 - easeInOutCubic(localT);
      if (scale <= 0.001) continue;

      const cx = col * cellW + cellW / 2;
      const cy = row * cellH + cellH / 2;
      const sw = cellW * scale;
      const sh = cellH * scale;

      ctx.fillStyle = pickColor(i);
      ctx.fillRect(cx - sw / 2, cy - sh / 2, sw + 1.5, sh + 1.5);
    }

    if (!allDone) {
      animationId = requestAnimationFrame(frame);
    } else {
      canvas!.style.visibility = "hidden";
      ctx!.clearRect(0, 0, w, h);
      animationId = null;
    }
  }

  animationId = requestAnimationFrame(frame);
}

init();
