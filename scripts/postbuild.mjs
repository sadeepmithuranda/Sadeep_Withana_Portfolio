// Runs after `vite build`:
//  • copies index.html → 404.html so clean URLs work on GitHub Pages
//  • writes sitemap.xml (and points robots.txt at it) when site.url is set in src/config/site.ts
import { readFileSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
copyFileSync(join(dist, 'index.html'), join(dist, '404.html'));

const siteTs = readFileSync('src/config/site.ts', 'utf8');
const url = (siteTs.match(/\burl:\s*'([^']*)'/)?.[1] ?? '').replace(/\/$/, '');
const projects = [...readFileSync('src/data/projects.ts', 'utf8').matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const posts = readdirSync('src/content/blog').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
const routes = ['/', '/research', '/blog', '/cv', ...projects.map((s) => `/projects/${s}`), ...posts.map((s) => `/blog/${s}`)];

if (url) {
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    routes.map((r) => `  <url><loc>${url}${r}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  writeFileSync(join(dist, 'sitemap.xml'), xml);
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${url}/sitemap.xml\n`);
  console.log(`sitemap.xml written with ${routes.length} routes`);
} else {
  console.log('Skipped sitemap.xml — set `url` in src/config/site.ts to generate it.');
}
