import { Navigate, useParams } from 'react-router-dom';
import { CodeFlow } from '../components/source/CodeFlow';
import { RelatedFeatures } from '../components/source/RelatedFeatures';
import { RelatedFiles } from '../components/source/RelatedFiles';
import { SourceBreadcrumbs } from '../components/source/SourceBreadcrumbs';
import { SourceCodeBlocks } from '../components/source/SourceCodeBlocks';
import { SourceEmptyState } from '../components/source/SourceEmptyState';
import { getSourceCategory, getSourceFeature } from '../data/source-explanations';
import { getProject } from '../data/projects';
import { useI18n } from '../i18n/I18nProvider';

export function SourceFeaturePage() {
  const { slug = '', category = '', feature = '' } = useParams();
  const project = getProject(slug);
  const sourceCategory = getSourceCategory(slug, category);
  const sourceFeature = getSourceFeature(slug, category, feature);
  const { t } = useI18n();
  if (!project) return <Navigate to="/projects" replace />;

  if (!sourceCategory || !sourceFeature) return <main className="source-page shell">
    <SourceBreadcrumbs projectSlug={slug} projectTitle={project.title} category={sourceCategory} />
    <SourceEmptyState backTo={`/projects/${slug}/source${sourceCategory ? `/${category}` : ''}`} />
  </main>;

  return <main className="source-page shell">
    <SourceBreadcrumbs projectSlug={slug} projectTitle={project.title} category={sourceCategory} featureNameKey={sourceFeature.nameKey} />
    <header className="source-hero"><p className="eyebrow">{t('source.feature')}</p><h1>{t(sourceFeature.nameKey)}</h1><p>{t(sourceFeature.summaryKey)}</p></header>
    {sourceFeature.explanationKeys.length > 0 && <section className="source-subsection source-explanation-copy"><h2>{t('source.explanation')}</h2>{sourceFeature.explanationKeys.map(key => <p key={key}>{t(key)}</p>)}</section>}
    <RelatedFiles files={sourceFeature.relatedFiles} />
    <CodeFlow steps={sourceFeature.codeFlow} />
    <SourceCodeBlocks blocks={sourceFeature.codeBlocks} />
    <RelatedFeatures projectSlug={slug} category={sourceCategory} feature={sourceFeature} />
  </main>;
}
