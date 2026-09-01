import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';

export function SourceEmptyState({ titleKey = 'source.empty.title', descriptionKey = 'source.empty.description', backTo }: { titleKey?: string; descriptionKey?: string; backTo: string }) {
  const { t } = useI18n();
  return <div className="source-empty"><span>⌁</span><h2>{t(titleKey)}</h2><p>{t(descriptionKey)}</p><Link className="text-link" to={backTo}>{t('source.backToProject')} ↗</Link></div>;
}
