import { Link } from 'react-router-dom';
import { homeCopy } from '../i18n/homeTranslations';
import { useI18n } from '../i18n/I18nProvider';

export function Footer() {
  const { language } = useI18n();
  const copy = homeCopy(language).footer;

  return (
    <footer className="footer">
      <div className="shell footer-main">
        <Link className="brand" to="/" aria-label="Lim Cheng Yang home">LCY.</Link>
        <p>{copy.summary}</p>
        <div><a href="https://github.com/chengyang1017">GitHub</a></div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Lim Cheng Yang</span>
        <span>{copy.verified}</span>
      </div>
    </footer>
  );
}
