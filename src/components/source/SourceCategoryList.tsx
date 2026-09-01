import { Link } from 'react-router-dom';
import type { SourceCategoryExplanation } from '../../data/source-explanations';
import { useI18n } from '../../i18n/I18nProvider';

export function SourceCategoryList({ projectSlug, categories }: { projectSlug: string; categories: SourceCategoryExplanation[] }) {
  const { t } = useI18n();
  return <div className="source-card-grid">{categories.map((category, index) => <Link className="source-card" to={`/projects/${projectSlug}/source/${category.slug}`} key={category.slug}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{t(category.nameKey)}</h2><p>{t(category.summaryKey)}</p><small>{category.features.length} {t('source.features')} · {t('source.viewCategory')} ↗</small></div></Link>)}</div>;
}
