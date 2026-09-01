import { Link } from 'react-router-dom';
import type { SourceCategoryExplanation, SourceFeatureExplanation } from '../../data/source-explanations';
import { useI18n } from '../../i18n/I18nProvider';

export function RelatedFeatures({ projectSlug, category, feature }: { projectSlug: string; category: SourceCategoryExplanation; feature: SourceFeatureExplanation }) {
  const { t } = useI18n();
  const related = feature.relatedFeatureSlugs.flatMap((slug) => category.features.filter((item) => item.slug === slug));
  return <section className="source-subsection"><h2>{t('source.relatedFeatures')}</h2>{related.length === 0 ? <p className="source-inline-empty">{t('source.empty.related')}</p> : <div className="related-features">{related.map((item) => <Link to={`/projects/${projectSlug}/source/${category.slug}/${item.slug}`} key={item.slug}><strong>{t(item.nameKey)}</strong><span>↗</span></Link>)}</div>}</section>;
}
