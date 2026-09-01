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

export interface SourceCodeBlock {
  id: string;
  language: string;
  code: string;
  filePath?: string;
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

export type SourceExplanationRegistry = Record<string, ProjectSourceExplanation>;
