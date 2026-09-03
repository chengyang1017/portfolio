import type { Project } from '../data/projects';

type ProjectVisualFocus = {
  title: string;
  caption: string;
  index: number;
};

export function ProjectVisual({
  project,
  compact = false,
  focus,
}: {
  project: Project;
  compact?: boolean;
  focus?: ProjectVisualFocus;
}) {
  const moduleSource = project.features.length > 0 ? project.features : project.technologies;
  const modules = moduleSource.slice(0, 3);
  const focusIndex = focus?.index ?? 1;
  const selectedModuleIndex = modules.length > 0 ? focusIndex % modules.length : 0;

  const technologies = project.technologies;
  const items = technologies.length > 0
    ? Array.from({ length: Math.min(3, technologies.length) }, (_, index) => technologies[(focusIndex + index) % technologies.length])
    : [];

  const heading = focus?.title ?? project.title;
  const kicker = focus
    ? `AREA ${String(focus.index + 1).padStart(2, '0')} · ${project.status}`
    : project.status;

  return (
    <div className={`visual tone-${project.tone} ${compact ? 'compact' : ''}`}>
      <div className="visual-window">
        <div className="visual-bar">
          <span>● ● ●</span>
          <b>{project.slug} / repository</b>
        </div>
        <div className="visual-body">
          <aside>
            <strong>{project.shortTitle}</strong>
            {modules.map((value, index) => (
              <small className={index === selectedModuleIndex ? 'selected' : ''} key={value}>
                {value}
              </small>
            ))}
          </aside>
          <div className="visual-canvas">
            <small>{kicker.toUpperCase()}</small>
            <h3>{heading}</h3>
            {focus && <p className="visual-focus-copy">{focus.caption}</p>}
            <div className="visual-pills">
              {items.map((value, index) => (
                <b className={index === selectedModuleIndex ? 'selected' : ''} key={value}>
                  {value}
                </b>
              ))}
            </div>
            <div className="visual-lines">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
