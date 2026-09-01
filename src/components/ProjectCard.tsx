import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';

export function ProjectCard({ project }: { project: Project }) { return <Link className="project-card" to={`/projects/${project.slug}`}><ProjectVisual project={project} compact/><div className="card-meta"><span>{project.category} · {project.year}</span><span>↗</span></div><h3>{project.title}</h3><p>{project.summary}</p></Link>; }
