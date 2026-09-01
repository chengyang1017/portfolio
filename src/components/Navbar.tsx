import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="navbar shell">
    <Link className="brand" to="/" aria-label="Lim Cheng Yang home">LCY.</Link>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open ? 'Close' : 'Menu'}</button>
    <nav className={open ? 'open' : ''} aria-label="Primary navigation" onClick={() => setOpen(false)}>
      <NavLink to="/projects">Projects</NavLink><NavLink to="/about">About</NavLink><a href="/#contact">Contact</a>
    </nav>
  </header>;
}
