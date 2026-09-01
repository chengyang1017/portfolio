import type {
  ProjectSourceExplanation,
} from '../source-explanations/types';

import type {
  Language,
  TranslationDictionary,
} from '../../i18n/types';

export interface SourceProjectModule {
  explanation: ProjectSourceExplanation;
  translations: Record<
    Language,
    TranslationDictionary
  >;
}
