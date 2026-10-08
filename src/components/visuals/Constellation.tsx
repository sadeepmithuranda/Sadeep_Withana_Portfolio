import { useRef, useState } from 'react';
import { useAnimatedCanvas, useReducedMotion, type Tokens } from '../../hooks/hooks';
import { constellation } from '../../data/profile';

const groupColor = (c: Tokens, g: string) => ({ domain: c.accent, lang: c.signal, hw: c.blue, tool: c.violet })[g] ?? c.accent;
const groupName: Record<string, string> = { domain: 'Domain', lang: 'Language', hw: 'Hardware', tool: 'Tooling' };

const inner = constellation.filter((n) => n.group === 'domain');
const outer = constellation.filter((n) => n.group !== 'domain');

export default function Constellation() {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<string | null>(null);
  const hoverRef = useRef<string | null>(null);

  const ref = useAnimatedCanvas(({ ctx, w, h, t, tokens: c, pointer }) => {
    const cx = w / 2;
    const cy = h / 2;
    const narrow = w < 560;
    const pos = new Map<string, { x: number; y: number }>();

    const place = (list: typeof constellation, rx: number, ry: number, speed: number, phase: number) =>
      list.forEach((n, i) => {
        const a = phase + (i / list.length) * Math.PI * 2 + t * speed;
        let x = cx + Math.cos(a) * rx;
        let y = cy + Math.sin(a) * ry;
        // gentle push away from the cursor
        if (pointer.inside) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 120) {
            const push = (1 - d / 120) * 14;
            x += (dx / d) * push;
            y += (dy / d) * push;
          }
        }
        pos.set(n.id, { x, y });
      });
    place(inner, w * (narrow ? 0.26 : 0.2), h * 0.24, 0.05, -Math.PI / 2);
    place(outer, w * (narrow ? 0.4 : 0.4), h * 0.41, -0.03, 0.2);

    // hovered node
    let hovered: string | null = null;
    if (pointer.inside) {
      let best = 36;
      pos.forEach((p, id) => {
        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (d < best) {
          best = d;
          hovered = id;
        }
      });
    }
    if (hovered !== hoverRef.current) {
      hoverRef.current = hovered;
      setHover(hovered);
    }
    const related = new Set<string>();
    if (hovered) {
      related.add(hovered);
      constellation.forEach((n) => {
        if (n.id === hovered) n.links?.forEach((l) => related.add(l));
        if (n.links?.includes(hovered!)) related.add(n.id);
      });
    }

    // orbits
    ctx.strokeStyle = c.line;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 5]);
    [
      [w * (narrow ? 0.26 : 0.2), h * 0.24],
      [w * 0.4, h * 0.41],
    ].forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // spokes from centre and peer links
    constellation.forEach((n) => {
      const p = pos.get(n.id)!;
      const on = !hovered || related.has(n.id);
      ctx.strokeStyle = on && hovered ? groupColor(c, n.group) : c.line2;
      ctx.globalAlpha = hovered ? (on ? 0.8 : 0.15) : 0.5;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      n.links?.forEach((l) => {
        const q = pos.get(l);
        if (!q) return;
        const lit = hovered && related.has(n.id) && related.has(l) && (n.id === hovered || l === hovered);
        ctx.strokeStyle = lit ? groupColor(c, n.group) : c.line2;
        ctx.globalAlpha = lit ? 0.9 : hovered ? 0.08 : 0.28;
        ctx.setLineDash(lit ? [] : [3, 4]);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    });
    ctx.globalAlpha = 1;

    // centre
    ctx.fillStyle = c.panel;
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx, cy, narrow ? 34 : 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = c.fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${narrow ? 13 : 15}px Archivo, sans-serif`;
    ctx.fillText('Sadeep', cx, cy);

    // node pills
    ctx.font = `500 ${narrow ? 11 : 12.5}px "JetBrains Mono", monospace`;
    constellation.forEach((n) => {
      const p = pos.get(n.id)!;
      const col = groupColor(c, n.group);
      const tw = ctx.measureText(n.label).width;
      const pw = tw + 22;
      const ph = narrow ? 22 : 26;
      const on = !hovered || related.has(n.id);
      ctx.globalAlpha = on ? 1 : 0.35;
      ctx.fillStyle = c.panel;
      ctx.strokeStyle = n.id === hovered ? col : c.line2;
      ctx.lineWidth = n.id === hovered ? 1.6 : 1;
      ctx.beginPath();
      ctx.roundRect(p.x - pw / 2, p.y - ph / 2, pw, ph, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(p.x - pw / 2 + 8, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.fg;
      ctx.textAlign = 'left';
      ctx.fillText(n.label, p.x - pw / 2 + 15, p.y + 0.5);
      ctx.globalAlpha = 1;
    });
  }, reduced);

  const hovered = constellation.find((n) => n.id === hover);
  const relatedLabels = hovered
    ? constellation
        .filter((n) => hovered.links?.includes(n.id) || n.links?.includes(hovered.id))
        .map((n) => n.label)
    : [];

  return (
    <div>
      <div className="relative h-[380px] sm:h-[460px]">
        <canvas
          ref={ref}
          className="block h-full w-full cursor-crosshair"
          aria-hidden="true"
        />
        <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center font-mono text-xs text-muted" aria-live="polite">
          {hovered
            ? `${hovered.label} · ${groupName[hovered.group]}${relatedLabels.length ? ` · connects to ${relatedLabels.join(', ')}` : ''}`
            : 'Move the cursor over a node to trace its connections'}
        </p>
      </div>
      {/* Accessible equivalent of the canvas */}
      <ul className="sr-only">
        {constellation.map((n) => (
          <li key={n.id}>
            {n.label} ({groupName[n.group]})
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs text-muted">
        {(['domain', 'lang', 'hw', 'tool'] as const).map((g) => (
          <span key={g} className="inline-flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: `var(--${{ domain: 'accent', lang: 'signal', hw: 'blue', tool: 'violet' }[g]})` }}
            />
            {groupName[g]}
          </span>
        ))}
      </div>
    </div>
  );
}
