import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './carousel-rubber-band.css';

const PROJECTION_TIME = 0.2;
const VELOCITY_COMMIT = 0.5;
const EDGE_MAX_RATIO = 0.28;
const STIFFNESS = 220;
const DAMPING = 22;

function reducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10);
}

function rubberBand(raw, viewportWidth) {
  const max = viewportWidth * EDGE_MAX_RATIO;
  const magnitude = max * (1 - Math.exp(-Math.abs(raw) / max));
  return Math.sign(raw) * magnitude;
}

export default function CarouselRubberBand({ pages, label = 'Carousel' }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const motionRef = useRef({
    page: 0,
    offset: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    dragging: false,
    horizontal: null,
    frame: 0,
    lastHaptic: 0
  });
  const [page, setPage] = useState(0);

  const pageCount = pages.length;

  const applyOffset = useCallback((value) => {
    motionRef.current.offset = value;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${value}px, 0, 0)`;
    }
  }, []);

  const width = useCallback(() => viewportRef.current?.clientWidth || 1, []);

  const springTo = useCallback((targetPage, notify = true) => {
    const state = motionRef.current;
    if (state.frame) cancelAnimationFrame(state.frame);

    const target = -targetPage * width();
    const from = state.offset;

    if (reducedMotion()) {
      applyOffset(target);
      state.page = targetPage;
      setPage(targetPage);
      if (notify && targetPage !== page) haptic();
      return;
    }

    let position = from;
    let velocity = 0;
    let previous = performance.now();

    function step(now) {
      const dt = Math.min((now - previous) / 1000, 0.032);
      previous = now;

      const acceleration = -STIFFNESS * (position - target) - DAMPING * velocity;
      velocity += acceleration * dt;
      position += velocity * dt;
      applyOffset(position);

      if (Math.abs(position - target) < 0.5 && Math.abs(velocity) < 10) {
        applyOffset(target);
        state.page = targetPage;
        setPage(targetPage);
        if (notify && targetPage !== page) haptic();
        state.frame = 0;
        return;
      }

      state.frame = requestAnimationFrame(step);
    }

    state.frame = requestAnimationFrame(step);
  }, [applyOffset, page, width]);

  useEffect(() => {
    const onResize = () => applyOffset(-motionRef.current.page * width());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (motionRef.current.frame) cancelAnimationFrame(motionRef.current.frame);
    };
  }, [applyOffset, width]);

  const goTo = useCallback((next) => {
    const clamped = Math.max(0, Math.min(pageCount - 1, next));
    springTo(clamped);
  }, [pageCount, springTo]);

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    const state = motionRef.current;
    if (state.frame) cancelAnimationFrame(state.frame);
    state.frame = 0;
    state.dragging = true;
    state.horizontal = null;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.lastX = event.clientX;
    state.lastT = performance.now();
    state.velocity = 0;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    const state = motionRef.current;
    if (!state.dragging) return;

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    if (state.horizontal === null) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      state.horizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
    }
    if (!state.horizontal) return;

    const now = performance.now();
    const dt = Math.max(now - state.lastT, 1);
    state.velocity = (event.clientX - state.lastX) / dt;
    state.lastX = event.clientX;
    state.lastT = now;

    const base = -state.page * width();
    let raw = base + dx;
    const minOffset = -(pageCount - 1) * width();
    const maxOffset = 0;

    if (raw > maxOffset) raw = maxOffset + rubberBand(raw - maxOffset, width());
    if (raw < minOffset) raw = minOffset + rubberBand(raw - minOffset, width());

    applyOffset(raw);

    const beyondEdge = raw > 1 || raw < minOffset - 1;
    if (beyondEdge && now - state.lastHaptic > 120) {
      state.lastHaptic = now;
      haptic(6);
    }
  }

  function onPointerUp(event) {
    const state = motionRef.current;
    if (!state.dragging) return;
    state.dragging = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (state.horizontal === false) {
      applyOffset(-state.page * width());
      return;
    }

    const projected = state.offset + state.velocity * PROJECTION_TIME * 1000;
    let target = Math.round(-projected / width());

    if (state.velocity < -VELOCITY_COMMIT) target = state.page + 1;
    if (state.velocity > VELOCITY_COMMIT) target = state.page - 1;

    springTo(Math.max(0, Math.min(pageCount - 1, target)));
  }

  const dots = useMemo(() => pages.map((_, index) => (
    <button
      key={index}
      type="button"
      className={`carousel-dot${index === page ? ' is-active' : ''}`}
      aria-label={`Go to page ${index + 1}`}
      aria-current={index === page ? 'true' : undefined}
      onClick={() => goTo(index)}
    >
      <span aria-hidden="true" />
    </button>
  )), [goTo, page, pages]);

  return (
    <div className="carousel-root">
      <div
        ref={viewportRef}
        className="carousel-viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(page + 1);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(page - 1);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={trackRef} className="carousel-track">
          {pages.map((content, index) => (
            <div
              className="carousel-page"
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${pageCount}`}
            >
              {content}
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-dots" aria-label="Carousel pages">{dots}</div>
    </div>
  );
}
