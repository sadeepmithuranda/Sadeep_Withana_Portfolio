import { useAnimatedCanvas, useReducedMotion } from '../../hooks/hooks';
import { ecgSample, mod1 } from './ecg';

/** Virtual drawing space; scaled to fit the canvas. */
const VW = 640;
const VH = 460;

type Pt = [number, number];
interface Trace {
  pts: Pt[];
  speed: number;
  pulses: number;
  color: 'accent' | 'signal' | 'blue';
}

// Board layout: sensors (left) → MCU (centre) → model / cloud / actuator (right)
const CHIP = { x: 240, y: 150, w: 120, h: 120 };
const sensors = [
  { label: 'MPU6050', sub: 'IMU', x: 28, y: 84 },
  { label: 'AD8232', sub: 'ECG AFE', x: 28, y: 194 },
  { label: 'SOIL', sub: 'moisture', x: 28, y: 304 },
];
const outputs = [
  { label: 'MQTT', sub: 'cloud', x: 516, y: 52 },
  { label: 'MOTOR', sub: 'driver', x: 516, y: 334 },
];
const NN = [
  [150, 190, 230, 270].map((y) => [436, y] as Pt),
  [170, 210, 250].map((y) => [490, y] as Pt),
  [195, 225].map((y) => [544, y] as Pt),
];

const traces: Trace[] = [
  { pts: [[118, 100], [186, 100], [218, 132], [218, 172], [240, 172]], speed: 60, pulses: 2, color: 'accent' },
  { pts: [[118, 210], [240, 210]], speed: 70, pulses: 2, color: 'signal' },
  { pts: [[118, 320], [186, 320], [218, 288], [218, 248], [240, 248]], speed: 55, pulses: 2, color: 'accent' },
  { pts: [[360, 210], [412, 210]], speed: 60, pulses: 1, color: 'accent' },
  { pts: [[300, 150], [300, 104], [336, 68], [516, 68]], speed: 65, pulses: 2, color: 'blue' },
  { pts: [[300, 270], [300, 318], [332, 350], [516, 350]], speed: 60, pulses: 2, color: 'accent' },
];

function traceLengths(pts: Pt[]) {
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push(d);
    total += d;
  }
  return { segs, total };
}
const lens = traces.map((t) => traceLengths(t.pts));

function pointAt(i: number, dist: number): Pt {
  const { pts } = traces[i];
  const { segs } = lens[i];
  let d = dist;
  for (let s = 0; s < segs.length; s++) {
    if (d <= segs[s]) {
      const k = d / segs[s];
      return [pts[s][0] + (pts[s + 1][0] - pts[s][0]) * k, pts[s][1] + (pts[s + 1][1] - pts[s][1]) * k];
    }
    d -= segs[s];
  }
  return pts[pts.length - 1];
}

function distToSeg(p: Pt, a: Pt, b: Pt) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy || 1;
  const k = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2));
  return Math.hypot(p[0] - (a[0] + k * dx), p[1] - (a[1] + k * dy));
}

export default function CircuitHero() {
  const reduced = useReducedMotion();
  const ref = useAnimatedCanvas(({ ctx, w, h, t, tokens: c, pointer }) => {
    const s = Math.min(w / VW, h / VH);
    const ox = (w - VW * s) / 2;
    const oy = (h - VH * s) / 2;
    const vp: Pt = [(pointer.x - ox) / s, (pointer.y - oy) / s];

    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(s, s);
    const font = (px: number, weight = 500) => `${weight} ${Math.max(px, 8.5 / s)}px "JetBrains Mono", ui-monospace, monospace`;

    // Board dot grid
    ctx.fillStyle = c.line;
    for (let x = 8; x < VW; x += 16) for (let y = 8; y < VH; y += 16) ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);

    // Traces
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    traces.forEach((tr) => {
      let near = Infinity;
      for (let i = 1; i < tr.pts.length; i++) near = Math.min(near, distToSeg(vp, tr.pts[i - 1], tr.pts[i]));
      const glow = pointer.inside ? Math.max(0, 1 - near / 70) : 0;
      ctx.strokeStyle = glow > 0.05 ? c[tr.color] : c.line2;
      ctx.globalAlpha = glow > 0.05 ? 0.35 + glow * 0.65 : 1;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      tr.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      ctx.globalAlpha = 1;
      // vias at bends
      tr.pts.slice(1, -1).forEach(([x, y]) => {
        ctx.fillStyle = c.bg;
        ctx.strokeStyle = c.line2;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    });

    // Pulses travelling along traces
    traces.forEach((tr, i) => {
      const total = lens[i].total;
      for (let k = 0; k < tr.pulses; k++) {
        const d = mod1((t * tr.speed) / total + k / tr.pulses + i * 0.13) * total;
        const [x, y] = pointAt(i, d);
        const col = c[tr.color];
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // NN edges
    ctx.lineWidth = 0.8;
    for (let l = 0; l < NN.length - 1; l++)
      NN[l].forEach((a, ai) =>
        NN[l + 1].forEach((b, bi) => {
          const act = 0.5 + 0.5 * Math.sin(t * 1.6 + ai * 1.3 + bi * 0.9 + l);
          ctx.strokeStyle = c.violet;
          ctx.globalAlpha = 0.12 + act * 0.3;
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.stroke();
        }),
      );
    // bus fan-out into input layer
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = c.line2;
    NN[0].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.moveTo(412, 210);
      ctx.lineTo(x, y);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    NN.flat().forEach(([x, y], i) => {
      const act = 0.5 + 0.5 * Math.sin(t * 2 + i * 0.8);
      ctx.fillStyle = c.bg;
      ctx.strokeStyle = c.violet;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 0.25 + act * 0.75;
      ctx.fillStyle = c.violet;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    ctx.fillStyle = c.dim;
    ctx.font = font(9);
    ctx.textAlign = 'center';
    ctx.fillText('1D-CNN · int8', 490, 296);

    // MCU chip
    const { x: cx, y: cy, w: cw, h: ch } = CHIP;
    ctx.strokeStyle = c.line2;
    ctx.lineWidth = 2;
    for (let p = 0; p < 7; p++) {
      const o = 15 + p * 15;
      ctx.beginPath();
      ctx.moveTo(cx + o, cy - 9);
      ctx.lineTo(cx + o, cy);
      ctx.moveTo(cx + o, cy + ch);
      ctx.lineTo(cx + o, cy + ch + 9);
      ctx.moveTo(cx - 9, cy + o);
      ctx.lineTo(cx, cy + o);
      ctx.moveTo(cx + cw, cy + o);
      ctx.lineTo(cx + cw + 9, cy + o);
      ctx.stroke();
    }
    ctx.fillStyle = c.panel;
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(cx, cy, cw, ch, 4);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 12, cy + 12, 3, 0, Math.PI * 2);
    ctx.strokeStyle = c.dim;
    ctx.stroke();
    ctx.fillStyle = c.fg;
    ctx.font = font(14, 600);
    ctx.fillText('ESP32-S3', cx + cw / 2, cy + ch / 2 - 2);
    ctx.fillStyle = c.dim;
    ctx.font = font(9);
    ctx.fillText('dual-core MCU', cx + cw / 2, cy + ch / 2 + 16);
    const beat = 0.5 + 0.5 * Math.sin(t * 3);
    ctx.fillStyle = c.signal;
    ctx.globalAlpha = 0.35 + beat * 0.65;
    ctx.beginPath();
    ctx.arc(cx + cw - 14, cy + ch - 14, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // code tag above chip
    ctx.fillStyle = c.accent;
    ctx.font = font(10);
    ctx.textAlign = 'left';
    ctx.fillText('> interpreter.Invoke()', 312, 132);

    // Sensor and output blocks
    const block = (label: string, sub: string, x: number, y: number, accent: string) => {
      ctx.fillStyle = c.panel;
      ctx.strokeStyle = c.line2;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(x, y, 90, 34, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.fillRect(x, y + 8, 2, 18);
      ctx.textAlign = 'left';
      ctx.fillStyle = c.fg;
      ctx.font = font(11, 600);
      ctx.fillText(label, x + 10, y + 15);
      ctx.fillStyle = c.dim;
      ctx.font = font(9);
      ctx.fillText(sub, x + 10, y + 27);
    };
    sensors.forEach((sn, i) => block(sn.label, sn.sub, sn.x, sn.y, i === 1 ? c.signal : c.accent));
    outputs.forEach((o, i) => block(o.label, o.sub, o.x, o.y, i === 0 ? c.blue : c.accent));

    // wireless arcs on MQTT block
    ctx.strokeStyle = c.blue;
    ctx.lineWidth = 1.4;
    for (let r = 0; r < 3; r++) {
      ctx.globalAlpha = mod1(t * 0.6 - r * 0.25) < 0.6 ? 0.8 - r * 0.2 : 0.15;
      ctx.beginPath();
      ctx.arc(596, 69, 6 + r * 6, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // ECG channel strip, fed from the AD8232 block
    const sx0 = 44;
    const sx1 = 612;
    const sy = 418;
    ctx.strokeStyle = c.line2;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(73, 228);
    ctx.lineTo(73, 380);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = c.line;
    ctx.beginPath();
    ctx.moveTo(sx0, sy);
    ctx.lineTo(sx1, sy);
    ctx.stroke();

    const period = 150;
    const sweep = mod1(t * 0.18) * (sx1 - sx0) + sx0; // monitor-style sweep head
    ctx.strokeStyle = c.signal;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    let started = false;
    for (let x = sx0; x <= sx1; x += 1.5) {
      const gap = x > sweep && x < sweep + 26;
      if (gap) {
        started = false;
        continue;
      }
      const y = sy - ecgSample(mod1((x - sx0) / period)) * 44;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = c.signal;
    ctx.beginPath();
    ctx.arc(sweep, sy - ecgSample(mod1((sweep - sx0) / period)) * 44, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = c.dim;
    ctx.font = font(9);
    ctx.textAlign = 'left';
    ctx.fillText('CH1 · synthetic ECG (illustration)', sx0, 448);
    ctx.textAlign = 'right';
    ctx.fillText('signal → features → model → decision', sx1, 448);

    ctx.restore();
  }, reduced);

  return (
    <canvas
      ref={ref}
      className="block h-full w-full"
      role="img"
      aria-label="Animated circuit board: IMU, ECG and soil moisture sensors feed an ESP32-S3 microcontroller, which runs a small neural network and connects to an MQTT cloud link and a motor driver. A synthetic ECG trace runs along the bottom."
    />
  );
}
