import React, { useEffect, useRef, useState } from 'react';
import './interactive-sheet.css';

const DISMISS_RATIO = 0.25;
const DISMISS_VELOCITY = 0.5;
const EDGE_HAPTIC_MS = 90;

function haptic(pattern = 10) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function InteractiveSheet({
  open,
  title,
  onDismiss,
  onClosedFocus,
  children
}) {
  const sheetRef = useRef(null);
  const dragRef = useRef({ active: false, startY: 0, startX: 0, lastY: 0, lastT: 0, velocity: 0, lastHaptic: 0 });
  const dismissedRef = useRef(false);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    dismissedRef.current = false;
    setOffset(0);
    setClosing(false);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        beginDismiss(0);
        return;
      }

      if (event.key !== 'Tab' || !sheetRef.current) return;
      const focusables = sheetRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => {
      const first = sheetRef.current?.querySelector('input, button, [href], [tabindex]:not([tabindex="-1"])');
      first?.focus();
    }, 60);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function finishDismiss() {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setClosing(false);
    setOffset(0);
    onDismiss();
    window.requestAnimationFrame(() => onClosedFocus?.current?.focus());
  }

  function beginDismiss(velocity) {
    if (dismissedRef.current) return;
    const reduced = prefersReducedMotion();

    if (reduced) {
      haptic(8);
      finishDismiss();
      return;
    }

    setClosing(true);
    setDragging(false);
    setOffset(Math.max(window.innerHeight, 400) + Math.max(velocity, 0) * 40);
    haptic(10);
    window.setTimeout(finishDismiss, 320);
  }

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    const state = dragRef.current;
    state.active = true;
    state.startY = event.clientY;
    state.startX = event.clientX;
    state.lastY = event.clientY;
    state.lastT = performance.now();
    state.velocity = 0;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
  }

  function onPointerMove(event) {
    const state = dragRef.current;
    if (!state.active) return;

    const dy = event.clientY - state.startY;
    const dx = event.clientX - state.startX;
    if (dy <= 0 && Math.abs(dx) > Math.abs(dy)) return;

    const now = performance.now();
    const dt = Math.max(now - state.lastT, 1);
    state.velocity = (event.clientY - state.lastY) / dt;
    state.lastY = event.clientY;
    state.lastT = now;

    const raw = Math.max(0, dy);
    const bounded = raw * 0.45;
    setOffset(bounded);

    if (bounded > 8 && now - state.lastHaptic > EDGE_HAPTIC_MS) {
      state.lastHaptic = now;
      haptic(6);
    }
  }

  function onPointerUp(event) {
    const state = dragRef.current;
    if (!state.active) return;
    state.active = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    const height = sheetRef.current?.getBoundingClientRect().height || window.innerHeight;
    const shouldDismiss = offset > height * DISMISS_RATIO || state.velocity > DISMISS_VELOCITY;

    setDragging(false);

    if (shouldDismiss) {
      beginDismiss(state.velocity);
    } else {
      setOffset(0);
    }
  }

  if (!open && !closing) return null;

  return (
    <div className={`interactive-sheet-root${closing ? ' is-closing' : ''}`}>
      <div
        className="interactive-sheet-backdrop"
        onClick={() => beginDismiss(0)}
        aria-hidden="true"
      />
      <section
        ref={sheetRef}
        className={`interactive-sheet${dragging ? ' is-dragging' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ '--sheet-offset': `${offset}px` }}
      >
        <header
          className="interactive-sheet__header"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span className="interactive-sheet__grabber" aria-hidden="true" />
          <h2 className="interactive-sheet__title">{title}</h2>
        </header>
        <div className="interactive-sheet__content">{children}</div>
      </section>
    </div>
  );
}
