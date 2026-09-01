import {
  glyphoraSourceExplanation,
} from '../../source-explanations/glyphora';

import {
  glyphoraTranslations,
} from '../../../i18n/glyphoraTranslations';

import type {
  SourceProjectModule,
} from '../types';

export const sourceProjectModule = {
  explanation:
    glyphoraSourceExplanation,
  translations:
    glyphoraTranslations,
} satisfies SourceProjectModule;
