import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

import type { SourceCodeBlock } from '../../data/source-explanations';
import { renderTranslatedCode } from '../../data/source-explanations/renderCode';
import { useI18n } from '../../i18n/I18nProvider';

export function SourceCodeBlocks({
  blocks,
}: {
  blocks: SourceCodeBlock[];
}) {
  const { t } = useI18n();

  return (
    <section className="source-subsection">
      <h2>{t('source.codeBlocks')}</h2>

      {blocks.length === 0 ? (
        <p className="source-inline-empty">
          {t('source.empty.code')}
        </p>
      ) : (
        <div className="source-code-blocks">
          {blocks.map((block) => {
            const code = renderTranslatedCode(
              block.code,
              t,
            );

            const highlighted = hljs.highlight(
              code,
              {
                language: block.language,
              },
            ).value;

            return (
              <figure key={block.id}>
                <figcaption>
                  <span>
                    {block.filePath ??
                      block.language}
                  </span>

                  {block.captionKey && (
                    <small>
                      {t(block.captionKey)}
                    </small>
                  )}
                </figcaption>

                <pre>
                  <code
                    className={`hljs language-${block.language}`}
                    dangerouslySetInnerHTML={{
                      __html: highlighted,
                    }}
                  />
                </pre>
              </figure>
            );
          })}
        </div>
      )}
    </section>
  );
}