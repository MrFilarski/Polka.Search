'use client';
import { useEffect, useRef } from 'react';

interface Dot {
  bx: number; by: number;
  x: number;  y: number;
  vx: number; vy: number;
}

export default function PolkaDotBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let dots: Dot[] = [];
    let mouse = { x: -9999, y: -9999 };
    let raf: number;

    const build = () => {
      dots = [];
      const spacing = 56;
      const cols = Math.ceil(canvas.width  / spacing) + 2;
      const rows = Math.ceil(canvas.height / spacing) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * spacing + (r % 2) * spacing * 0.5 - spacing;
          const by = r * spacing - spacing;
          dots.push({ bx, by, x: bx, y: by, vx: 0, vy: 0 });
        }
      }
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      build();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const REPEL = 140;

        if (dist < REPEL && dist > 0) {
          const force = ((REPEL - dist) / REPEL) ** 2 * 10;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        // spring
        d.vx += (d.bx - d.x) * 0.06;
        d.vy += (d.by - d.y) * 0.06;
        // damping
        d.vx *= 0.82;
        d.vy *= 0.82;
        d.x  += d.vx;
        d.y  += d.vy;

        const disp = Math.hypot(d.x - d.bx, d.y - d.by);
        const alpha = 0.10 + Math.min(disp / 25, 1) * 0.35;
        const radius = 3.5 + Math.min(disp / 20, 1) * 2;

        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${getDotColor()},${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    const getDotColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--dot-color').trim() || '255,255,255';

    const onMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouse = { x: -9999, y: -9999 }; };

    resize();
    tick();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
