# Sadeep Withana — Engineering Lab

Personal technology blog + engineering portfolio. React 18, TypeScript, Tailwind CSS v4, Vite. Dark by default with a light-mode toggle.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## Fill in your details (one file)

Everything personal that might change lives in **`src/config/site.ts`**:

| Field | What it does |
|---|---|
| `url` | Your deployed URL. Turns on canonical links, share URLs and `sitemap.xml`. |
| `links.email / github / linkedin / researchProfile` | Contact section, footer, CV. Empty = "Coming soon". |
| `githubUsername` | Turns the GitHub section on (public GitHub API, no token). |
| `featuredRepos` | Repo names to show first. |
| `contactFormEndpoint` | Formspree/Getform/etc. URL. Empty = form shown as not yet active. |
| `cv.pdfPath`, `cv.pdfAvailable` | Where the CV PDF lives and whether download buttons show. |

Nothing on the site is invented: projects with no GitHub/demo link simply hide those buttons.

## CV — view & download

- **View:** `/cv` (also `/resume`) renders the CV as a document page, with a **Web view / PDF view** switch, **Print**, **Open PDF** and **Download CV**. The home page has a "Want the complete engineering profile?" section with the same buttons.
- **Data:** `src/data/cv.json` is the single source for both the web CV and the PDF.
- **PDF:** `public/cv/Sadeep_Withana_CV.pdf` is generated from that JSON:
  ```bash
  pip install reportlab
  npm run cv:pdf
  ```
  Or drop your own PDF at the same path — the site serves whatever is there.

## Content

| What | Where |
|---|---|
| Projects + case studies | `src/data/projects.ts` |
| Bio, "What I Build", focus areas, timeline, skills, constellation, research | `src/data/profile.ts` |
| Blog posts | `src/content/blog/*.md` — see `docs/WRITING.md` |

Blog posts are drafts (outline only) until you set `status: published` and add a `date`.

## Deploy

- **Vercel:** import the repo. `vercel.json` handles clean URLs.
- **Netlify:** build `npm run build`, publish `dist`. `public/_redirects` handles clean URLs.
- **GitHub Pages:** push to `main`; `.github/workflows/deploy-pages.yml` builds with the right base path and publishes. Enable Pages → "GitHub Actions" in repo settings. The build copies `index.html` to `404.html` so deep links work.

## Structure

```
src/
  config/site.ts           links, switches
  data/                    projects, profile, cv.json
  content/blog/            Markdown posts
  lib/posts.ts             front matter, Markdown → HTML, TOC, reading time
  hooks/hooks.ts           theme, reduced motion, page meta, animated canvas
  components/
    layout/                navbar, footer
    home/                  hero, what-I-build, terminal, sections
    visuals/               circuit hero, constellation, pipeline, project schematics
  pages/                   Home, Research, Blog, Article, Project, CV, NotFound
scripts/                   CV PDF builder, postbuild (404 + sitemap)
```

Accessibility: semantic landmarks, skip link, keyboard-navigable controls, visible focus, `prefers-reduced-motion` respected (canvases draw a still frame).
