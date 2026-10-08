import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { getProject, projects } from '../data/projects';
import { usePageMeta } from '../hooks/hooks';
import { Container, GithubIcon, StatusPill, Tag, btn } from '../components/ui/ui';
import ProjectVisual from '../components/visuals/ProjectVisual';
import NotFound from './NotFound';

export default function Project() {
  const { slug = '' } = useParams();
  const p = getProject(slug);
  usePageMeta(p?.title ?? 'Not found', p?.summary, `/projects/${slug}`);
  if (!p) return <NotFound />;
  const cs = p.caseStudy;
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article>
      <header className="board-grid border-b border-line">
        <Container className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="flex min-w-0 flex-col gap-5">
            <Link to="/" state={{ section: 'projects' }} className="inline-flex w-fit items-center gap-2 font-mono text-xs text-muted hover:text-accent">
              <ArrowLeft size={14} aria-hidden="true" /> All projects
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-wider text-accent">{p.category}</span>
              <StatusPill status={p.status} />
            </div>
            <h1 className="text-4xl font-bold leading-[1.05] text-fg sm:text-5xl" style={{ fontStretch: '115%' }}>
              {p.title}
            </h1>
            <p className="max-w-xl text-lg text-muted">{p.summary}</p>
            {cs.role && (
              <p className="font-mono text-sm text-fg">
                <span className="text-dim">my role · </span>
                {cs.role}
              </p>
            )}
            {(p.links.github || p.links.demo) && (
              <div className="flex flex-wrap gap-3">
                {p.links.github && (
                  <a href={p.links.github} target="_blank" rel="noreferrer" className={btn.secondary}>
                    <GithubIcon width={16} height={16} /> GitHub
                  </a>
                )}
                {p.links.demo && (
                  <a href={p.links.demo} target="_blank" rel="noreferrer" className={btn.primary}>
                    <ExternalLink size={16} aria-hidden="true" /> Live demo
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="panel reg-marks aspect-[2/1] min-w-0 max-w-full overflow-hidden">
            <ProjectVisual kind={p.visual} />
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_300px]">
        <div className="flex min-w-0 flex-col gap-12">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-fg">Overview</h2>
            <p className="max-w-prose text-muted">{cs.overview}</p>
            {cs.question && (
              <blockquote className="mt-6 max-w-prose border-l-2 border-accent pl-4 text-lg text-fg">
                <p className="mb-1 font-mono text-xs uppercase tracking-wider text-dim">Research question</p>
                {cs.question}
              </blockquote>
            )}
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold text-fg">System architecture</h2>
            <ol className="flex flex-col">
              {cs.architecture.map((a, i) => (
                <li key={a.label} className="relative flex gap-5 pb-6 last:pb-0">
                  {i < cs.architecture.length - 1 && (
                    <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-line2" />
                  )}
                  <span className="relative z-10 grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[3px] border border-accent bg-bg font-mono text-[0.7rem] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-semibold text-fg">{a.label}</h3>
                    <p className="mt-1 text-sm text-muted">{a.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl font-bold text-fg">Engineering focus</h2>
              <ul className="flex flex-col gap-2">
                {cs.focus.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-accent" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-xl font-bold text-fg">What's next</h2>
              <ul className="flex flex-col gap-2">
                {cs.next.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[1px] border border-signal" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-8">
          <div>
            <p className="eyebrow mb-3 !text-dim">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <Tag key={t} tone="accent">
                  {t}
                </Tag>
              ))}
            </div>
          </div>
          {cs.components && (
            <div>
              <p className="eyebrow mb-3 !text-dim">Hardware</p>
              <ul className="divide-y divide-line border-y border-line">
                {cs.components.map((c) => (
                  <li key={c} className="py-2.5 text-sm text-fg">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="panel p-5">
            <p className="font-mono text-xs text-dim">Results &amp; media</p>
            <p className="mt-1 text-sm text-muted">Measurements, photos and demo video will be added as the project progresses.</p>
          </div>
        </aside>
      </Container>

      <Container>
        <Link
          to={`/projects/${next.slug}`}
          className="group flex items-center justify-between gap-4 border-y border-line py-8 transition-colors hover:border-accent/60"
        >
          <span>
            <span className="block font-mono text-xs text-dim">Next project</span>
            <span className="text-2xl font-bold text-fg group-hover:text-accent">{next.title}</span>
          </span>
          <ArrowRight className="shrink-0 text-dim group-hover:text-accent" aria-hidden="true" />
        </Link>
      </Container>
    </article>
  );
}
