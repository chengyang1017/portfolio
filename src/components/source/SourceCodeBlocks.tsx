import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

import type {
  SourceCodeBlock,
} from '../../data/source-explanations';

import {
  injectCodeAnnotations,
  renderTranslatedCode,
} from '../../data/source-explanations/renderCode';

import {
  resolveCodeBlock,
  type ResolvedCode,
} from '../../data/source-explanations/resolveCodeSource';

import {
  useI18n,
} from '../../i18n/I18nProvider';

interface ResolvedBlockState {
  status:
    | 'loading'
    | 'success'
    | 'error';

  result?: ResolvedCode;

  error?: string;
}

export function SourceCodeBlocks({
  blocks,
  embedded = false,
}: {
  blocks: SourceCodeBlock[];

  embedded?: boolean;
}) {
  const {
    t,
  } = useI18n();

  const [
    resolvedBlocks,
    setResolvedBlocks,
  ] = useState<
    Record<
      string,
      ResolvedBlockState
    >
  >({});

  const mountedRef =
    useRef(true);

  useEffect(() => {
    mountedRef.current =
      true;

    return () => {
      mountedRef.current =
        false;
    };
  }, []);

  async function retryBlock(
    block: SourceCodeBlock,
  ) {
    setResolvedBlocks(
      (
        current,
      ) => ({
        ...current,

        [block.id]: {
          status:
            'loading',
        },
      }),
    );

    try {
      const result =
        await resolveCodeBlock(
          block,
        );

      if (
        !mountedRef.current
      ) {
        return;
      }

      setResolvedBlocks(
        (
          current,
        ) => ({
          ...current,

          [block.id]: {
            status:
              'success',

            result,
          },
        }),
      );
    } catch (error) {
      if (
        !mountedRef.current
      ) {
        return;
      }

      setResolvedBlocks(
        (
          current,
        ) => ({
          ...current,

          [block.id]: {
            status:
              'error',

            error:
              error instanceof
              Error
                ? error.message
                : 'Unknown source loading error',
          },
        }),
      );
    }
  }

  useEffect(() => {
    let cancelled =
      false;

    async function loadBlocks() {
      const entries =
        await Promise.all(
          blocks.map(
            async (
              block,
            ) => {
              try {
                const result =
                  await resolveCodeBlock(
                    block,
                  );

                return [
                  block.id,

                  {
                    status:
                      'success',

                    result,
                  } satisfies ResolvedBlockState,
                ] as const;
              } catch (
                error
              ) {
                return [
                  block.id,

                  {
                    status:
                      'error',

                    error:
                      error instanceof
                      Error
                        ? error.message
                        : 'Unknown source loading error',
                  } satisfies ResolvedBlockState,
                ] as const;
              }
            },
          ),
        );

      if (
        cancelled
      ) {
        return;
      }

      setResolvedBlocks(
        Object.fromEntries(
          entries,
        ),
      );
    }

    setResolvedBlocks(
      Object.fromEntries(
        blocks.map(
          (
            block,
          ) => [
            block.id,

            {
              status:
                'loading',
            } satisfies ResolvedBlockState,
          ],
        ),
      ),
    );

    void loadBlocks();

    return () => {
      cancelled =
        true;
    };
  }, [
    blocks,
  ]);

  if (
    blocks.length === 0
  ) {
    if (
      embedded
    ) {
      return (
        <p className="source-inline-empty">
          {t(
            'source.empty.code',
          )}
        </p>
      );
    }

    return (
      <section className="source-subsection">
        <h2>
          {t(
            'source.codeBlocks',
          )}
        </h2>

        <p className="source-inline-empty">
          {t(
            'source.empty.code',
          )}
        </p>
      </section>
    );
  }

  const blockList = (
    <div
      className={
        embedded
          ? 'source-code-blocks source-code-blocks-embedded'
          : 'source-code-blocks'
      }
    >
      {blocks.map(
        (
          block,
          index,
        ) => (
          <SourceCodeBlockView
            key={
              block.id
            }
            block={
              block
            }
            state={
              resolvedBlocks[
                block.id
              ]
            }
            defaultExpanded={
              embedded ||
              index === 0
            }
            onRetry={() => {
              void retryBlock(
                block,
              );
            }}
          />
        ),
      )}
    </div>
  );

  if (
    embedded
  ) {
    return blockList;
  }

  return (
    <section className="source-subsection">
      <h2>
        {t(
          'source.codeBlocks',
        )}
      </h2>

      {blockList}
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2A11.4 11.4 0 0 1 12 6.6c1 0 2 .1 2.9.4 2.2-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.1v3c0 .3.2.6.8.5A11.3 11.3 0 0 0 12 .7Z"
      />
    </svg>
  );
}

function CollapseIcon({
  expanded,
}: {
  expanded: boolean;
}) {
  return (
    <svg
      className={
        expanded
          ? 'source-code-collapse-icon expanded'
          : 'source-code-collapse-icon'
      }
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SourceCodeBlockView({
  block,
  state,
  defaultExpanded,
  onRetry,
}: {
  block: SourceCodeBlock;

  state?: ResolvedBlockState;

  defaultExpanded: boolean;

  onRetry: () => void;
}) {
  const {
    t,
  } = useI18n();

  const [
    expanded,
    setExpanded,
  ] = useState(
    defaultExpanded,
  );

  const githubSource =
    block.source.type ===
    'github'
      ? block.source
      : undefined;

  /*
   * GitHub source
   * → annotations
   * → translated placeholders
   * → syntax highlighting
   */
  const code =
    state?.status ===
    'success'
      ? renderTranslatedCode(
          injectCodeAnnotations(
            state.result
              ?.code ??
              '',
            block.language,
            block.annotations,
            t,
          ),
          t,
        )
      : '';

  const highlighted =
    useMemo(() => {
      if (
        !code
      ) {
        return '';
      }

      try {
        return hljs.highlight(
          code,
          {
            language:
              block.language,
          },
        ).value;
      } catch {
        return hljs
          .highlightAuto(
            code,
          )
          .value;
      }
    }, [
      code,
      block.language,
    ]);

  const displayPath =
    githubSource?.path ??
    block.id;

  const fallbackSourceUrl =
    githubSource
      ? `https://github.com/${githubSource.repository}/blob/${
          githubSource.ref ??
          'main'
        }/${githubSource.path}`
      : undefined;

  const sourceUrl =
    state?.status ===
    'success'
      ? state.result
          ?.sourceUrl ??
        fallbackSourceUrl
      : fallbackSourceUrl;

  const commitSha =
    state?.status ===
    'success'
      ? state.result
          ?.commitSha
      : undefined;

  const contentId =
    `source-code-content-${block.id}`;

  return (
    <figure
      className={
        expanded
          ? 'source-code-block expanded'
          : 'source-code-block collapsed'
      }
    >
      <figcaption>
        <div className="source-code-caption-main">
          <span className="source-code-path">
            {
              displayPath
            }
          </span>

          {githubSource && (
            <div className="source-code-origin">
              <small>
                {
                  githubSource.repository
                }
              </small>

              <small>
                {githubSource.ref ??
                  'main'}
              </small>

              {commitSha && (
                <small
                  title={
                    commitSha
                  }
                >
                  {commitSha.slice(
                    0,
                    7,
                  )}
                </small>
              )}

              {githubSource.symbol && (
                <small>
                  {
                    githubSource.symbol
                  }
                </small>
              )}
            </div>
          )}
        </div>

        <div className="source-code-caption-meta">
          {block.captionKey && (
            <small className="source-code-caption-copy">
              {t(
                block.captionKey,
              )}
            </small>
          )}

          {sourceUrl && (
            <a
              className="source-code-github-link"
              href={
                sourceUrl
              }
              target="_blank"
              rel="noreferrer"
              aria-label={t(
                'source.ui.viewOnGitHub',
              )}
              title={t(
                'source.ui.viewOnGitHub',
              )}
            >
              <GitHubIcon />
            </a>
          )}

          <button
            type="button"
            className="source-code-collapse-button"
            onClick={() =>
              setExpanded(
                (
                  current,
                ) =>
                  !current,
              )
            }
            aria-expanded={
              expanded
            }
            aria-controls={
              contentId
            }
            aria-label={
              expanded
                ? t(
                    'source.ui.collapseSource',
                  )
                : t(
                    'source.ui.expandSource',
                  )
            }
            title={
              expanded
                ? t(
                    'source.ui.collapseSource',
                  )
                : t(
                    'source.ui.expandSource',
                  )
            }
          >
            <CollapseIcon
              expanded={
                expanded
              }
            />
          </button>
        </div>
      </figcaption>

      {expanded && (
        <div
          id={
            contentId
          }
          className="source-code-content"
        >
          {state?.status ===
          'error' ? (
            <div className="source-code-status source-code-error">
              <strong>
                {t(
                  'source.ui.unableLoadSource',
                )}
              </strong>

              {state.error && (
                <span>
                  {
                    state.error
                  }
                </span>
              )}

              <button
                type="button"
                className="source-code-retry"
                onClick={
                  onRetry
                }
              >
                {t(
                  'source.ui.retry',
                )}
              </button>
            </div>
          ) : state?.status !==
            'success' ? (
            <div className="source-code-status">
              {t(
                'source.ui.loadingSource',
              )}
            </div>
          ) : (
            <pre>
              <code
                className={`hljs language-${block.language}`}
                dangerouslySetInnerHTML={{
                  __html:
                    highlighted,
                }}
              />
            </pre>
          )}
        </div>
      )}
    </figure>
  );
}