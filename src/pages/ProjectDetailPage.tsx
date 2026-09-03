import { Link, Navigate, useParams } from 'react-router-dom';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';
import { FeatureShowcase } from '../components/FeatureShowcase';
import { ProjectGallery } from '../components/ProjectGallery';
import { ProjectVisual } from '../components/ProjectVisual';
import { TechTag } from '../components/TechTag';
import { getProject, projects } from '../data/projects';
import { useI18n } from '../i18n/I18nProvider';
import { glyphoraEcosystemCopy, localizeProjectDetail, projectDetailUi } from '../i18n/projectDetailTranslations';

function localizedCategory(category: string, language: 'en' | 'zh-CN' | 'zh-TW') {
  if (language === 'zh-CN') {
    if (category === 'Product') return '产品';
    if (category === 'Language') return '语言';
    if (category === 'AI & Developer Tools') return 'AI 与开发者工具';
  }

  if (language === 'zh-TW') {
    if (category === 'Product') return '產品';
    if (category === 'Language') return '語言';
    if (category === 'AI & Developer Tools') return 'AI 與開發者工具';
  }

  return category;
}

function localizedStatus(status: string, language: 'en' | 'zh-CN' | 'zh-TW') {
  if (language === 'zh-CN') {
    if (status === 'Active development') return '持续开发中';
    if (status === 'In Development') return '开发中';
    if (status === 'Public repository') return '公开仓库';
    if (status === 'Archived') return '已归档';
  }

  if (language === 'zh-TW') {
    if (status === 'Active development') return '持續開發中';
    if (status === 'In Development') return '開發中';
    if (status === 'Public repository') return '公開儲存庫';
    if (status === 'Archived') return '已封存';
  }

  return status;
}

export function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const { t, language } = useI18n();
  const sourceProject = getProject(slug);

  if (!sourceProject) return <Navigate to="/projects" replace />;

  const project = localizeProjectDetail(sourceProject, language);
  const ui = projectDetailUi(language);
  const projectCategory = localizedCategory(project.category, language);
  const projectStatus = localizedStatus(project.status, language);
  const ecosystem = project.slug === 'glyphora' ? glyphoraEcosystemCopy(language) : null;

  const index = projects.indexOf(sourceProject);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="case-study">
      <section className="case-hero shell">
        <Link className="back-link" to="/projects">
          {ui.allProjects}
        </Link>

        <div className="case-title">
          <div>
            <p className="eyebrow">
              {projectCategory} · {projectStatus}
            </p>
            <h1>{project.title}</h1>
          </div>
          <p>{project.summary}</p>
        </div>

        <ProjectVisual project={project} />

        <dl className="project-facts">
          <div>
            <dt>{ui.status}</dt>
            <dd>{projectStatus}</dd>
          </div>
          <div>
            <dt>{ui.coreStack}</dt>
            <dd>{project.technologies.slice(0, 3).join(', ')}</dd>
          </div>
          <div>
            <dt>{ui.source}</dt>
            <dd>{project.github ? ui.publicRepository : ui.notPublic}</dd>
          </div>
        </dl>
      </section>

      <section className="case-section shell overview overview-redesign">
        <div className="overview-rail">
          <p className="eyebrow">{ui.overview}</p>
          <span>{ui.snapshot}</span>
        </div>

        <div className="overview-main">
          <p className="overview-kicker">
            {projectCategory} · {projectStatus}
          </p>
          <h2>{project.summary}</h2>
          <p className="overview-description">{project.overview}</p>

          {ecosystem && (
            <aside className="ecosystem-statement" aria-label={ecosystem.eyebrow}>
              <span className="ecosystem-statement-eyebrow">{ecosystem.eyebrow}</span>
              <strong>{ecosystem.title}</strong>
              <p>{ecosystem.description}</p>
              <div className="ecosystem-tags">
                {ecosystem.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </aside>
          )}

          <dl className="overview-metrics" aria-label={ui.snapshot}>
            <div>
              <dt>{ui.verifiedFeatures}</dt>
              <dd>{String(project.features.length).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>{ui.architectureNodes}</dt>
              <dd>{String(project.architecture.length).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>{ui.technologies}</dt>
              <dd>{String(project.technologies.length).padStart(2, '0')}</dd>
            </div>
          </dl>
        </div>

        <aside className="overview-sidebar">
          <span className="overview-sidebar-label">{ui.explore}</span>
          <div className="case-links">
            {project.github && <a href={project.github}>{ui.githubRepository} ↗</a>}
            <Link to={`/projects/${project.slug}/source`}>{t('source.entry')} ↗</Link>
          </div>
        </aside>
      </section>

      {project.features.length > 0 && (
        <section className="case-section case-dark feature-section">
          <div className="shell">
            <div className="feature-section-intro">
              <div>
                <p className="eyebrow">{ui.featureSection}</p>
                <h2>{ui.featureHeading}</h2>
              </div>
              <div className="feature-section-summary">
                <strong>{String(project.features.length).padStart(2, '0')}</strong>
                <p>{ui.featureSummary}</p>
              </div>
            </div>
            <FeatureShowcase
              features={sourceProject.features}
              displayFeatures={project.features}
              language={language}
            />
          </div>
        </section>
      )}

      <section className="case-section shell">
        <p className="eyebrow">{ui.architecture}</p>
        <h2 className="case-heading">{ui.architectureHeading}</h2>
        <ArchitectureDiagram nodes={project.architecture} />
        <div className="all-tags">
          {project.technologies.map((technology) => (
            <TechTag key={technology}>{technology}</TechTag>
          ))}
        </div>

        {project.github && (
          <div className="source-cta">
            <div>
              <small>{ui.sourceWalkthroughLabel}</small>
              <strong>{ui.sourceWalkthroughTitle}</strong>
              <p>{ui.sourceWalkthroughDescription}</p>
            </div>
            <Link to={`/projects/${project.slug}/source`}>{ui.exploreSource}</Link>
          </div>
        )}
      </section>

      {project.challenges.length > 0 && (
        <section className="case-section challenges">
          <div className="shell">
            <p className="eyebrow">{ui.implementation}</p>
            <div className="challenge-grid">
              {project.challenges.map((item, challengeIndex) => (
                <article key={item.title}>
                  <span>{String(challengeIndex + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="case-section shell">
          <p className="eyebrow">{ui.projectAreas}</p>
          <h2 className="case-heading project-areas-heading">{ui.projectAreasHeading}</h2>
          <ProjectGallery project={project} />
        </section>
      )}

      <nav className="project-pagination shell" aria-label="Adjacent projects">
        <Link className="project-pagination-card" to={`/projects/${prev.slug}`}>
          <small>{ui.previousProject}</small>
          <strong>{prev.shortTitle}</strong>
          <span>{localizedCategory(prev.category, language)}</span>
          <p>{prev.summary}</p>
        </Link>
        <Link className="project-pagination-card project-pagination-next" to={`/projects/${next.slug}`}>
          <small>{ui.nextProject}</small>
          <strong>{next.shortTitle}</strong>
          <span>{localizedCategory(next.category, language)}</span>
          <p>{next.summary}</p>
        </Link>
      </nav>
    </main>
  );
}
