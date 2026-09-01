import {
  projectSourceExplanations,
} from '../source-projects';

import type {
  SourceExplanationRegistry,
} from './types';

export const sourceExplanations:
  SourceExplanationRegistry =
    projectSourceExplanations;

export const getProjectSource = (
  projectSlug: string,
) => sourceExplanations[projectSlug];

export const getSourceCategory = (
  projectSlug: string,
  categorySlug: string,
) =>
  getProjectSource(projectSlug)?.categories.find(
    (category) =>
      category.slug === categorySlug,
  );

export const getSourceFeature = (
  projectSlug: string,
  categorySlug: string,
  featureSlug: string,
) =>
  getSourceCategory(
    projectSlug,
    categorySlug,
  )?.features.find(
    (feature) =>
      feature.slug === featureSlug,
  );

export type {
  ProjectSourceExplanation,
  SourceCategoryExplanation,
  SourceCodeBlock,
  SourceCodeFlowStep,
  SourceFeatureExplanation,
  SourceRelatedFile,
} from './types';
