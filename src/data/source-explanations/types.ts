import type { TranslationKey } from '../../i18n/types';

export interface SourceRelatedFile {
  path: string;
  descriptionKey?: TranslationKey;
}

export interface SourceCodeFlowStep {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  filePath?: string;
}

export interface InlineCodeSource {
  type: 'inline';
  code: string;
}

export interface GitHubCodeSource {
  type: 'github';

  repository: string;
  path: string;

  ref?: string;

  /**
   * 优先通过函数 / 方法名称定位。
   */
  symbol?: string;

  /**
   * 没有 symbol，或需要在 symbol 内进一步裁剪时使用。
   */
  startAnchor?: string;
  endAnchor?: string;
}

export type SourceCodeSource =
  | InlineCodeSource
  | GitHubCodeSource;

export interface SourceCodeBlock {
  id: string;
  language: string;

  source: SourceCodeSource;

  captionKey?: TranslationKey;
}

export interface SourceFeatureExplanation {
  slug: string;
  nameKey: TranslationKey;
  summaryKey: TranslationKey;

  explanationKeys: TranslationKey[];

  relatedFiles: SourceRelatedFile[];
  codeFlow: SourceCodeFlowStep[];
  codeBlocks: SourceCodeBlock[];

  relatedFeatureSlugs: string[];
}

export interface SourceCategoryExplanation {
  slug: string;
  nameKey: TranslationKey;
  summaryKey: TranslationKey;

  features: SourceFeatureExplanation[];
}

export interface ProjectSourceExplanation {
  projectSlug: string;
  titleKey: TranslationKey;
  summaryKey: TranslationKey;

  categories: SourceCategoryExplanation[];
}

export type SourceExplanationRegistry = Record<
  string,
  ProjectSourceExplanation
>;