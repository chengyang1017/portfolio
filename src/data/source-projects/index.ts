import type {
  Language,
  TranslationDictionary,
} from '../../i18n/types';

import type {
  ProjectSourceExplanation,
  SourceCategoryExplanation,
  SourceExplanationRegistry,
} from '../source-explanations/types';

import type {
  SourceProjectModule,
} from './types';

type SourceProjectModuleFile = {
  sourceProjectModule?: SourceProjectModule;
};

const moduleFiles = import.meta.glob<
  SourceProjectModuleFile
>('./modules/*.ts', {
  eager: true,
});

export const sourceProjectModules =
  Object.values(moduleFiles)
    .map(
      (module) =>
        module.sourceProjectModule,
    )
    .filter(
      (
        module,
      ): module is SourceProjectModule =>
        Boolean(module),
    );

const mergeCategory = (
  existing: SourceCategoryExplanation,
  incoming: SourceCategoryExplanation,
): SourceCategoryExplanation => {
  if (
    existing.nameKey !== incoming.nameKey ||
    existing.summaryKey !== incoming.summaryKey
  ) {
    throw new Error(
      `Conflicting source category metadata: ${existing.slug}`,
    );
  }

  const featureSlugs = new Set(
    existing.features.map(
      (feature) => feature.slug,
    ),
  );

  for (const feature of incoming.features) {
    if (featureSlugs.has(feature.slug)) {
      throw new Error(
        `Duplicate source feature slug: ${existing.slug}/${feature.slug}`,
      );
    }

    featureSlugs.add(feature.slug);
  }

  return {
    ...existing,
    features: [
      ...existing.features,
      ...incoming.features,
    ],
  };
};

const mergeExplanation = (
  existing: ProjectSourceExplanation,
  incoming: ProjectSourceExplanation,
): ProjectSourceExplanation => {
  if (
    existing.titleKey !== incoming.titleKey ||
    existing.summaryKey !== incoming.summaryKey
  ) {
    throw new Error(
      `Conflicting source project metadata: ${existing.projectSlug}`,
    );
  }

  const categories = [
    ...existing.categories,
  ];

  for (const incomingCategory of incoming.categories) {
    const index = categories.findIndex(
      (category) =>
        category.slug === incomingCategory.slug,
    );

    if (index === -1) {
      categories.push(incomingCategory);
      continue;
    }

    categories[index] = mergeCategory(
      categories[index],
      incomingCategory,
    );
  }

  return {
    ...existing,
    categories,
  };
};

export const projectSourceExplanations =
  sourceProjectModules.reduce<
    SourceExplanationRegistry
  >((registry, module) => {
    const slug =
      module.explanation.projectSlug;

    const existing = registry[slug];

    registry[slug] = existing
      ? mergeExplanation(
          existing,
          module.explanation,
        )
      : module.explanation;

    return registry;
  }, {});

const createEmptyTranslations = ():
  Record<Language, TranslationDictionary> => ({
    en: {},
    'zh-CN': {},
    'zh-TW': {},
  });

export const projectTranslations =
  sourceProjectModules.reduce(
    (registry, module) => {
      Object.assign(
        registry.en,
        module.translations.en,
      );

      Object.assign(
        registry['zh-CN'],
        module.translations['zh-CN'],
      );

      Object.assign(
        registry['zh-TW'],
        module.translations['zh-TW'],
      );

      return registry;
    },
    createEmptyTranslations(),
  );

export type {
  SourceProjectModule,
} from './types';
