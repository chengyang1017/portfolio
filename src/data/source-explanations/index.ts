import { glyphoraSourceExplanation } from './glyphora';
import type { SourceExplanationRegistry } from './types';

// Add only verified source explanations here. Project pages intentionally show
// a translated empty state until an audited explanation is registered.
export const sourceExplanations: SourceExplanationRegistry = {
  glyphora: glyphoraSourceExplanation,
};

export const getProjectSource = (projectSlug: string) =>
  sourceExplanations[projectSlug];

export const getSourceCategory = (projectSlug: string, categorySlug: string) =>
  getProjectSource(projectSlug)?.categories.find(
    (category) => category.slug === categorySlug,
  );

export const getSourceFeature = (
  projectSlug: string,
  categorySlug: string,
  featureSlug: string,
) =>
  getSourceCategory(projectSlug, categorySlug)?.features.find(
    (feature) => feature.slug === featureSlug,
  );

export type {
  ProjectSourceExplanation,
  SourceCategoryExplanation,
  SourceCodeBlock,
  SourceCodeFlowStep,
  SourceFeatureExplanation,
  SourceRelatedFile,
} from './types';
