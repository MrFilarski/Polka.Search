'use client';
import { useState, useEffect, useRef } from 'react';

interface Article {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

export default function NewsTicker({ locationLabel }: { locationLabel: string }) {
  const [items, setItems] = useState<Article[]>([]);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // drag state
  const dragging  = useRef(false);
  const startX    = useRef(0);
  const offsetAtDrag = useRef(0);  // CSS translateX at drag start (positive = moved left)
  const currentOffset = useRef(0); // current manual offset
  const paused    = useRef(false);

  useEffect(() => {
    fetch(`/api/news?location=${encodeURIComponent(locationLabel)}`)
      .then(r => r.json())
      .then(d => setItems(d.articles ?? []))
      .catch(() => {});
  }, [locationLabel]);

  // apply offset to the track, accounting for animation progress
  const applyOffset = (offset: number) => {
    const el = trackRef.current;
    if (!el) return;
    currentOffset.current = offset;
    el.style.transform = `translateX(${-offset}px)`;
  };

  const getAnimProgress = () => {
    const el = trackRef.current;
    if (!el) return 0;
    // read current translateX from computed style during animation
    const mat = new DOMMatrix(getComputedStyle(el).transform);
    return -mat.m41; // positive = pixels moved left
  };

  const startDrag = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    dragging.current = true;
    paused.current = true;
    el.style.animationPlayState = 'paused';
    offsetAtDrag.current = getAnimProgress();
    startX.current = clientX;
    // switch from animation to manual transform
    el.style.animation = 'none';
    applyOffset(offsetAtDrag.current);
  };

  const moveDrag = (clientX: number) => {
    if (!dragging.current) return;
    const dx = startX.current - clientX;
    applyOffset(offsetAtDrag.current + dx);
  };

  const endDrag = (didClick: boolean, href: string) => {
    if (!dragging.current) return;
    dragging.current = false;
    // if barely moved, treat as click
    const moved = Math.abs(currentOffset.current - offsetAtDrag.current);
    if (didClick && moved < 5) {
      window.open(href, '_blank', 'noopener');
    }
    // resume animation from current position
    resumeAnimation();
  };

  const resumeAnimation = () => {
    const el = trackRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    const halfWidth = el.scrollWidth / 2;
    // normalise offset into [0, halfWidth)
    const norm = ((currentOffset.current % halfWidth) + halfWidth) % halfWidth;
    const pct  = norm / halfWidth; // 0–1
    const duration = 60; // seconds
    const delay = -(pct * duration);
    el.style.transform = '';
    el.style.animation = `ticker-scroll ${duration}s ${delay}s linear infinite`;
    paused.current = false;
  };

  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div
      className="ticker-bar"
      style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
      onMouseDown={e => { e.preventDefault(); startDrag(e.clientX); }}
      onMouseMove={e => moveDrag(e.clientX)}
      onMouseUp={() => endDrag(false, '')}
      onMouseLeave={() => { if (dragging.current) { dragging.current = false; resumeAnimation(); } }}
      onTouchStart={e => startDrag(e.touches[0].clientX)}
      onTouchMove={e => { e.preventDefault(); moveDrag(e.touches[0].clientX); }}
      onTouchEnd={() => { dragging.current = false; resumeAnimation(); }}
    >
      <span className="ticker-label">NA ŻYWO</span>
      <div className="ticker-track-wrap" ref={wrapRef}>
        <div className="ticker-track" ref={trackRef}>
          {doubled.map((a, i) => (
            <a
              key={i}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ticker-item"
              onClick={e => {
                // block link if dragged
                const moved = Math.abs(currentOffset.current - offsetAtDrag.current);
                if (moved > 5) e.preventDefault();
              }}
              draggable={false}
            >
              {a.source && <span className="ticker-source">{a.source}</span>}
              <span className="ticker-title">{a.title}</span>
              <span className="ticker-sep">·</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
