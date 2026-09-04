import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Link,
  Navigate,
  useParams,
} from 'react-router-dom';

import {
  CodeFlow,
} from '../components/source/CodeFlow';

import {
  RelatedFiles,
} from '../components/source/RelatedFiles';

import {
  SourceBreadcrumbs,
} from '../components/source/SourceBreadcrumbs';

import {
  SourceEmptyState,
} from '../components/source/SourceEmptyState';

import {
  getProjectSource,
} from '../data/source-explanations';

import {
  getProject,
} from '../data/projects';

import {
  useI18n,
} from '../i18n/I18nProvider';

export function ProjectSourcePage() {
  const {
    slug = '',
  } = useParams();

  const project =
    getProject(slug);

  const source =
    getProjectSource(slug);

  const {
    t,
  } = useI18n();

  const [
    selectedCategorySlug,
    setSelectedCategorySlug,
  ] = useState('');

  const [
    selectedFeatureSlug,
    setSelectedFeatureSlug,
  ] = useState('');

  const featureTabsRef =
    useRef<HTMLDivElement>(
      null,
    );

  useEffect(() => {
    if (
      !source ||
      source.categories.length === 0
    ) {
      return;
    }

    const syncFromHash = () => {
      const hash =
        window.location.hash.replace(
          /^#/,
          '',
        );

      const [
        categoryFromHash,
        featureFromHash,
      ] = hash.split('/');

      const category =
        source.categories.find(
          (item) =>
            item.slug ===
            categoryFromHash,
        ) ??
        source.categories[0];

      const feature =
        category.features.find(
          (item) =>
            item.slug ===
            featureFromHash,
        ) ??
        category.features[0];

      setSelectedCategorySlug(
        category.slug,
      );

      setSelectedFeatureSlug(
        feature?.slug ?? '',
      );
    };

    syncFromHash();

    window.addEventListener(
      'hashchange',
      syncFromHash,
    );

    return () => {
      window.removeEventListener(
        'hashchange',
        syncFromHash,
      );
    };
  }, [source]);

  if (!project) {
    return (
      <Navigate
        to="/projects"
        replace
      />
    );
  }

  if (
    !source ||
    source.categories.length === 0
  ) {
    return (
      <main className="source-page shell">
        <SourceBreadcrumbs
          projectSlug={slug}
          projectTitle={
            project.title
          }
        />

        <header className="source-hero">
          <p className="eyebrow">
            {t(
              'source.eyebrow',
            )}
          </p>

          <h1>
            {t(
              'source.title',
            )}
          </h1>

          <p>
            {t(
              'source.description',
            )}
          </p>
        </header>

        <SourceEmptyState
          backTo={`/projects/${slug}`}
        />
      </main>
    );
  }

  const selectedCategory =
    source.categories.find(
      (category) =>
        category.slug ===
        selectedCategorySlug,
    ) ??
    source.categories[0];

  const selectedFeature =
    selectedCategory.features.find(
      (feature) =>
        feature.slug ===
        selectedFeatureSlug,
    ) ??
    selectedCategory.features[0];

  const selectedFeatureIndex =
    selectedFeature
      ? selectedCategory.features.findIndex(
          (feature) =>
            feature.slug ===
            selectedFeature.slug,
        )
      : -1;

  function updateHash(
    categorySlug: string,
    featureSlug: string,
  ) {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}#${categorySlug}/${featureSlug}`,
    );
  }

  function selectCategory(
    categorySlug: string,
  ) {
    const category =
      source.categories.find(
        (item) =>
          item.slug ===
          categorySlug,
      );

    if (!category) {
      return;
    }

    const firstFeature =
      category.features[0];

    setSelectedCategorySlug(
      category.slug,
    );

    setSelectedFeatureSlug(
      firstFeature?.slug ?? '',
    );

    updateHash(
      category.slug,
      firstFeature?.slug ?? '',
    );

    featureTabsRef.current?.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  }

  function selectFeature(
    featureSlug: string,
  ) {
    setSelectedFeatureSlug(
      featureSlug,
    );

    updateHash(
      selectedCategory.slug,
      featureSlug,
    );
  }

  function scrollFeatures(
    direction: -1 | 1,
  ) {
    featureTabsRef.current?.scrollBy({
      left:
        direction * 420,

      behavior:
        'smooth',
    });
  }

  return (
    <main className="source-page shell">
      <SourceBreadcrumbs
        projectSlug={slug}
        projectTitle={
          project.title
        }
      />

      {/* =====================================================
          HERO
          ===================================================== */}

      <header className="source-hero source-hero-compact">
        <p className="eyebrow">
          {t(
            'source.eyebrow',
          )}
        </p>

        <h1>
          {t(
            'source.title',
          )}
        </h1>

        <p>
          {t(
            source.summaryKey,
          )}
        </p>
      </header>

      <section className="source-workspace">
        {/* ===================================================
            TWO LEVEL NAVIGATION
            =================================================== */}

        <div className="source-filter-panel">
          {/* =================================================
              01 CATEGORY
              ================================================= */}

          <section className="source-filter-stage">
            <header className="source-filter-stage-label">
              <span className="source-filter-step">
                01
              </span>

              <div>
                <small>
                  {t('source.category')}
                </small>

                <strong>
                  {t(
                    selectedCategory
                      .nameKey,
                  )}
                </strong>
              </div>
            </header>

            <div className="source-category-options">
              {source.categories.map(
                (
                  category,
                  index,
                ) => {
                  const active =
                    selectedCategory
                      .slug ===
                    category.slug;

                  return (
                    <button
                      key={
                        category.slug
                      }
                      type="button"
                      aria-pressed={
                        active
                      }
                      className={
                        active
                          ? 'source-category-option active'
                          : 'source-category-option'
                      }
                      onClick={() =>
                        selectCategory(
                          category.slug,
                        )
                      }
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <strong>
                        {t(
                          category
                            .nameKey,
                        )}
                      </strong>
                    </button>
                  );
                },
              )}
            </div>
          </section>

          {/* =================================================
              02 FEATURE
              ================================================= */}

          <section className="source-filter-stage">
            <header className="source-filter-stage-label">
              <span className="source-filter-step">
                02
              </span>

              <div>
                <small>
                  {t('source.feature')}
                </small>

                <strong>
                  {selectedFeature
                    ? t(
                        selectedFeature
                          .nameKey,
                      )
                    : '—'}
                </strong>
              </div>
            </header>

            <div className="source-feature-navigation">
              <button
                type="button"
                className="source-feature-scroll-button"
                aria-label={t('source.ui.previousFeatures')}
                onClick={() =>
                  scrollFeatures(
                    -1,
                  )
                }
              >
                ←
              </button>

              <div
                ref={
                  featureTabsRef
                }
                className="source-feature-options"
              >
                {selectedCategory.features.map(
                  (
                    feature,
                    index,
                  ) => {
                    const active =
                      selectedFeature
                        ?.slug ===
                      feature.slug;

                    return (
                      <button
                        key={
                          feature.slug
                        }
                        type="button"
                        aria-pressed={
                          active
                        }
                        className={
                          active
                            ? 'source-feature-option active'
                            : 'source-feature-option'
                        }
                        onClick={() =>
                          selectFeature(
                            feature.slug,
                          )
                        }
                      >
                        <span>
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            '0',
                          )}
                        </span>

                        <strong>
                          {t(
                            feature
                              .nameKey,
                          )}
                        </strong>
                      </button>
                    );
                  },
                )}
              </div>

              <button
                type="button"
                className="source-feature-scroll-button"
                aria-label={t('source.ui.nextFeatures')}
                onClick={() =>
                  scrollFeatures(
                    1,
                  )
                }
              >
                →
              </button>
            </div>
          </section>
        </div>

        {/* ===================================================
            CATEGORY CONTEXT
            =================================================== */}

        <div className="source-current-context">
          <div>
            <small>
              {t('source.ui.currentCategory')}
            </small>

            <strong>
              {t(
                selectedCategory
                  .nameKey,
              )}
            </strong>
          </div>

          <p>
            {t(
              selectedCategory
                .summaryKey,
            )}
          </p>
        </div>

        {!selectedFeature ? (
          <p className="source-inline-empty">
            No source features.
          </p>
        ) : (
          <>
            {/* ===============================================
                SELECTED FEATURE
                =============================================== */}

            <header className="source-selected-feature-redesign">
              <div className="source-selected-feature-index">
                <span>
                  FEATURE
                </span>

                <strong>
                  {String(
                    selectedFeatureIndex +
                      1,
                  ).padStart(
                    2,
                    '0',
                  )}
                </strong>
              </div>

              <div className="source-selected-feature-copy">
                <p className="eyebrow">
                  {t(
                    'source.feature',
                  )}
                </p>

                <h2>
                  {t(
                    selectedFeature
                      .nameKey,
                  )}
                </h2>

                <p>
                  {t(
                    selectedFeature
                      .summaryKey,
                  )}
                </p>
              </div>
            </header>

            {/* ===============================================
                RELATED FILES
                Click a file to reveal source code
                =============================================== */}

            <RelatedFiles
              files={
                selectedFeature
                  .relatedFiles
              }
              codeBlocks={
                selectedFeature
                  .codeBlocks
              }
            />

            {/* ===============================================
                CODE FLOW
                =============================================== */}

            <CodeFlow
              steps={
                selectedFeature
                  .codeFlow
              }
            />

            {/* ===============================================
                EXPLANATION
                =============================================== */}

            {selectedFeature
              .explanationKeys
              .length >
              0 && (
              <section className="source-subsection source-explanation-copy">
                <h2>
                  {t(
                    'source.explanation',
                  )}
                </h2>

                {selectedFeature.explanationKeys.map(
                  (
                    key,
                  ) => (
                    <p
                      key={
                        key
                      }
                    >
                      {t(
                        key,
                      )}
                    </p>
                  ),
                )}
              </section>
            )}
          </>
        )}
      </section>

      <Link
        className="back-link source-project-back"
        to={`/projects/${slug}`}
      >
        {t(
          'source.backProject',
        )}
      </Link>
    </main>
  );
}