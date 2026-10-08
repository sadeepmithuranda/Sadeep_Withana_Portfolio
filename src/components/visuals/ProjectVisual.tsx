import type { ProjectVisual as Kind } from '../../data/projects';
import { ecgSample, mod1 } from './ecg';

const ecgPath = (x0: number, x1: number, y: number, amp: number, period: number) => {
  let d = '';
  for (let x = x0; x <= x1; x += 2) d += `${x === x0 ? 'M' : 'L'}${x},${(y - ecgSample(mod1((x - x0) / period)) * amp).toFixed(1)}`;
  return d;
};

const S = { stroke: 'var(--line-2)', fill: 'none', strokeWidth: 1.5 } as const;
const label = { fill: 'var(--dim)', fontFamily: 'var(--font-mono)', fontSize: 10 } as const;

function Chip({ x, y, w = 70, h = 46, text }: { x: number; y: number; w?: number; h?: number; text: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill="var(--panel)" stroke="var(--accent)" strokeWidth="1.4" />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill="var(--fg)" fontFamily="var(--font-mono)" fontSize="11" fontWeight="600">
        {text}
      </text>
    </g>
  );
}

/** Small illustrative schematic per project — drawn, not photographed. */
export default function ProjectVisual({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full" role="img" aria-label={`${kind} illustration`}>
      <rect width="320" height="160" fill="var(--bg-2)" />
      <g opacity="0.5">
        {Array.from({ length: 20 }, (_, i) => (
          <line key={i} x1={i * 16 + 8} y1="0" x2={i * 16 + 8} y2="160" stroke="var(--line)" strokeWidth="0.6" />
        ))}
      </g>

      {kind === 'ecg' && (
        <>
          <path d={ecgPath(14, 200, 92, 46, 62)} stroke="var(--signal)" strokeWidth="1.8" fill="none" />
          <path d="M200 92 H232" {...S} className="flow-line" stroke="var(--signal)" />
          <Chip x={232} y={69} w={74} text="ESP32-S3" />
          <text x="14" y="146" {...label}>single-lead ECG → 1D CNN (INT8)</text>
        </>
      )}

      {kind === 'imu' && (
        <>
          {[
            ['var(--accent)', 0],
            ['var(--blue)', 1.7],
            ['var(--violet)', 3.1],
          ].map(([col, ph], i) => {
            let d = '';
            for (let x = 14; x <= 180; x += 3) {
              const spike = Math.exp(-(((x - 110) / 7) ** 2)) * (i === 0 ? 46 : 26);
              d += `${x === 14 ? 'M' : 'L'}${x},${(80 + i * 8 + Math.sin(x / 9 + (ph as number)) * 5 - spike * (i === 1 ? -1 : 1)).toFixed(1)}`;
            }
            return <path key={i} d={d} stroke={col as string} strokeWidth="1.4" fill="none" />;
          })}
          <line x1="110" y1="20" x2="110" y2="134" stroke="var(--dim)" strokeDasharray="2 4" />
          <text x="114" y="30" {...label}>impact</text>
          <path d="M184 84 H222" {...S} className="flow-line" stroke="var(--accent)" />
          <Chip x={222} y={61} w={84} text="RF · SVM" />
          <text x="14" y="146" {...label}>MPU6050 accel/gyro → fall?</text>
        </>
      )}

      {kind === 'agents' && (
        <>
          <line x1="40" y1="80" x2="280" y2="80" stroke="var(--line-2)" strokeWidth="2" />
          <text x="160" y="96" textAnchor="middle" {...label}>async event bus</text>
          {['Sensory', 'Medical', 'Cognitive', 'Care'].map((a, i) => {
            const x = 52 + i * 72;
            const y = i % 2 ? 112 : 26;
            return (
              <g key={a}>
                <line x1={x + 18} y1={i % 2 ? y : y + 28} x2={x + 18} y2="80" stroke="var(--violet)" strokeWidth="1.2" className="flow-line" />
                <rect x={x - 12} y={y} width="60" height="28" rx="3" fill="var(--panel)" stroke="var(--violet)" strokeWidth="1.3" />
                <text x={x + 18} y={y + 18} textAnchor="middle" fill="var(--fg)" fontFamily="var(--font-mono)" fontSize="10">
                  {a}
                </text>
              </g>
            );
          })}
          <text x="14" y="154" {...label}>camera-free · privacy-first</text>
        </>
      )}

      {kind === 'robot' && (
        <>
          <path d="M14 120 C 70 120, 80 50, 150 50 S 240 110, 306 70" stroke="var(--fg)" strokeWidth="5" fill="none" opacity="0.85" />
          {[
            [70, 'ZONE A'],
            [250, 'ZONE B'],
          ].map(([x, t]) => (
            <g key={t as string}>
              <rect x={(x as number) - 26} y="122" width="52" height="22" rx="2" fill="none" stroke="var(--signal)" strokeDasharray="3 3" />
              <text x={x as number} y="137" textAnchor="middle" fill="var(--signal)" fontFamily="var(--font-mono)" fontSize="9">
                {t}
              </text>
            </g>
          ))}
          <g transform="translate(150 50) rotate(-6)">
            <rect x="-22" y="-14" width="44" height="28" rx="4" fill="var(--panel)" stroke="var(--accent)" strokeWidth="1.4" />
            <rect x="-26" y="-18" width="8" height="10" rx="1" fill="var(--line-2)" />
            <rect x="-26" y="8" width="8" height="10" rx="1" fill="var(--line-2)" />
            <rect x="18" y="-18" width="8" height="10" rx="1" fill="var(--line-2)" />
            <rect x="18" y="8" width="8" height="10" rx="1" fill="var(--line-2)" />
            <circle cx="24" cy="0" r="3" fill="var(--accent)" className="live-dot" />
          </g>
          <text x="14" y="24" {...label}>IR line follow → water dry zones</text>
        </>
      )}

      {kind === 'vision' && (
        <>
          <rect x="18" y="26" width="110" height="96" rx="3" fill="none" stroke="var(--line-2)" />
          <circle cx="73" cy="66" r="18" fill="none" stroke="var(--muted)" strokeWidth="1.4" />
          <path d="M56 92 Q73 104 90 92" stroke="var(--muted)" strokeWidth="1.4" fill="none" />
          <rect x="48" y="40" width="50" height="62" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
          <text x="48" y="36" fill="var(--accent)" fontFamily="var(--font-mono)" fontSize="9">face</text>
          <path d="M134 74 H170" {...S} className="flow-line" stroke="var(--accent)" />
          <Chip x={170} y={52} w={84} text="MobileNetV2" />
          <path d="M254 74 H270" {...S} />
          <text x="274" y="70" fill="var(--signal)" fontFamily="var(--font-mono)" fontSize="10">mask</text>
          <text x="274" y="84" fill="var(--dim)" fontFamily="var(--font-mono)" fontSize="10">no mask</text>
          <text x="18" y="146" {...label}>OpenCV → CNN → Flask</text>
        </>
      )}

      {kind === 'iot' && (
        <>
          {[
            [40, 34, 'DHT'],
            [40, 80, 'MQ'],
            [40, 126, 'HC-SR04'],
          ].map(([x, y, t]) => (
            <g key={t as string}>
              <circle cx={x as number} cy={y as number} r="5" fill="var(--panel)" stroke="var(--accent)" strokeWidth="1.4" />
              <text x={(x as number) + 10} y={(y as number) - 8} {...label}>
                {t}
              </text>
              <path d={`M${(x as number) + 5} ${y} L 124 80`} {...S} className="flow-line" stroke="var(--accent)" />
            </g>
          ))}
          <Chip x={124} y={57} w={66} text="ESP32" />
          <path d="M190 80 H230" {...S} className="flow-line" stroke="var(--blue)" />
          <rect x="230" y="50" width="76" height="60" rx="3" fill="var(--panel)" stroke="var(--blue)" strokeWidth="1.3" />
          <text x="268" y="74" textAnchor="middle" fill="var(--fg)" fontFamily="var(--font-mono)" fontSize="10">MQTT</text>
          <polyline points="240,100 252,92 262,96 274,84 286,88 296,78" fill="none" stroke="var(--signal)" strokeWidth="1.4" />
          <text x="230" y="130" {...label}>dashboard</text>
        </>
      )}
    </svg>
  );
}
