import { useState } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { projects, type ProjectCategory } from '../data/projects';

const filters: Array<'All' | ProjectCategory> = ['All','Language','AI & Developer Tools','Product'];
export function ProjectsPage() { const [filter,setFilter]=useState<(typeof filters)[number]>('All'); const visible=filter==='All'?projects:projects.filter(p=>p.category===filter); return <main className="page shell"><header className="page-intro"><p className="eyebrow">Selected projects · 2024–2026</p><h1>Work that makes<br/><em>complexity useful.</em></h1><p>A collection of language tools, developer experiences, and product systems — designed and built end to end.</p></header><div className="filter-row" aria-label="Project filters">{filters.map(item=><button className={filter===item?'active':''} onClick={()=>setFilter(item)} key={item}>{item}<span>{item==='All'?projects.length:projects.filter(p=>p.category===item).length}</span></button>)}</div><div className="projects-grid">{visible.map(p=><ProjectCard project={p} key={p.slug}/>)}</div></main>; }
