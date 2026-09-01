import type {
  TranslationKey,
} from '../../i18n/types';

import type {
  SourceCodeAnnotation,
} from './types';

const commentPlaceholder =
  /\{\{i18n:([^{}]+)\}\}/g;

export function renderTranslatedCode(
  code: string,
  translate: (
    key: TranslationKey,
  ) => string,
) {
  return code.replace(
    commentPlaceholder,
    (_placeholder, key: string) =>
      translate(
        key.trim() as TranslationKey,
      ),
  );
}

/**
 * 只修改 Portfolio 最终显示的字符串。
 *
 * 不会写回 GitHub，
 * 不会修改 glyphora / shoppingapp123 源码。
 */
export function injectCodeAnnotations(
  code: string,
  language: string,
  annotations:
    | SourceCodeAnnotation[]
    | undefined,
  translate: (
    key: TranslationKey,
  ) => string,
): string {
  if (
    !annotations ||
    annotations.length === 0
  ) {
    return code;
  }

  const lines = code.split('\n');

  for (const annotation of annotations) {
    const normalizedAnchor =
      normalizeWhitespace(
        annotation.anchor,
      );

    const targetIndex =
      lines.findIndex((line) =>
        normalizeWhitespace(line)
          .includes(normalizedAnchor),
      );

    /*
     * 源码以后改了，anchor 找不到时，
     * 不让整个代码区报错。
     *
     * 只是暂时不显示这一条注释。
     */
    if (targetIndex === -1) {
      continue;
    }

    const targetLine =
      lines[targetIndex] ?? '';

    const indentation =
      targetLine.match(/^\s*/)?.[0] ?? '';

    const comment =
      createComment(
        translate(annotation.textKey),
        language,
        indentation,
      );

    if (
      annotation.position === 'after'
    ) {
      lines.splice(
        targetIndex + 1,
        0,
        comment,
      );
    } else {
      lines.splice(
        targetIndex,
        0,
        comment,
      );
    }
  }

  return lines.join('\n');
}

function createComment(
  text: string,
  language: string,
  indentation: string,
): string {
  const prefix =
    getCommentPrefix(language);

  /*
   * 翻译如果以后变成多行，
   * 每一行都会自动拥有注释符号。
   */
  return text
    .split('\n')
    .map(
      (line) =>
        `${indentation}${prefix} ${line}`,
    )
    .join('\n');
}

function getCommentPrefix(
  language: string,
): string {
  switch (
    language.toLowerCase()
  ) {
    case 'python':
    case 'py':
    case 'ruby':
    case 'shell':
    case 'bash':
    case 'sh':
    case 'yaml':
    case 'yml':
      return '#';

    case 'sql':
    case 'lua':
      return '--';

    default:
      /*
       * Dart / TypeScript / JavaScript /
       * Java / Kotlin / C / C++ / C#
       * 都可以使用 //
       */
      return '//';
  }
}

function normalizeWhitespace(
  value: string,
): string {
  return value
    .replace(/\s+/g, ' ')
    .trim();
}