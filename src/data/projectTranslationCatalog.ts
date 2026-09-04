import type { Project } from './projects';

export const PROJECT_TRANSLATION_LOCALES = [
  'zh-CN',
  'zh-TW',
  'vi-Latn',
  'vi-Hani',
] as const;

export type ProjectTranslationLocale =
  (typeof PROJECT_TRANSLATION_LOCALES)[number];

export type ProjectTranslation = Pick<
  Project,
  | 'title'
  | 'shortTitle'
  | 'summary'
  | 'overview'
  | 'features'
  | 'challenges'
  | 'architecture'
  | 'gallery'
>;

export type ProjectTranslationCatalog = Record<
  string,
  Partial<Record<ProjectTranslationLocale, ProjectTranslation>>
>;

export const projectTranslationCatalog: ProjectTranslationCatalog = {};
