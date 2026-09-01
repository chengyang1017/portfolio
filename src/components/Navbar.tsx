import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return <header className="navbar shell">
    <Link className="brand" to="/" aria-label="Lim Cheng Yang home">LCY.</Link>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={t('nav.toggle')}>{open ? t('nav.close') : t('nav.menu')}</button>
    <nav className={open ? 'open' : ''} aria-label="Primary navigation" onClick={() => setOpen(false)}>
      <NavLink to="/projects">{t('nav.projects')}</NavLink><NavLink to="/about">{t('nav.about')}</NavLink><a href="/#contact">{t('nav.contact')}</a><LanguageSwitcher />
    </nav>
  </header>;
}
