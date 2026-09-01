import { Link } from 'react-router-dom';
import { AreaCard } from '../components/AreaCard';
import { FeaturedProject } from '../components/FeaturedProject';
import { Hero } from '../components/Hero';
import { ProjectCard } from '../components/ProjectCard';
import { SectionHeader } from '../components/SectionHeader';
import { TechTag } from '../components/TechTag';
import { projects } from '../data/projects';

export function HomePage() { return <>
  <Hero/>
  <section className="section shell"><SectionHeader index="01" eyebrow="Selected work" action={<Link className="text-link" to="/projects">All projects ↗</Link>}/><FeaturedProject project={projects[0]}/><div className="home-project-grid">{projects.slice(1,3).map(p => <ProjectCard project={p} key={p.slug}/>)}</div></section>
  <section className="section areas"><div className="shell"><SectionHeader index="02" eyebrow="Areas I build in" title="Software across languages, platforms, and systems."/><div className="area-grid"><AreaCard number="01" icon="Aa" title="Language technology" description="Dictionary, morphology, language configuration, and writing-system projects."/><AreaCard number="02" icon="</>" title="Developer tools" description="Desktop editing and Flutter UI tooling from public repositories."/><AreaCard number="03" icon="◇" title="Product engineering" description="Mobile, web, commerce, community, and backend applications."/></div></div></section>
  <section className="section shell stack-section"><SectionHeader index="03" eyebrow="Verified technology" title="Technologies present in the projects."/><div className="stack-row"><h3>Client</h3><div>{['Flutter','Dart','Android','Kotlin','React','TypeScript','Vite','Electron'].map(x=><TechTag key={x}>{x}</TechTag>)}</div></div><div className="stack-row"><h3>Backend & data</h3><div>{['Node.js','Express','Prisma','PostgreSQL','Python','Flask','SQLite','ASP.NET Core','EF Core'].map(x=><TechTag key={x}>{x}</TechTag>)}</div></div><div className="stack-row"><h3>Platforms & services</h3><div>{['Firebase','Stripe','Serverpod','Monaco Editor','Pandas'].map(x=><TechTag key={x}>{x}</TechTag>)}</div></div></section>
  <section className="section about-preview"><div className="shell about-grid"><div><p className="eyebrow">04 / About</p><div className="portrait"><span>LCY</span><i>PUBLIC SOURCE</i></div></div><div><h2>Projects documented<br/><em>from their source.</em></h2><p>This portfolio presents Lim Cheng Yang’s public software repositories and one language platform currently in development. Project descriptions are limited to information verified from source code, repository documentation, or the supplied project status.</p><Link className="text-link" to="/about">About this portfolio ↗</Link></div></div></section>
  <section className="contact shell" id="contact"><p className="eyebrow">05 / Profile</p><h2>Explore the source<br/><a href="https://github.com/chengyang1017">on GitHub.</a></h2><div><p>Public repositories are available from the verified GitHub profile.</p><a className="button button-light" href="https://github.com/chengyang1017">GitHub profile <span>↗</span></a></div></section>
</>; }
