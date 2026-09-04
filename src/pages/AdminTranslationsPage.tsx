import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PROJECT_TRANSLATION_LOCALES,
  projectTranslationCatalog,
  type ProjectTranslation,
  type ProjectTranslationCatalog,
  type ProjectTranslationLocale,
} from '../data/projectTranslationCatalog';
import { projects } from '../data/projects';
import { verifyPortfolioAccess } from '../admin/githubPortfolio';
import {
  mergeProjectTranslations,
  publishProjectTranslationCatalog,
  translateProjectAllLocales,
} from '../admin/projectTranslationManager';
import '../styles/admin-translations.css';

const LOCALE_LABELS: Record<ProjectTranslationLocale, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'vi-Latn': 'Tiếng Việt',
  'vi-Hani': '𡨸喃',
};

function cloneCatalog(): ProjectTranslationCatalog {
  return JSON.parse(JSON.stringify(projectTranslationCatalog)) as ProjectTranslationCatalog;
}

function listFromText(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminTranslationsPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [token, setToken] = useState('');
  const [branch, setBranch] = useState('main');
  const [accessState, setAccessState] = useState<'locked' | 'checking' | 'ready' | 'error'>('locked');
  const [accessMessage, setAccessMessage] = useState('');
  const [catalog, setCatalog] = useState<ProjectTranslationCatalog>(cloneCatalog);
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? '');
  const [activeLocale, setActiveLocale] = useState<ProjectTranslationLocale>('zh-CN');
  const [translationState, setTranslationState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [translationMessage, setTranslationMessage] = useState('');
  const [publishState, setPublishState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [publishMessage, setPublishMessage] = useState('');

  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedSlug),
    [selectedSlug],
  );

  const selectedTranslations = catalog[selectedSlug] ?? {};
  const activeTranslation = selectedTranslations[activeLocale];
  const completedCount = PROJECT_TRANSLATION_LOCALES.filter(
    (locale) => Boolean(selectedTranslations[locale]),
  ).length;

  async function unlock() {
    setAccessState('checking');
    setAccessMessage('Checking GitHub write access…');

    try {
      const access = await verifyPortfolioAccess(tokenInput.trim());
      setToken(tokenInput.trim());
      setBranch(access.defaultBranch || 'main');
      setTokenInput('');
      setAccessState('ready');
      setAccessMessage(`Verified ${access.repository} · ${access.defaultBranch}`);
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : 'Unable to verify GitHub access.');
    }
  }

  function lock() {
    setToken('');
    setTokenInput('');
    setAccessState('locked');
    setAccessMessage('');
  }

  async function generateAllTranslations() {
    if (!selectedProject || !token) return;

    setTranslationState('loading');
    setTranslationMessage('Translating every project field into all four locales…');

    try {
      const translations = await translateProjectAllLocales({
        project: selectedProject,
        token,
      });
      setCatalog((current) => mergeProjectTranslations(current, selectedProject.slug, translations));
      setTranslationState('idle');
      setTranslationMessage('AI translation complete. Review each language before publishing.');
    } catch (error) {
      setTranslationState('error');
      setTranslationMessage(error instanceof Error ? error.message : 'AI translation failed.');
    }
  }

  async function publish() {
    if (!token) return;

    setPublishState('saving');
    setPublishMessage('Publishing multilingual project content to GitHub…');

    try {
      const commitUrl = await publishProjectTranslationCatalog({ token, branch, catalog });
      setPublishState('success');
      setPublishMessage(commitUrl ? `Published: ${commitUrl}` : 'Published project translations.');
    } catch (error) {
      setPublishState('error');
      setPublishMessage(error instanceof Error ? error.message : 'Publishing failed.');
    }
  }

  function updateActive(patch: Partial<ProjectTranslation>) {
    if (!activeTranslation) return;

    setCatalog((current) => ({
      ...current,
      [selectedSlug]: {
        ...(current[selectedSlug] ?? {}),
        [activeLocale]: {
          ...activeTranslation,
          ...patch,
        },
      },
    }));
  }

  if (accessState !== 'ready') {
    return (
      <main className="translation-admin-page shell">
        <section className="translation-access-card">
          <p className="eyebrow">PORTFOLIO CONTROL</p>
          <h1>Translation access</h1>
          <p>
            Use the same fine-grained GitHub token as the main admin. The token stays in memory only.
          </p>
          <label>
            <span>GitHub token</span>
            <input
              type="password"
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              placeholder="github_pat_…"
              autoComplete="off"
            />
          </label>
          <button type="button" onClick={unlock} disabled={accessState === 'checking'}>
            {accessState === 'checking' ? 'Checking…' : 'Unlock translations'}
          </button>
          {accessMessage && (
            <p className={accessState === 'error' ? 'translation-message error' : 'translation-message'}>
              {accessMessage}
            </p>
          )}
          <Link to="/admin">← Back to admin</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="translation-admin-page shell">
      <header className="translation-admin-hero">
        <div>
          <p className="eyebrow">PORTFOLIO CONTROL / AI TRANSLATION</p>
          <h1>Project translator</h1>
          <p>
            Translate one project’s complete portfolio copy into Simplified Chinese, Traditional Chinese,
            Vietnamese, and Chữ Nôm in one AI run.
          </p>
        </div>
        <div className="translation-admin-actions">
          <Link to="/admin">Main admin</Link>
          <button type="button" className="secondary" onClick={lock}>Lock</button>
        </div>
      </header>

      <section className="translation-panel translation-project-picker">
        <div>
          <span>Project</span>
          <select value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)}>
            {projects.map((project) => (
              <option value={project.slug} key={project.slug}>{project.title}</option>
            ))}
          </select>
        </div>
        <div className="translation-coverage">
          <span>Translation coverage</span>
          <strong>{completedCount} / {PROJECT_TRANSLATION_LOCALES.length}</strong>
        </div>
        <button
          type="button"
          onClick={generateAllTranslations}
          disabled={!selectedProject || translationState === 'loading'}
        >
          {translationState === 'loading' ? 'Translating all languages…' : 'AI translate all 4 languages'}
        </button>
      </section>

      {translationMessage && (
        <p className={translationState === 'error' ? 'translation-message error' : 'translation-message'}>
          {translationMessage}
        </p>
      )}

      {selectedProject && (
        <section className="translation-source-summary">
          <div>
            <span>English source</span>
            <strong>{selectedProject.title}</strong>
          </div>
          <p>{selectedProject.summary}</p>
          <small>
            Technologies, URLs, slugs, code identifiers, and brand names are kept as source data rather than translated.
          </small>
        </section>
      )}

      <section className="translation-workspace">
        <nav className="translation-locale-tabs" aria-label="Translation language">
          {PROJECT_TRANSLATION_LOCALES.map((locale) => (
            <button
              type="button"
              key={locale}
              className={activeLocale === locale ? 'active' : ''}
              onClick={() => setActiveLocale(locale)}
            >
              <span>{LOCALE_LABELS[locale]}</span>
              <small>{selectedTranslations[locale] ? 'READY' : 'EMPTY'}</small>
            </button>
          ))}
        </nav>

        {!activeTranslation ? (
          <div className="translation-empty">
            <strong>{LOCALE_LABELS[activeLocale]} has not been generated yet.</strong>
            <p>Run “AI translate all 4 languages” to create the complete translation set.</p>
          </div>
        ) : (
          <div className="translation-editor">
            <div className="translation-editor-heading">
              <div>
                <span>{activeLocale}</span>
                <h2>{LOCALE_LABELS[activeLocale]}</h2>
              </div>
              <strong>ALL PROJECT COPY</strong>
            </div>

            <div className="translation-form-grid">
              <label>
                <span>Title</span>
                <input value={activeTranslation.title} onChange={(event) => updateActive({ title: event.target.value })} />
              </label>
              <label>
                <span>Short title</span>
                <input value={activeTranslation.shortTitle} onChange={(event) => updateActive({ shortTitle: event.target.value })} />
              </label>
              <label className="wide">
                <span>Summary</span>
                <textarea value={activeTranslation.summary} onChange={(event) => updateActive({ summary: event.target.value })} />
              </label>
              <label className="wide">
                <span>Overview</span>
                <textarea className="large" value={activeTranslation.overview} onChange={(event) => updateActive({ overview: event.target.value })} />
              </label>
              <label className="wide">
                <span>Features · one per line</span>
                <textarea
                  className="large"
                  value={activeTranslation.features.join('\n')}
                  onChange={(event) => updateActive({ features: listFromText(event.target.value) })}
                />
              </label>
            </div>

            <section className="translation-array-section">
              <header><span>Challenges</span><strong>{activeTranslation.challenges.length}</strong></header>
              {activeTranslation.challenges.map((item, index) => (
                <div className="translation-pair-row" key={`challenge-${index}`}>
                  <input
                    value={item.title}
                    aria-label={`Challenge ${index + 1} title`}
                    onChange={(event) => {
                      const next = activeTranslation.challenges.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, title: event.target.value } : entry,
                      );
                      updateActive({ challenges: next });
                    }}
                  />
                  <textarea
                    value={item.description}
                    aria-label={`Challenge ${index + 1} description`}
                    onChange={(event) => {
                      const next = activeTranslation.challenges.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, description: event.target.value } : entry,
                      );
                      updateActive({ challenges: next });
                    }}
                  />
                </div>
              ))}
            </section>

            <section className="translation-array-section">
              <header><span>Architecture</span><strong>{activeTranslation.architecture.length}</strong></header>
              {activeTranslation.architecture.map((item, index) => (
                <div className="translation-pair-row compact" key={`architecture-${index}`}>
                  <input
                    value={item.label}
                    aria-label={`Architecture ${index + 1} label`}
                    onChange={(event) => {
                      const next = activeTranslation.architecture.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, label: event.target.value } : entry,
                      );
                      updateActive({ architecture: next });
                    }}
                  />
                  <input
                    value={item.detail}
                    aria-label={`Architecture ${index + 1} detail`}
                    onChange={(event) => {
                      const next = activeTranslation.architecture.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, detail: event.target.value } : entry,
                      );
                      updateActive({ architecture: next });
                    }}
                  />
                </div>
              ))}
            </section>

            <section className="translation-array-section">
              <header><span>Gallery</span><strong>{activeTranslation.gallery.length}</strong></header>
              {activeTranslation.gallery.map((item, index) => (
                <div className="translation-pair-row" key={`gallery-${index}`}>
                  <input
                    value={item.title}
                    aria-label={`Gallery ${index + 1} title`}
                    onChange={(event) => {
                      const next = activeTranslation.gallery.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, title: event.target.value } : entry,
                      );
                      updateActive({ gallery: next });
                    }}
                  />
                  <textarea
                    value={item.caption}
                    aria-label={`Gallery ${index + 1} caption`}
                    onChange={(event) => {
                      const next = activeTranslation.gallery.map((entry, entryIndex) =>
                        entryIndex === index ? { ...entry, caption: event.target.value } : entry,
                      );
                      updateActive({ gallery: next });
                    }}
                  />
                </div>
              ))}
            </section>
          </div>
        )}
      </section>

      <section className="translation-publish-panel">
        <div>
          <span>GitHub publish</span>
          <strong>{branch}</strong>
          <p>Writes the reviewed translation catalog to GitHub. The normal Cloudflare deployment then publishes it.</p>
        </div>
        <button type="button" onClick={publish} disabled={publishState === 'saving' || completedCount === 0}>
          {publishState === 'saving' ? 'Publishing…' : 'Publish translations'}
        </button>
      </section>

      {publishMessage && (
        <p className={publishState === 'error' ? 'translation-message error' : publishState === 'success' ? 'translation-message success' : 'translation-message'}>
          {publishMessage}
        </p>
      )}
    </main>
  );
}
