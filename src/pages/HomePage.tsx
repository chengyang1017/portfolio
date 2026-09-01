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
  <section className="section areas"><div className="shell"><SectionHeader index="02" eyebrow="Areas I build in" title="At the intersection of systems, people, and language."/><div className="area-grid"><AreaCard number="01" icon="Aa" title="Language technology" description="Tools that help people understand, learn, and work across writing systems."/><AreaCard number="02" icon="</>" title="Developer tools" description="Focused environments that make complex technical work more approachable."/><AreaCard number="03" icon="◇" title="Product engineering" description="End-to-end web and mobile products with thoughtful interaction at their core."/></div></div></section>
  <section className="section shell stack-section"><SectionHeader index="03" eyebrow="Tech stack" title="Tools chosen for the problem, not the trend."/><div className="stack-row"><h3>Front end</h3><div>{['React','TypeScript','React Native','Vite','CSS','WebAssembly'].map(x=><TechTag key={x}>{x}</TechTag>)}</div></div><div className="stack-row"><h3>Back end</h3><div>{['Node.js','Python','FastAPI','PostgreSQL','SQLite','Rust'].map(x=><TechTag key={x}>{x}</TechTag>)}</div></div><div className="stack-row"><h3>Practice</h3><div>{['Product design','NLP','Accessibility','Testing','API design'].map(x=><TechTag key={x}>{x}</TechTag>)}</div></div></section>
  <section className="section about-preview"><div className="shell about-grid"><div><p className="eyebrow">04 / About</p><div className="portrait"><span>LCY</span><i>KL · MY</i></div></div><div><h2>Engineer by practice.<br/><em>Linguist at heart.</em></h2><p>I’m a software engineer who enjoys turning demanding ideas into products people can actually use. My work often lives where technology meets language, learning, and culture.</p><Link className="text-link" to="/about">More about me ↗</Link></div></div></section>
  <section className="contact shell" id="contact"><p className="eyebrow">05 / Contact</p><h2>Have an interesting problem?<br/><a href="mailto:hello@example.com">Let’s talk.</a></h2><div><p>Open to product collaborations, language technology work, and ambitious engineering projects.</p><a className="button button-light" href="mailto:hello@example.com">hello@example.com <span>↗</span></a></div></section>
</>; }
