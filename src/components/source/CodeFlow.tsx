import type { SourceCodeFlowStep } from '../../data/source-explanations';
import { useI18n } from '../../i18n/I18nProvider';

export function CodeFlow({ steps }: { steps: SourceCodeFlowStep[] }) {
  const { t } = useI18n();
  return <section className="source-subsection"><h2>{t('source.codeFlow')}</h2>{steps.length === 0 ? <p className="source-inline-empty">{t('source.empty.flow')}</p> : <div className="code-flow">{steps.map((step, index) => <article key={step.id}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{t(step.titleKey)}</h3><p>{t(step.descriptionKey)}</p>{step.filePath && <code>{step.filePath}</code>}</div>{index < steps.length - 1 && <i>↓</i>}</article>)}</div>}</section>;
}
