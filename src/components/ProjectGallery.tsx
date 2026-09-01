import type { Project } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';
export function ProjectGallery({ project }: { project: Project }) { return <div className="gallery">{project.gallery.map((image, index) => <figure key={image.title}><ProjectVisual project={project} compact/><figcaption><span>0{index + 1}</span><div><strong>{image.title}</strong><p>{image.caption}</p></div></figcaption></figure>)}</div>; }
