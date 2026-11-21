// Flagship demo behavior. Progressive enhancement only: the document is
// complete and readable before this file runs, and stays so if it fails.

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const canEnhance = !reduceMotion.matches && 'IntersectionObserver' in window;

if (canEnhance) {
  root.classList.add('js-enhanced');
}

function initScrolly() {
  const scrolly = document.querySelector('[data-scrolly]');
  if (!scrolly) return () => {};

  const scenes = Array.from(scrolly.querySelectorAll('[data-scene]'));
  const steps = Array.from(scrolly.querySelectorAll('[data-step]'));
  const fill = scrolly.querySelector('[data-progress-fill]');
  const label = scrolly.querySelector('[data-progress-label]');
  if (scenes.length === 0) return () => {};

  let target = 0;
  let current = 0;
  let frame = 0;
  let activeIndex = -1;

  const setActive = (index) => {
    if (index === activeIndex) return;
    scrolly.dataset.direction = index >= activeIndex ? 'forward' : 'backward';
    activeIndex = index;
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
    steps.forEach((step, i) => step.classList.toggle('is-current', i === index));
    if (label) label.textContent = 'Step ' + (index + 1) + ' of ' + scenes.length;
  };

  const readScroll = () => {
    const rect = scrolly.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const raw = span > 0 ? -rect.top / span : 0;
    target = Math.min(Math.max(raw, 0), 1);
  };

  const tick = () => {
    current += (target - current) * 0.18;
    if (fill) fill.style.setProperty('--scene-progress', current.toFixed(3));
    const index = Math.min(scenes.length - 1, Math.floor(current * scenes.length));
    setActive(Math.max(0, index));
    frame = window.requestAnimationFrame(tick);
  };

  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', readScroll);
  readScroll();
  frame = window.requestAnimationFrame(tick);

  return () => {
    window.removeEventListener('scroll', readScroll);
    window.removeEventListener('resize', readScroll);
    window.cancelAnimationFrame(frame);
  };
}

function initMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!toggle || !nav) return () => {};

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  const onClick = () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) {
      close();
    } else {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
    }
  };

  const onKey = (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  };

  toggle.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);

  return () => {
    toggle.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
  };
}

function initReveal() {
  if (!canEnhance) return () => {};
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  if (items.length === 0) return () => {};

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
  return () => observer.disconnect();
}

const cleanups = [initScrolly(), initMenu(), initReveal()].filter(Boolean);
window.addEventListener('pagehide', () => cleanups.forEach((cleanup) => cleanup()));
