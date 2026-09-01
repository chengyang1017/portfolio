import type {
  SourceCodeFlowStep,
} from '../../data/source-explanations';

import {
  useI18n,
} from '../../i18n/I18nProvider';

export function CodeFlow({
  steps,
}: {
  steps: SourceCodeFlowStep[];
}) {
  const { t } = useI18n();

  return (
    <section className="source-subsection">
      <h2>{t('source.codeFlow')}</h2>

      {steps.length === 0 ? (
        <p className="source-inline-empty">
          {t('source.empty.flow')}
        </p>
      ) : (
        <ol className="code-flow">
          {steps.map((step, index) => (
            <li
              className="code-flow-step"
              key={step.id}
            >
              <div
                className="code-flow-step-index"
                aria-hidden="true"
              >
                {String(index + 1).padStart(
                  2,
                  '0',
                )}
              </div>

              <div className="code-flow-step-body">
                <h3>
                  {t(step.titleKey)}
                </h3>

                <p>
                  {t(step.descriptionKey)}
                </p>

                {step.filePath && (
                  <code className="code-flow-step-file">
                    {step.filePath}
                  </code>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}