import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';
import type { Language, TranslationKey } from './types';

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const supportedLanguages: Language[] = ['en', 'zh-CN', 'zh-TW'];

function initialLanguage(): Language {
  const saved = window.localStorage.getItem('portfolio-language');
  return supportedLanguages.includes(saved as Language) ? saved as Language : 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  useEffect(() => {
    window.localStorage.setItem('portfolio-language', language);
    document.documentElement.lang = language;
  }, [language]);
  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key) => translations[language][key] ?? translations.en[key] ?? key,
  }), [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
