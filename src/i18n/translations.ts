import type { Language, TranslationDictionary } from './types';
import { projectTranslations } from '../data/source-projects';

const english: TranslationDictionary = {
  'nav.projects': 'Projects', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.menu': 'Menu', 'nav.close': 'Close', 'nav.toggle': 'Toggle navigation',
  'language.label': 'Language', 'language.en': 'English', 'language.zh-CN': '简体中文', 'language.zh-TW': '繁體中文',
  'source.entry': 'Source Code / Code Explanation', 'source.title': 'Source Code Explanation', 'source.eyebrow': 'Project source', 'source.description': 'Browse verified source categories, features, related files, code flow, and translated code commentary.', 'source.categories': 'Source categories',
  'source.category': 'Category', 'source.features': 'Features', 'source.feature': 'Feature', 'source.explanation': 'Code explanation',
  'source.relatedFiles': 'Related files', 'source.codeFlow': 'Code flow', 'source.codeBlocks': 'Code blocks', 'source.relatedFeatures': 'Related features',
  'source.backToProject': 'Back to project', 'source.backProject': 'Back to project detail', 'source.overview': 'Project source overview', 'source.viewCategory': 'View category', 'source.viewFeature': 'View explanation',
  'source.empty.title': 'Source explanation coming soon', 'source.empty.description': 'No verified source-code explanation has been added for this project yet.',
  'source.empty.categoryTitle': 'Category not available', 'source.empty.categoryDescription': 'This source category does not exist or has not been published yet.',
  'source.empty.featureTitle': 'Explanation not available', 'source.empty.featureDescription': 'This feature explanation does not exist or has not been published yet.',
  'source.empty.files': 'No related files have been added.', 'source.empty.flow': 'No code flow has been added.', 'source.empty.code': 'No code blocks have been added.', 'source.empty.related': 'No related features have been added.',
  ...projectTranslations.en,
};

const simplifiedChinese: TranslationDictionary = {
  'nav.projects': '项目', 'nav.about': '关于', 'nav.contact': '联系', 'nav.menu': '菜单', 'nav.close': '关闭', 'nav.toggle': '切换导航菜单',
  'language.label': '语言', 'language.en': 'English', 'language.zh-CN': '简体中文', 'language.zh-TW': '繁體中文',
  'source.entry': '源代码 / 代码解释', 'source.title': '源代码解释', 'source.eyebrow': '项目源码', 'source.description': '浏览经过验证的源码分类、功能、相关文件、代码流程和翻译后的代码注释。', 'source.categories': '源码分类',
  'source.category': '分类', 'source.features': '功能', 'source.feature': '功能', 'source.explanation': '代码解释',
  'source.relatedFiles': '相关文件', 'source.codeFlow': '代码流程', 'source.codeBlocks': '代码块', 'source.relatedFeatures': '相关功能',
  'source.backToProject': '返回项目', 'source.backProject': '返回项目详情', 'source.overview': '项目源码概览', 'source.viewCategory': '查看分类', 'source.viewFeature': '查看解释',
  'source.empty.title': '源码解释即将推出', 'source.empty.description': '此项目尚未添加经过验证的源代码解释。',
  'source.empty.categoryTitle': '分类不可用', 'source.empty.categoryDescription': '此源码分类不存在或尚未发布。',
  'source.empty.featureTitle': '解释不可用', 'source.empty.featureDescription': '此功能解释不存在或尚未发布。',
  'source.empty.files': '尚未添加相关文件。', 'source.empty.flow': '尚未添加代码流程。', 'source.empty.code': '尚未添加代码块。', 'source.empty.related': '尚未添加相关功能。',
  ...projectTranslations['zh-CN'],
};

const traditionalChinese: TranslationDictionary = {
  'nav.projects': '專案', 'nav.about': '關於', 'nav.contact': '聯絡', 'nav.menu': '選單', 'nav.close': '關閉', 'nav.toggle': '切換導覽選單',
  'language.label': '語言', 'language.en': 'English', 'language.zh-CN': '简体中文', 'language.zh-TW': '繁體中文',
  'source.entry': '原始碼 / 程式碼解釋', 'source.title': '原始碼解釋', 'source.eyebrow': '專案原始碼', 'source.description': '瀏覽經過驗證的原始碼分類、功能、相關檔案、程式碼流程和翻譯後的程式碼註解。', 'source.categories': '原始碼分類',
  'source.category': '分類', 'source.features': '功能', 'source.feature': '功能', 'source.explanation': '程式碼解釋',
  'source.relatedFiles': '相關檔案', 'source.codeFlow': '程式碼流程', 'source.codeBlocks': '程式碼區塊', 'source.relatedFeatures': '相關功能',
  'source.backToProject': '返回專案', 'source.backProject': '返回專案詳情', 'source.overview': '專案原始碼概覽', 'source.viewCategory': '查看分類', 'source.viewFeature': '查看解釋',
  'source.empty.title': '原始碼解釋即將推出', 'source.empty.description': '此專案尚未加入經過驗證的原始碼解釋。',
  'source.empty.categoryTitle': '分類無法使用', 'source.empty.categoryDescription': '此原始碼分類不存在或尚未發布。',
  'source.empty.featureTitle': '解釋無法使用', 'source.empty.featureDescription': '此功能解釋不存在或尚未發布。',
  'source.empty.files': '尚未加入相關檔案。', 'source.empty.flow': '尚未加入程式碼流程。', 'source.empty.code': '尚未加入程式碼區塊。', 'source.empty.related': '尚未加入相關功能。',
  ...projectTranslations['zh-TW'],
};

export const translations: Record<Language, TranslationDictionary> = {
  en: english,
  'zh-CN': simplifiedChinese,
  'zh-TW': traditionalChinese,
};
