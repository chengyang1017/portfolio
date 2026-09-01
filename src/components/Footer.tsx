import { Link } from 'react-router-dom';

export function Footer() { return <footer className="footer"><div className="shell footer-main"><Link className="brand" to="/" aria-label="Lim Cheng Yang home">LCY.</Link><p>Software projects across language tools,<br/>mobile apps, developer tools, and backends.</p><div><a href="https://github.com/chengyang1017">GitHub</a></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Lim Cheng Yang</span><span>Project information verified from source</span></div></footer>; }
