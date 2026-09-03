import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';
import type { AppLocale, TranslationKey } from './types';

interface I18nContextValue {
  language: AppLocale;
  setLanguage: (language: AppLocale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const supportedLanguages: AppLocale[] = ['en', 'zh-CN', 'zh-TW', 'vi-Latn', 'vi-Hani'];

const localeFallbacks: Partial<Record<AppLocale, AppLocale>> = {
  'vi-Hani': 'vi-Latn',
};

function initialLanguage(): AppLocale {
  const saved = window.localStorage.getItem('portfolio-language');
  return supportedLanguages.includes(saved as AppLocale) ? saved as AppLocale : 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLocale>(initialLanguage);

  useEffect(() => {
    window.localStorage.setItem('portfolio-language', language);
    document.documentElement.lang = language;
    document.documentElement.dataset.locale = language;
    document.documentElement.dataset.script = language.endsWith('Hani')
      ? 'hani'
      : language.endsWith('Latn')
        ? 'latn'
        : language.startsWith('zh-')
          ? 'han'
          : 'default';
  }, [language]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key) => {
      const direct = translations[language]?.[key];
      if (direct) return direct;

      const fallbackLocale = localeFallbacks[language];
      if (fallbackLocale) {
        const fallback = translations[fallbackLocale]?.[key];
        if (fallback) return fallback;
      }

      return translations.en[key] ?? key;
    },
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
