import verification from './verification.json';

const PLATFORM_COPY = {
  web: {
    badge: 'Web controls',
    names: 'Framework names: button, role=switch input, element',
    note: 'Native anatomy: browser chrome, URL and app nav, 44px targets.'
  },
  ios: {
    badge: 'iOS controls',
    names: 'Framework names: Button, Toggle, Text',
    note: 'Native anatomy: nav and toolbar, nav stack, 44pt targets.'
  },
  android: {
    badge: 'Android controls',
    names: 'Framework names: Button, Switch, Text',
    note: 'Native anatomy: top app bar, nav rail or bottom nav and back, 48dp targets.'
  }
};

const listeners = [];
const timers = new Set();
let sectionObserver;
let revealObserver;
let wipeObserver;

function on(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  listeners.push([target, type, handler, options]);
}

function later(handler, delay) {
  const id = window.setTimeout(() => {
    timers.delete(id);
    handler();
  }, delay);
  timers.add(id);
}

function dispose() {
  for (const [target, type, handler, options] of listeners.splice(0)) {
    target.removeEventListener(type, handler, options);
  }
  for (const id of timers) window.clearTimeout(id);
  timers.clear();
  sectionObserver?.disconnect();
  revealObserver?.disconnect();
  wipeObserver?.disconnect();
}

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.className = 'sr-only';
  document.body.append(field);
  field.select();
  const copied = typeof document.execCommand === 'function' ? document.execCommand('copy') : false;
  field.remove();
  return copied ? Promise.resolve() : Promise.reject(new Error('Clipboard unavailable'));
}

function wireCopyButtons() {
  const promptText = document.getElementById('install-prompt-text')?.textContent?.trim() ?? '';
  const tokenSnippet = [
    '.button {',
    '  background: var(--apple-color-tint);',
    '  border-radius: var(--apple-radius-control);',
    '}',
    '.field input:focus-visible {',
    '  border-color: var(--apple-color-tint);',
    '}'
  ].join('\n');

  for (const button of document.querySelectorAll('[data-copy-prompt], [data-copy-tokens]')) {
    const status = document.getElementById(button.getAttribute('aria-describedby') ?? '');
    const label = button.querySelector('span') ?? button;
    const original = label.textContent;
    const text = button.hasAttribute('data-copy-prompt') ? promptText : tokenSnippet;

    on(button, 'click', () => {
      copyText(text).then(
        () => {
          if (!status) return;
          status.textContent = 'Copied to clipboard.';
          label.textContent = 'Copied';
          later(() => {
            label.textContent = original;
            status.textContent = '';
          }, 1800);
        },
        () => {
          if (!status) return;
          status.textContent = 'Copy failed. Select the text manually.';
          label.textContent = 'Copy failed';
          later(() => {
            label.textContent = original;
            status.textContent = '';
          }, 2400);
        }
      );
    });
  }
}

function wireHeaderState() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const update = () => {
    header.dataset.scrolled = String(window.scrollY > 0);
  };

  on(window, 'scroll', update, { passive: true });
  update();
}

function wireNavigation() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('[data-menu-toggle]');
  const list = document.querySelector('[data-nav-list]');

  if (header && toggle && list) {
    const closeMenu = () => {
      header.dataset.menuOpen = 'false';
      toggle.setAttribute('aria-expanded', 'false');
    };

    on(toggle, 'click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      header.dataset.menuOpen = String(open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    on(list, 'click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    on(document, 'keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const links = Array.from(document.querySelectorAll('[data-nav-link]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href') ?? ''))
    .filter((section) => section instanceof Element);

  if (!sections.length || typeof IntersectionObserver !== 'function') return;

  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        }
      }
    },
    { rootMargin: '-25% 0px -65% 0px' }
  );

  for (const section of sections) sectionObserver.observe(section);
}

function wireReveals() {
  const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
  const wipes = Array.from(document.querySelectorAll('.wipe'));

  for (const wipe of wipes) {
    for (const [index, word] of Array.from(wipe.children).entries()) {
      word.style.setProperty('--wipe-index', String(index));
    }
  }

  if (prefersReducedMotion() || typeof IntersectionObserver !== 'function') {
    for (const target of reveals) target.classList.add('is-visible');
    for (const wipe of wipes) wipe.classList.add('is-visible');
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' }
  );

  for (const target of reveals) revealObserver.observe(target);

  wipeObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15 }
  );

  for (const wipe of wipes) wipeObserver.observe(wipe);
}

function wireSpecimenControls() {
  const specimen = document.getElementById('specimen-tokens');
  const badge = document.querySelector('[data-platform-badge]');
  const names = document.querySelector('[data-native-names]');
  const note = document.querySelector('[data-native-note]');
  const platformGroup = document.querySelector('.segmented');
  const appearanceToggle = document.querySelector('[data-appearance-toggle]');

  if (specimen && platformGroup && badge && names && note) {
    on(platformGroup, 'change', (event) => {
      const copy = PLATFORM_COPY[event.target.value];
      if (!copy) return;
      specimen.dataset.platform = event.target.value;
      badge.textContent = copy.badge;
      names.textContent = copy.names;
      note.textContent = copy.note;
    });
  }

  if (specimen && appearanceToggle) {
    const label = appearanceToggle.querySelector('span');
    const applyAppearance = (appearance) => {
      const dark = appearance === 'dark';
      const root = document.documentElement;
      root.classList.add('theme-switching');
      root.dataset.appearance = appearance;
      root.style.colorScheme = appearance;
      appearanceToggle.setAttribute('aria-checked', String(dark));
      if (label) label.textContent = dark ? 'Dark appearance' : 'Light appearance';
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => root.classList.remove('theme-switching'));
      });
    };

    applyAppearance(document.documentElement.dataset.appearance === 'dark' ? 'dark' : 'light');

    on(appearanceToggle, 'click', () => {
      const dark = appearanceToggle.getAttribute('aria-checked') !== 'true';
      applyAppearance(dark ? 'dark' : 'light');
    });
  }
}

function wireFieldStates() {
  const input = document.getElementById('display-name');
  const hint = document.getElementById('display-hint');
  const message = document.getElementById('display-message');
  const feedback = document.querySelector('[data-save-feedback]');
  const save = document.querySelector('[data-save-button]');
  const reset = document.querySelector('[data-reset-button]');

  if (!input || !hint || !message || !feedback || !save || !reset) return;

  const shake = () => {
    input.classList.remove('is-shaking');
    void input.offsetWidth;
    input.classList.add('is-shaking');
  };

  const validate = () => {
    const valid = input.value.trim().length >= 2;
    if (valid) {
      input.removeAttribute('aria-invalid');
      input.classList.remove('is-shaking');
      hint.hidden = false;
      message.hidden = true;
      message.textContent = '';
    } else {
      input.setAttribute('aria-invalid', 'true');
      hint.hidden = true;
      message.hidden = false;
      message.textContent = 'Use at least two characters.';
    }
    return valid;
  };

  on(input, 'input', validate);
  on(input, 'blur', validate);

  on(save, 'click', () => {
    if (!validate()) {
      shake();
      input.focus();
      return;
    }
    feedback.textContent = 'Name validated in this demo. Nothing was sent.';
  });

  on(reset, 'click', () => {
    input.value = '';
    input.removeAttribute('aria-invalid');
    input.classList.remove('is-shaking');
    hint.hidden = false;
    message.hidden = true;
    message.textContent = '';
    feedback.textContent = 'Name saved.';
    input.focus();
  });
}

function wireRouter() {
  const chips = Array.from(document.querySelectorAll('[data-route]'));
  const panels = Array.from(document.querySelectorAll('[data-route-panel]'));

  for (const chip of chips) {
    on(chip, 'click', () => {
      const selected = chip.dataset.route;
      for (const item of chips) {
        item.setAttribute('aria-pressed', String(item === chip));
      }
      for (const panel of panels) {
        panel.open = panel.dataset.routePanel === selected;
      }
    });
  }
}

function showVerificationResults() {
  for (const result of verification.results ?? []) {
    const target = document.querySelector(`[data-verification="${result.id}"]`);
    if (target) target.textContent = result.summary;
  }
}

function init() {
  document.documentElement.classList.add('js');
  wireHeaderState();
  wireReveals();
  wireCopyButtons();
  wireNavigation();
  wireSpecimenControls();
  wireFieldStates();
  wireRouter();
  showVerificationResults();
}

on(window, 'pagehide', dispose, { once: true });
if (import.meta.hot) import.meta.hot.dispose(dispose);
init();
