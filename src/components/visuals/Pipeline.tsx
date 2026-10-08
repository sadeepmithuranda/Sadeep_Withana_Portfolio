import { ChevronRight } from 'lucide-react';
import { ecgSample, mod1 } from './ecg';
import { useReducedMotion } from '../../hooks/hooks';

/** Ordered research pipeline. Numbering is meaningful here: it is the order of work. */
export function Pipeline({ steps, highlight = [] }: { steps: string[]; highlight?: string[] }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-7">
      {steps.map((s, i) => {
        const hot = highlight.includes(s);
        return (
          <li key={s} className="relative flex min-w-0 flex-col gap-2 bg-panel p-4">
            <span className={`font-mono text-[0.7rem] ${hot ? 'text-accent' : 'text-dim'}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className={`text-sm font-semibold leading-snug ${hot ? 'text-accent' : 'text-fg'}`}>{s}</span>
            {i < steps.length - 1 && (
              <ChevronRight
                size={14}
                aria-hidden="true"
                className="absolute right-2 top-4 hidden text-dim lg:block"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

const wave = (() => {
  let d = '';
  for (let x = 0; x <= 400; x += 2) d += `${x ? 'L' : 'M'}${x},${(46 - ecgSample(mod1(x / 100)) * 32).toFixed(1)}`;
  return d;
})();

/** ECG signal → feature extraction → neural network → edge device. Illustration only. */
export function SignalChain() {
  const reduced = useReducedMotion();
  const card = 'flex min-w-0 flex-col gap-3 rounded-[4px] border border-line bg-panel p-4';
  const cap = 'font-mono text-xs uppercase tracking-wider text-muted';
  return (
    <figure className="flex flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-4">
        <div className={card}>
          <p className={cap}>ECG signal</p>
          <svg viewBox="0 0 200 70" className="h-16 w-full overflow-hidden" aria-hidden="true">
            <g>
              <path d={wave} stroke="var(--signal)" strokeWidth="1.8" fill="none">
                {!reduced && (
                  <animateTransform attributeName="transform" type="translate" from="0 0" to="-100 0" dur="1.6s" repeatCount="indefinite" />
                )}
              </path>
            </g>
          </svg>
        </div>
        <div className={card}>
          <p className={cap}>Feature extraction</p>
          <svg viewBox="0 0 200 70" className="h-16 w-full" aria-hidden="true">
            <path d={wave} stroke="var(--line-2)" strokeWidth="1.4" fill="none" transform="scale(0.5 1)" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={6 + i * 48} y="8" width="42" height="56" rx="2" fill="none" stroke="var(--accent)" strokeDasharray="3 3" opacity={0.4 + i * 0.15} />
            ))}
          </svg>
        </div>
        <div className={card}>
          <p className={cap}>Neural network</p>
          <svg viewBox="0 0 200 70" className="h-16 w-full" aria-hidden="true">
            {[[30, [15, 35, 55]], [100, [22, 48]], [170, [35]]].map(([x, ys], li, arr) =>
              (ys as number[]).map((y) => (
                <g key={`${li}-${y}`}>
                  {li < arr.length - 1 &&
                    (arr[li + 1][1] as number[]).map((y2) => (
                      <line key={y2} x1={x as number} y1={y} x2={arr[li + 1][0] as number} y2={y2} stroke="var(--violet)" strokeWidth="0.8" opacity="0.5" />
                    ))}
                  <circle cx={x as number} cy={y} r="5" fill="var(--panel)" stroke="var(--violet)" strokeWidth="1.4" />
                </g>
              )),
            )}
          </svg>
        </div>
        <div className={card}>
          <p className={cap}>Edge device</p>
          <svg viewBox="0 0 200 70" className="h-16 w-full" aria-hidden="true">
            <rect x="62" y="10" width="76" height="50" rx="3" fill="var(--panel)" stroke="var(--accent)" strokeWidth="1.4" />
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i} stroke="var(--line-2)" strokeWidth="1.4">
                <line x1={70 + i * 15} y1="4" x2={70 + i * 15} y2="10" />
                <line x1={70 + i * 15} y1="60" x2={70 + i * 15} y2="66" />
              </g>
            ))}
            <text x="100" y="39" textAnchor="middle" fill="var(--fg)" fontFamily="var(--font-mono)" fontSize="11">ESP32-S3</text>
          </svg>
        </div>
      </div>
      <figcaption className="font-mono text-xs text-dim">
        Synthetic signal for illustration. This is an engineering research project, not a medical device.
      </figcaption>
    </figure>
  );
}
