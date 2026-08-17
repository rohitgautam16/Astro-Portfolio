/**
 * Global magnetic hover effect for elements with data-magnetic attribute.
 * Works across Astro view transitions and respects reduced motion.
 */
function initMagnetic() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const elements = document.querySelectorAll<HTMLElement>("[data-magnetic]");

  elements.forEach((el) => {
    // Avoid double attaching
    if (el.dataset.magneticInit === "true") return;
    el.dataset.magneticInit = "true";

    const strength = parseFloat(el.getAttribute("data-magnetic") || "0.35");
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let animId: number | null = null;

    function render() {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        animId = requestAnimationFrame(render);
      } else {
        el.style.transform = targetX === 0 && targetY === 0 ? "" : `translate3d(${targetX}px, ${targetY}px, 0)`;
        animId = null;
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetX = (e.clientX - centerX) * strength;
      targetY = (e.clientY - centerY) * strength;

      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
  });
}

if (typeof document !== "undefined") {
  initMagnetic();
  document.addEventListener("astro:page-load", initMagnetic);
  document.addEventListener("astro:after-swap", initMagnetic);
}
