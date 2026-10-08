import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileText, Printer, ScrollText } from 'lucide-react';
import cv from '../data/cv.json';
import { asset, site } from '../config/site';
import { usePageMeta } from '../hooks/hooks';
import { Container, btn } from '../components/ui/ui';

type View = 'web' | 'pdf';

function SheetSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid-page">
      <h2 className="mb-3 flex items-center gap-3 font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-inkaccent">
        {title}
        <span className="h-px flex-1 bg-inkline" aria-hidden="true" />
      </h2>
      {children}
    </section>
  );
}

/** The CV rendered as a document page, from the same data as the PDF. */
function CvSheet() {
  const { email, github, linkedin, researchProfile } = site.links;
  const strip = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '');
  const contact = [
    email && { label: email, href: `mailto:${email}` },
    github && { label: strip(github), href: github },
    linkedin && { label: strip(linkedin), href: linkedin },
    researchProfile && { label: strip(researchProfile), href: researchProfile },
    site.url && { label: strip(site.url), href: site.url },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <article
      className="cv-sheet mx-auto w-full max-w-[820px] rounded-[2px] bg-paper px-6 py-9 text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:px-12 sm:py-12"
      aria-label="Curriculum vitae of Sadeep Withana"
    >
      <header className="flex flex-col gap-4 border-b-2 border-ink pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[2.1rem] font-bold leading-none tracking-tight sm:text-[2.6rem]" style={{ fontStretch: '118%' }}>
            {cv.name}
          </h1>
          <p className="mt-2 text-base font-medium">{cv.title}</p>
          <p className="mt-0.5 font-mono text-[0.78rem] text-inkmuted">{cv.focus}</p>
        </div>
        <ul className="flex flex-col gap-0.5 text-[0.82rem] sm:items-end">
          <li className="text-inkmuted">{cv.location}</li>
          {contact.map((c) => (
            <li key={c.href}>
              <a href={c.href} className="text-ink underline decoration-inkline underline-offset-2 hover:decoration-inkaccent">
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-7 flex flex-col gap-7 text-[0.9rem] leading-relaxed">
        <SheetSection title="Profile">
          <p className="text-inkmuted">{cv.summary}</p>
        </SheetSection>

        <SheetSection title="Education">
          {cv.education.map((e) => (
            <div key={e.degree} className="flex flex-col gap-1.5">
              <div className="flex flex-col justify-between gap-x-4 sm:flex-row sm:items-baseline">
                <h3 className="font-semibold">{e.degree}</h3>
                <span className="font-mono text-[0.75rem] text-inkmuted">{e.period}</span>
              </div>
              <p>{e.institution}</p>
              <p className="text-inkmuted">{e.detail}</p>
              <p className="text-inkmuted">
                <span className="text-ink">Relevant coursework: </span>
                {e.coursework.join(', ')}
              </p>
            </div>
          ))}
        </SheetSection>

        <SheetSection title="Research">
          {cv.research.map((r) => (
            <div key={r.title} className="flex flex-col gap-1.5">
              <div className="flex flex-col justify-between gap-x-4 sm:flex-row sm:items-baseline">
                <h3 className="font-semibold">{r.title}</h3>
                <span className="shrink-0 font-mono text-[0.75rem] text-inkmuted">{r.status}</span>
              </div>
              <ul className="ml-4 list-[square] text-inkmuted marker:text-inkaccent">
                {r.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </SheetSection>

        <SheetSection title="Projects">
          <div className="flex flex-col gap-4">
            {cv.projects.map((p) => (
              <div key={p.title} className="flex flex-col gap-1 break-inside-avoid">
                <div className="flex flex-col justify-between gap-x-4 sm:flex-row sm:items-baseline">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className="shrink-0 font-mono text-[0.72rem] text-inkmuted sm:text-right">{p.status}</span>
                </div>
                <p className="font-mono text-[0.74rem] text-inkaccent">{p.tech}</p>
                <ul className="ml-4 list-[square] text-inkmuted marker:text-inkaccent">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SheetSection>

        <SheetSection title="Skills">
          <dl className="flex flex-col gap-1.5">
            {cv.skills.map((s) => (
              <div key={s.group} className="grid gap-x-4 sm:grid-cols-[150px_1fr]">
                <dt className="font-semibold">{s.group}</dt>
                <dd className="text-inkmuted">{s.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </SheetSection>

        <SheetSection title="Research interests">
          <p className="text-inkmuted">{cv.interests.join(' · ')}</p>
        </SheetSection>
      </div>
    </article>
  );
}

export default function CV() {
  usePageMeta('CV / Resume', 'Curriculum vitae of Sadeep Withana, Computer Engineering undergraduate at KDU, Sri Lanka.', '/cv');
  const [view, setView] = useState<View>('web');
  const { pdfAvailable, pdfPath, downloadName } = site.cv;
  const pdfUrl = asset(pdfPath);

  const tab = (v: View, label: string, Icon: typeof FileText) => (
    <button
      type="button"
      role="tab"
      aria-selected={view === v}
      onClick={() => setView(v)}
      className={`inline-flex items-center gap-2 rounded-[3px] px-3 py-1.5 font-mono text-xs transition-colors ${
        view === v ? 'bg-accent text-onaccent' : 'text-muted hover:text-fg'
      }`}
    >
      <Icon size={14} aria-hidden="true" /> {label}
    </button>
  );

  return (
    <div className="board-grid min-h-[70vh] border-b border-line pb-16">
      <div className="no-print border-b border-line bg-bg/80 backdrop-blur">
        <Container className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <Link to="/" className="inline-flex w-fit items-center gap-2 font-mono text-xs text-muted hover:text-accent">
              <ArrowLeft size={14} aria-hidden="true" /> Home
            </Link>
            <h1 className="display-wide text-2xl text-fg sm:text-3xl">Curriculum Vitae</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pdfAvailable && (
              <div role="tablist" aria-label="CV view" className="flex rounded-[4px] border border-line2 p-0.5">
                {tab('web', 'Web view', ScrollText)}
                {tab('pdf', 'PDF view', FileText)}
              </div>
            )}
            <button type="button" onClick={() => window.print()} className={btn.ghost}>
              <Printer size={16} aria-hidden="true" /> Print
            </button>
            {pdfAvailable && (
              <>
                <a href={pdfUrl} target="_blank" rel="noreferrer" className={btn.secondary}>
                  <ExternalLink size={16} aria-hidden="true" /> Open PDF
                </a>
                <a href={pdfUrl} download={downloadName} className={btn.primary}>
                  <Download size={16} aria-hidden="true" /> Download CV
                </a>
              </>
            )}
          </div>
        </Container>
      </div>

      <Container className="pt-8 sm:pt-12">
        {view === 'web' || !pdfAvailable ? (
          <CvSheet />
        ) : (
          <div className="no-print mx-auto flex max-w-[860px] flex-col gap-3">
            <iframe
              src={`${pdfUrl}#view=FitH`}
              title="Sadeep Withana CV (PDF)"
              className="h-[80vh] min-h-[560px] w-full rounded-[3px] border border-line bg-paper"
            />
            <p className="font-mono text-xs text-dim">
              PDF not showing? Some mobile browsers can't display PDFs inline —{' '}
              <a href={pdfUrl} download={downloadName} className="text-accent underline underline-offset-2">
                download it
              </a>{' '}
              instead.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
