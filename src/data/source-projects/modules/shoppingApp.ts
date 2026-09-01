import {
  shoppingAppSourceExplanation,
} from '../../source-explanations/shoppingApp';

import {
  shoppingTranslations,
} from '../../../i18n/shoppingTranslations';

import type {
  SourceProjectModule,
} from '../types';

export const sourceProjectModule = {
  explanation:
    shoppingAppSourceExplanation,
  translations:
    shoppingTranslations,
} satisfies SourceProjectModule;
