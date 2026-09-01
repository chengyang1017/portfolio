import type { Project } from '../data/projects';

export function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  const items = project.technologies.slice(0, 3);
  const modules = (project.features.length > 0 ? project.features : project.technologies).slice(0, 3);
  return <div className={`visual tone-${project.tone} ${compact ? 'compact' : ''}`}>
    <div className="visual-window">
      <div className="visual-bar"><span>● ● ●</span><b>{project.slug} / repository</b></div>
      <div className="visual-body">
        <aside><strong>{project.shortTitle}</strong>{modules.map((value, index) => <small className={index === 1 ? 'selected' : ''} key={value}>{value}</small>)}</aside>
        <div className="visual-canvas"><small>{project.status.toUpperCase()}</small><h3>{project.title}</h3><div className="visual-pills">{items.map((value, index) => <b className={index === 1 ? 'selected' : ''} key={value}>{value}</b>)}</div><div className="visual-lines"><i/><i/><i/></div></div>
      </div>
    </div>
  </div>;
}
