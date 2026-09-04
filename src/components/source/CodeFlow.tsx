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
  const {
    t,
  } = useI18n();

  return (
    <section className="source-subsection flow-section">
      <header className="flow-heading">
        <div>
          <p className="flow-heading-label">
            {t(
              'source.ui.executionPath',
            )}
          </p>

          <h2>
            {t(
              'source.codeFlow',
            )}
          </h2>
        </div>

        <span className="flow-heading-count">
          {String(
            steps.length,
          ).padStart(
            2,
            '0',
          )}{' '}
          {t(
            'source.ui.steps',
          )}
        </span>
      </header>

      {steps.length === 0 ? (
        <p className="source-inline-empty">
          {t(
            'source.empty.flow',
          )}
        </p>
      ) : (
        <ol className="flow-pipeline">
          {steps.map(
            (
              step,
              index,
            ) => (
              <li
                className="flow-pipeline-item"
                key={
                  step.id
                }
              >
                <div className="flow-pipeline-top">
                  <span className="flow-pipeline-number">
                    {String(
                      index +
                        1,
                    ).padStart(
                      2,
                      '0',
                    )}
                  </span>

                  <span className="flow-pipeline-state">
                    {t(
                      'source.ui.step',
                    )}
                  </span>
                </div>

                <div className="flow-pipeline-copy">
                  <h3>
                    {t(
                      step.titleKey,
                    )}
                  </h3>

                  <p>
                    {t(
                      step.descriptionKey,
                    )}
                  </p>
                </div>

                {step.filePath && (
                  <code className="flow-pipeline-file">
                    {
                      step.filePath
                    }
                  </code>
                )}

                {index <
                  steps.length -
                    1 && (
                  <span
                    className="flow-pipeline-arrow"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </li>
            ),
          )}
        </ol>
      )}
    </section>
  );
}