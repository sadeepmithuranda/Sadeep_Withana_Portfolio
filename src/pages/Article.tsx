import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Link2 } from 'lucide-react';
import { formatDate, getPost, relatedPosts } from '../lib/posts';
import { usePageMeta } from '../hooks/hooks';
import { site } from '../config/site';
import { Container, LinkedinIcon, Tag } from '../components/ui/ui';
import PostCard, { PostCover } from '../components/PostCard';
import NotFound from './NotFound';

function Share({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = site.url ? `${site.url}${window.location.pathname}` : window.location.href;
  const enc = encodeURIComponent;
  const a = 'grid h-9 w-9 place-items-center rounded-[3px] border border-line2 text-muted transition-colors hover:border-accent hover:text-accent';
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 font-mono text-xs text-dim">share</span>
      <a className={a} href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn">
        <LinkedinIcon width={15} height={15} />
      </a>
      <a className={a} href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noreferrer" aria-label="Share on X">
        <span className="font-mono text-sm font-semibold">X</span>
      </a>
      <button
        type="button"
        className={a}
        aria-label="Copy link"
        onClick={() =>
          navigator.clipboard
            ?.writeText(url)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            })
            .catch(() => undefined)
        }
      >
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
    </div>
  );
}

export default function Article() {
  const { slug = '' } = useParams();
  const post = getPost(slug);
  usePageMeta(post?.title ?? 'Not found', post?.summary, `/blog/${slug}`);
  if (!post) return <NotFound />;
  const related = relatedPosts(post);

  return (
    <article>
      <header className="border-b border-line">
        <Container className="flex flex-col gap-6 pb-10 pt-10 sm:pt-14">
          <Link to="/blog" className="inline-flex w-fit items-center gap-2 font-mono text-xs text-muted hover:text-accent">
            <ArrowLeft size={14} aria-hidden="true" /> Engineering Notes
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-dim">
            <span className="uppercase tracking-wider text-accent">{post.category}</span>
            {post.draft ? <span className="rounded-[2px] border border-line2 px-1.5 uppercase tracking-wider text-muted">Draft</span> : <span>{formatDate(post.date)}</span>}
            {!post.draft && <span>{post.readingMinutes} min read</span>}
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] text-fg sm:text-5xl" style={{ fontStretch: '110%' }}>
            {post.title}
          </h1>
          <p className="max-w-2xl text-lg text-muted">{post.summary}</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Tag key={t}>#{t}</Tag>
              ))}
            </div>
            <Share title={post.title} />
          </div>
        </Container>
        <Container className="pb-10">
          <div className="overflow-hidden rounded-[4px] border border-line">
            <PostCover post={post} tall />
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_240px]">
        <div className="min-w-0">
          {post.draft && (
            <div className="panel mb-8 flex flex-col gap-1 border-l-2 !border-l-accent p-5">
              <p className="font-semibold text-fg">This note is still being written.</p>
              <p className="text-sm text-muted">Below is the planned outline. The full article will replace it when it's published.</p>
            </div>
          )}
          <div className="prose-lab" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
        {post.headings.length > 0 && (
          <aside className="order-first lg:order-none">
            <nav aria-label="Table of contents" className="lg:sticky lg:top-24">
              <p className="eyebrow mb-3 !text-dim">On this page</p>
              <ol className="flex flex-col gap-2 border-l border-line">
                {post.headings.map((h) => (
                  <li key={h.id} style={{ paddingLeft: h.depth === 3 ? 28 : 14 }}>
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-sm text-muted hover:text-accent"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </Container>

      {related.length > 0 && (
        <section className="border-t border-line py-14">
          <Container>
            <h2 className="mb-6 text-2xl font-bold text-fg">Related notes</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <div key={p.slug} className="flex">
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
