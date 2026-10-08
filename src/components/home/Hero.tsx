import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Microscope } from 'lucide-react';
import CircuitHero from '../visuals/CircuitHero';
import { profile } from '../../data/profile';
import { Container, SectionLink, btn } from '../ui/ui';

export default function Hero() {
  const tags = ['TinyML', 'IoT', 'Embedded Systems', 'Edge AI', 'Robotics'];
  return (
    <section id="top" className="board-grid relative overflow-hidden border-b border-line">
      <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:py-24">
        <div className="flex min-w-0 flex-col gap-6">
          <p className="eyebrow flex items-center gap-2">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
            Engineering lab · KDU, Sri Lanka
          </p>
          <h1 className="display-wide text-[2.5rem] leading-[1.02] text-fg sm:text-6xl lg:text-[4.1rem]">
            Hi, I'm <span className="text-accent">Sadeep</span> Withana.
          </h1>
          <p className="font-mono text-sm leading-7 text-muted">
            Computer Engineering Undergraduate
            {tags.map((t) => (
              <span key={t}>
                <span className="px-2 text-dim" aria-hidden="true">|</span>
                <span className="text-fg">{t}</span>
              </span>
            ))}
          </p>
          <p className="max-w-xl text-lg leading-relaxed text-fg sm:text-xl">{profile.intro}</p>
          <p className="max-w-xl text-base text-muted">{profile.introMore}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <SectionLink section="projects" className={btn.primary}>
              Explore My Work <ArrowRight size={16} aria-hidden="true" />
            </SectionLink>
            <Link to="/blog" className={btn.secondary}>
              <BookOpen size={16} aria-hidden="true" /> Read My Blog
            </Link>
            <Link to="/research" className={btn.secondary}>
              <Microscope size={16} aria-hidden="true" /> View Research
            </Link>
          </div>
        </div>

        <div className="panel reg-marks min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-xs">
            <span className="text-muted">bench://signal-path</span>
            <span className="text-dim">hover the board</span>
          </div>
          <div className="aspect-[640/460] w-full max-w-full">
            <CircuitHero />
          </div>
        </div>
      </Container>
    </section>
  );
}
