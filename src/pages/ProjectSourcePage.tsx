import {
  useEffect,
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
  SourceCodeBlocks,
} from '../components/source/SourceCodeBlocks';

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

type SourceView =
  | 'explanation'
  | 'code';

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

  const [
    activeView,
    setActiveView,
  ] = useState<SourceView>(
    'explanation',
  );

  /*
   * 仍然只有一个页面：
   *
   * /projects/glyphora/source
   *
   * hash 只负责保存：
   *
   * #posts-engagement/publish-post
   *
   * 不会进入新的 React Router 页面。
   */
  useEffect(() => {
    if (
      !source ||
      source.categories.length === 0
    ) {
      return;
    }

    const syncFromHash = () => {
      const hash =
        window.location.hash
          .replace(/^#/, '');

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
          projectTitle={project.title}
        />

        <header className="source-hero">
          <p className="eyebrow">
            {t('source.eyebrow')}
          </p>

          <h1>
            {t('source.title')}
          </h1>

          <p>
            {t('source.description')}
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

    /*
     * 切换分类以后，
     * 默认回到 Code explanation。
     */
    setActiveView(
      'explanation',
    );

    updateHash(
      category.slug,
      firstFeature?.slug ?? '',
    );
  }

  function selectFeature(
    featureSlug: string,
  ) {
    setSelectedFeatureSlug(
      featureSlug,
    );

    /*
     * 切换 Feature 后，
     * 默认先展示解释。
     */
    setActiveView(
      'explanation',
    );

    updateHash(
      selectedCategory.slug,
      featureSlug,
    );
  }

  return (
    <main className="source-page shell">
      <SourceBreadcrumbs
        projectSlug={slug}
        projectTitle={project.title}
      />

      {/* =====================================================
          PAGE HERO
          ===================================================== */}

      <header className="source-hero source-hero-compact">
        <p className="eyebrow">
          {t('source.eyebrow')}
        </p>

        <h1>
          {t('source.title')}
        </h1>

        <p>
          {t(source.summaryKey)}
        </p>
      </header>

      {/* =====================================================
          CATEGORY TABS

          Posts & engagement
          Real-time chat lifecycle
          Collaborative notes
          ===================================================== */}

      <nav
        className="source-category-tabs"
        aria-label="Source categories"
      >
        {source.categories.map(
          (category, index) => {
            const active =
              selectedCategory.slug ===
              category.slug;

            return (
              <button
                key={category.slug}
                type="button"
                className={
                  active
                    ? 'source-category-tab active'
                    : 'source-category-tab'
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
                  ).padStart(2, '0')}
                </span>

                <strong>
                  {t(category.nameKey)}
                </strong>
              </button>
            );
          },
        )}
      </nav>

      {/* =====================================================
          CURRENT CATEGORY
          ===================================================== */}

      <section className="source-category-workspace">
        <header className="source-category-intro">
          <div>
            <p className="eyebrow">
              Category
            </p>

            <h2>
              {t(
                selectedCategory.nameKey,
              )}
            </h2>
          </div>

          <p>
            {t(
              selectedCategory.summaryKey,
            )}
          </p>
        </header>

        {/* ===================================================
            FEATURE TABS

            Publish a multilingual post
            Optimistic, idempotent likes
            =================================================== */}

        {selectedCategory.features.length >
          0 && (
          <nav
            className="source-feature-tabs"
            aria-label="Features"
          >
            {selectedCategory.features.map(
              (feature, index) => {
                const active =
                  selectedFeature?.slug ===
                  feature.slug;

                return (
                  <button
                    key={feature.slug}
                    type="button"
                    className={
                      active
                        ? 'source-feature-tab active'
                        : 'source-feature-tab'
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
                      ).padStart(2, '0')}
                    </span>

                    <strong>
                      {t(
                        feature.nameKey,
                      )}
                    </strong>
                  </button>
                );
              },
            )}
          </nav>
        )}

        {!selectedFeature ? (
          <p className="source-inline-empty">
            No source features.
          </p>
        ) : (
          <>
            {/* ===============================================
                SELECTED FEATURE
                =============================================== */}

            <header className="source-selected-feature">
              <span className="source-feature-number">
                {String(
                  selectedFeatureIndex +
                    1,
                ).padStart(2, '0')}
              </span>

              <div>
                <p className="eyebrow">
                  {t('source.feature')}
                </p>

                <h2>
                  {t(
                    selectedFeature.nameKey,
                  )}
                </h2>

                <p>
                  {t(
                    selectedFeature.summaryKey,
                  )}
                </p>
              </div>
            </header>

            {/* ===============================================
                MAIN TABVIEW

                Code explanation
                Source code
                =============================================== */}

            <div
              className="source-view-tabs"
              role="tablist"
              aria-label="Source feature view"
            >
              <button
                type="button"
                role="tab"
                aria-selected={
                  activeView ===
                  'explanation'
                }
                className={
                  activeView ===
                  'explanation'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setActiveView(
                    'explanation',
                  )
                }
              >
                Code explanation
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={
                  activeView === 'code'
                }
                className={
                  activeView === 'code'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setActiveView(
                    'code',
                  )
                }
              >
                Source code
              </button>
            </div>

            {/* ===============================================
                TAB CONTENT
                =============================================== */}

            <div className="source-view-content">
              {activeView ===
              'explanation' ? (
                /*
                 * TAB 1
                 *
                 * Code explanation
                 * Related files
                 * Code flow
                 */
                <div className="source-explanation-view">
                  {selectedFeature
                    .explanationKeys
                    .length > 0 && (
                    <section className="source-subsection source-explanation-copy">
                      <h2>
                        Code explanation
                      </h2>

                      {selectedFeature
                        .explanationKeys
                        .map(
                          (key) => (
                            <p
                              key={key}
                            >
                              {t(key)}
                            </p>
                          ),
                        )}
                    </section>
                  )}

                  <RelatedFiles
                    files={
                      selectedFeature.relatedFiles
                    }
                  />

                  <CodeFlow
                    steps={
                      selectedFeature.codeFlow
                    }
                  />
                </div>
              ) : (
                /*
                 * TAB 2
                 *
                 * 真正的 GitHub Source Code
                 *
                 * 动态代码读取、
                 * GitHub 按钮、
                 * annotation 展示逻辑
                 * 全部继续由 SourceCodeBlocks 负责。
                 */
                <div className="source-code-view">
                  <SourceCodeBlocks
                    blocks={
                      selectedFeature.codeBlocks
                    }
                  />
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <Link
        className="back-link source-project-back"
        to={`/projects/${slug}`}
      >
        {t('source.backProject')}
      </Link>
    </main>
  );
}