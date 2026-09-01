import { Navigate, useParams } from 'react-router-dom';
import { SourceBreadcrumbs } from '../components/source/SourceBreadcrumbs';
import { SourceEmptyState } from '../components/source/SourceEmptyState';
import { SourceFeatureList } from '../components/source/SourceFeatureList';
import { getSourceCategory } from '../data/source-explanations';
import { getProject } from '../data/projects';
import { useI18n } from '../i18n/I18nProvider';

export function SourceCategoryPage() {
  const { slug = '', category = '' } = useParams();
  const project = getProject(slug);
  const sourceCategory = getSourceCategory(slug, category);
  const { t } = useI18n();
  if (!project) return <Navigate to="/projects" replace />;

  return <main className="source-page shell">
    <SourceBreadcrumbs projectSlug={slug} projectTitle={project.title} category={sourceCategory} />
    {sourceCategory ? <>
      <header className="source-hero"><p className="eyebrow">{t('source.category')}</p><h1>{t(sourceCategory.nameKey)}</h1><p>{t(sourceCategory.summaryKey)}</p></header>
      {sourceCategory.features.length > 0
        ? <SourceFeatureList projectSlug={slug} categorySlug={category} features={sourceCategory.features} />
        : <SourceEmptyState backTo={`/projects/${slug}/source`} />}
    </> : <SourceEmptyState backTo={`/projects/${slug}/source`} />}
  </main>;
}
