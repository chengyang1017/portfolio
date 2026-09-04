import { useEffect, useMemo, useState } from 'react';
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
import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';
import { getAdminUiCopy } from '../admin/adminUiCopy';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useI18n } from '../i18n/I18nProvider';
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
  const { language } = useI18n();
  const ui = getAdminUiCopy(language);
  const [password, setPassword] = useState('');
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
    const cleanPassword = password.trim();
    if (!cleanPassword) return;

    setAccessState('checking');
    setAccessMessage(ui.checkingAdminAccess);

    try {
      const access = await loginAdmin(cleanPassword);
      setBranch(access.defaultBranch || 'main');
      setPassword('');
      setAccessState('ready');
      setAccessMessage(`Verified ${access.repository} · ${access.defaultBranch}`);
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : ui.unableVerifyAdmin);
    }
  }

  useEffect(() => {
    let active = true;
    setAccessState('checking');
    setAccessMessage(ui.restoringAdminSession);

    void getAdminSession()
      .then((session) => {
        if (!active) return;
        if (!session) {
          setAccessState('locked');
          setAccessMessage('');
          return;
        }
        setBranch(session.defaultBranch || 'main');
        setAccessState('ready');
        setAccessMessage(`Verified ${session.repository} · ${session.defaultBranch}`);
      })
      .catch((error) => {
        if (!active) return;
        setAccessState('error');
        setAccessMessage(error instanceof Error ? error.message : ui.unableRestoreSession);
      });

    return () => {
      active = false;
    };
  }, []);

  function lock() {
    void logoutAdmin();
    setPassword('');
    setAccessState('locked');
    setAccessMessage('');
  }

  async function generateAllTranslations() {
    if (!selectedProject) return;

    setTranslationState('loading');
    setTranslationMessage(ui.translatingMessage);

    try {
      const translations = await translateProjectAllLocales({
        project: selectedProject,
      });
      setCatalog((current) => mergeProjectTranslations(current, selectedProject.slug, translations));
      setTranslationState('idle');
      setTranslationMessage(ui.translationComplete);
    } catch (error) {
      setTranslationState('error');
      setTranslationMessage(error instanceof Error ? error.message : ui.translationFailed);
    }
  }

  async function publish() {
    setPublishState('saving');
    setPublishMessage(ui.publishingTranslations);

    try {
      const commitUrl = await publishProjectTranslationCatalog({ branch, catalog });
      setPublishState('success');
      setPublishMessage(commitUrl ? `Published: ${commitUrl}` : ui.publishedTranslations);
    } catch (error) {
      setPublishState('error');
      setPublishMessage(error instanceof Error ? error.message : ui.publishingFailed);
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
          <div className="translation-access-language"><LanguageSwitcher /></div>
          <p className="eyebrow">PORTFOLIO CONTROL</p>
          <h1>{ui.translationAccessTitle}</h1>
          <p>
            {ui.translationAccessDescription}
          </p>
          <label>
            <span>{ui.adminPassword}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={ui.enterAdminPassword}
              autoComplete="off"
            />
          </label>
          <button type="button" onClick={unlock} disabled={accessState === 'checking'}>
            {accessState === 'checking' ? ui.checkingAccess : ui.unlockTranslations}
          </button>
          {accessMessage && (
            <p className={accessState === 'error' ? 'translation-message error' : 'translation-message'}>
              {accessMessage}
            </p>
          )}
          <Link to="/admin">← {ui.backToAdmin}</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="translation-admin-page shell">
      <header className="translation-admin-hero">
        <div>
          <p className="eyebrow">PORTFOLIO CONTROL / AI TRANSLATION</p>
          <h1>{ui.projectTranslator}</h1>
          <p>
            {ui.translatorDescription}
          </p>
        </div>
        <div className="translation-admin-actions">
          <LanguageSwitcher />
          <Link to="/admin">{ui.mainAdmin}</Link>
          <button type="button" className="secondary" onClick={lock}>{ui.lock}</button>
        </div>
      </header>

      <section className="translation-panel translation-project-picker">
        <div>
          <span>{ui.project}</span>
          <select value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)}>
            {projects.map((project) => (
              <option value={project.slug} key={project.slug}>{project.title}</option>
            ))}
          </select>
        </div>
        <div className="translation-coverage">
          <span>{ui.translationCoverage}</span>
          <strong>{completedCount} / {PROJECT_TRANSLATION_LOCALES.length}</strong>
        </div>
        <button
          type="button"
          onClick={generateAllTranslations}
          disabled={!selectedProject || translationState === 'loading'}
        >
          {translationState === 'loading' ? ui.translatingAll : ui.aiTranslateAll}
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
            <span>{ui.englishSource}</span>
            <strong>{selectedProject.title}</strong>
          </div>
          <p>{selectedProject.summary}</p>
          <small>
            {ui.sourcePreservationNote}
          </small>
        </section>
      )}

      <section className="translation-workspace">
        <nav className="translation-locale-tabs" aria-label={ui.translationLanguage}>
          {PROJECT_TRANSLATION_LOCALES.map((locale) => (
            <button
              type="button"
              key={locale}
              className={activeLocale === locale ? 'active' : ''}
              onClick={() => setActiveLocale(locale)}
            >
              <span>{LOCALE_LABELS[locale]}</span>
              <small>{selectedTranslations[locale] ? ui.ready : ui.empty}</small>
            </button>
          ))}
        </nav>

        {!activeTranslation ? (
          <div className="translation-empty">
            <strong>{LOCALE_LABELS[activeLocale]} {ui.notGenerated}</strong>
            <p>{ui.runAiTranslate}</p>
          </div>
        ) : (
          <div className="translation-editor">
            <div className="translation-editor-heading">
              <div>
                <span>{activeLocale}</span>
                <h2>{LOCALE_LABELS[activeLocale]}</h2>
              </div>
              <strong>{ui.allProjectCopy}</strong>
            </div>

            <div className="translation-form-grid">
              <label>
                <span>{ui.title}</span>
                <input value={activeTranslation.title} onChange={(event) => updateActive({ title: event.target.value })} />
              </label>
              <label>
                <span>{ui.shortTitle}</span>
                <input value={activeTranslation.shortTitle} onChange={(event) => updateActive({ shortTitle: event.target.value })} />
              </label>
              <label className="wide">
                <span>{ui.summary}</span>
                <textarea value={activeTranslation.summary} onChange={(event) => updateActive({ summary: event.target.value })} />
              </label>
              <label className="wide">
                <span>{ui.overview}</span>
                <textarea className="large" value={activeTranslation.overview} onChange={(event) => updateActive({ overview: event.target.value })} />
              </label>
              <label className="wide">
                <span>{ui.featuresOnePerLine}</span>
                <textarea
                  className="large"
                  value={activeTranslation.features.join('\n')}
                  onChange={(event) => updateActive({ features: listFromText(event.target.value) })}
                />
              </label>
            </div>

            <section className="translation-array-section">
              <header><span>{ui.challenges}</span><strong>{activeTranslation.challenges.length}</strong></header>
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
              <header><span>{ui.architecture}</span><strong>{activeTranslation.architecture.length}</strong></header>
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
              <header><span>{ui.gallery}</span><strong>{activeTranslation.gallery.length}</strong></header>
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
          <span>{ui.githubPublish}</span>
          <strong>{branch}</strong>
          <p>{ui.translationPublishDescription}</p>
        </div>
        <button type="button" onClick={publish} disabled={publishState === 'saving' || completedCount === 0}>
          {publishState === 'saving' ? ui.publishing : ui.publishTranslations}
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
