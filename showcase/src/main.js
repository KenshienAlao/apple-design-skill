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
        const target = entry.target;
        // Stagger children slightly when a container reveals; honors HIG motion restraint.
        const delay = Math.min(Number(target.dataset.revealDelay || 0), 240);
        if (delay) target.style.setProperty("--reveal-delay", `${delay}ms`);
        target.classList.add('is-visible');
        observer.unobserve(target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  for (const [i, target] of reveals.entries()) {
    // Subtle stagger for adjacent grid items: cap to avoid slow-feeling lists.
    if (!target.dataset.revealDelay) {
      const group = target.parentElement;
      const siblings = group ? Array.from(group.children).filter((n) => n.hasAttribute('data-reveal')) : [];
      const idx = siblings.indexOf(target);
      if (siblings.length > 1 && idx > 0) target.dataset.revealDelay = String(Math.min(idx * 40, 160));
    }
    revealObserver.observe(target);
  }

  wipeObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.2 }
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

function wireHeroDevice() {
  const frame = document.querySelector('[data-device-frame]');
  if (!frame) return;

  const appearanceButtons = Array.from(frame.querySelectorAll('[data-device-appearance]'));
  const stepButtons = Array.from(frame.querySelectorAll('[data-device-step]'));
  const radiusValue = frame.querySelector('[data-device-radius-value]');
  const focusSwitch = frame.querySelector('[data-device-switch]');
  const focusLabel = frame.querySelector('[data-device-focus-label]');
  const tokenBg = document.querySelector('[data-token-bg]');
  const tokenRadius = document.querySelector('[data-token-radius]');
  const tokenTint = document.querySelector('[data-token-tint]');
  const radii = [10, 14, 20, 28];
  let radiusIndex = 1;

  const updateTokens = () => {
    const styles = getComputedStyle(frame);
    const read = (name, target) => {
      if (target) target.textContent = `${name}: ${styles.getPropertyValue(name).trim()}`;
    };

    read('--apple-color-bg', tokenBg);
    read('--apple-radius-medium', tokenRadius);
    read('--apple-color-tint', tokenTint);
  };

  const applyAppearance = (appearance) => {
    frame.dataset.appearance = appearance;
    frame.style.setProperty('--segment-index', appearance === 'dark' ? '1' : '0');
    for (const button of appearanceButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.deviceAppearance === appearance));
    }
    updateTokens();
  };

  for (const button of appearanceButtons) {
    on(button, 'click', () => applyAppearance(button.dataset.deviceAppearance === 'dark' ? 'dark' : 'light'));
  }

  for (const button of stepButtons) {
    on(button, 'click', () => {
      const step = Number(button.dataset.deviceStep);
      radiusIndex = Math.min(radii.length - 1, Math.max(0, radiusIndex + step));
      frame.style.setProperty('--apple-radius-medium', `${radii[radiusIndex]}px`);
      if (radiusValue) radiusValue.textContent = String(radii[radiusIndex]);
      updateTokens();
    });
  }

  if (focusSwitch) {
    on(focusSwitch, 'click', () => {
      const enabled = focusSwitch.getAttribute('aria-checked') !== 'true';
      focusSwitch.setAttribute('aria-checked', String(enabled));
      if (focusLabel) focusLabel.textContent = enabled ? 'On' : 'Off';
    });
  }

  applyAppearance(frame.dataset.appearance === 'dark' ? 'dark' : 'light');
}

function wireMotionLab() {
  const stage = document.querySelector('[data-lab]');
  if (!stage) return;

  const toggle = stage.querySelector('[data-lab-toggle]');
  const toggleLabel = toggle?.querySelector('span');
  const sheet = stage.querySelector('[data-lab-sheet]');
  const readout = stage.querySelector('[data-lab-readout]');
  const sheetValue = stage.querySelector('[data-lab-token-value]');
  const options = Array.from(stage.querySelectorAll('[data-lab-token][data-lab-value]'));
  const tokens = {
    radius: {
      control: '--apple-radius-control',
      medium: '--apple-radius-medium',
      sheet: '--apple-radius-sheet'
    },
    duration: {
      instant: '--apple-duration-instant',
      control: '--apple-duration-control',
      sheet: '--apple-duration-sheet'
    },
    ease: {
      standard: '--apple-ease-standard',
      out: '--apple-ease-out',
      in: '--apple-ease-in'
    }
  };
  const state = {
    radius: 'medium',
    duration: 'control',
    ease: 'standard'
  };

  const render = () => {
    for (const [group, choices] of Object.entries(tokens)) {
      stage.style.setProperty(`--lab-${group}`, `var(${choices[state[group]]})`);
    }
    if (readout) readout.textContent = `${state.radius} · ${state.duration} · ${state.ease}`;
    if (sheetValue) sheetValue.textContent = tokens.radius[state.radius];
    for (const option of options) {
      option.setAttribute('aria-pressed', String(state[option.dataset.labToken] === option.dataset.labValue));
    }
  };

  for (const option of options) {
    on(option, 'click', () => {
      const group = option.dataset.labToken;
      const value = option.dataset.labValue;
      if (!tokens[group]?.[value]) return;
      state[group] = value;
      render();
    });
  }

  if (toggle && sheet) {
    on(toggle, 'click', () => {
      const active = stage.dataset.active !== 'true';
      stage.dataset.active = String(active);
      toggle.setAttribute('aria-pressed', String(active));
      if (toggleLabel) toggleLabel.textContent = active ? 'Dismiss sheet' : 'Present sheet';
      sheet.setAttribute('aria-hidden', String(!active));
    });
  }

  render();
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
  wireHeroDevice();
  wireMotionLab();
  wireFieldStates();
  wireRouter();
  showVerificationResults();
}

on(window, 'pagehide', dispose, { once: true });
if (import.meta.hot) import.meta.hot.dispose(dispose);
init();
