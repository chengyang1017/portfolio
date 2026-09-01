import { useI18n } from '../i18n/I18nProvider';
import type { Language } from '../i18n/types';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  return <label className="language-switcher"><span className="sr-only">{t('language.label')}</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={t('language.label')}><option value="en">EN</option><option value="zh-CN">简</option><option value="zh-TW">繁</option></select></label>;
}
