import { useMemo, useState } from 'react';
import type { Project, ProjectCategory } from '../data/projects';
import { projects as initialProjects } from '../data/projects';
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

function challengesToText(project: Project) {
  return project.challenges
    .map((item) => `${item.title} | ${item.description}`)
    .join('\n');
}

function architectureToText(project: Project) {
  return project.architecture
    .map((item) => `${item.label} | ${item.detail}`)
    .join('\n');
}

function galleryToText(project: Project) {
  return project.gallery
    .map((item) => `${item.title} | ${item.caption}`)
    .join('\n');
}

export function AdminPage() {
  const [projectDrafts, setProjectDrafts] = useState<Project[]>(cloneProjects);
  const [technologyDrafts, setTechnologyDrafts] = useState<TechnologyCatalog>(
    cloneTechnologyCatalog,
  );
  const [selectedSlug, setSelectedSlug] = useState(initialProjects[0]?.slug ?? '');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [analysisState, setAnalysisState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [analysisError, setAnalysisError] = useState('');
  const [token, setToken] = useState('');
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

  async function handleUnlock() {
    setAccessState('checking');
    setAccessMessage('Checking write access to chengyang1017/portfolio…');

    try {
      const result = await verifyPortfolioAccess(token);
      setAccessInfo(result);
      setBranch(result.defaultBranch || 'main');
      setAccessState('granted');
      setAccessMessage('');
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : 'Unable to verify GitHub access.');
    }
  }

  function lockAdmin() {
    setToken('');
    setAccessInfo(null);
    setAccessState('locked');
    setAccessMessage('');
    setPublishMessage('');
  }

  function resetDrafts() {
    const nextProjects = cloneProjects();
    setProjectDrafts(nextProjects);
    setTechnologyDrafts(cloneTechnologyCatalog());
    setSelectedSlug(nextProjects[0]?.slug ?? '');
    setAnalysis(null);
    setPublishState('idle');
    setPublishMessage('Drafts reset to the version loaded with this deployment.');
  }

  function updateProject(patch: Partial<Project>) {
    setProjectDrafts((current) =>
      current.map((project) =>
        project.slug === selectedSlug ? { ...project, ...patch } : project,
      ),
    );
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
          name: 'New technology',
          color: '#C7FF4A',
        },
      ],
    }));
  }

  async function handleAnalyze() {
    setAnalysisState('loading');
    setAnalysisError('');

    try {
      const result = await analyzeRepository(repositoryUrl, token.trim());
      setAnalysis(result);
      setAnalysisState('idle');
    } catch (error) {
      setAnalysisState('error');
      setAnalysisError(error instanceof Error ? error.message : 'Repository analysis failed.');
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
      title: 'New project',
      shortTitle: 'New project',
      category: 'Product',
      status: 'In Development',
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
    setSelectedSlug(next[0]?.slug ?? '');
  }

  async function handlePublish() {
    setPublishState('saving');
    setPublishMessage('Publishing project and technology data to GitHub…');

    try {
      const result = await publishPortfolioContent({
        token: token.trim(),
        branch: branch.trim() || 'main',
        projects: projectDrafts,
        technologyCatalog: technologyDrafts,
      });

      setPublishState('success');
      setPublishMessage(
        `Published. ${result.projectCommitUrl ?? ''} ${result.technologyCommitUrl ?? ''}`.trim(),
      );
    } catch (error) {
      setPublishState('error');
      setPublishMessage(error instanceof Error ? error.message : 'Publishing failed.');
    }
  }

  if (accessState !== 'granted') {
    return (
      <main className="admin-page shell">
        <section className="admin-access-shell">
          <div className="admin-access-card">
            <p className="eyebrow">PORTFOLIO CONTROL</p>
            <h1>Admin access</h1>
            <p>
              Unlock this dashboard with a fine-grained GitHub token that can write to
              chengyang1017/portfolio. The token stays in memory only and is cleared when you lock
              the dashboard or reload the page.
            </p>

            <label className="admin-access-field">
              <span>GitHub token</span>
              <input
                type="password"
                value={token}
                autoComplete="off"
                placeholder="github_pat_…"
                onChange={(event) => setToken(event.target.value)}
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
              disabled={accessState === 'checking' || !token.trim()}
            >
              {accessState === 'checking' ? 'Checking access…' : 'Unlock admin'}
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
          <h1>Admin</h1>
          <p>
            Manage projects, programming languages, frameworks, and tools. Publishing writes the
            edited source data back to GitHub.
          </p>
        </div>

        <div className="admin-hero-status">
          <span>{String(projectDrafts.length).padStart(2, '0')} PROJECTS</span>
          <span>{String(allTechnologyNames.length).padStart(2, '0')} TECHNOLOGIES</span>
          <span>{accessInfo?.repository ?? 'GITHUB CONNECTED'}</span>
          <span>
            {import.meta.env.VITE_PORTFOLIO_AI_ENDPOINT
              ? 'AI ENDPOINT CONNECTED'
              : 'REPO ANALYZER MODE'}
          </span>
          <button type="button" className="secondary admin-lock-button" onClick={lockAdmin}>
            Lock admin
          </button>
        </div>
      </header>

      <section className="admin-panel admin-ai-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">01 / REPOSITORY ASSISTANT</p>
            <h2>GitHub → portfolio draft</h2>
          </div>
          <p>
            Paste a repository URL. The assistant reads repository metadata, languages, root files,
            and package dependencies. If VITE_PORTFOLIO_AI_ENDPOINT is configured, that evidence is
            also sent to the server-side AI endpoint for richer copy and feature suggestions.
          </p>
        </div>

        <div className="admin-repo-input-row">
          <input
            value={repositoryUrl}
            onChange={(event) => setRepositoryUrl(event.target.value)}
            placeholder="https://github.com/owner/repository"
          />
          <button type="button" onClick={() => void handleAnalyze()} disabled={analysisState === 'loading'}>
            {analysisState === 'loading' ? 'Analyzing…' : 'Analyze repository'}
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
                Apply to selected project
              </button>
              <button type="button" className="secondary" onClick={addAnalysisAsProject}>
                Add as new project
              </button>
            </div>
          </article>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">02 / PROJECTS</p>
            <h2>Project content</h2>
          </div>

          <div className="admin-actions">
            <button type="button" onClick={addBlankProject}>Add project</button>
            <button type="button" className="secondary" onClick={resetDrafts}>Reset drafts</button>
            <button
              type="button"
              className="danger"
              onClick={removeSelectedProject}
              disabled={!selectedProject}
            >
              Delete selected
            </button>
          </div>
        </div>

        <div className="admin-project-layout">
          <nav className="admin-project-list" aria-label="Projects">
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
            <div className="admin-form-grid">
              <label>
                <span>Title</span>
                <input
                  value={selectedProject.title}
                  onChange={(event) => updateProject({ title: event.target.value })}
                />
              </label>

              <label>
                <span>Short title</span>
                <input
                  value={selectedProject.shortTitle}
                  onChange={(event) => updateProject({ shortTitle: event.target.value })}
                />
              </label>

              <label>
                <span>Slug</span>
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
                    setSelectedSlug(nextSlug);
                  }}
                />
              </label>

              <label>
                <span>Project number</span>
                <input
                  value={selectedProject.number}
                  onChange={(event) => updateProject({ number: event.target.value })}
                />
              </label>

              <label>
                <span>Category</span>
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
                <span>Status</span>
                <input
                  value={selectedProject.status}
                  onChange={(event) => updateProject({ status: event.target.value })}
                />
              </label>

              <label>
                <span>Tone</span>
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
                <span>Mockup</span>
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
                <span>GitHub URL</span>
                <input
                  value={selectedProject.github ?? ''}
                  onChange={(event) =>
                    updateProject({ github: event.target.value || undefined })
                  }
                />
              </label>

              <label className="wide">
                <span>Summary</span>
                <textarea
                  value={selectedProject.summary}
                  onChange={(event) => updateProject({ summary: event.target.value })}
                />
              </label>

              <label className="wide">
                <span>Overview</span>
                <textarea
                  className="large"
                  value={selectedProject.overview}
                  onChange={(event) => updateProject({ overview: event.target.value })}
                />
              </label>

              <label className="wide">
                <span>Technologies · comma or new line separated</span>
                <textarea
                  value={selectedProject.technologies.join(', ')}
                  onChange={(event) =>
                    updateProject({ technologies: listFromText(event.target.value) })
                  }
                />
              </label>

              <label className="wide">
                <span>Features · one per line</span>
                <textarea
                  className="large"
                  value={selectedProject.features.join('\n')}
                  onChange={(event) =>
                    updateProject({ features: listFromText(event.target.value) })
                  }
                />
              </label>

              <label className="wide">
                <span>Challenges · title | description</span>
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
                <span>Architecture · label | detail</span>
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
                <span>Gallery · title | caption</span>
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
          ) : (
            <p className="admin-message">No project selected.</p>
          )}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">03 / TECHNOLOGY</p>
            <h2>Languages & tools</h2>
          </div>
          <p>
            This catalog powers the Technology section on the home page. Repository detection now
            puts known technologies into the right group and uses their established brand colors
            instead of assigning every new item the portfolio lime color.
          </p>
        </div>

        <div className="admin-tech-groups">
          {GROUPS.map((group) => (
            <article className="admin-tech-group" key={group.id}>
              <header>
                <div>
                  <span>{group.id.toUpperCase()}</span>
                  <h3>{group.label}</h3>
                </div>
                <button type="button" onClick={() => addTechnology(group.id)}>Add</button>
              </header>

              <div className="admin-tech-list">
                {technologyDrafts[group.id].map((technology, index) => (
                  <div className="admin-tech-row" key={`${group.id}-${index}`}>
                    <input
                      value={technology.name}
                      aria-label="Technology name"
                      onChange={(event) =>
                        updateTechnology(group.id, index, { name: event.target.value })
                      }
                    />
                    <input
                      value={technology.color}
                      aria-label="Brand color"
                      onChange={(event) =>
                        updateTechnology(group.id, index, { color: event.target.value })
                      }
                    />
                    <input
                      value={technology.logo ?? ''}
                      aria-label="Logo URL"
                      placeholder="Logo URL"
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
                      aria-label={`Remove ${technology.name}`}
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
            <h2>Write changes to GitHub</h2>
          </div>
          <p>
            The verified token remains only in this page session. Publishing updates
            src/data/projects.ts and src/data/technologyCatalog.ts on the selected branch.
          </p>
        </div>

        <div className="admin-publish-grid admin-publish-grid-verified">
          <div className="admin-verified-repository">
            <span>Verified repository</span>
            <strong>{accessInfo?.repository}</strong>
          </div>

          <label>
            <span>Branch</span>
            <input value={branch} onChange={(event) => setBranch(event.target.value)} />
          </label>

          <button
            type="button"
            onClick={() => void handlePublish()}
            disabled={publishState === 'saving'}
          >
            {publishState === 'saving' ? 'Publishing…' : 'Publish to GitHub'}
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
