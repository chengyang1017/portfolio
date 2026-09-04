import { projectTranslationCatalog } from '../data/projectTranslationCatalog';
import type { Project } from '../data/projects';
import { localizeProjectDetail as legacyLocalizeProjectDetail } from './projectDetailTranslations';
import type { AppLocale } from './types';

function mergeCanonicalGalleryMedia(project: Project, localized: Project): Project {
  const size = Math.max(project.gallery.length, localized.gallery.length);
  const gallery = Array.from({ length: size }, (_, index) => {
    const source = project.gallery[index];
    const translated = localized.gallery[index];

    return {
      title: translated?.title ?? source?.title ?? '',
      caption: translated?.caption ?? source?.caption ?? '',
      ...(source?.image ? { image: source.image } : {}),
    };
  }).filter((item) => item.title || item.caption || item.image);

  return { ...localized, gallery };
}

export function localizeProject(project: Project, language: AppLocale): Project {
  if (language === 'en') return project;

  const generated = projectTranslationCatalog[project.slug]?.[language];

  if (generated) {
    return mergeCanonicalGalleryMedia(project, {
      ...project,
      ...generated,
    });
  }

  return mergeCanonicalGalleryMedia(project, legacyLocalizeProjectDetail(project, language));
}
