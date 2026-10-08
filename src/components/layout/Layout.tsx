import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';
import { site } from '../../config/site';
import { Container, GithubIcon, LinkedinIcon, SectionLink } from '../ui/ui';

type NavItem = { label: string; section?: string; to?: string };
const nav: NavItem[] = [
  { label: 'Home', section: 'top' },
  { label: 'About', section: 'about' },
  { label: 'Projects', section: 'projects' },
  { label: 'Research', to: '/research' },
  { label: 'Blog', to: '/blog' },
  { label: 'Skills', section: 'skills' },
  { label: 'Contact', section: 'contact' },
];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="6" y="6" width="20" height="20" rx="2" fill="none" stroke="var(--accent)" strokeWidth="1.6" />
        {[10, 16, 22].map((p) => (
          <g key={p} stroke="var(--accent)" strokeWidth="1.6">
            <line x1={p} y1="1.5" x2={p} y2="6" />
            <line x1={p} y1="26" x2={p} y2="30.5" />
            <line x1="1.5" y1={p} x2="6" y2={p} />
            <line x1="26" y1={p} x2="30.5" y2={p} />
          </g>
        ))}
        <path d="M10 17h3l1.5-4 3 7 1.5-3h3" fill="none" stroke="var(--signal)" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="font-display text-[0.95rem] font-bold tracking-tight text-fg" style={{ fontStretch: '115%' }}>
        Sadeep Withana
      </span>
    </span>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const itemClass = 'rounded-[3px] px-3 py-2 text-sm text-muted transition-colors hover:text-fg';
  const renderItem = (item: NavItem, mobile = false) => {
    const cls = mobile ? 'block border-b border-line py-3.5 font-display text-lg text-fg' : itemClass;
    if (item.to)
      return (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) => `${cls} ${isActive && !mobile ? '!text-accent' : ''}`}
        >
          {item.label}
        </NavLink>
      );
    return (
      <SectionLink key={item.label} section={item.section!} className={cls} onNavigate={() => setOpen(false)}>
        {item.label}
      </SectionLink>
    );
  };

  return (
    <header
      className={`no-print sticky z-50 border-b transition-colors duration-300 ${
        scrolled || open ? 'border-line bg-bg/85 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <SectionLink section="top" className="shrink-0" onNavigate={() => setOpen(false)}>
          <Logo />
        </SectionLink>

        <nav aria-label="Main" className="hidden items-center lg:flex">
          {nav.map((n) => renderItem(n))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            to="/cv"
            className="hidden items-center gap-1.5 rounded-[3px] border border-line2 px-3 py-1.5 font-mono text-xs text-fg transition-colors hover:border-accent hover:text-accent sm:inline-flex"
          >
            <FileText size={14} aria-hidden="true" /> CV
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-9 w-9 place-items-center rounded-[3px] text-fg lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-bg lg:hidden">
          <Container className="pb-6 pt-2">
            {nav.map((n) => renderItem(n, true))}
            <Link to="/cv" className="block py-3.5 font-display text-lg text-accent">
              CV / Resume
            </Link>
          </Container>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const { github, linkedin } = site.links;
  const col = 'flex flex-col gap-2 text-sm';
  const a = 'text-muted transition-colors hover:text-accent w-fit';
  return (
    <footer className="no-print mt-24 border-t border-line">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="font-mono text-xs leading-6 text-muted">
            Computer Engineering | Embedded Systems | TinyML | IoT | Edge AI
          </p>
          <p className="max-w-sm text-sm text-dim">{site.tagline}</p>
        </div>
        <nav aria-label="Footer" className={col}>
          <p className="eyebrow mb-1 !text-dim">Site</p>
          <SectionLink section="about" className={a}>About</SectionLink>
          <SectionLink section="projects" className={a}>Projects</SectionLink>
          <Link to="/research" className={a}>Research</Link>
          <Link to="/blog" className={a}>Blog</Link>
          <Link to="/cv" className={a}>Resume</Link>
          <SectionLink section="contact" className={a}>Contact</SectionLink>
        </nav>
        <div className={col}>
          <p className="eyebrow mb-1 !text-dim">Elsewhere</p>
          {github ? (
            <a href={github} target="_blank" rel="noreferrer" className={`${a} inline-flex items-center gap-2`}>
              <GithubIcon width={15} height={15} /> GitHub
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-dim"><GithubIcon width={15} height={15} /> GitHub · coming soon</span>
          )}
          {linkedin ? (
            <a href={linkedin} target="_blank" rel="noreferrer" className={`${a} inline-flex items-center gap-2`}>
              <LinkedinIcon width={15} height={15} /> LinkedIn
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-dim"><LinkedinIcon width={15} height={15} /> LinkedIn · coming soon</span>
          )}
        </div>
      </Container>
      <Container className="flex flex-col justify-between gap-2 border-t border-line py-6 font-mono text-xs text-dim sm:flex-row">
        <span>Designed &amp; engineered by Sadeep Withana</span>
        <span>© {new Date().getFullYear()} · Built with React, TypeScript &amp; Tailwind</span>
      </Container>
    </footer>
  );
}

export default function Layout() {
  const location = useLocation();
  useEffect(() => {
    const hasSection = (location.state as { section?: string } | null)?.section;
    if (!hasSection) window.scrollTo({ top: 0 });
  }, [location.pathname, location.state]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="no-print sr-only z-[60] rounded bg-accent px-3 py-2 text-onaccent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
