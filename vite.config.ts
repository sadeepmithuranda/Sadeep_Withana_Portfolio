import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`          → normal multi-file build for Vercel / Netlify / GitHub Pages
// `npm run build:preview`  → single self-contained HTML (hash routing) used for quick previews
export default defineConfig(({ mode }) => ({
  // For GitHub Pages project sites set VITE_BASE=/repo-name/ when building.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss(), ...(mode === 'preview' ? [viteSingleFile()] : [])],
  build: {
    outDir: mode === 'preview' ? 'dist-preview' : 'dist',
    copyPublicDir: mode !== 'preview',
  },
}));
