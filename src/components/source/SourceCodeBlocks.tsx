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
  <span>{displayPath}</span>

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
      commit {commitSha.slice(0, 7)}
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
            <small>
              {t(block.captionKey)}
            </small>
          )}

          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              View source ↗
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