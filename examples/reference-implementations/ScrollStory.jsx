import { useEffect, useRef } from 'react';
import './scroll-story.css';

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const mapRange = (value, inA, inB, outA, outB) => {
  const span = inB - inA;
  if (span === 0) return outA;
  return outA + clamp01((value - inA) / span) * (outB - outA);
};

const CHAPTERS = [
  {
    id: 'focus',
    eyebrow: 'Focus',
    title: 'A clear place for the work.',
    body: 'One idea per chapter. The scene moves only as far as the story needs.',
    theme: 'light'
  },
  {
    id: 'depth',
    eyebrow: 'Depth',
    title: 'Layers that explain themselves.',
    body: 'Transforms track position, reverse cleanly, and stop at a resolved frame.',
    theme: 'dark'
  }
];

export default function ScrollStory() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const chapterNodes = Array.from(root.querySelectorAll('[data-chapter]'));
    const layerNodes = Array.from(root.querySelectorAll('[data-layer]'));

    if (reduce) {
      chapterNodes.forEach((node) => {
        const layer = node.querySelector('[data-layer]');
        if (layer) {
          layer.style.transform = 'none';
          layer.style.opacity = '1';
        }
      });
      return undefined;
    }

    let frame = 0;
    let raw = window.scrollY;
    let smooth = raw;

    const paint = () => {
      frame = 0;
      smooth += (raw - smooth) * 0.1;

      layerNodes.forEach((layer) => {
        const chapter = layer.closest('[data-chapter]');
        if (!chapter) return;

        const start = chapter.offsetTop;
        const end = start + chapter.offsetHeight - window.innerHeight;
        const progress = mapRange(smooth, start, end, 0, 1);
        const travel = mapRange(progress, 0, 1, 0, -120);
        const scale = mapRange(progress, 0, 1, 0.92, 1);

        layer.style.transform = `translateY(${travel.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        layer.style.opacity = String(mapRange(progress, 0, 1, 0.7, 1));
      });

      if (Math.abs(raw - smooth) > 0.1) frame = window.requestAnimationFrame(paint);
    };

    const onScroll = () => {
      raw = window.scrollY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const themeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        root.dataset.theme = entry.target.dataset.theme;
      });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    chapterNodes.forEach((chapter) => themeObserver.observe(chapter));
    window.addEventListener('scroll', onScroll, { passive: true });
    paint();

    return () => {
      window.removeEventListener('scroll', onScroll);
      themeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main ref={rootRef} className="story" data-theme="light">
      <header className="story__intro">
        <p className="story__eyebrow">Motion study</p>
        <h1 className="story__title">Scroll as a narrative, not a trap.</h1>
        <p className="story__body">
          A complete reduced-motion path ships with the scene. Native scrolling stays in charge.
        </p>
      </header>

      {CHAPTERS.map((chapter) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className="story__chapter"
          data-chapter
          data-theme={chapter.theme}
        >
          <div className="story__scene">
            <div className="story__layer" data-layer>
              <p className="story__eyebrow">{chapter.eyebrow}</p>
              <h2 className="story__heading">{chapter.title}</h2>
              <p className="story__body">{chapter.body}</p>
              <div className="story__shape" aria-hidden="true">
                <span className="story__shape-core" />
                <span className="story__shape-ring" />
              </div>
            </div>
          </div>
        </section>
      ))}

      <footer className="story__footer">
        <p className="story__body">The scene resolves here. Nothing stays hidden.</p>
      </footer>
    </main>
  );
}
