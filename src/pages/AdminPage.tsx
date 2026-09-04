import { useEffect, useMemo, useState } from 'react';
import type { Project, ProjectCategory } from '../data/projects';
import { projects as initialProjects } from '../data/projects';
import {
  PROJECT_TRANSLATION_LOCALES,
  projectTranslationCatalog,
  type ProjectTranslation,
  type ProjectTranslationCatalog,
  type ProjectTranslationLocale,
} from '../data/projectTranslationCatalog';
import {
  technologyCatalog as initialTechnologyCatalog,
  type TechnologyCatalog,
  type TechnologyGroupId,
  type TechnologyItem,
} from '../data/technologyCatalog';
import {
  analyzeRepository,
  createProjectFromAnalysis,
  mergeTechnologyNames,
  publishPortfolioContent,
  verifyPortfolioAccess,
  type PortfolioAccess,
  type RepositoryAnalysis,
} from '../admin/githubPortfolio';
import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';
import {
  mergeProjectTranslations,
  publishProjectTranslationCatalog,
  translateProjectAllLocales,
} from '../admin/projectTranslationManager';
import { getAdminUiCopy } from '../admin/adminUiCopy';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useI18n } from '../i18n/I18nProvider';

type ContentLocale = 'en' | ProjectTranslationLocale;

const CONTENT_LOCALES: Array<{ id: ContentLocale; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'zh-CN', label: '简体中文' },
  { id: 'zh-TW', label: '繁體中文' },
  { id: 'vi-Latn', label: 'Tiếng Việt' },
  { id: 'vi-Hani', label: '𡨸喃' },
];

const GROUPS: Array<{ id: TechnologyGroupId; label: string }> = [
  { id: 'client', label: 'Client / Languages' },
  { id: 'backend', label: 'Backend / Data' },
  { id: 'platform', label: 'Platforms / Tools' },
];

const PROJECT_TONES: Project['tone'][] = [
  'lime',
  'blue',
  'sand',
  'lavender',
  'slate',
  'coral',
];

const PROJECT_MOCKUPS: Project['mockup'][] = [
  'morphology',
  'commerce',
  'language',
  'keyboard',
  'ide',
  'inflection',
];

function cloneProjects() {
  return initialProjects.map((project) => ({
    ...project,
    technologies: [...project.technologies],
    features: [...project.features],
    challenges: project.challenges.map((item) => ({ ...item })),
    architecture: project.architecture.map((item) => ({ ...item })),
    gallery: project.gallery.map((item) => ({ ...item })),
  }));
}

function cloneTechnologyCatalog(): TechnologyCatalog {
  return {
    client: initialTechnologyCatalog.client.map((item) => ({ ...item })),
    backend: initialTechnologyCatalog.backend.map((item) => ({ ...item })),
    platform: initialTechnologyCatalog.platform.map((item) => ({ ...item })),
  };
}

function cloneProjectTranslations(): ProjectTranslationCatalog {
  return JSON.parse(JSON.stringify(projectTranslationCatalog)) as ProjectTranslationCatalog;
}

function emptyProjectTranslation(): ProjectTranslation {
  return {
    title: '',
    shortTitle: '',
    summary: '',
    overview: '',
    features: [],
    challenges: [],
    architecture: [],
    gallery: [],
  };
}

function listFromText(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pairLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...right] = line.split('|');
      return [left.trim(), right.join('|').trim()] as const;
    })
    .filter(([left]) => Boolean(left));
}

function challengesToText(project: Pick<Project, 'challenges'>) {
  return project.challenges
    .map((item) => `${item.title} | ${item.description}`)
    .join('\n');
}

function architectureToText(project: Pick<Project, 'architecture'>) {
  return project.architecture
    .map((item) => `${item.label} | ${item.detail}`)
    .join('\n');
}

function galleryToText(project: Pick<Project, 'gallery'>) {
  return project.gallery
    .map((item) => `${item.title} | ${item.caption}`)
    .join('\n');
}

export function AdminPage() {
  const { language } = useI18n();
  const ui = getAdminUiCopy(language);
  const [projectDrafts, setProjectDrafts] = useState<Project[]>(cloneProjects);
  const [technologyDrafts, setTechnologyDrafts] = useState<TechnologyCatalog>(
    cloneTechnologyCatalog,
  );
  const [translationDrafts, setTranslationDrafts] = useState<ProjectTranslationCatalog>(
    cloneProjectTranslations,
  );
  const [contentLocale, setContentLocale] = useState<ContentLocale>('en');
  const [translationState, setTranslationState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [translationMessage, setTranslationMessage] = useState('');
  const [selectedSlug, setSelectedSlug] = useState(initialProjects[0]?.slug ?? '');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [analysisState, setAnalysisState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [analysisError, setAnalysisError] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('main');
  const [accessState, setAccessState] = useState<'locked' | 'checking' | 'granted' | 'error'>(
    'locked',
  );
  const [accessInfo, setAccessInfo] = useState<PortfolioAccess | null>(null);
  const [accessMessage, setAccessMessage] = useState('');
  const [publishState, setPublishState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [publishMessage, setPublishMessage] = useState('');

  const selectedProject = useMemo(
    () => projectDrafts.find((project) => project.slug === selectedSlug),
    [projectDrafts, selectedSlug],
  );

  const allTechnologyNames = useMemo(
    () => Object.values(technologyDrafts).flat().map((technology) => technology.name),
    [technologyDrafts],
  );

  const selectedTranslation = useMemo(() => {
    if (!selectedProject || contentLocale === 'en') return null;
    return translationDrafts[selectedProject.slug]?.[contentLocale] ?? emptyProjectTranslation();
  }, [contentLocale, selectedProject, translationDrafts]);

  async function handleUnlock() {
    const cleanPassword = password.trim();
    if (!cleanPassword) return;

    setAccessState('checking');
    setAccessMessage(ui.checkingAdminAccess);

    try {
      const result = await loginAdmin(cleanPassword);
      setAccessInfo(result);
      setBranch(result.defaultBranch || 'main');
      setPassword('');
      setAccessState('granted');
      setAccessMessage('');
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
        setAccessInfo(session);
        setBranch(session.defaultBranch || 'main');
        setAccessState('granted');
        setAccessMessage('');
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

  function lockAdmin() {
    void logoutAdmin();
    setPassword('');
    setAccessInfo(null);
    setAccessState('locked');
    setAccessMessage('');
    setPublishMessage('');
  }

  function resetDrafts() {
    const nextProjects = cloneProjects();
    setProjectDrafts(nextProjects);
    setTechnologyDrafts(cloneTechnologyCatalog());
    setTranslationDrafts(cloneProjectTranslations());
    setContentLocale('en');
    setTranslationState('idle');
    setTranslationMessage('');
    setSelectedSlug(nextProjects[0]?.slug ?? '');
    setAnalysis(null);
    setPublishState('idle');
    setPublishMessage(ui.resetComplete);
  }

  function updateProject(patch: Partial<Project>) {
    setProjectDrafts((current) =>
      current.map((project) =>
        project.slug === selectedSlug ? { ...project, ...patch } : project,
      ),
    );
  }

  function updateTranslation(patch: Partial<ProjectTranslation>) {
    if (!selectedProject || contentLocale === 'en') return;
    setTranslationDrafts((current) => {
      const existing = current[selectedProject.slug]?.[contentLocale] ?? emptyProjectTranslation();
      return {
        ...current,
        [selectedProject.slug]: {
          ...(current[selectedProject.slug] ?? {}),
          [contentLocale]: { ...existing, ...patch },
        },
      };
    });
  }

  async function handleAiFillTranslations() {
    if (!selectedProject) return;
    setTranslationState('loading');
    setTranslationMessage(ui.translatingMessage);
    try {
      const translations = await translateProjectAllLocales({ project: selectedProject });
      setTranslationDrafts((current) =>
        mergeProjectTranslations(current, selectedProject.slug, translations),
      );
      setTranslationState('idle');
      setTranslationMessage(ui.translationComplete);
    } catch (error) {
      setTranslationState('error');
      setTranslationMessage(error instanceof Error ? error.message : ui.translationFailed);
    }
  }

  function updateTechnology(
    group: TechnologyGroupId,
    index: number,
    patch: Partial<TechnologyItem>,
  ) {
    setTechnologyDrafts((current) => ({
      ...current,
      [group]: current[group].map((technology, technologyIndex) =>
        technologyIndex === index ? { ...technology, ...patch } : technology,
      ),
    }));
  }

  function removeTechnology(group: TechnologyGroupId, index: number) {
    setTechnologyDrafts((current) => ({
      ...current,
      [group]: current[group].filter((_, technologyIndex) => technologyIndex !== index),
    }));
  }

  function addTechnology(group: TechnologyGroupId) {
    setTechnologyDrafts((current) => ({
      ...current,
      [group]: [
        ...current[group],
        {
          name: ui.newTechnology,
          color: '#C7FF4A',
        },
      ],
    }));
  }

  async function handleAnalyze() {
    setAnalysisState('loading');
    setAnalysisError('');

    try {
      const result = await analyzeRepository(repositoryUrl);
      setAnalysis(result);
      setAnalysisState('idle');
    } catch (error) {
      setAnalysisState('error');
      setAnalysisError(error instanceof Error ? error.message : ui.repositoryAnalysisFailed);
    }
  }

  function applyAnalysisToSelected() {
    if (!analysis || !selectedProject) return;

    updateProject({
      title: analysis.title,
      shortTitle: selectedProject.shortTitle || analysis.title,
      summary: analysis.summary,
      overview: analysis.overview,
      github: analysis.github,
      technologies: Array.from(
        new Set([...selectedProject.technologies, ...analysis.technologies]),
      ),
      features: analysis.features.length > 0 ? analysis.features : selectedProject.features,
    });

    setTechnologyDrafts((current) => mergeTechnologyNames(current, analysis.technologies));
  }

  function addAnalysisAsProject() {
    if (!analysis) return;

    const project = createProjectFromAnalysis(analysis, projectDrafts.length);
    const existingIndex = projectDrafts.findIndex((item) => item.slug === project.slug);

    if (existingIndex >= 0) {
      setSelectedSlug(projectDrafts[existingIndex].slug);
      return;
    }

    setProjectDrafts((current) => [...current, project]);
    setTechnologyDrafts((current) => mergeTechnologyNames(current, analysis.technologies));
    setSelectedSlug(project.slug);
  }

  function addBlankProject() {
    const index = projectDrafts.length;
    const slug = `project-${index + 1}`;
    const project: Project = {
      slug,
      title: ui.newProject,
      shortTitle: ui.newProject,
      category: 'Product',
      status: ui.inDevelopment,
      number: String(index + 1).padStart(2, '0'),
      summary: '',
      overview: '',
      technologies: [],
      features: [],
      challenges: [],
      architecture: [],
      gallery: [],
      tone: 'blue',
      mockup: 'language',
    };

    setProjectDrafts((current) => [...current, project]);
    setSelectedSlug(slug);
  }

  function removeSelectedProject() {
    if (!selectedProject) return;

    const next = projectDrafts.filter((project) => project.slug !== selectedProject.slug);
    setProjectDrafts(next);
    setTranslationDrafts((current) => {
      const nextTranslations = { ...current };
      delete nextTranslations[selectedProject.slug];
      return nextTranslations;
    });
    setSelectedSlug(next[0]?.slug ?? '');
  }

  async function handlePublish() {
    setPublishState('saving');
    setPublishMessage(ui.publishingPortfolio);

    try {
      const publishBranch = branch.trim() || 'main';
      const result = await publishPortfolioContent({
        branch: publishBranch,
        projects: projectDrafts,
        technologyCatalog: technologyDrafts,
      });
      const translationCommitUrl = await publishProjectTranslationCatalog({
        branch: publishBranch,
        catalog: translationDrafts,
      });

      setPublishState('success');
      setPublishMessage(
        `${ui.published} ${result.projectCommitUrl ?? ''} ${result.technologyCommitUrl ?? ''} ${translationCommitUrl ?? ''}`.trim(),
      );
    } catch (error) {
      setPublishState('error');
      setPublishMessage(error instanceof Error ? error.message : ui.publishingFailed);
    }
  }

  if (accessState !== 'granted') {
    return (
      <main className="admin-page shell">
        <section className="admin-access-shell">
          <div className="admin-access-card">
            <div className="admin-access-language"><LanguageSwitcher /></div>
            <p className="eyebrow">PORTFOLIO CONTROL</p>
            <h1>{ui.adminAccessTitle}</h1>
            <p>
              {ui.adminAccessDescription}
            </p>

            <label className="admin-access-field">
              <span>{ui.adminPassword}</span>
              <input
                type="password"
                value={password}
                autoComplete="off"
                placeholder={ui.enterAdminPassword}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && accessState !== 'checking') {
                    void handleUnlock();
                  }
                }}
              />
            </label>

            <button
              type="button"
              onClick={() => void handleUnlock()}
              disabled={accessState === 'checking' || !password.trim()}
            >
              {accessState === 'checking' ? ui.checkingAccess : ui.unlockAdmin}
            </button>

            {accessMessage && (
              <p className={`admin-message ${accessState === 'error' ? 'error' : ''}`}>
                {accessMessage}
              </p>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page shell">
      <header className="admin-hero">
        <div>
          <p className="eyebrow">PORTFOLIO CONTROL</p>
          <h1>{ui.adminTitle}</h1>
          <p>
            {ui.adminDescription}
          </p>
        </div>

        <div className="admin-hero-status">
          <LanguageSwitcher />
          <span>{String(projectDrafts.length).padStart(2, '0')} {ui.projects}</span>
          <span>{String(allTechnologyNames.length).padStart(2, '0')} {ui.technologies}</span>
          <span>{accessInfo?.repository ?? ui.githubConnected}</span>
          <span>
            {import.meta.env.VITE_PORTFOLIO_AI_ENDPOINT
              ? ui.aiConnected
              : ui.analyzerMode}
          </span>
          <button type="button" className="secondary admin-lock-button" onClick={lockAdmin}>
            {ui.lockAdmin}
          </button>
        </div>
      </header>

      <section className="admin-panel admin-ai-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">01 / {ui.repositoryAssistant}</p>
            <h2>{ui.repositoryDraft}</h2>
          </div>
          <p>
            {ui.repositoryAssistantDescription}
          </p>
        </div>

        <div className="admin-repo-input-row">
          <input
            value={repositoryUrl}
            onChange={(event) => setRepositoryUrl(event.target.value)}
            placeholder="https://github.com/owner/repository"
          />
          <button type="button" onClick={() => void handleAnalyze()} disabled={analysisState === 'loading'}>
            {analysisState === 'loading' ? ui.analyzing : ui.analyzeRepository}
          </button>
        </div>

        {analysisState === 'error' && <p className="admin-message error">{analysisError}</p>}

        {analysis && (
          <article className="admin-analysis-card">
            <div>
              <span className="admin-analysis-source">
                {analysis.source === 'ai' ? 'AI' : 'REPOSITORY'}
              </span>
              <h3>{analysis.title}</h3>
              <p>{analysis.summary}</p>
            </div>

            <div className="admin-chip-row">
              {analysis.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>

            <div className="admin-actions">
              <button type="button" onClick={applyAnalysisToSelected} disabled={!selectedProject}>
                {ui.applyToSelectedProject}
              </button>
              <button type="button" className="secondary" onClick={addAnalysisAsProject}>
                {ui.addAsNewProject}
              </button>
            </div>
          </article>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">02 / PROJECTS</p>
            <h2>{ui.projectContent}</h2>
          </div>

          <div className="admin-actions">
            <button type="button" onClick={addBlankProject}>{ui.addProject}</button>
            <button
              type="button"
              className="secondary"
              onClick={() => void handleAiFillTranslations()}
              disabled={!selectedProject || translationState === 'loading'}
            >
              {translationState === 'loading' ? ui.translatingAll : ui.aiTranslateAll}
            </button>
            <button type="button" className="secondary" onClick={resetDrafts}>{ui.resetDrafts}</button>
            <button
              type="button"
              className="danger"
              onClick={removeSelectedProject}
              disabled={!selectedProject}
            >
              {ui.deleteSelected}
            </button>
          </div>
        </div>

        <div className="admin-project-layout">
          <nav className="admin-project-list" aria-label={ui.projectList}>
            {projectDrafts.map((project) => (
              <button
                type="button"
                className={project.slug === selectedSlug ? 'active' : ''}
                key={project.slug}
                onClick={() => setSelectedSlug(project.slug)}
              >
                <span>{project.number}</span>
                <strong>{project.title}</strong>
              </button>
            ))}
          </nav>

          {selectedProject ? (
            <div className="admin-project-editor">
              <div className="admin-content-locale-bar" aria-label={ui.translationLanguage}>
                {CONTENT_LOCALES.map((locale) => {
                  const ready = locale.id === 'en' || Boolean(
                    translationDrafts[selectedProject.slug]?.[locale.id],
                  );
                  return (
                    <button
                      type="button"
                      key={locale.id}
                      className={contentLocale === locale.id ? 'admin-locale-tab active' : 'admin-locale-tab'}
                      onClick={() => setContentLocale(locale.id)}
                    >
                      <span>{locale.label}</span>
                      <small>{ready ? ui.ready : ui.empty}</small>
                    </button>
                  );
                })}
              </div>

              {translationMessage && (
                <p className={translationState === 'error' ? 'admin-message error' : 'admin-message'}>
                  {translationMessage}
                </p>
              )}

              {contentLocale === 'en' ? (
                <div className="admin-form-grid">
              <label>
                <span>{ui.title}</span>
                <input
                  value={selectedProject.title}
                  onChange={(event) => updateProject({ title: event.target.value })}
                />
              </label>

              <label>
                <span>{ui.shortTitle}</span>
                <input
                  value={selectedProject.shortTitle}
                  onChange={(event) => updateProject({ shortTitle: event.target.value })}
                />
              </label>

              <label>
                <span>{ui.slug}</span>
                <input
                  value={selectedProject.slug}
                  onChange={(event) => {
                    const previousSlug = selectedProject.slug;
                    const nextSlug = event.target.value;
                    setProjectDrafts((current) =>
                      current.map((project) =>
                        project.slug === previousSlug ? { ...project, slug: nextSlug } : project,
                      ),
                    );
                    setTranslationDrafts((current) => {
                      if (!current[previousSlug] || previousSlug === nextSlug) return current;
                      const nextTranslations = { ...current };
                      nextTranslations[nextSlug] = nextTranslations[previousSlug];
                      delete nextTranslations[previousSlug];
                      return nextTranslations;
                    });
                    setSelectedSlug(nextSlug);
                  }}
                />
              </label>

              <label>
                <span>{ui.projectNumber}</span>
                <input
                  value={selectedProject.number}
                  onChange={(event) => updateProject({ number: event.target.value })}
                />
              </label>

              <label>
                <span>{ui.category}</span>
                <select
                  value={selectedProject.category}
                  onChange={(event) =>
                    updateProject({ category: event.target.value as ProjectCategory })
                  }
                >
                  <option value="Language">Language</option>
                  <option value="AI & Developer Tools">AI & Developer Tools</option>
                  <option value="Product">Product</option>
                </select>
              </label>

              <label>
                <span>{ui.status}</span>
                <input
                  value={selectedProject.status}
                  onChange={(event) => updateProject({ status: event.target.value })}
                />
              </label>

              <label>
                <span>{ui.tone}</span>
                <select
                  value={selectedProject.tone}
                  onChange={(event) =>
                    updateProject({ tone: event.target.value as Project['tone'] })
                  }
                >
                  {PROJECT_TONES.map((tone) => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>{ui.mockup}</span>
                <select
                  value={selectedProject.mockup}
                  onChange={(event) =>
                    updateProject({ mockup: event.target.value as Project['mockup'] })
                  }
                >
                  {PROJECT_MOCKUPS.map((mockup) => (
                    <option key={mockup} value={mockup}>{mockup}</option>
                  ))}
                </select>
              </label>

              <label className="wide">
                <span>{ui.githubUrl}</span>
                <input
                  value={selectedProject.github ?? ''}
                  onChange={(event) =>
                    updateProject({ github: event.target.value || undefined })
                  }
                />
              </label>

              <label className="wide">
                <span>{ui.summary}</span>
                <textarea
                  value={selectedProject.summary}
                  onChange={(event) => updateProject({ summary: event.target.value })}
                />
              </label>

              <label className="wide">
                <span>{ui.overview}</span>
                <textarea
                  className="large"
                  value={selectedProject.overview}
                  onChange={(event) => updateProject({ overview: event.target.value })}
                />
              </label>

              <label className="wide">
                <span>{ui.technologiesHint}</span>
                <textarea
                  value={selectedProject.technologies.join(', ')}
                  onChange={(event) =>
                    updateProject({ technologies: listFromText(event.target.value) })
                  }
                />
              </label>

              <label className="wide">
                <span>{ui.featuresHint}</span>
                <textarea
                  className="large"
                  value={selectedProject.features.join('\n')}
                  onChange={(event) =>
                    updateProject({ features: listFromText(event.target.value) })
                  }
                />
              </label>

              <label className="wide">
                <span>{ui.challengesHint}</span>
                <textarea
                  className="large"
                  value={challengesToText(selectedProject)}
                  onChange={(event) =>
                    updateProject({
                      challenges: pairLines(event.target.value).map(([title, description]) => ({
                        title,
                        description,
                      })),
                    })
                  }
                />
              </label>

              <label className="wide">
                <span>{ui.architectureHint}</span>
                <textarea
                  className="large"
                  value={architectureToText(selectedProject)}
                  onChange={(event) =>
                    updateProject({
                      architecture: pairLines(event.target.value).map(([label, detail]) => ({
                        label,
                        detail,
                      })),
                    })
                  }
                />
              </label>

              <label className="wide">
                <span>{ui.galleryHint}</span>
                <textarea
                  className="large"
                  value={galleryToText(selectedProject)}
                  onChange={(event) =>
                    updateProject({
                      gallery: pairLines(event.target.value).map(([title, caption]) => ({
                        title,
                        caption,
                      })),
                    })
                  }
                />
              </label>
            </div>
              ) : selectedTranslation ? (
                <div className="admin-form-grid admin-translation-form-grid">
                  <div className="admin-language-note wide">
                    <strong>{CONTENT_LOCALES.find((locale) => locale.id === contentLocale)?.label}</strong>
                    <span>{ui.sourcePreservationNote}</span>
                  </div>
                  <label><span>{ui.title}</span><input value={selectedTranslation.title} onChange={(event) => updateTranslation({ title: event.target.value })} /></label>
                  <label><span>{ui.shortTitle}</span><input value={selectedTranslation.shortTitle} onChange={(event) => updateTranslation({ shortTitle: event.target.value })} /></label>
                  <label className="wide"><span>{ui.summary}</span><textarea value={selectedTranslation.summary} onChange={(event) => updateTranslation({ summary: event.target.value })} /></label>
                  <label className="wide"><span>{ui.overview}</span><textarea className="large" value={selectedTranslation.overview} onChange={(event) => updateTranslation({ overview: event.target.value })} /></label>
                  <label className="wide"><span>{ui.featuresOnePerLine}</span><textarea className="large" value={selectedTranslation.features.join('\n')} onChange={(event) => updateTranslation({ features: listFromText(event.target.value) })} /></label>
                  <label className="wide"><span>{ui.challengesHint}</span><textarea className="large" value={challengesToText(selectedTranslation)} onChange={(event) => updateTranslation({ challenges: pairLines(event.target.value).map(([title, description]) => ({ title, description })) })} /></label>
                  <label className="wide"><span>{ui.architectureHint}</span><textarea className="large" value={architectureToText(selectedTranslation)} onChange={(event) => updateTranslation({ architecture: pairLines(event.target.value).map(([label, detail]) => ({ label, detail })) })} /></label>
                  <label className="wide"><span>{ui.galleryHint}</span><textarea className="large" value={galleryToText(selectedTranslation)} onChange={(event) => updateTranslation({ gallery: pairLines(event.target.value).map(([title, caption]) => ({ title, caption })) })} /></label>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="admin-message">{ui.noProjectSelected}</p>
          )}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">03 / TECHNOLOGY</p>
            <h2>{ui.languagesTools}</h2>
          </div>
          <p>
            {ui.technologyDescription}
          </p>
        </div>

        <div className="admin-tech-groups">
          {GROUPS.map((group) => (
            <article className="admin-tech-group" key={group.id}>
              <header>
                <div>
                  <span>{group.id.toUpperCase()}</span>
                  <h3>{group.id === 'client' ? ui.clientLanguages : group.id === 'backend' ? ui.backendData : ui.platformsTools}</h3>
                </div>
                <button type="button" onClick={() => addTechnology(group.id)}>{ui.add}</button>
              </header>

              <div className="admin-tech-list">
                {technologyDrafts[group.id].map((technology, index) => (
                  <div className="admin-tech-row" key={`${group.id}-${index}`}>
                    <input
                      value={technology.name}
                      aria-label={ui.technologyName}
                      onChange={(event) =>
                        updateTechnology(group.id, index, { name: event.target.value })
                      }
                    />
                    <input
                      value={technology.color}
                      aria-label={ui.brandColor}
                      onChange={(event) =>
                        updateTechnology(group.id, index, { color: event.target.value })
                      }
                    />
                    <input
                      value={technology.logo ?? ''}
                      aria-label={ui.logoUrl}
                      placeholder={ui.logoUrl}
                      onChange={(event) =>
                        updateTechnology(group.id, index, {
                          logo: event.target.value || undefined,
                        })
                      }
                    />
                    <span
                      className="admin-color-preview"
                      style={{ background: technology.color }}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      className="icon danger"
                      onClick={() => removeTechnology(group.id, index)}
                      aria-label={`${ui.remove} ${technology.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel admin-publish-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">04 / PUBLISH</p>
            <h2>{ui.writeChanges}</h2>
          </div>
          <p>
            {ui.publishDescription}
          </p>
        </div>

        <div className="admin-publish-grid admin-publish-grid-verified">
          <div className="admin-verified-repository">
            <span>{ui.verifiedRepository}</span>
            <strong>{accessInfo?.repository}</strong>
          </div>

          <button
            type="button"
            onClick={() => void handlePublish()}
            disabled={publishState === 'saving'}
          >
            {publishState === 'saving' ? ui.publishing : ui.publishToGitHub}
          </button>
        </div>

        {publishMessage && (
          <p
            className={`admin-message ${
              publishState === 'error'
                ? 'error'
                : publishState === 'success'
                  ? 'success'
                  : ''
            }`}
          >
            {publishMessage}
          </p>
        )}
      </section>
    </main>
  );
}
