import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { buildChain } from '../../data/profile';
import { getProject } from '../../data/projects';
import { Container, SectionHeader, Tag } from '../ui/ui';

export default function WhatIBuild() {
  const [active, setActive] = useState(buildChain[0].id);
  const node = buildChain.find((n) => n.id === active)!;
  const activeIndex = buildChain.findIndex((n) => n.id === active);

  return (
    <section id="build" className="border-b border-line py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="What I build"
          title="From a raw sensor reading to a decision someone can use."
          lead="Each layer of the stack, with the tools I use and where it shows up in my projects. Hover or tab through the chain."
        />

        <div className="reveal grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* The chain */}
          <ol className="relative flex flex-col" aria-label="System layers">
            <span aria-hidden="true" className="absolute bottom-6 left-[15px] top-6 w-px bg-line2" />
            <span
              aria-hidden="true"
              className="absolute left-[15px] top-6 w-px bg-accent transition-all duration-500"
              style={{ height: `calc((100% - 48px) * ${activeIndex / (buildChain.length - 1)})` }}
            />
            {buildChain.map((n, i) => {
              const on = n.id === active;
              return (
                <li key={n.id} className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(n.id)}
                    onFocus={() => setActive(n.id)}
                    onClick={() => setActive(n.id)}
                    aria-pressed={on}
                    className={`group flex w-full items-center gap-4 rounded-[3px] py-2.5 pr-3 text-left transition-colors ${
                      on ? 'text-fg' : 'text-muted hover:text-fg'
                    }`}
                  >
                    <span
                      className={`relative z-10 grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[3px] border font-mono text-[0.7rem] transition-colors ${
                        on ? 'border-accent bg-accent text-onaccent' : i < activeIndex ? 'border-accent bg-bg text-accent' : 'border-line2 bg-bg text-dim'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-display text-lg font-semibold sm:text-xl ${on ? '' : ''}`} style={{ fontStretch: '110%' }}>
                      {n.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Detail panel */}
          <div className="panel flex min-w-0 flex-col gap-6 p-6 sm:p-8" aria-live="polite">
            <div>
              <p className="font-mono text-xs text-dim">
                layer {String(activeIndex + 1).padStart(2, '0')} / {String(buildChain.length).padStart(2, '0')}
              </p>
              <h3 className="mt-1 text-2xl font-bold text-fg" style={{ fontStretch: '115%' }}>
                {node.label}
              </h3>
              <p className="mt-2 text-muted">{node.note}</p>
            </div>
            <div>
              <p className="eyebrow mb-3 !text-dim">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {node.tech.map((t) => (
                  <Tag key={t} tone="accent">
                    {t}
                  </Tag>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3 !text-dim">Where it shows up</p>
              <ul className="flex flex-col divide-y divide-line border-y border-line">
                {node.projects.map((slug) => {
                  const p = getProject(slug);
                  if (!p) return null;
                  return (
                    <li key={slug}>
                      <Link
                        to={`/projects/${slug}`}
                        className="group flex items-center justify-between gap-3 py-3 text-sm text-fg transition-colors hover:text-accent"
                      >
                        <span>{p.title}</span>
                        <ArrowUpRight size={16} className="shrink-0 text-dim transition-colors group-hover:text-accent" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
