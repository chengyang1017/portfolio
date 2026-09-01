import { Link } from 'react-router-dom';

export function Hero() { return <section className="hero shell"><p className="eyebrow">Software engineer · product builder</p><h1>I build useful software for <em>language</em>, learning, and everyday life.</h1><div className="hero-foot"><p>From morphology engines to AI-powered developer tools — I turn complex systems into calm, considered products.</p><Link className="button" to="/projects">Explore my work <span>↗</span></Link></div></section>; }
