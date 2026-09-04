import {
  useMemo,
  useState,
} from 'react';

import type {
  SourceCodeBlock,
  SourceRelatedFile,
} from '../../data/source-explanations';

import {
  useI18n,
} from '../../i18n/I18nProvider';

import {
  SourceCodeBlocks,
} from './SourceCodeBlocks';

function splitFilePath(
  path: string,
) {
  const lastSlash =
    path.lastIndexOf('/');

  if (lastSlash === -1) {
    return {
      directory: '',
      fileName: path,
    };
  }

  return {
    directory:
      path.slice(
        0,
        lastSlash + 1,
      ),

    fileName:
      path.slice(
        lastSlash + 1,
      ),
  };
}

function getFileType(
  fileName: string,
) {
  const extension =
    fileName
      .split('.')
      .pop();

  return (
    extension?.toUpperCase() ||
    'FILE'
  );
}

function normalizePath(
  value: string,
) {
  return value
    .replaceAll(
      '\\',
      '/',
    )
    .replace(
      /^\/+/,
      '',
    );
}

function getBlocksForFile(
  path: string,
  blocks: SourceCodeBlock[],
) {
  const normalizedPath =
    normalizePath(path);

  return blocks.filter(
    (block) => {
      if (
        block.source.type !==
        'github'
      ) {
        return false;
      }

      return (
        normalizePath(
          block.source.path,
        ) ===
        normalizedPath
      );
    },
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

export function RelatedFiles({
  files,
  codeBlocks = [],
}: {
  files: SourceRelatedFile[];
  codeBlocks?: SourceCodeBlock[];
}) {
  const {
    t,
  } = useI18n();

  const [
    expandedPath,
    setExpandedPath,
  ] = useState<
    string | null
  >(null);

  const blocksByFile =
    useMemo(() => {
      return Object.fromEntries(
        files.map(
          (file) => [
            file.path,
            getBlocksForFile(
              file.path,
              codeBlocks,
            ),
          ],
        ),
      ) as Record<
        string,
        SourceCodeBlock[]
      >;
    }, [
      files,
      codeBlocks,
    ]);

  function toggleFile(
    path: string,
  ) {
    setExpandedPath(
      (current) =>
        current === path
          ? null
          : path,
    );
  }

  return (
    <section className="source-subsection related-files-section">
      <header className="related-files-toolbar">
        <div>
          <p className="related-files-label">
            {t(
              'source.ui.repositoryReferences',
            )}
          </p>

          <h2>
            {t(
              'source.relatedFiles',
            )}
          </h2>
        </div>

        <span className="related-files-count">
          {String(
            files.length,
          ).padStart(
            2,
            '0',
          )}{' '}
          {t(
            'source.ui.files',
          )}
        </span>
      </header>

      {files.length === 0 ? (
        <p className="source-inline-empty">
          {t(
            'source.empty.files',
          )}
        </p>
      ) : (
        <div className="related-files-browser">
          <div
            className="related-files-browser-head"
            aria-hidden="true"
          >
            <span>
              {t(
                'source.ui.no',
              )}
            </span>

            <span>
              {t(
                'source.ui.file',
              )}
            </span>

            <span>
              {t(
                'source.ui.repositoryLocation',
              )}
            </span>

            <span>
              {t(
                'source.ui.type',
              )}
            </span>

            <span />

            <span />
          </div>

          <div className="related-files-list">
            {files.map(
              (
                file,
                index,
              ) => {
                const {
                  directory,
                  fileName,
                } =
                  splitFilePath(
                    file.path,
                  );

                const expanded =
                  expandedPath ===
                  file.path;

                const matchingBlocks =
                  blocksByFile[
                    file.path
                  ] ?? [];

                const primaryBlock =
                  matchingBlocks[0];

                const githubSources =
                  matchingBlocks.flatMap(
                    (block) =>
                      block.source.type ===
                      'github'
                        ? [
                            block.source,
                          ]
                        : [],
                  );

                const primarySource =
                  githubSources[0];

                const symbols =
                  Array.from(
                    new Set(
                      githubSources
                        .map(
                          (
                            source,
                          ) =>
                            source.symbol,
                        )
                        .filter(
                          (
                            symbol,
                          ): symbol is string =>
                            Boolean(
                              symbol,
                            ),
                        ),
                    ),
                  );

                const sourceUrl =
                  primarySource
                    ? `https://github.com/${primarySource.repository}/blob/${
                        primarySource.ref ??
                        'main'
                      }/${primarySource.path}`
                    : undefined;

                return (
                  <article
                    className={
                      expanded
                        ? 'related-file-entry expanded'
                        : 'related-file-entry'
                    }
                    key={
                      file.path
                    }
                  >
                    <div className="related-file-row">
                      <button
                        type="button"
                        className="related-file-main"
                        aria-expanded={
                          expanded
                        }
                        aria-label={
                          expanded
                            ? `${t(
                                'source.ui.collapseSource',
                              )}: ${fileName}`
                            : `${t(
                                'source.ui.expandSource',
                              )}: ${fileName}`
                        }
                        onClick={() =>
                          toggleFile(
                            file.path,
                          )
                        }
                      >
                        <span className="related-file-index">
                          {String(
                            index +
                              1,
                          ).padStart(
                            2,
                            '0',
                          )}
                        </span>

                        <div className="related-file-name">
                          <strong>
                            {
                              fileName
                            }
                          </strong>

                          {(primarySource ||
                            symbols.length >
                              0) && (
                            <div className="related-file-origin">
                              {primarySource && (
                                <>
                                  <span>
                                    {
                                      primarySource.repository
                                    }
                                  </span>

                                  <span>
                                    {primarySource.ref ??
                                      'main'}
                                  </span>
                                </>
                              )}

                              {symbols.map(
                                (
                                  symbol,
                                ) => (
                                  <span
                                    key={
                                      symbol
                                    }
                                  >
                                    {
                                      symbol
                                    }
                                  </span>
                                ),
                              )}
                            </div>
                          )}

                          {primaryBlock?.captionKey && (
                            <p className="related-file-caption">
                              {t(
                                primaryBlock.captionKey,
                              )}
                            </p>
                          )}

                          {!primaryBlock?.captionKey &&
                            file.descriptionKey && (
                              <p className="related-file-caption">
                                {t(
                                  file.descriptionKey,
                                )}
                              </p>
                            )}
                        </div>

                        <code className="related-file-path">
                          {directory ||
                            './'}
                        </code>

                        <span
                          className="related-file-type"
                          data-type={getFileType(
                            fileName,
                          ).toLowerCase()}
                        >
                          {getFileType(
                            fileName,
                          )}
                        </span>
                      </button>

                      {sourceUrl ? (
                        <a
                          className="related-file-github"
                          href={
                            sourceUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${t(
                            'source.ui.viewOnGitHub',
                          )}: ${fileName}`}
                          title={t(
                            'source.ui.viewOnGitHub',
                          )}
                        >
                          <GitHubIcon />
                        </a>
                      ) : (
                        <span className="related-file-action-placeholder" />
                      )}

                      <button
                        type="button"
                        className={
                          expanded
                            ? 'related-file-toggle expanded'
                            : 'related-file-toggle'
                        }
                        onClick={() =>
                          toggleFile(
                            file.path,
                          )
                        }
                        aria-expanded={
                          expanded
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
                        <span
                          aria-hidden="true"
                        >
                          ↓
                        </span>
                      </button>
                    </div>

                    {expanded && (
                      <div className="related-file-expanded">
                        {matchingBlocks.length >
                        0 ? (
                          <SourceCodeBlocks
                            blocks={
                              matchingBlocks
                            }
                            embedded
                          />
                        ) : (
                          <p className="related-file-no-code">
                            {t(
                              'source.empty.code',
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                );
              },
            )}
          </div>
        </div>
      )}
    </section>
  );
}