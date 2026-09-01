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

export interface SourceCodeAnnotation {
  /**
   * 找到包含这个内容的代码行。
   * 不使用固定行号，源码前后增加代码也不会立刻失效。
   */
  anchor: string;

  /**
   * 注释放在目标代码之前还是之后。
   */
  position?: 'before' | 'after';

  /**
   * 注释正文使用 i18n。
   */
  textKey: TranslationKey;
}

export interface SourceCodeBlock {
  id: string;
  language: string;

  source: SourceCodeSource;

  captionKey?: TranslationKey;

  /**
   * 只用于 Portfolio 展示。
   * 不会修改真实 GitHub 源码。
   */
  annotations?: SourceCodeAnnotation[];
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