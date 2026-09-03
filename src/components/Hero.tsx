import { Link } from 'react-router-dom';
import { homeCopy } from '../i18n/homeTranslations';
import { useI18n } from '../i18n/I18nProvider';

export function Hero() {
  const { language } = useI18n();
  const copy = homeCopy(language).hero;

  return (
    <section className="home-hero shell">
      <div className="home-hero-topline">
        <p className="eyebrow">{copy.eyebrow}</p>
        <span className="home-hero-mark" aria-hidden="true">LCY / 26</span>
      </div>

      <div className="home-hero-grid">
        <div className="home-hero-main">
          <h1>
            {copy.lead}{' '}
            <em>{copy.accent}</em>{' '}
            <span>{copy.tail}</span>
          </h1>

          <div className="home-hero-actions">
            <Link className="button" to="/projects">{copy.projects} <span>↗</span></Link>
            <a className="home-hero-text-link" href="https://github.com/chengyang1017">{copy.github} ↗</a>
          </div>
        </div>

        <aside className="home-hero-aside">
          <p>{copy.description}</p>
          <div className="home-focus-list">
            {copy.focus.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
