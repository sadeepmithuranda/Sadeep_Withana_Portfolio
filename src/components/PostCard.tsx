import { Link } from 'react-router-dom';
import type { Post } from '../lib/posts';
import { formatDate } from '../lib/posts';
import { asset } from '../config/site';
import { ecgSample, mod1 } from './visuals/ecg';

/** Generated cover art keyed by category, used until a real cover image is set. */
export function PostCover({ post, tall = false }: { post: Post; tall?: boolean }) {
  if (post.cover) {
    return <img src={asset(post.cover)} alt="" loading="lazy" className={`w-full object-cover ${tall ? 'aspect-[21/9]' : 'aspect-[16/9]'}`} />;
  }
  // deterministic variation per slug
  const seed = [...post.slug].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const accent =
    post.category === 'Research' || post.category === 'TinyML'
      ? 'var(--signal)'
      : post.category === 'Edge AI' || post.category === 'AI/ML'
        ? 'var(--violet)'
        : post.category === 'IoT'
          ? 'var(--blue)'
          : 'var(--accent)';
  const W = 400;
  const H = tall ? 170 : 225;
  let d = '';
  for (let x = 0; x <= W; x += 3) {
    const y =
      post.category === 'Research' || post.category === 'TinyML'
        ? H * 0.58 - ecgSample(mod1(x / 120 + seed * 0.01)) * H * 0.3
        : H * 0.58 + Math.sin(x / (18 + (seed % 9)) + seed) * H * 0.08 + Math.sin(x / 7) * H * 0.02;
    d += `${x ? 'L' : 'M'}${x},${y.toFixed(1)}`;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
      <rect width={W} height={H} fill="var(--bg-2)" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={i * 36 + (seed % 36)} y1="0" x2={i * 36 + (seed % 36)} y2={H} stroke="var(--line)" strokeWidth="0.7" />
      ))}
      <path d={d} fill="none" stroke={accent} strokeWidth="1.8" />
      <text x="16" y="26" fill="var(--dim)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.5">
        {post.category.toUpperCase()}
      </text>
    </svg>
  );
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex w-full min-w-0 flex-col overflow-hidden rounded-[4px] border border-line bg-panel transition-colors hover:border-accent/60">
      <Link to={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden border-b border-line">
        <PostCover post={post} />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] text-dim">
          <span className="uppercase tracking-wider text-accent">{post.category}</span>
          {post.draft ? (
            <span className="rounded-[2px] border border-line2 px-1.5 uppercase tracking-wider text-muted">Draft</span>
          ) : (
            <>
              <span>{formatDate(post.date)}</span>
              <span>{post.readingMinutes} min read</span>
            </>
          )}
        </div>
        <h3 className="text-lg font-bold leading-snug text-fg">
          <Link to={`/blog/${post.slug}`} className="group-hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-muted">{post.summary}</p>
      </div>
    </article>
  );
}
