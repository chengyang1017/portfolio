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

import { renderTranslatedCode } from '../../data/source-explanations/renderCode';
import {
  resolveCodeBlock,
  type ResolvedCode,
} from '../../data/source-explanations/resolveCodeSource';
import { useI18n } from '../../i18n/I18nProvider';

interface ResolvedBlockState {
  status: 'loading' | 'success' | 'error';
  result?: ResolvedCode;
  error?: string;
}

export function SourceCodeBlocks({
  blocks,
}: {
  blocks: SourceCodeBlock[];
}) {
  const { t } = useI18n();

  const [resolvedBlocks, setResolvedBlocks] =
    useState<Record<string, ResolvedBlockState>>(
      {},
    );

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  async function retryBlock(
    block: SourceCodeBlock,
  ) {
    setResolvedBlocks((current) => ({
      ...current,

      [block.id]: {
        status: 'loading',
      },
    }));

    try {
      const result =
        await resolveCodeBlock(block);

      if (!mountedRef.current) {
        return;
      }

      setResolvedBlocks((current) => ({
        ...current,

        [block.id]: {
          status: 'success',
          result,
        },
      }));
    } catch (error) {
      if (!mountedRef.current) {
        return;
      }

      setResolvedBlocks((current) => ({
        ...current,

        [block.id]: {
          status: 'error',

          error:
            error instanceof Error
              ? error.message
              : 'Unknown source loading error',
        },
      }));
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadBlocks() {
      const entries = await Promise.all(
        blocks.map(async (block) => {
          try {
            const result =
              await resolveCodeBlock(block);

            return [
              block.id,
              {
                status: 'success',
                result,
              } satisfies ResolvedBlockState,
            ] as const;
          } catch (error) {
            return [
              block.id,
              {
                status: 'error',
                error:
                  error instanceof Error
                    ? error.message
                    : 'Unknown source loading error',
              } satisfies ResolvedBlockState,
            ] as const;
          }
        }),
      );

      if (cancelled) {
        return;
      }

      setResolvedBlocks(
        Object.fromEntries(entries),
      );
    }

    setResolvedBlocks(
      Object.fromEntries(
        blocks.map((block) => [
          block.id,
          {
            status: 'loading',
          } satisfies ResolvedBlockState,
        ]),
      ),
    );

    void loadBlocks();

    return () => {
      cancelled = true;
    };
  }, [blocks]);

  if (blocks.length === 0) {
    return (
      <section className="source-subsection">
        <h2>{t('source.codeBlocks')}</h2>

        <p className="source-inline-empty">
          {t('source.empty.code')}
        </p>
      </section>
    );
  }

  return (
    <section className="source-subsection">
      <h2>{t('source.codeBlocks')}</h2>

      <div className="source-code-blocks">
        {blocks.map((block) => (
          <SourceCodeBlockView
            key={block.id}
            block={block}
            state={resolvedBlocks[block.id]}
            onRetry={() => {
              void retryBlock(block);
            }}
          />
        ))}
      </div>
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

function SourceCodeBlockView({
  block,
  state,
  onRetry,
}: {
  block: SourceCodeBlock;
  state?: ResolvedBlockState;
  onRetry: () => void;
}) {
  const { t } = useI18n();

  const githubSource =
    block.source.type === 'github'
      ? block.source
      : undefined;

  const code =
    state?.status === 'success'
      ? renderTranslatedCode(
          state.result?.code ?? '',
          t,
        )
      : '';

  const highlighted = useMemo(() => {
    if (!code) {
      return '';
    }

    try {
      return hljs.highlight(code, {
        language: block.language,
      }).value;
    } catch {
      return hljs.highlightAuto(code).value;
    }
  }, [code, block.language]);

  const displayPath =
    githubSource?.path ??
    block.id;

  const fallbackSourceUrl = githubSource
    ? `https://github.com/${githubSource.repository}/blob/${
        githubSource.ref ?? 'main'
      }/${githubSource.path}`
    : undefined;

  const sourceUrl =
    state?.status === 'success'
      ? state.result?.sourceUrl ??
        fallbackSourceUrl
      : fallbackSourceUrl;

  const commitSha =
    state?.status === 'success'
      ? state.result?.commitSha
      : undefined;

  return (
    <figure>
      <figcaption>
        <div className="source-code-caption-main">
          <span className="source-code-path">
            {displayPath}
          </span>

          {githubSource && (
            <div className="source-code-origin">
              <small>
                {githubSource.repository}
              </small>

              <small>
                {githubSource.ref ?? 'main'}
              </small>

              {commitSha && (
                <small title={commitSha}>
                  {commitSha.slice(0, 7)}
                </small>
              )}

              {githubSource.symbol && (
                <small>
                  {githubSource.symbol}
                </small>
              )}
            </div>
          )}
        </div>

        <div className="source-code-caption-meta">
          {block.captionKey && (
            <small className="source-code-caption-copy">
              {t(block.captionKey)}
            </small>
          )}

          {sourceUrl && (
            <a
              className="source-code-github-link"
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="View source on GitHub"
              title="View source on GitHub"
            >
              <GitHubIcon />
            </a>
          )}
        </div>
      </figcaption>

      {state?.status === 'error' ? (
        <div className="source-code-status source-code-error">
          <strong>Unable to load source code</strong>

          <span>{state.error}</span>

          <button
            type="button"
            className="source-code-retry"
            onClick={onRetry}
          >
            Retry
          </button>
        </div>
      ) : state?.status !== 'success' ? (
        <div className="source-code-status">
          Loading source code…
        </div>
      ) : (
        <pre>
          <code
            className={`hljs language-${block.language}`}
            dangerouslySetInnerHTML={{
              __html: highlighted,
            }}
          />
        </pre>
      )}
    </figure>
  );
}
