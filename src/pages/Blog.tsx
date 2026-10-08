import { useMemo, useState } from 'react';
import { blogCategories, posts } from '../lib/posts';
import { usePageMeta } from '../hooks/hooks';
import { Container } from '../components/ui/ui';
import PostCard from '../components/PostCard';

export default function Blog() {
  usePageMeta('Engineering Notes', "Things I'm building, learning, testing and breaking — notes on embedded systems, TinyML, IoT, edge AI and robotics.", '/blog');
  const [cat, setCat] = useState<string>('All');
  const [query, setQuery] = useState('');

  const used = blogCategories.filter((c) => posts.some((p) => p.category === c));
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (cat === 'All' || p.category === cat) &&
        (!q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))),
    );
  }, [cat, query]);
  const drafts = posts.filter((p) => p.draft).length;

  return (
    <>
      <section className="board-grid border-b border-line">
        <Container className="flex flex-col gap-5 py-16 sm:py-24">
          <p className="eyebrow">Blog</p>
          <h1 className="display-wide text-5xl leading-[1] text-fg sm:text-7xl">Engineering Notes</h1>
          <p className="max-w-2xl text-xl text-muted">Things I'm building, learning, testing and breaking.</p>
          {drafts === posts.length && (
            <p className="font-mono text-sm text-dim">
              {drafts} notes in draft. Full articles are being written and will be published here.
            </p>
          )}
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
              {['All', ...used].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={`rounded-[3px] border px-3 py-1.5 font-mono text-xs transition-colors ${
                    cat === c ? 'border-accent bg-accent/10 text-accent' : 'border-line2 text-muted hover:text-fg'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="lg:w-72">
              <label htmlFor="blog-search" className="sr-only">
                Search notes
              </label>
              <input
                id="blog-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes…"
                className="w-full rounded-[3px] border border-line2 bg-bg px-3 py-2 font-mono text-sm text-fg placeholder:text-dim focus:border-accent focus:outline-none"
              />
            </div>
          </div>
          {list.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <div key={p.slug} className="flex">
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          ) : (
            <p className="panel p-8 text-center text-muted">No notes match that filter yet.</p>
          )}
        </Container>
      </section>
    </>
  );
}
