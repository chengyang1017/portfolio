import type { TranslationKey } from '../../i18n/types';

const commentPlaceholder = /\{\{i18n:([^{}]+)\}\}/g;

export function renderTranslatedCode(
  code: string,
  translate: (key: TranslationKey) => string,
) {
  return code.replace(commentPlaceholder, (_placeholder, key: string) => translate(key.trim()));
}
