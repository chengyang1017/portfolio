import portfolioSeed from './portfolioSeed.json';
import portfolioSeedExtra from './portfolioSeedExtra.json';

export type ProjectCategory = 'Language' | 'AI & Developer Tools' | 'Product';

export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  status: string;
  number: string;
  summary: string;
  overview: string;
  technologies: string[];
  features: string[];
  challenges: { title: string; description: string }[];
  architecture: { label: string; detail: string }[];
  gallery: { title: string; caption: string; image?: string }[];
  github?: string;
  tone: 'lime' | 'blue' | 'sand' | 'lavender' | 'slate' | 'coral';
  mockup: 'morphology' | 'commerce' | 'language' | 'keyboard' | 'ide' | 'inflection';
}

export const portfolioContentVersion = `${portfolioSeed.version}-${portfolioSeedExtra.version}`;
export const projects = [
  ...portfolioSeed.projects,
  ...portfolioSeedExtra.projects,
] as Project[];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
