import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { projectCategories, projects, type Project } from '../../data/projects';
import ProjectVisual from '../visuals/ProjectVisual';
import { Container, GithubIcon, SectionHeader, StatusPill, Tag, btn } from '../ui/ui';

export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[4px] border border-line bg-panel transition-colors duration-300 hover:border-accent/60">
      <Link to={`/projects/${p.slug}`} className="block aspect-[2/1] max-w-full overflow-hidden border-b border-line" tabIndex={-1} aria-hidden="true">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          <ProjectVisual kind={p.visual} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[0.72rem] uppercase tracking-wider text-accent">{p.category}</span>
          <StatusPill status={p.status} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold leading-tight text-fg" style={{ fontStretch: '108%' }}>
            <Link to={`/projects/${p.slug}`} className="hover:text-accent">
              {p.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-muted">{p.summary}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {p.tech.slice(0, 5).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {p.tech.length > 5 && <Tag>+{p.tech.length - 5}</Tag>}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <Link to={`/projects/${p.slug}`} className={`${btn.ghost} !px-0 text-fg`}>
            Read Case Study <ArrowRight size={15} aria-hidden="true" />
          </Link>
          {p.links.github && (
            <a href={p.links.github} target="_blank" rel="noreferrer" className={btn.ghost}>
              <GithubIcon width={15} height={15} /> GitHub
            </a>
          )}
          {p.links.demo && (
            <a href={p.links.demo} target="_blank" rel="noreferrer" className={btn.ghost}>
              <ExternalLink size={15} aria-hidden="true" /> Live demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const [cat, setCat] = useState<(typeof projectCategories)[number]>('All');
  const list = cat === 'All' ? projects : projects.filter((p) => p.category === cat);

  return (
    <section id="projects" className="border-b border-line py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Projects"
          title="Things I've built and am building."
          lead="Hardware, firmware, models and the software around them. Each one has a case study with the architecture and what I'm working on next."
        />
        <div role="group" aria-label="Filter projects by category" className="reveal mb-8 flex flex-wrap gap-2">
          {projectCategories.map((c) => {
            const count = c === 'All' ? projects.length : projects.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={`rounded-[3px] border px-3 py-1.5 font-mono text-xs transition-colors ${
                  cat === c ? 'border-accent bg-accent/10 text-accent' : 'border-line2 text-muted hover:text-fg'
                }`}
              >
                {c} <span className="text-dim">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.slug} className="reveal flex">
              <ProjectCard p={p} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
