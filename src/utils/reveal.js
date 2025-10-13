export function setupReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.dataset.revealed = 'true'; });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
}