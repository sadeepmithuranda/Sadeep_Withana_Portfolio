/**
 * Single place for links and switches.
 * Leave a value as an empty string until the real one exists — the UI hides
 * or shows "Coming soon" for anything empty. Nothing here is invented.
 */
export const site = {
  name: 'Sadeep Withana',
  /** Full deployed URL, no trailing slash. Used for canonical links, share links and the sitemap. */
  url: 'https://sadeepmithuranda.github.io/Sadeep_Withana_Portfolio',
  title: 'Sadeep Withana | Computer Engineering | TinyML | IoT | Embedded Systems',
  description:
    'Sadeep Withana is a Computer Engineering undergraduate exploring TinyML, IoT, embedded systems, edge AI, robotics, and intelligent hardware-software systems.',
  tagline: 'Building intelligent systems at the edge — one sensor, microcontroller and model at a time.',

  links: {
    email: 'sadeepmithuranda@gmail.com', // e.g. 'you@example.com'
    github: 'https://github.com/sadeepmithuranda',
    linkedin: 'https://www.linkedin.com/in/sadeep-withana-006b8034a', // e.g. 'https://www.linkedin.com/in/your-handle'
    researchProfile: '', // e.g. ORCID / Google Scholar / ResearchGate URL
  },

  /**
   * Profile photo. Upload a square-ish image to public/images/ with this exact name
   * (jpg, ~600×600px). Until it exists the site shows an "SW" monogram placeholder.
   */
  photo: {
    path: 'images/profile.jpg',
    alt: 'Portrait of Sadeep Withana',
  },

  /** GitHub username for the live repository section. Empty = placeholder state. */
  githubUsername: 'sadeepmithuranda',
  /** Optional: repository names to feature first, in order. */
  featuredRepos: [] as string[],

  /**
   * Contact form endpoint. Uses FormSubmit (formsubmit.co), which forwards messages to your inbox.
   * The first message ever sent triggers a one-time "Activate form" email from FormSubmit — click it once.
   * After activating you can replace the email in this URL with the random alias FormSubmit gives you.
   * Empty = form shown as not yet active.
   */
  contactFormEndpoint: 'https://formsubmit.co/ajax/sadeepmithuranda@gmail.com',

  cv: {
    /** Drop your PDF at public/cv/ with this name (or change the path). */
    pdfPath: 'cv/Sadeep_Withana_CV.pdf',
    downloadName: 'Sadeep_Withana_CV.pdf',
    /** Set to false to hide the download buttons if no PDF is deployed. */
    pdfAvailable: true,
  },
};

export type Site = typeof site;

/** Resolves a public asset path against Vite's base (works on GitHub Pages sub-paths). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
