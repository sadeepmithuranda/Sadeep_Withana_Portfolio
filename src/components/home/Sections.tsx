import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Copy, Download, FileText, GitBranch, Mail, Microscope, Star } from 'lucide-react';
import Terminal from './Terminal';
import ProfileBadge from './ProfileBadge';
import Constellation from '../visuals/Constellation';
import { Pipeline } from '../visuals/Pipeline';
import { focusAreas, profile, research, skillTiers, timeline } from '../../data/profile';
import { posts } from '../../lib/posts';
import { asset, site } from '../../config/site';
import { Container, GithubIcon, LinkedinIcon, SectionHeader, Tag, btn } from '../ui/ui';
import PostCard from '../PostCard';

/* ---------------- About ---------------- */
export function About() {
  const facts: [string, string][] = [
    ['Degree', profile.degree],
    ['Faculty', profile.faculty],
    ['University', profile.university],
    ['Based in', profile.country],
  ];
  return (
    <section id="about" className="border-b border-line py-20 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="min-w-0">
          <SectionHeader eyebrow="About" title="Engineering systems that connect the physical and digital worlds." />
          <div className="reveal flex max-w-[62ch] flex-col gap-4 text-muted">
            <p>
              I'm a Computer Engineering undergraduate at General Sir John Kotelawala Defence University (KDU) in Sri Lanka,
              studying in the Faculty of Computing.
            </p>
            <p>
              I chose Computer Engineering because I didn't want to pick between hardware and software. I've always been
              curious about electronic systems and how hardware actually works, and I also wanted to build with modern
              software and AI. This degree is where both of those live.
            </p>
            <p>
              Most of my time now goes into the overlap between <span className="text-fg">electronics</span>,{' '}
              <span className="text-fg">embedded computing</span>, <span className="text-fg">software</span>,{' '}
              <span className="text-fg">artificial intelligence</span>, <span className="text-fg">IoT</span> and{' '}
              <span className="text-fg">robotics</span>: wiring up sensor nodes, writing firmware, training small models and
              working out how to make them run on a microcontroller. My current research looks at what INT8 quantization
              changes when a compact ECG model runs on an ESP32-S3.
            </p>
          </div>
          <dl className="reveal mt-8 grid border-t border-line sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 border-b border-line py-3 sm:pr-4">
                <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-dim">{k}</dt>
                <dd className="text-sm text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="reveal flex min-w-0 flex-col gap-5 lg:pt-16">
          <ProfileBadge />
          <Terminal />
          <p className="-mt-2 font-mono text-xs text-dim">Try it: type a command and press Enter.</p>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Technical focus areas ---------------- */
export function FocusAreas() {
  const [active, setActive] = useState(focusAreas[0].id);
  const area = focusAreas.find((a) => a.id === active)!;
  return (
    <section id="focus" className="border-b border-line py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Technical focus"
          title="The toolkit, by layer."
          lead="What I work with across embedded systems, connectivity, machine learning and the hardware itself."
        />
        <div className="reveal grid gap-6 md:grid-cols-[260px_1fr]">
          <div role="tablist" aria-label="Focus areas" className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
            {focusAreas.map((a) => (
              <button
                key={a.id}
                role="tab"
                type="button"
                id={`tab-${a.id}`}
                aria-selected={active === a.id}
                aria-controls={`panel-${a.id}`}
                onClick={() => setActive(a.id)}
                onMouseEnter={() => setActive(a.id)}
                className={`shrink-0 whitespace-nowrap rounded-[3px] border px-4 py-2.5 text-left text-sm transition-colors md:whitespace-normal ${
                  active === a.id ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-line2 hover:text-fg'
                }`}
              >
                {a.title}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id={`panel-${area.id}`}
            aria-labelledby={`tab-${area.id}`}
            className="panel board-grid min-w-0 p-6 sm:p-8"
          >
            <h3 className="display-wide text-2xl text-fg sm:text-3xl">{area.title}</h3>
            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {area.items.map((it) => (
                <li key={it} className="flex items-center gap-3 border-b border-line pb-3 text-fg">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-[1px] bg-accent" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Research teaser ---------------- */
export function ResearchTeaser() {
  const r = research.current;
  return (
    <section id="research" className="border-b border-line py-20 sm:py-24">
      <Container>
        <SectionHeader eyebrow="Research Lab" title="Exploring intelligent computing at the edge." />
        <div className="panel reg-marks reveal grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Tag tone="signal">Current research</Tag>
              <span className="font-mono text-xs text-muted">{r.status}</span>
            </div>
            <h3 className="text-2xl font-bold leading-tight text-fg sm:text-3xl" style={{ fontStretch: '108%' }}>
              {r.title}
            </h3>
            <p className="text-muted">
              <span className="text-fg">Question: </span>
              {r.question}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link to="/research" className={btn.primary}>
                <Microscope size={16} aria-hidden="true" /> Open the Research Lab
              </Link>
              <Link to="/projects/tinyml-af-detection" className={btn.secondary}>
                Project case study
              </Link>
            </div>
          </div>
          <dl className="grid min-w-0 grid-cols-2 gap-px self-start overflow-hidden rounded-[3px] border border-line bg-line">
            {r.spec.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 bg-panel p-3">
                <dt className="font-mono text-[0.68rem] uppercase tracking-wider text-dim">{k}</dt>
                <dd className="text-sm text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="reveal mt-6">
          <Pipeline steps={r.pipeline} highlight={['Float32 Baseline', 'INT8 Quantization']} />
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Timeline ---------------- */
export function Timeline() {
  return (
    <section id="journey" className="border-b border-line py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Engineering journey"
          title="How the interests stacked up."
          lead="Each stage built on the one before it. The order matters more than the dates."
        />
        <ol className="reveal relative grid gap-0 lg:grid-cols-8">
          <span aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-line2 lg:left-0 lg:top-[7px] lg:h-px lg:w-full" />
          {timeline.map((s, i) => (
            <li key={s.label} className="relative flex gap-5 pb-8 lg:flex-col lg:gap-4 lg:pb-0 lg:pr-4">
              <span
                aria-hidden="true"
                className={`relative z-10 mt-1 h-[15px] w-[15px] shrink-0 rounded-[2px] border lg:mt-0 ${
                  s.current ? 'live-dot border-signal bg-signal' : 'border-accent bg-bg'
                }`}
              />
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="font-mono text-[0.68rem] text-dim">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={`text-base font-semibold ${s.current ? 'text-signal' : 'text-fg'}`}>{s.label}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ---------------- Skills + constellation ---------------- */
export function Skills() {
  const tone = { comfortable: 'accent', exploring: 'signal', research: 'violet' } as const;
  return (
    <section id="skills" className="border-b border-line py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Skills"
          title="Grouped by experience, not by made-up percentages."
          lead="What I already use with confidence, what I'm learning right now, and the questions I want to keep working on."
        />
        <div className="reveal grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-3">
          {skillTiers.map((t) => (
            <div key={t.id} className="flex min-w-0 flex-col gap-4 bg-panel p-6">
              <div>
                <h3 className="text-lg font-bold text-fg" style={{ fontStretch: '112%' }}>
                  {t.title}
                </h3>
                <p className="mt-1 text-sm text-dim">{t.note}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.items.map((s) => (
                  <Tag key={s} tone={tone[t.id as keyof typeof tone]}>
                    {s}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-16">
          <div className="mb-2 flex flex-col items-center gap-2 text-center">
            <p className="eyebrow">Technology universe</p>
            <h3 className="text-2xl font-bold text-fg">How it all connects</h3>
          </div>
          <Constellation />
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Blog teaser ---------------- */
export function BlogTeaser() {
  const list = posts.slice(0, 3);
  return (
    <section id="notes" className="border-b border-line py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="Engineering Notes" title="Things I'm building, learning, testing and breaking." />
          <Link to="/blog" className={`${btn.secondary} reveal mb-10`}>
            <BookOpen size={16} aria-hidden="true" /> All notes
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {list.map((p) => (
            <div key={p.slug} className="reveal flex">
              <PostCard post={p} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- GitHub ---------------- */
interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}

export function GitHubSection() {
  const user = site.githubUsername;
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=30`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Repo[]) => {
        const own = data.filter((r) => !r.fork);
        const featured = site.featuredRepos
          .map((n) => own.find((r) => r.name === n))
          .filter((r): r is Repo => Boolean(r));
        const rest = own.filter((r) => !site.featuredRepos.includes(r.name));
        setRepos([...featured, ...rest].slice(0, 6));
      })
      .catch(() => setError(true));
  }, [user]);

  const languages = repos
    ? Object.entries(
        repos.reduce<Record<string, number>>((acc, r) => {
          if (r.language) acc[r.language] = (acc[r.language] ?? 0) + 1;
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <section id="github" className="border-b border-line py-20 sm:py-24">
      <Container>
        <SectionHeader eyebrow="GitHub" title="Code, firmware and experiments." />
        {!user && (
          <div className="panel reveal flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[3px] border border-line2 text-muted">
                <GithubIcon width={20} height={20} />
              </span>
              <div>
                <p className="font-semibold text-fg">Repositories coming soon</p>
                <p className="mt-1 max-w-xl text-sm text-muted">
                  Selected repositories, languages and recent activity will appear here once the GitHub profile is connected.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 opacity-60" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="h-8 w-14 rounded-[3px] border border-dashed border-line2" />
              ))}
            </div>
          </div>
        )}
        {user && error && <p className="panel p-6 text-muted">Couldn't reach GitHub right now. The repositories are on the profile.</p>}
        {user && !error && (
          <div className="flex flex-col gap-6">
            {languages.length > 0 && (
              <div className="reveal flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-dim">languages</span>
                {languages.map(([l, n]) => (
                  <Tag key={l} tone="accent">
                    {l} · {n}
                  </Tag>
                ))}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(repos ?? Array.from({ length: 3 }, () => null)).map((r, i) =>
                r ? (
                  <a
                    key={r.name}
                    href={r.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="panel reveal flex min-w-0 flex-col gap-3 p-5 transition-colors hover:border-accent/60"
                  >
                    <span className="flex items-center gap-2 font-mono text-sm text-fg">
                      <GitBranch size={15} className="shrink-0 text-accent" aria-hidden="true" />
                      <span className="truncate">{r.name}</span>
                    </span>
                    <span className="line-clamp-2 text-sm text-muted">{r.description ?? 'No description yet.'}</span>
                    <span className="mt-auto flex items-center gap-4 font-mono text-xs text-dim">
                      {r.language && <span>{r.language}</span>}
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} aria-hidden="true" /> {r.stargazers_count}
                      </span>
                      <span>updated {new Date(r.pushed_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                    </span>
                  </a>
                ) : (
                  <div key={i} className="panel h-32 animate-pulse" />
                ),
              )}
            </div>
            <a href={`https://github.com/${user}`} target="_blank" rel="noreferrer" className={`${btn.secondary} w-fit`}>
              <GithubIcon width={16} height={16} /> View all on GitHub
            </a>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ---------------- CV call to action ---------------- */
export function CvCta() {
  const { pdfAvailable, pdfPath, downloadName } = site.cv;
  return (
    <section id="resume" className="border-b border-line py-20 sm:py-24">
      <Container>
        <div className="panel reg-marks board-grid reveal flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">Resume / CV</p>
            <h2 className="display-wide text-3xl text-fg sm:text-4xl">Want the complete engineering profile?</h2>
            <p className="mt-3 text-muted">Education, research, projects and skills on one page. Read it here or take the PDF with you.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {pdfAvailable && (
              <a href={asset(pdfPath)} download={downloadName} className={btn.primary}>
                <Download size={16} aria-hidden="true" /> Download CV
              </a>
            )}
            <Link to="/cv" className={btn.secondary}>
              <FileText size={16} aria-hidden="true" /> View Resume
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy email address"
      onClick={() =>
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1600);
          })
          .catch(() => undefined)
      }
      className="grid h-8 w-8 place-items-center rounded-[3px] text-muted hover:text-accent"
    >
      {done ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

export function Contact() {
  const { email, github, linkedin, researchProfile } = site.links;
  const endpoint = site.contactFormEndpoint;
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const channels = [
    { label: 'Email', value: email, href: email ? `mailto:${email}` : '', icon: <Mail size={18} aria-hidden="true" /> },
    { label: 'GitHub', value: github.replace(/^https?:\/\/(www\.)?/, ''), href: github, icon: <GithubIcon /> },
    { label: 'LinkedIn', value: linkedin.replace(/^https?:\/\/(www\.)?/, ''), href: linkedin, icon: <LinkedinIcon /> },
    { label: 'Research profile', value: researchProfile.replace(/^https?:\/\/(www\.)?/, ''), href: researchProfile, icon: <Microscope size={18} aria-hidden="true" /> },
  ];

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!endpoint) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data._honey) return; // spam bot filled the hidden field
    setState('sending');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          topic: data.topic,
          message: data.message,
          _replyto: data.email,
          _subject: `Portfolio message: ${data.topic} — ${data.name}`,
          _template: 'table',
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(json.success) === 'false') throw new Error('send failed');
      setState('sent');
      form.reset();
    } catch {
      setState('error');
    }
  };

  const field =
    'w-full rounded-[3px] border border-line2 bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-dim focus:border-accent focus:outline-none disabled:opacity-60';

  return (
    <section id="contact" className="py-20 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div className="min-w-0">
          <SectionHeader
            eyebrow="Contact"
            title={<span className="display-wide">Let's Build Something Intelligent.</span>}
            lead="Interested in embedded systems, TinyML, IoT, robotics, edge AI or collaborative engineering projects? Let's connect."
          />
          <ul className="reveal flex flex-col divide-y divide-line border-y border-line">
            {channels.map((c) => (
              <li key={c.label} className="flex items-center gap-4 py-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] border border-line2 text-accent">{c.icon}</span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-dim">{c.label}</span>
                  {c.value ? (
                    <a href={c.href} target={c.label === 'Email' ? undefined : '_blank'} rel="noreferrer" className="truncate text-fg hover:text-accent">
                      {c.value}
                    </a>
                  ) : (
                    <span className="text-muted">Coming soon</span>
                  )}
                </div>
                {c.label === 'Email' && email && <CopyButton text={email} />}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="panel reveal flex min-w-0 flex-col gap-4 self-start p-6 sm:p-8" aria-describedby="form-note">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Send a message</p>
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cf-name" className="text-sm text-fg">Name</label>
              <input id="cf-name" name="name" required className={field} disabled={!endpoint} autoComplete="name" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cf-email" className="text-sm text-fg">Email</label>
              <input id="cf-email" name="email" type="email" required className={field} disabled={!endpoint} autoComplete="email" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cf-topic" className="text-sm text-fg">Topic</label>
            <select id="cf-topic" name="topic" className={field} disabled={!endpoint} defaultValue="Collaboration">
              {['Collaboration', 'Research', 'Internship / role', 'Something I wrote', 'Other'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cf-msg" className="text-sm text-fg">Message</label>
            <textarea id="cf-msg" name="message" rows={5} required className={field} disabled={!endpoint} />
          </div>
          <button type="submit" className={`${btn.primary} disabled:cursor-not-allowed disabled:opacity-50`} disabled={!endpoint || state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Send message'} <ArrowRight size={16} aria-hidden="true" />
          </button>
          <p id="form-note" className="text-sm text-dim" role="status">
            {!endpoint && 'The contact form is being set up. Use the channels on the left once they are live.'}
            {state === 'sent' && 'Message sent. Thanks, I’ll reply by email.'}
            {state === 'error' && 'The message didn’t go through. Check your connection and try again.'}
          </p>
        </form>
      </Container>
    </section>
  );
}
