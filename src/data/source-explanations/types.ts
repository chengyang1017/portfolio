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

/**
 * 直接把代码保存在 portfolio 中。
 *
 * 用于：
 * - 尚未迁移的旧代码块
 * - 人工裁剪过、不希望跟随仓库变化的示例
 */
export interface InlineCodeSource {
  type: 'inline';
  code: string;
}

/**
 * 从 GitHub 仓库读取真实代码。
 *
 * 定位优先级：
 *
 * 1. symbol
 * 2. symbol + startAnchor / endAnchor
 * 3. startAnchor / endAnchor
 *
 * 不使用固定行号定位。
 */
export interface GitHubCodeSource {
  type: 'github';

  /**
   * owner/repository
   *
   * 例如：
   * chengyang1017/glyphora
   */
  repository: string;

  /**
   * 仓库内文件路径。
   */
  path: string;

  /**
   * branch / tag / commit。
   *
   * 不填时默认 main。
   */
  ref?: string;

  /**
   * 函数、方法或其他代码 symbol。
   *
   * 例如：
   * _publishPost
   * toggleLike
   */
  symbol?: string;

  /**
   * 在 symbol 内进一步截取代码。
   *
   * 如果没有 symbol，则在整个文件内搜索。
   */
  startAnchor?: string;
  endAnchor?: string;
}

export type SourceCodeSource =
  | InlineCodeSource
  | GitHubCodeSource;

interface SourceCodeBlockBase {
  id: string;
  language: string;
  captionKey?: TranslationKey;
}

/**
 * 旧格式。
 *
 * 迁移期间继续支持，
 * 等所有代码块都改成 GitHub source 后再删除。
 */
export interface LegacySourceCodeBlock
  extends SourceCodeBlockBase {
  code: string;
  filePath?: string;
  source?: never;
}

/**
 * 新格式。
 */
export interface DynamicSourceCodeBlock
  extends SourceCodeBlockBase {
  source: SourceCodeSource;
  code?: never;
  filePath?: never;
}

export type SourceCodeBlock =
  | LegacySourceCodeBlock
  | DynamicSourceCodeBlock;

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