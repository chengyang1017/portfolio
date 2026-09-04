import { projectTranslationCatalog, type ProjectTranslationCatalog } from './projectTranslationCatalog';
import { projects, type Project } from './projects';
import { technologyCatalog, type TechnologyCatalog } from './technologyCatalog';

type RemotePortfolioData = {
  projects?: Project[];
  technologyCatalog?: TechnologyCatalog;
  projectTranslationCatalog?: ProjectTranslationCatalog;
};

export async function hydratePortfolioData() {
  try {
    const response = await fetch('/api/portfolio-data', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return;

    const data = (await response.json()) as RemotePortfolioData;

    if (Array.isArray(data.projects)) {
      projects.splice(0, projects.length, ...data.projects);
    }

    if (data.technologyCatalog) {
      technologyCatalog.client = [...data.technologyCatalog.client];
      technologyCatalog.backend = [...data.technologyCatalog.backend];
      technologyCatalog.platform = [...data.technologyCatalog.platform];
    }

    if (data.projectTranslationCatalog) {
      for (const key of Object.keys(projectTranslationCatalog)) {
        delete projectTranslationCatalog[key];
      }
      Object.assign(projectTranslationCatalog, data.projectTranslationCatalog);
    }
  } catch {
    // Bundled data remains the offline/deployment fallback.
  }
}
