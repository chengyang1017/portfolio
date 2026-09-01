import { Link } from 'react-router-dom';

export function Hero() { return <section className="hero shell"><p className="eyebrow">Software developer · public projects</p><h1>Software across <em>language</em>, mobile, developer tools, and backend systems.</h1><div className="hero-foot"><p>Explore projects documented from their public repositories, plus one language platform currently in development.</p><Link className="button" to="/projects">Explore the projects <span>↗</span></Link></div></section>; }
