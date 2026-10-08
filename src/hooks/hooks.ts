import { useEffect, useRef, useState } from 'react';
import { site } from '../config/site';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Per-page title, description and canonical link. */
export function usePageMeta(title?: string, description?: string, path = '') {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : site.title;
    const desc = description ?? site.description;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
    if (site.url) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = `${site.url}${path}`;
    }
  }, [title, description, path]);
}

/** Reads the color tokens so canvas drawings use the same palette as the CSS. */
export function readTokens() {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return {
    bg: v('--bg'),
    panel: v('--panel'),
    line: v('--line'),
    line2: v('--line-2'),
    fg: v('--fg'),
    muted: v('--muted'),
    dim: v('--dim'),
    accent: v('--accent'),
    blue: v('--blue'),
    signal: v('--signal'),
    violet: v('--violet'),
  };
}
export type Tokens = ReturnType<typeof readTokens>;

interface CanvasFrame {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  t: number;
  dt: number;
  tokens: Tokens;
  pointer: { x: number; y: number; inside: boolean };
}

/**
 * Animated canvas helper: handles DPR, resizing, pausing when off-screen,
 * pointer tracking and reduced motion (draws a single still frame).
 */
export function useAnimatedCanvas(draw: (f: CanvasFrame) => void, reduced: boolean) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let tokens = readTokens();
    const pointer = { x: -9999, y: -9999, inside: false };
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      frame(performance.now()); // resizing clears the canvas; repaint immediately
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      drawRef.current({ ctx, w, h, t: reduced ? 2.2 : (now - start) / 1000, dt, tokens, pointer });
    };

    const loop = (now: number) => {
      if (visible) frame(now);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    // re-read tokens once web fonts/styles settle
    const settle = setTimeout(() => (tokens = readTokens()), 500);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.inside = true;
      if (reduced) frame(performance.now());
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.x = pointer.y = -9999;
      if (reduced) frame(performance.now());
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    resize();
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      clearTimeout(settle);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return ref;
}
