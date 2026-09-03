import { Link, Navigate, useParams } from 'react-router-dom';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';
import { FeatureShowcase } from '../components/FeatureShowcase';
import { ProjectGallery } from '../components/ProjectGallery';
import { ProjectVisual } from '../components/ProjectVisual';
import { TechTag } from '../components/TechTag';
import { getProject, projects } from '../data/projects';
import { useI18n } from '../i18n/I18nProvider';

export function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const { t } = useI18n();
  const project = getProject(slug);

  if (!project) return <Navigate to="/projects" replace />;

  const index = projects.indexOf(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="case-study">
      <section className="case-hero shell">
        <Link className="back-link" to="/projects">
          ← All projects
        </Link>

        <div className="case-title">
          <div>
            <p className="eyebrow">
              {project.category} · {project.status}
            </p>
            <h1>{project.title}</h1>
          </div>
          <p>{project.summary}</p>
        </div>

        <ProjectVisual project={project} />

        <dl className="project-facts">
          <div>
            <dt>Status</dt>
            <dd>{project.status}</dd>
          </div>
          <div>
            <dt>Core stack</dt>
            <dd>{project.technologies.slice(0, 3).join(', ')}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{project.github ? 'Public repository' : 'Not public'}</dd>
          </div>
        </dl>
      </section>

      <section className="case-section shell overview">
        <p className="eyebrow">01 / Overview</p>
        <h2>{project.overview}</h2>
        <div className="case-links">
          {project.github && <a href={project.github}>GitHub ↗</a>}
          <Link to={`/projects/${project.slug}/source`}>{t('source.entry')} ↗</Link>
        </div>
      </section>

      {project.features.length > 0 && (
        <section className="case-section case-dark feature-section">
          <div className="shell">
            <div className="feature-section-intro">
              <div>
                <p className="eyebrow">02 / Verified features</p>
                <h2>What the product actually supports.</h2>
              </div>
              <div className="feature-section-summary">
                <strong>{String(project.features.length).padStart(2, '0')}</strong>
                <p>Repository-backed capabilities presented as product surfaces, not a plain feature checklist.</p>
              </div>
            </div>
            <FeatureShowcase features={project.features} />
          </div>
        </section>
      )}

      <section className="case-section shell">
        <p className="eyebrow">03 / Architecture</p>
        <h2 className="case-heading">Verified repository structure and technologies.</h2>
        <ArchitectureDiagram nodes={project.architecture} />
        <div className="all-tags">
          {project.technologies.map((technology) => (
            <TechTag key={technology}>{technology}</TechTag>
          ))}
        </div>

        {project.github && (
          <div className="source-cta">
            <div>
              <small>Source walkthrough</small>
              <strong>Follow the implementation from feature to repository code.</strong>
              <p>
                Browse project areas, verified files, code flow, and implementation notes without leaving the portfolio.
              </p>
            </div>
            <Link to={`/projects/${project.slug}/source`}>Explore source architecture ↗</Link>
          </div>
        )}
      </section>

      {project.challenges.length > 0 && (
        <section className="case-section challenges">
          <div className="shell">
            <p className="eyebrow">04 / Implementation details</p>
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
          <p className="eyebrow">05 / Project areas</p>
          <h2 className="case-heading project-areas-heading">Selected product areas and implementation surfaces.</h2>
          <ProjectGallery project={project} />
        </section>
      )}

      <nav className="project-pagination shell" aria-label="Adjacent projects">
        <Link className="project-pagination-card" to={`/projects/${prev.slug}`}>
          <small>← Previous project</small>
          <strong>{prev.shortTitle}</strong>
          <span>{prev.category}</span>
          <p>{prev.summary}</p>
        </Link>
        <Link className="project-pagination-card project-pagination-next" to={`/projects/${next.slug}`}>
          <small>Next project →</small>
          <strong>{next.shortTitle}</strong>
          <span>{next.category}</span>
          <p>{next.summary}</p>
        </Link>
      </nav>
    </main>
  );
}
