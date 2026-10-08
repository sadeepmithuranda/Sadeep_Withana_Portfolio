import Hero from '../components/home/Hero';
import WhatIBuild from '../components/home/WhatIBuild';
import ProjectsSection from '../components/home/ProjectsSection';
import { About, BlogTeaser, Contact, CvCta, FocusAreas, GitHubSection, ResearchTeaser, Skills, Timeline } from '../components/home/Sections';
import { usePageMeta } from '../hooks/hooks';
import { useSectionFromState } from '../components/ui/ui';

export default function Home() {
  usePageMeta(undefined, undefined, '/');
  useSectionFromState();
  return (
    <>
      <Hero />
      <WhatIBuild />
      <About />
      <FocusAreas />
      <ProjectsSection />
      <ResearchTeaser />
      <Timeline />
      <Skills />
      <BlogTeaser />
      <GitHubSection />
      <CvCta />
      <Contact />
    </>
  );
}
