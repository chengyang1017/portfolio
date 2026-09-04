import { Link, Navigate, useParams } from 'react-router-dom';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';
import { FeatureShowcase } from '../components/FeatureShowcase';
import { ProjectGallery } from '../components/ProjectGallery';
import { ProjectVisual } from '../components/ProjectVisual';
import { TechTag } from '../components/TechTag';
import { getProject, projects } from '../data/projects';
import { useI18n } from '../i18n/I18nProvider';
import { localizeProject } from '../i18n/localizeProject';
import { glyphoraEcosystemCopy, projectDetailUi } from '../i18n/projectDetailTranslations';
import type { AppLocale } from '../i18n/types';

function localizedCategory(category: string, language: AppLocale) {
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

  if (language.startsWith('vi-')) {
    if (category === 'Product') return 'Sản phẩm';
    if (category === 'Language') return 'Ngôn ngữ';
    if (category === 'AI & Developer Tools') return 'AI & Công cụ lập trình';
  }

  return category;
}

function localizedStatus(status: string, language: AppLocale) {
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

  if (language.startsWith('vi-')) {
    if (status === 'Active development') return 'Đang phát triển';
    if (status === 'In Development') return 'Đang phát triển';
    if (status === 'Public repository') return 'Kho mã công khai';
    if (status === 'Archived') return 'Đã lưu trữ';
  }

  return status;
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.27-.01-1.18-.02-2.14-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.44-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.03 0 0 .96-.31 3.14 1.17a10.8 10.8 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.39-5.25 5.67.41.36.77 1.06.77 2.14 0 1.55-.02 2.8-.02 3.18 0 .31.21.67.8.56a11.54 11.54 0 0 0 7.84-10.93C23.5 5.66 18.35.5 12 .5Z" />
    </svg>
  );
}

function SourceCodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m8 9-4 3 4 3" />
      <path d="m16 9 4 3-4 3" />
      <path d="m14 5-4 14" />
    </svg>
  );
}

export function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const { t, language } = useI18n();
  const sourceProject = getProject(slug);

  if (!sourceProject) return <Navigate to="/projects" replace />;

  const project = localizeProject(sourceProject, language);
  const ui = projectDetailUi(language);
  const projectCategory = localizedCategory(project.category, language);
  const projectStatus = localizedStatus(project.status, language);
  const ecosystem = project.slug === 'glyphora' ? glyphoraEcosystemCopy(language) : null;

  const index = projects.indexOf(sourceProject);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const localizedPrev = localizeProject(prev, language);
  const localizedNext = localizeProject(next, language);

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

      {project.gallery.length > 0 && (
        <section className="case-section shell">
          <p className="eyebrow">{ui.projectAreas}</p>
          <h2 className="case-heading project-areas-heading">{ui.projectAreasHeading}</h2>
          <ProjectGallery project={project} />
        </section>
      )}

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
    {project.github && (
      <a
        className="case-action"
        href={project.github}
        target="_blank"
        rel="noreferrer"
      >
        <span className="case-action-icon">
          <GitHubIcon />
        </span>

        <span className="case-action-label">
          {ui.githubRepository}
        </span>

        <span className="case-action-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    )}

    <Link
      className="case-action"
      to={`/projects/${project.slug}/source`}
    >
      <span className="case-action-icon">
        <SourceCodeIcon />
      </span>

      <span className="case-action-label">
        {t('source.entry')}
      </span>

      <span className="case-action-arrow" aria-hidden="true">
        →
      </span>
    </Link>
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

      

      <nav className="project-pagination shell" aria-label="Adjacent projects">
        <Link className="project-pagination-card" to={`/projects/${prev.slug}`}>
          <small>{ui.previousProject}</small>
          <strong>{localizedPrev.shortTitle}</strong>
          <span>{localizedCategory(prev.category, language)}</span>
          <p>{localizedPrev.summary}</p>
        </Link>
        <Link className="project-pagination-card project-pagination-next" to={`/projects/${next.slug}`}>
          <small>{ui.nextProject}</small>
          <strong>{localizedNext.shortTitle}</strong>
          <span>{localizedCategory(next.category, language)}</span>
          <p>{localizedNext.summary}</p>
        </Link>
      </nav>
    </main>
  );
}