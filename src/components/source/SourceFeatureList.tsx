import { Link } from 'react-router-dom';
import type { SourceFeatureExplanation } from '../../data/source-explanations';
import { useI18n } from '../../i18n/I18nProvider';

export function SourceFeatureList({ projectSlug, categorySlug, features }: { projectSlug: string; categorySlug: string; features: SourceFeatureExplanation[] }) {
  const { t } = useI18n();
  return <div className="source-feature-list">{features.map((feature, index) => <Link to={`/projects/${projectSlug}/source/${categorySlug}/${feature.slug}`} key={feature.slug}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{t(feature.nameKey)}</h2><p>{t(feature.summaryKey)}</p></div><i>↗</i></Link>)}</div>;
}
