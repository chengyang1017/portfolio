import { Link } from 'react-router-dom';

export function Footer() { return <footer className="footer"><div className="shell footer-main"><Link className="brand" to="/" aria-label="Lim Cheng Yang home">LCY.</Link><p>Building clear, useful software<br/>from Kuala Lumpur to the world.</p><div><a href="mailto:hello@example.com">Email</a><a href="https://github.com/">GitHub</a><a href="https://linkedin.com/">LinkedIn</a></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Lim Cheng Yang</span><span>Designed & built with intention</span></div></footer>; }
