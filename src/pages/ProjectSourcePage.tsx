import { Link, Navigate, useParams } from 'react-router-dom';
import { SourceBreadcrumbs } from '../components/source/SourceBreadcrumbs';
import { SourceCategoryList } from '../components/source/SourceCategoryList';
import { SourceEmptyState } from '../components/source/SourceEmptyState';
import { getProjectSource } from '../data/source-explanations';
import { getProject } from '../data/projects';
import { useI18n } from '../i18n/I18nProvider';

export function ProjectSourcePage() {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  const source = getProjectSource(slug);
  const { t } = useI18n();
  if (!project) return <Navigate to="/projects" replace />;

  return <main className="source-page shell">
    <SourceBreadcrumbs projectSlug={slug} projectTitle={project.title} />
    <header className="source-hero"><p className="eyebrow">{t('source.eyebrow')}</p><h1>{t('source.title')}</h1><p>{source ? t(source.summaryKey) : t('source.description')}</p></header>
    {!source || source.categories.length === 0
      ? <SourceEmptyState backTo={`/projects/${slug}`} />
      : <SourceCategoryList projectSlug={slug} categories={source.categories} />}
    <Link className="back-link" to={`/projects/${slug}`}>{t('source.backProject')}</Link>
  </main>;
}
