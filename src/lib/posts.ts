import { Marked, type Tokens } from 'marked';

/**
 * Blog content lives in src/content/blog/*.md with simple front matter:
 *
 * ---
 * title: Post title
 * category: TinyML
 * tags: [a, b]
 * summary: One sentence.
 * date: 2026-10-08        (omit while drafting)
 * cover: /images/x.jpg    (optional, file in public/)
 * status: draft | published
 * ---
 */

export const blogCategories = [
  'Embedded Systems',
  'TinyML',
  'IoT',
  'Edge AI',
  'Robotics',
  'Electronics',
  'AI/ML',
  'Research',
  'Programming',
  'DevOps',
  'Engineering Tutorials',
  'Learning Journey',
] as const;

export interface Heading {
  id: string;
  text: string;
  depth: number;
}

export interface Post {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  date?: string;
  cover?: string;
  draft: boolean;
  readingMinutes: number;
  html: string;
  headings: Heading[];
}

const files = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

function parseFrontMatter(raw: string): { data: Record<string, string | string[]>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string | string[]> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      data[m[1]] = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      continue;
    }
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[m[1]] = value;
  }
  return { data, body: match[2] };
}

function render(body: string) {
  const headings: Heading[] = [];
  const md = new Marked({
    gfm: true,
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Heading) {
        const text = this.parser.parseInline(token.tokens);
        const id = slugify(token.text);
        if (token.depth <= 3) headings.push({ id, text: token.text, depth: token.depth });
        return `<h${token.depth} id="${id}">${text}</h${token.depth}>\n`;
      },
    },
  });
  const html = md.parse(body) as string;
  return { html, headings };
}

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(', ') : (v ?? ''));

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    const { data, body } = parseFrontMatter(raw);
    const { html, headings } = render(body);
    const words = body.split(/\s+/).filter(Boolean).length;
    return {
      slug,
      title: str(data.title) || slug,
      category: str(data.category) || 'Engineering Tutorials',
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: str(data.summary),
      date: str(data.date) || undefined,
      cover: str(data.cover) || undefined,
      draft: str(data.status) !== 'published',
      readingMinutes: Math.max(1, Math.round(words / 220)),
      html,
      headings,
    };
  })
  .sort((a, b) => {
    // Published first (newest first), then drafts in a stable order.
    if (a.draft !== b.draft) return a.draft ? 1 : -1;
    return (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title);
  });

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const relatedPosts = (post: Post, n = 3) =>
  posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: (p.category === post.category ? 2 : 0) + p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.p);

export const formatDate = (iso?: string) =>
  iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
