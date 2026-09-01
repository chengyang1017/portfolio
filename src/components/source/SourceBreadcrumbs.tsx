import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';

interface Props {
  projectSlug: string;
  projectTitle: string;
  category?: { slug: string; nameKey: string };
  featureNameKey?: string;
}

export function SourceBreadcrumbs({ projectSlug, projectTitle, category, featureNameKey }: Props) {
  const { t } = useI18n();
  return <nav className="source-breadcrumbs" aria-label="Breadcrumb"><Link to={`/projects/${projectSlug}`}>{projectTitle}</Link><span>→</span><Link to={`/projects/${projectSlug}/source`}>{t('source.title')}</Link>{category && <><span>→</span><Link to={`/projects/${projectSlug}/source/${category.slug}`}>{t(category.nameKey)}</Link></>}{featureNameKey && <><span>→</span><strong>{t(featureNameKey)}</strong></>}</nav>;
}
