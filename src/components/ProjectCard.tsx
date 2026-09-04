import {
  Languages,
  Smartphone,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project, ProjectCategory } from '../data/projects';
import {
  projectCategoryLabel,
  projectStatusLabel,
  projectSummary,
  projectsCopy,
} from '../i18n/projectsTranslations';
import { useI18n } from '../i18n/I18nProvider';

const categoryIcons: Record<ProjectCategory, LucideIcon> = {
  Language: Languages,
  Product: Smartphone,
  'AI & Developer Tools': Terminal,
};

export function ProjectCard({ project }: { project: Project }) {
  const { language } = useI18n();
  const copy = projectsCopy(language);

  const CategoryIcon = categoryIcons[project.category];

  return (
    <Link
      className="project-card"
      data-tone={project.tone}
      to={`/projects/${project.slug}`}
      aria-label={`${copy.viewProject}: ${project.title}`}
    >
      <div className="project-card-head">
        <span className="project-card-icon" aria-hidden="true">
          <CategoryIcon />
        </span>

        <span className="project-card-number">
          {project.number}
        </span>
      </div>

      <div className="project-card-meta">
        <span>
          {projectCategoryLabel(project.category, language)}
        </span>

        <span className="project-card-meta-dot">·</span>

        <span>
          {projectStatusLabel(project.status, language)}
        </span>
      </div>

      <div className="project-card-body">
        <h3>{project.title}</h3>

        <p>
          {projectSummary(
            project.slug,
            language,
            project.summary,
          )}
        </p>
      </div>

      <div className="project-card-bottom">
        <div
          className="project-card-stack"
          aria-label={copy.technologyLabel}
        >
          {project.technologies
            .slice(0, 4)
            .map((technology) => (
              <span key={technology}>
                {technology}
              </span>
            ))}
        </div>

        <span
          className="project-card-arrow"
          aria-hidden="true"
        >
          ↗
        </span>
      </div>
    </Link>
  );
}