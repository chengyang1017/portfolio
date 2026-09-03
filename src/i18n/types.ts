export type Language = 'en' | 'zh-CN' | 'zh-TW';
export type AppLocale = Language | 'vi-Latn' | 'vi-Hani';
export type TranslationKey = string;
export type TranslationDictionary = Record<TranslationKey, string>;
