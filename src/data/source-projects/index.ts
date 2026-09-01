import type {
  Language,
  TranslationDictionary,
} from '../../i18n/types';

import type {
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

export const projectSourceExplanations =
  sourceProjectModules.reduce<
    SourceExplanationRegistry
  >((registry, module) => {
    const slug =
      module.explanation.projectSlug;

    if (registry[slug]) {
      throw new Error(
        `Duplicate source project slug: ${slug}`,
      );
    }

    registry[slug] =
      module.explanation;

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
