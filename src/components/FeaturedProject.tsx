import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';
import { TechTag } from './TechTag';

export function FeaturedProject({ project }: { project: Project }) { return <Link className="feature" to={`/projects/${project.slug}`}><div className="feature-copy"><span>{project.number}</span><div><p className="project-category">{project.category} · {project.year}</p><h3>{project.title}</h3><p>{project.summary}</p><div className="tag-list">{project.technologies.slice(0,3).map(t => <TechTag key={t}>{t}</TechTag>)}</div><span className="text-link">View case study ↗</span></div></div><ProjectVisual project={project}/></Link>; }
