import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/hooks';
import { projects } from '../../data/projects';
import { research, skillTiers } from '../../data/profile';

const PROMPT = 'sadeep@engineering-lab:~$';

type Line = { kind: 'cmd' | 'out'; text: string };

const commands: Record<string, () => string[]> = {
  help: () => ['Commands: whoami · interests · current_research · projects · skills · cv · contact · clear'],
  whoami: () => ['Computer Engineering Undergraduate · KDU, Sri Lanka'],
  interests: () => ['> TinyML', '> Embedded Systems', '> IoT', '> Edge AI', '> Robotics'],
  current_research: () => ['> INT8 Quantization for ECG-based AF Detection', `  status: ${research.current.status.toLowerCase()}`],
  projects: () => projects.map((p) => `> ${p.slug.padEnd(24)} ${p.status.toLowerCase()}`),
  skills: () => skillTiers.map((t) => `> ${t.title.toLowerCase()}: ${t.items.join(', ')}`),
  cv: () => ['Opening /cv …'],
  contact: () => ['Scroll to the contact section below, or type "cv" for the resume.'],
};

const demo = ['whoami', 'interests', 'current_research'];

export default function Terminal() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState('');
  const [busy, setBusy] = useState(true);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-play the opening sequence (instant with reduced motion)
  useEffect(() => {
    if (reduced) {
      setLines(demo.flatMap((c) => [{ kind: 'cmd', text: c } as Line, ...commands[c]().map((t) => ({ kind: 'out', text: t }) as Line)]));
      setBusy(false);
      return;
    }
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await sleep(600);
      for (const c of demo) {
        for (let i = 1; i <= c.length; i++) {
          if (cancelled) return;
          setTyping(c.slice(0, i));
          await sleep(55);
        }
        await sleep(220);
        if (cancelled) return;
        setTyping('');
        setLines((l) => [...l, { kind: 'cmd', text: c }, ...commands[c]().map((t) => ({ kind: 'out', text: t }) as Line)]);
        await sleep(500);
      }
      if (!cancelled) setBusy(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [reduced]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  const run = (e: FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    setInput('');
    if (!cmd) return;
    if (cmd === 'clear') return setLines([]);
    const out = commands[cmd]?.() ?? [`command not found: ${cmd} — try "help"`];
    setLines((l) => [...l, { kind: 'cmd', text: cmd }, ...out.map((t) => ({ kind: 'out', text: t }) as Line)]);
    if (cmd === 'cv') setTimeout(() => navigate('/cv'), 500);
  };

  return (
    <div className="panel reg-marks flex flex-col overflow-hidden" onClick={() => !busy && inputRef.current?.focus()}>
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-xs text-muted">tty0 · engineering-lab</span>
        <span className="flex items-center gap-1.5 font-mono text-[0.7rem] text-signal">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" /> online
        </span>
      </div>
      <div
        ref={bodyRef}
        className="h-[300px] overflow-y-auto px-4 py-3 font-mono text-[0.8rem] leading-6 sm:text-[0.84rem]"
        aria-live="polite"
      >
        {lines.map((l, i) =>
          l.kind === 'cmd' ? (
            <p key={i} className="mt-2 first:mt-0 break-words">
              <span className="text-accent">{PROMPT}</span> <span className="text-fg">{l.text}</span>
            </p>
          ) : (
            <p key={i} className="whitespace-pre-wrap break-words text-muted">
              {l.text}
            </p>
          ),
        )}
        {busy ? (
          <p className="mt-2 break-words">
            <span className="text-accent">{PROMPT}</span> <span className="text-fg">{typing}</span>
            <span className="caret text-accent">▌</span>
          </p>
        ) : (
          <form onSubmit={run} className="mt-2 flex items-center gap-2">
            <label htmlFor="term-input" className="shrink-0 text-accent">
              {PROMPT}
            </label>
            <input
              id="term-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="type help"
              className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none placeholder:text-dim"
            />
          </form>
        )}
      </div>
    </div>
  );
}
