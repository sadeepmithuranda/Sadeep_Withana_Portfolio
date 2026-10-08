import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, FlaskConical, Gauge, HardDrive, Layers, Timer } from 'lucide-react';
import { research } from '../data/profile';
import { posts } from '../lib/posts';
import { usePageMeta } from '../hooks/hooks';
import { Container, SectionHeader, Tag, btn } from '../components/ui/ui';
import { Pipeline, SignalChain } from '../components/visuals/Pipeline';
import PostCard from '../components/PostCard';

const evalIcons = [FlaskConical, HardDrive, Timer, Layers, Gauge];

export default function Research() {
  usePageMeta(
    'Research Lab',
    'TinyML and edge AI research by Sadeep Withana: the impact of INT8 quantization on compact ECG-based atrial fibrillation detection on the ESP32-S3.',
    '/research',
  );
  const r = research.current;
  const notes = posts.filter((p) => p.category === 'Research' || p.category === 'TinyML' || p.category === 'Edge AI').slice(0, 3);

  return (
    <>
      <section className="board-grid border-b border-line">
        <Container className="flex flex-col gap-6 py-16 sm:py-24">
          <p className="eyebrow">Research</p>
          <h1 className="display-wide text-5xl leading-[1] text-fg sm:text-7xl">Research Lab</h1>
          <p className="max-w-2xl text-xl text-muted">Exploring intelligent computing at the edge.</p>
          <div className="flex flex-wrap gap-2">
            {research.interests.map((i) => (
              <Tag key={i} tone="accent">
                {i}
              </Tag>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 sm:py-20">
        <Container>
          <div className="panel reg-marks grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="flex min-w-0 flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <Tag tone="signal">Current research</Tag>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" /> {r.status}
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-fg sm:text-4xl" style={{ fontStretch: '108%' }}>
                {r.title}
              </h2>
              <blockquote className="border-l-2 border-accent pl-4 text-lg text-fg">
                <p className="mb-1 font-mono text-xs uppercase tracking-wider text-dim">Research question</p>
                {r.question}
              </blockquote>
              <p className="max-w-prose text-muted">
                A compact 1D CNN is trained on single-lead ECG to separate atrial fibrillation from normal rhythm. The same
                model is evaluated twice on the ESP32-S3: once as a Float32 baseline and once after INT8 quantization. The
                interest is in the trade-off: what is gained in memory and speed, and what, if anything, is lost in detection
                performance.
              </p>
            </div>
            <div className="flex min-w-0 flex-col gap-6">
              <dl className="divide-y divide-line border-y border-line">
                {r.spec.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[120px_1fr] gap-3 py-3">
                    <dt className="font-mono text-[0.72rem] uppercase tracking-wider text-dim">{k}</dt>
                    <dd className="text-sm text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="eyebrow mb-3 !text-dim">Evaluation</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {r.evaluation.map((e, i) => {
                    const Icon = evalIcons[i] ?? Cpu;
                    return (
                      <li key={e} className="flex items-center gap-2.5 text-sm text-fg">
                        <Icon size={15} className="shrink-0 text-accent" aria-hidden="true" /> {e}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Pipeline"
            title="Seven steps from dataset to on-device comparison."
            lead="The two highlighted stages are the core of the study: the same model before and after quantization."
          />
          <Pipeline steps={r.pipeline} highlight={['Float32 Baseline', 'INT8 Quantization']} />
        </Container>
      </section>

      <section className="border-b border-line py-16 sm:py-20">
        <Container>
          <SectionHeader eyebrow="Signal path" title="From an ECG trace to a decision on the chip." />
          <SignalChain />
        </Container>
      </section>

      <section className="border-b border-line py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="panel flex flex-col gap-3 p-6 sm:p-8">
            <p className="eyebrow !text-dim">Results</p>
            <h3 className="text-2xl font-bold text-fg">Coming soon</h3>
            <p className="text-muted">
              Detection performance, memory, latency and model size for both versions will be published here once the
              experiments are complete. No numbers are shown until they are measured.
            </p>
          </div>
          <div className="panel flex flex-col gap-3 p-6 sm:p-8">
            <p className="eyebrow !text-dim">Publications</p>
            <h3 className="text-2xl font-bold text-fg">Coming soon</h3>
            <p className="text-muted">Papers, reports and posters from this work will be listed here as they are released.</p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Research notes" title="Writing from the lab bench." />
            <Link to="/blog" className={`${btn.secondary} mb-10`}>
              All notes <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {notes.map((p) => (
              <div key={p.slug} className="flex">
                <PostCard post={p} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
