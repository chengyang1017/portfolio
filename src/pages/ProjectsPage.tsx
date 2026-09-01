import { useState } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { projects, type ProjectCategory } from '../data/projects';

const filters: Array<'All' | ProjectCategory> = ['All','Language','AI & Developer Tools','Product'];
export function ProjectsPage() { const [filter,setFilter]=useState<(typeof filters)[number]>('All'); const visible=filter==='All'?projects:projects.filter(p=>p.category===filter); return <main className="page shell"><header className="page-intro"><p className="eyebrow">Public repositories and work in development</p><h1>Software across<br/><em>languages and platforms.</em></h1><p>Projects spanning language tooling, mobile applications, developer tools, commerce, and backend systems.</p></header><div className="filter-row" aria-label="Project filters">{filters.map(item=><button className={filter===item?'active':''} onClick={()=>setFilter(item)} key={item}>{item}<span>{item==='All'?projects.length:projects.filter(p=>p.category===item).length}</span></button>)}</div><div className="projects-grid">{visible.map(p=><ProjectCard project={p} key={p.slug}/>)}</div></main>; }
