import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import {
  projectCategoryLabel,
  projectStatusLabel,
  projectSummary,
  projectsCopy,
} from '../i18n/projectsTranslations';
import { useI18n } from '../i18n/I18nProvider';

export function ProjectCard({ project }: { project: Project }) {
  const { language } = useI18n();
  const copy = projectsCopy(language);

  return (
    <Link
      className="project-card"
      data-tone={project.tone}
      to={`/projects/${project.slug}`}
      aria-label={`${copy.viewProject}: ${project.title}`}
    >
      <div className="project-card-topline">
        <div className="project-card-meta">
          <span className="project-card-number">{project.number}</span>
          <span>
            {projectCategoryLabel(project.category, language)} ·{' '}
            {projectStatusLabel(project.status, language)}
          </span>
        </div>

        <span className="project-card-arrow" aria-hidden="true">
          ↗
        </span>
      </div>

      <div className="project-card-body">
        <h3>{project.title}</h3>
        <p>{projectSummary(project.slug, language, project.summary)}</p>
      </div>

      <div className="project-card-stack" aria-label={copy.technologyLabel}>
        {project.technologies.slice(0, 4).map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>
    </Link>
  );
}
