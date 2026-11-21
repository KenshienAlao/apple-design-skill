import { useCallback, useEffect, useRef, useState } from 'react';
import './media-hero.css';

const POSTER = '/media/generated-hero-still.webp';
const VIDEO = '/media/generated-hero.mp4';

export default function MediaHero() {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [showStill, setShowStill] = useState(true);
  const [status, setStatus] = useState('Ready');

  const revealStill = useCallback((message) => {
    setShowStill(true);
    setStatus(message);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShowStill(true);
      setStatus('Still shown for reduced motion');
      return undefined;
    }

    let timeoutId = 0;
    let cancelled = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || video.src) return;
      video.src = VIDEO;
      observer.disconnect();
    }, { rootMargin: '100vh 0px' });

    observer.observe(video);

    const onLoaded = () => {
      if (cancelled) return;
      window.clearTimeout(timeoutId);
      setShowStill(false);
      setStatus('Playing generated motion');
      const play = video.play();
      if (play) play.catch(() => revealStill('Still shown because playback was blocked'));
    };

    const onEnded = () => {
      video.removeAttribute('src');
      video.load();
      revealStill('Still shown after playback ended');
    };

    const onError = () => {
      window.clearTimeout(timeoutId);
      revealStill('Still shown because media failed to load');
    };

    timeoutId = window.setTimeout(() => {
      revealStill('Still shown after load timeout');
    }, 3000);

    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      observer.disconnect();
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [revealStill]);

  return (
    <section ref={rootRef} className={`media-hero${showStill ? ' media-hero--still' : ''}`}>
      <video
        ref={videoRef}
        className="media-hero__video"
        muted
        playsInline
        preload="none"
        role="img"
        aria-label="Generated abstract product motion study"
        poster={POSTER}
      />

      <img
        className="media-hero__poster"
        src={POSTER}
        width="1920"
        height="1080"
        alt="Generated abstract product still"
      />

      <div className="media-hero__content">
        <p className="media-hero__eyebrow">Motion study</p>
        <h1 className="media-hero__title">A hero that knows when to be still.</h1>
        <p className="media-hero__body">
          Media loads near the viewport, falls back to a static frame, and unloads when finished.
        </p>
        <button className="media-hero__cta" type="button" onClick={() => revealStill(status)}>
          Learn more
        </button>
        <p className="media-hero__status" aria-live="polite">{status}</p>
      </div>
    </section>
  );
}
