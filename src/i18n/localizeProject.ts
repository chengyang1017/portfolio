import { projectTranslationCatalog } from '../data/projectTranslationCatalog';
import type { Project } from '../data/projects';
import { localizeProjectDetail as legacyLocalizeProjectDetail } from './projectDetailTranslations';
import type { AppLocale } from './types';

export function localizeProject(project: Project, language: AppLocale): Project {
  if (language === 'en') return project;

  const generated = projectTranslationCatalog[project.slug]?.[language];

  if (generated) {
    return {
      ...project,
      ...generated,
    };
  }

  return legacyLocalizeProjectDetail(project, language);
}
