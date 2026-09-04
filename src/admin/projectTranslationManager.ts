import type { Project } from '../data/projects';
import {
  PROJECT_TRANSLATION_LOCALES,
  type ProjectTranslation,
  type ProjectTranslationCatalog,
  type ProjectTranslationLocale,
} from '../data/projectTranslationCatalog';

export type ProjectTranslationBundle = Record<
  ProjectTranslationLocale,
  ProjectTranslation
>;

function projectSource(project: Project): ProjectTranslation {
  return {
    title: project.title,
    shortTitle: project.shortTitle,
    summary: project.summary,
    overview: project.overview,
    features: project.features.map((item) => item),
    challenges: project.challenges.map((item) => ({ ...item })),
    architecture: project.architecture.map((item) => ({ ...item })),
    gallery: project.gallery.map((item) => ({ ...item })),
  };
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function validateTranslation(
  value: unknown,
  source: ProjectTranslation,
): ProjectTranslation {
  if (!value || typeof value !== 'object') {
    throw new Error('AI returned an invalid translation object.');
  }

  const candidate = value as Partial<ProjectTranslation>;

  if (!isString(candidate.title)) throw new Error('Translated title is missing.');
  if (!isString(candidate.shortTitle)) throw new Error('Translated short title is missing.');
  if (!isString(candidate.summary)) throw new Error('Translated summary is missing.');
  if (!isString(candidate.overview)) throw new Error('Translated overview is missing.');

  if (!Array.isArray(candidate.features) || candidate.features.length !== source.features.length) {
    throw new Error('Translated features do not match the source structure.');
  }

  if (!Array.isArray(candidate.challenges) || candidate.challenges.length !== source.challenges.length) {
    throw new Error('Translated challenges do not match the source structure.');
  }

  if (!Array.isArray(candidate.architecture) || candidate.architecture.length !== source.architecture.length) {
    throw new Error('Translated architecture does not match the source structure.');
  }

  if (!Array.isArray(candidate.gallery) || candidate.gallery.length !== source.gallery.length) {
    throw new Error('Translated gallery does not match the source structure.');
  }

  const features = candidate.features.map((item) => {
    if (!isString(item)) throw new Error('A translated feature is invalid.');
    return item;
  });

  const challenges = candidate.challenges.map((item) => {
    if (!item || typeof item !== 'object') throw new Error('A translated challenge is invalid.');
    const typed = item as { title?: unknown; description?: unknown };
    if (!isString(typed.title) || !isString(typed.description)) {
      throw new Error('A translated challenge is incomplete.');
    }
    return { title: typed.title, description: typed.description };
  });

  const architecture = candidate.architecture.map((item) => {
    if (!item || typeof item !== 'object') throw new Error('A translated architecture item is invalid.');
    const typed = item as { label?: unknown; detail?: unknown };
    if (!isString(typed.label) || !isString(typed.detail)) {
      throw new Error('A translated architecture item is incomplete.');
    }
    return { label: typed.label, detail: typed.detail };
  });

  const gallery = candidate.gallery.map((item) => {
    if (!item || typeof item !== 'object') throw new Error('A translated gallery item is invalid.');
    const typed = item as { title?: unknown; caption?: unknown };
    if (!isString(typed.title) || !isString(typed.caption)) {
      throw new Error('A translated gallery item is incomplete.');
    }
    return { title: typed.title, caption: typed.caption };
  });

  return {
    title: candidate.title,
    shortTitle: candidate.shortTitle,
    summary: candidate.summary,
    overview: candidate.overview,
    features,
    challenges,
    architecture,
    gallery,
  };
}

export async function translateProjectAllLocales({
  project,
}: {
  project: Project;
}): Promise<ProjectTranslationBundle> {
  const source = projectSource(project);
  const endpoint =
    (import.meta.env.VITE_PORTFOLIO_AI_ENDPOINT as string | undefined) ||
    '/api/portfolio-ai';

  const response = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'translate-project',
      project: {
        slug: project.slug,
        technologies: project.technologies,
        ...source,
      },
      targetLocales: PROJECT_TRANSLATION_LOCALES,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; detail?: string }
      | null;
    throw new Error(
      payload?.detail ||
        payload?.error ||
        `AI translation failed (${response.status}).`,
    );
  }

  const payload = (await response.json()) as Record<string, unknown>;

  return Object.fromEntries(
    PROJECT_TRANSLATION_LOCALES.map((locale) => [
      locale,
      validateTranslation(payload[locale], source),
    ]),
  ) as ProjectTranslationBundle;
}

export function mergeProjectTranslations(
  catalog: ProjectTranslationCatalog,
  slug: string,
  translations: ProjectTranslationBundle,
): ProjectTranslationCatalog {
  return {
    ...catalog,
    [slug]: {
      ...(catalog[slug] ?? {}),
      ...translations,
    },
  };
}

export async function publishProjectTranslationCatalog({
  branch,
  catalog,
}: {
  branch: string;
  catalog: ProjectTranslationCatalog;
}) {
  const response = await fetch('/api/admin/publish-translations', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ branch, catalog }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { commitUrl?: string; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || `Translation publish failed (${response.status}).`);
  }

  return payload?.commitUrl;
}
