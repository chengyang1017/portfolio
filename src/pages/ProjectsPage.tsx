import { useState } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { projects, type ProjectCategory } from '../data/projects';
import { projectsCopy, projectsFilterLabel } from '../i18n/projectsTranslations';
import { useI18n } from '../i18n/I18nProvider';

const filters: Array<'All' | ProjectCategory> = [
  'All',
  'Language',
  'AI & Developer Tools',
  'Product',
];

export function ProjectsPage() {
  const { language } = useI18n();
  const copy = projectsCopy(language);
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');

  const visible =
    filter === 'All' ? projects : projects.filter((project) => project.category === filter);

  const counts = {
    language: projects.filter((project) => project.category === 'Language').length,
    tooling: projects.filter((project) => project.category === 'AI & Developer Tools').length,
    product: projects.filter((project) => project.category === 'Product').length,
  };

  return (
    <main className="page projects-page shell">
      <header className="projects-intro">
        <div className="projects-intro-main">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>
            {copy.titleLead} <em>{copy.titleAccent}</em>
          </h1>
        </div>

        <aside className="projects-intro-aside">
          <p>{copy.description}</p>

          <div className="projects-stats" aria-label={copy.statsLabel}>
            <div>
              <strong>{projects.length}</strong>
              <span>{copy.stats.projects}</span>
            </div>
            <div>
              <strong>{counts.language}</strong>
              <span>{copy.stats.language}</span>
            </div>
            <div>
              <strong>{counts.tooling}</strong>
              <span>{copy.stats.tooling}</span>
            </div>
            <div>
              <strong>{counts.product}</strong>
              <span>{copy.stats.product}</span>
            </div>
          </div>
        </aside>
      </header>

      <section className="projects-directory" aria-labelledby="project-index-title">
        <div className="projects-toolbar">
          <div className="projects-toolbar-copy">
            <span id="project-index-title">{copy.indexLabel}</span>
            <strong>
              {visible.length} / {projects.length}
            </strong>
          </div>

          <div className="filter-row" aria-label={copy.filterLabel}>
            {filters.map((item) => {
              const count =
                item === 'All'
                  ? projects.length
                  : projects.filter((project) => project.category === item).length;

              return (
                <button
                  className={filter === item ? 'active' : ''}
                  onClick={() => setFilter(item)}
                  key={item}
                  type="button"
                >
                  {projectsFilterLabel(item, language)}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="projects-grid">
          {visible.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
