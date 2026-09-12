import portfolioSeed from './portfolioSeed.json';
import portfolioSeedExtra from './portfolioSeedExtra.json';

export type ProjectCategory = 'Language' | 'AI & Developer Tools' | 'Product';

export type ProjectPageCopyLocale = 'en' | 'zh-CN' | 'zh-TW' | 'vi-Latn' | 'vi-Hani';

export type ProjectPageCopy = {
  projectAreasLabel?: string;
  projectAreasHeading?: string;
  overviewLabel?: string;
  snapshotLabel?: string;
  featureSectionLabel?: string;
  featureHeading?: string;
  featureSummary?: string;
  architectureLabel?: string;
  architectureHeading?: string;
  sourceWalkthroughLabel?: string;
  sourceWalkthroughTitle?: string;
  sourceWalkthroughDescription?: string;
  implementationLabel?: string;
};

export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  status: string;
  number: string;
  summary: string;
  overview: string;

  heroImage?: string;

  technologies: string[];
  features: string[];
  challenges: { title: string; description: string }[];
  architecture: { label: string; detail: string }[];
  gallery: { title: string; caption: string; image?: string }[];

  github?: string;
  pageCopy?: Partial<Record<ProjectPageCopyLocale, ProjectPageCopy>>;
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
