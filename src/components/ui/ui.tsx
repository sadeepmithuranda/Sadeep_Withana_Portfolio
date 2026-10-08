import { useEffect, type ReactNode, type MouseEvent, type SVGProps } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/* ---------- Brand marks (not in lucide) ---------- */
export const GithubIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
export const LinkedinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

/* ---------- Section scaffolding ---------- */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <header className={`reveal mb-10 flex flex-col gap-3 ${align === 'center' ? 'items-center text-center' : ''}`}>
      <p className="eyebrow flex items-center gap-2">
        <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-[1px] bg-accent" />
        {eyebrow}
      </p>
      <h2 className="max-w-3xl text-3xl font-bold leading-[1.1] text-fg sm:text-4xl">{title}</h2>
      {lead && <p className="max-w-2xl text-base text-muted sm:text-lg">{lead}</p>}
    </header>
  );
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'accent' | 'signal' | 'violet' }) {
  const tones = {
    default: 'border-line2 text-muted',
    accent: 'border-accent/40 text-accent',
    signal: 'border-signal/40 text-signal',
    violet: 'border-violet/40 text-violet',
  };
  return (
    <span className={`inline-flex items-center rounded-[3px] border px-2 py-0.5 font-mono text-[0.72rem] leading-5 ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const live = /ongoing|progress|development/i.test(status);
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-wider text-muted">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${live ? 'live-dot bg-signal' : 'bg-dim'}`}
      />
      {status}
    </span>
  );
}

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-[3px] px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-2';
export const btn = {
  primary: `${btnBase} bg-accent text-onaccent hover:bg-fg`,
  secondary: `${btnBase} border border-line2 text-fg hover:border-accent hover:text-accent`,
  ghost: `${btnBase} px-2 text-muted hover:text-accent`,
};

/* ---------- Navigation to sections on the home page ---------- */

/** Links to a section of the home page, working from any route and with hash or browser routing. */
export function SectionLink({
  section,
  children,
  className,
  onNavigate,
}: {
  section: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const go = (e: MouseEvent) => {
    e.preventDefault();
    onNavigate?.();
    if (location.pathname === '/') {
      scrollToSection(section);
      window.history.replaceState(window.history.state, '');
    } else {
      navigate('/', { state: { section } });
    }
  };
  return (
    <Link to="/" state={{ section }} onClick={go} className={className}>
      {children}
    </Link>
  );
}

export function scrollToSection(id: string) {
  if (id === 'top') return window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** On the home page, scroll to a section requested via navigation state. */
export function useSectionFromState() {
  const location = useLocation();
  useEffect(() => {
    const section = (location.state as { section?: string } | null)?.section;
    if (section) {
      // wait a frame so the page has laid out
      requestAnimationFrame(() => setTimeout(() => scrollToSection(section), 30));
    }
  }, [location]);
}
