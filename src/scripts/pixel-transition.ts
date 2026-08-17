/**
 * pixel-transition.ts — Vanilla JS pixel dissolve page transition.
 *
 * Hooks into Astro's <ClientRouter /> lifecycle:
 *   astro:before-swap  → dissolve-out (cover the old page)
 *   astro:after-swap   → dissolve-in  (reveal the new page)
 *
 * This script runs ONCE and persists across soft navigations.
 * It must NOT re-initialize on each swap — Astro's <ClientRouter />
 * keeps <script> tags alive, which is the desired behaviour.
 *
 * Graceful no-op: if the browser doesn't support View Transitions
 * (and thus ClientRouter falls back to MPA navigation), the script
 * simply doesn't fire because the astro:* events never trigger.
 */

const COLS = 14;
const ROWS = 9;
const COVER_DURATION = 350;    // ms to cover the screen
const HOLD_DURATION = 400;     // ms the grid stays fully covered
const DISSOLVE_DURATION = 400; // ms to dissolve away

/** Lavender tones matching the design system. */
const TONES = [
  "oklch(0.795 0.11 300)",       // --tone-lavender
  "oklch(0.795 0.11 300 / 85%)",
  "oklch(0.795 0.11 300 / 70%)",
] as const;

/** Deterministic pseudo-random — matches pixel.tsx pick(). */
function pick(i: number): string {
  return TONES[(i * 7 + ((i * i) % 5)) % TONES.length]!;
}

/** Easing: cubic-bezier(0.22, 1, 0.36, 1) sampled. */
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

/** Guard: only set up listeners once. */
function init() {
  if (isInitialized) return;
  isInitialized = true;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  // Create persistent canvas overlay
  canvas = document.createElement("canvas");
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 90;
    pointer-events: none;
    width: 100vw;
    height: 100vh;
    visibility: hidden;
  `;
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  // Resize canvas to match viewport
  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  }
  resize();
  window.addEventListener("resize", resize);

  // Listen for reduced motion changes
  prefersReducedMotion.addEventListener("change", (e) => {
    if (e.matches && canvas) {
      canvas.style.visibility = "hidden";
    }
  });

  // ─── Lifecycle hooks ──────────────────────────────────────────────
  document.addEventListener("astro:before-swap", handleBeforeSwap);
  document.addEventListener("astro:after-swap", handleAfterSwap);
}

function handleBeforeSwap() {
  if (!canvas || !ctx) return;

  // Cancel any running animation
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  canvas.style.visibility = "visible";
  animateCover();
}

function handleAfterSwap() {
  // After hold, dissolve away
  window.setTimeout(() => {
    animateDissolve();
  }, HOLD_DURATION);
}

/** Cover animation: blocks scale from 0 → 1 with diagonal stagger. */
function animateCover() {
  if (!canvas || !ctx) return;

  const dpr = window.devicePixelRatio;
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
      const staggerDelay = (diagonal / maxDiag) * (COVER_DURATION * 0.6);
      const localT = Math.max(0, Math.min(1, (elapsed - staggerDelay) / (COVER_DURATION * 0.6)));

      if (localT < 1) allDone = false;

      const scale = easeOutExpo(localT);
      const cx = col * cellW + cellW / 2;
      const cy = row * cellH + cellH / 2;
      const sw = cellW * scale;
      const sh = cellH * scale;

      ctx.fillStyle = pick(i);
      ctx.fillRect(cx - sw / 2, cy - sh / 2, sw, sh);
    }

    if (!allDone) {
      animationId = requestAnimationFrame(frame);
    } else {
      // Fully covered — draw final state
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < total; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        ctx.fillStyle = pick(i);
        ctx.fillRect(col * cellW, row * cellH, cellW + 1, cellH + 1);
      }
      animationId = null;
    }
  }

  animationId = requestAnimationFrame(frame);
}

/** Dissolve animation: blocks scale from 1 → 0 with diagonal stagger. */
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
      const staggerDelay = (diagonal / maxDiag) * (DISSOLVE_DURATION * 0.6);
      const localT = Math.max(0, Math.min(1, (elapsed - staggerDelay) / (DISSOLVE_DURATION * 0.6)));

      if (localT < 1) allDone = false;

      const scale = 1 - easeInOutCubic(localT);
      if (scale <= 0.001) continue;

      const cx = col * cellW + cellW / 2;
      const cy = row * cellH + cellH / 2;
      const sw = cellW * scale;
      const sh = cellH * scale;

      ctx.fillStyle = pick(i);
      ctx.fillRect(cx - sw / 2, cy - sh / 2, sw, sh);
    }

    if (!allDone) {
      animationId = requestAnimationFrame(frame);
    } else {
      // Fully dissolved — hide canvas
      canvas!.style.visibility = "hidden";
      ctx!.clearRect(0, 0, w, h);
      animationId = null;
    }
  }

  animationId = requestAnimationFrame(frame);
}

// ─── Bootstrap ────────────────────────────────────────────────────────
// Run init() exactly once.
init();
