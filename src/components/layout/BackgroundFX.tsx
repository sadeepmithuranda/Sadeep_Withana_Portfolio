import { useEffect, useRef } from 'react';
import { readTokens, useReducedMotion } from '../../hooks/hooks';

/**
 * Site-wide ambient background:
 *  • faint PCB-style traces with purple signal pulses travelling along them
 *  • traces and grid dots light up near the cursor
 *  • slow scroll parallax
 *  • drifting glow (CSS) behind everything
 * Sits behind all content, ignores pointer events, pauses when the tab is hidden,
 * and draws a single still frame for prefers-reduced-motion.
 */

type Pt = [number, number];
interface Trace {
  pts: Pt[];
  len: number;
  segs: number[];
  speed: number;
  phase: number;
  hasPulse: boolean;
}

const CELL = 48;

function rand(seed: number) {
  // small deterministic PRNG so the layout is stable across resizes of the same size
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function buildTraces(w: number, h: number): Trace[] {
  const r = rand(Math.round(w) * 31 + Math.round(h));
  const cols = Math.ceil(w / CELL) + 1;
  const rows = Math.ceil(h / CELL) + 1;
  const count = Math.round(Math.min(26, Math.max(9, (w * h) / 75000)));
  const dirs: Pt[] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  const traces: Trace[] = [];
  for (let i = 0; i < count; i++) {
    let x = Math.floor(r() * cols) * CELL;
    let y = Math.floor(r() * rows) * CELL;
    const pts: Pt[] = [[x, y]];
    let d = Math.floor(r() * 4);
    const steps = 2 + Math.floor(r() * 4);
    for (let s = 0; s < steps; s++) {
      const run = (1 + Math.floor(r() * 4)) * CELL;
      x += dirs[d][0] * run;
      y += dirs[d][1] * run;
      pts.push([x, y]);
      // 45° chamfer into the next direction, like routed copper
      const turn = r() < 0.5 ? 1 : 3;
      const nd = (d + turn) % 4;
      const c = CELL / 2;
      x += dirs[d][0] * c + dirs[nd][0] * c;
      y += dirs[d][1] * c + dirs[nd][1] * c;
      pts.push([x, y]);
      d = nd;
    }
    const segs: number[] = [];
    let len = 0;
    for (let k = 1; k < pts.length; k++) {
      const l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
      segs.push(l);
      len += l;
    }
    traces.push({ pts, len, segs, speed: 16 + r() * 18, phase: r(), hasPulse: r() < 0.3 });
  }
  return traces;
}

function pointAt(t: Trace, dist: number): Pt {
  let d = dist;
  for (let s = 0; s < t.segs.length; s++) {
    if (d <= t.segs[s]) {
      const k = d / t.segs[s];
      return [t.pts[s][0] + (t.pts[s + 1][0] - t.pts[s][0]) * k, t.pts[s][1] + (t.pts[s + 1][1] - t.pts[s][1]) * k];
    }
    d -= t.segs[s];
  }
  return t.pts[t.pts.length - 1];
}

function nearestDist(t: Trace, p: Pt) {
  let best = Infinity;
  for (let i = 1; i < t.pts.length; i++) {
    const [ax, ay] = t.pts[i - 1];
    const [bx, by] = t.pts[i];
    const dx = bx - ax;
    const dy = by - ay;
    const l2 = dx * dx + dy * dy || 1;
    const k = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / l2));
    best = Math.min(best, Math.hypot(p[0] - (ax + k * dx), p[1] - (ay + k * dy)));
  }
  return best;
}

function hexToRgb(hex: string) {
  const m = hex.replace('#', '').match(/.{2}/g);
  return m ? m.map((v) => parseInt(v, 16)).join(',') : '169,139,255';
}

export default function BackgroundFX() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let traces: Trace[] = [];
    let raf = 0;
    let tokens = readTokens();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      traces = buildTraces(w, h);
      draw(performance.now());
    };

    const draw = (now: number) => {
      const t = reduced ? 3 : (now - start) / 1000;
      // ease the glow toward the cursor for a soft, trailing feel
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      const accent = hexToRgb(tokens.accent);
      const violet = hexToRgb(tokens.violet);
      // slow parallax: the board drifts up at a fraction of scroll speed, wrapping around
      const off = reduced ? 0 : -((window.scrollY * 0.08) % h);

      ctx.clearRect(0, 0, w, h);

      // cursor spotlight on the dot grid
      if (!coarse && pointer.x > -999) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 260);
        g.addColorStop(0, `rgba(${accent},0.22)`);
        g.addColorStop(0.45, `rgba(${accent},0.08)`);
        g.addColorStop(1, `rgba(${accent},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(pointer.x - 260, pointer.y - 260, 520, 520);

        ctx.fillStyle = `rgba(${accent},0.55)`;
        const gx0 = Math.floor((pointer.x - 200) / 24) * 24;
        const gy0 = Math.floor((pointer.y - 200 - off) / 24) * 24;
        for (let gx = gx0; gx < pointer.x + 200; gx += 24)
          for (let gy = gy0; gy < pointer.y + 200 - off; gy += 24) {
            const py = gy + off;
            const d = Math.hypot(gx - pointer.x, py - pointer.y);
            if (d > 200) continue;
            ctx.globalAlpha = (1 - d / 200) * 0.9;
            ctx.fillRect(gx - 1.1, py - 1.1, 2.2, 2.2);
          }
        ctx.globalAlpha = 1;
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (const pass of [0, h]) {
        ctx.save();
        ctx.translate(0, off + pass);
        const local: Pt = [pointer.x, pointer.y - off - pass];

        for (const tr of traces) {
          const near = !coarse && pointer.x > -999 ? nearestDist(tr, local) : Infinity;
          const glow = Math.max(0, 1 - near / 170);
          const lit = glow > 0.02;
          ctx.globalAlpha = lit ? 1 : 0.7;
          ctx.strokeStyle = lit ? `rgba(${accent},${0.25 + glow * 0.7})` : tokens.line;
          ctx.lineWidth = lit ? 1.2 + glow * 0.9 : 1.2;
          ctx.beginPath();
          tr.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.stroke();

          // pads at both ends
          const [sx, sy] = tr.pts[0];
          const [ex, ey] = tr.pts[tr.pts.length - 1];
          ctx.fillStyle = tokens.bg;
          ctx.strokeStyle = lit ? `rgba(${accent},${0.35 + glow * 0.6})` : tokens.line2;
          for (const [px, py] of [
            [sx, sy],
            [ex, ey],
          ]) {
            ctx.beginPath();
            ctx.arc(px, py, 2.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.globalAlpha = 1;

          if (tr.hasPulse && !reduced) {
            const head = ((t * tr.speed) / tr.len + tr.phase) % 1;
            const d0 = head * tr.len;
            // short fading tail behind the pulse
            for (let k = 0; k < 4; k++) {
              const dd = d0 - k * 5;
              if (dd < 0) break;
              const [x, y] = pointAt(tr, dd);
              ctx.fillStyle = `rgba(${k === 0 ? accent : violet},${(0.32 - k * 0.07).toFixed(2)})`;
              ctx.beginPath();
              ctx.arc(x, y, k === 0 ? 1.6 : 1.1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.restore();
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (pointer.x < -999) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      if (reduced) draw(performance.now());
    };
    const onLeave = () => {
      pointer.tx = pointer.ty = pointer.x = pointer.y = -9999;
      if (reduced) draw(performance.now());
    };
    const settle = setTimeout(() => (tokens = readTokens()), 400);

    resize();
    window.addEventListener('resize', resize);
    if (!coarse) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return (
    <div aria-hidden="true" className="bgfx no-print pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bgfx-glow bgfx-glow-a" />
      <div className="bgfx-glow bgfx-glow-b" />
      <canvas ref={ref} className="absolute inset-0" />
      <div className="bgfx-vignette" />
    </div>
  );
}
