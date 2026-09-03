import type { ProjectCategory } from '../data/projects';
import type { AppLocale } from './types';

export type ProjectsCopy = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  statsLabel: string;
  stats: {
    projects: string;
    language: string;
    tooling: string;
    product: string;
  };
  indexLabel: string;
  filterLabel: string;
  viewProject: string;
  technologyLabel: string;
};

const copy: Record<AppLocale, ProjectsCopy> = {
  en: {
    eyebrow: 'Public repositories and work in development',
    titleLead: 'Software for',
    titleAccent: 'language ecosystems, developer tools, and products.',
    description:
      'A compact project index spanning language infrastructure, mobile applications, developer tooling, commerce, and backend systems.',
    statsLabel: 'Portfolio project statistics',
    stats: {
      projects: 'Projects',
      language: 'Language',
      tooling: 'Developer tools',
      product: 'Products',
    },
    indexLabel: 'Project index',
    filterLabel: 'Project filters',
    viewProject: 'View project',
    technologyLabel: 'Technologies',
  },
  'zh-CN': {
    eyebrow: '公开仓库与开发中的项目',
    titleLead: '围绕',
    titleAccent: '语言生态、开发者工具与产品构建软件。',
    description:
      '用更紧凑的项目索引展示语言基础设施、移动应用、开发者工具、电商与后端系统。',
    statsLabel: '作品集项目统计',
    stats: {
      projects: '项目',
      language: '语言项目',
      tooling: '开发者工具',
      product: '产品项目',
    },
    indexLabel: '项目索引',
    filterLabel: '项目筛选',
    viewProject: '查看项目',
    technologyLabel: '技术栈',
  },
  'zh-TW': {
    eyebrow: '公開儲存庫與開發中的專案',
    titleLead: '圍繞',
    titleAccent: '語言生態、開發者工具與產品構建軟體。',
    description:
      '用更緊湊的專案索引展示語言基礎設施、行動應用、開發者工具、電商與後端系統。',
    statsLabel: '作品集專案統計',
    stats: {
      projects: '專案',
      language: '語言專案',
      tooling: '開發者工具',
      product: '產品專案',
    },
    indexLabel: '專案索引',
    filterLabel: '專案篩選',
    viewProject: '查看專案',
    technologyLabel: '技術棧',
  },
  'vi-Latn': {
    eyebrow: 'Kho mã công khai và các dự án đang phát triển',
    titleLead: 'Phần mềm cho',
    titleAccent: 'hệ sinh thái ngôn ngữ, công cụ lập trình và sản phẩm.',
    description:
      'Một chỉ mục dự án gọn, bao quát hạ tầng ngôn ngữ, ứng dụng di động, công cụ lập trình, thương mại và hệ thống backend.',
    statsLabel: 'Thống kê dự án trong portfolio',
    stats: {
      projects: 'Dự án',
      language: 'Ngôn ngữ',
      tooling: 'Công cụ lập trình',
      product: 'Sản phẩm',
    },
    indexLabel: 'Chỉ mục dự án',
    filterLabel: 'Bộ lọc dự án',
    viewProject: 'Xem dự án',
    technologyLabel: 'Công nghệ',
  },
  'vi-Hani': {
    eyebrow: '各庫碼公開吧各預案正在發展',
    titleLead: '𡏦軟件朱',
    titleAccent: '系生態言語、工具立程吧產品。',
    description:
      '𠬠只目預案𥘷、包括基礎言語、應用移動、工具立程、商買吧系統 backend。',
    statsLabel: '統計各預案作品集',
    stats: {
      projects: '預案',
      language: '言語',
      tooling: '工具立程',
      product: '產品',
    },
    indexLabel: '只目預案',
    filterLabel: '濾各預案',
    viewProject: '䀡預案',
    technologyLabel: '工藝',
  },
};

const categoryLabels: Record<AppLocale, Record<ProjectCategory, string>> = {
  en: {
    Product: 'Product',
    Language: 'Language',
    'AI & Developer Tools': 'AI & Developer Tools',
  },
  'zh-CN': {
    Product: '产品',
    Language: '语言',
    'AI & Developer Tools': 'AI 与开发者工具',
  },
  'zh-TW': {
    Product: '產品',
    Language: '語言',
    'AI & Developer Tools': 'AI 與開發者工具',
  },
  'vi-Latn': {
    Product: 'Sản phẩm',
    Language: 'Ngôn ngữ',
    'AI & Developer Tools': 'AI & Công cụ lập trình',
  },
  'vi-Hani': {
    Product: '產品',
    Language: '言語',
    'AI & Developer Tools': 'AI & 工具立程',
  },
};

const statusLabels: Record<AppLocale, Record<string, string>> = {
  en: {},
  'zh-CN': {
    'Active development': '持续开发',
    'In Development': '开发中',
    'Public repository': '公开仓库',
    Archived: '已归档',
    'Alpha 0.14': 'Alpha 0.14',
    'v0.1': 'v0.1',
  },
  'zh-TW': {
    'Active development': '持續開發',
    'In Development': '開發中',
    'Public repository': '公開儲存庫',
    Archived: '已封存',
    'Alpha 0.14': 'Alpha 0.14',
    'v0.1': 'v0.1',
  },
  'vi-Latn': {
    'Active development': 'Đang phát triển',
    'In Development': 'Đang phát triển',
    'Public repository': 'Kho mã công khai',
    Archived: 'Đã lưu trữ',
    'Alpha 0.14': 'Alpha 0.14',
    'v0.1': 'v0.1',
  },
  'vi-Hani': {
    'Active development': '正在發展',
    'In Development': '正在發展',
    'Public repository': '庫碼公開',
    Archived: '㐌留𡨺',
    'Alpha 0.14': 'Alpha 0.14',
    'v0.1': 'v0.1',
  },
};

const summaries: Record<string, Partial<Record<AppLocale, string>>> = {
  glyphora: {
    en: 'Community infrastructure for multilingual and underrepresented-language ecosystems, with Chữ Nôm as a current focus.',
    'zh-CN': '以语言生态为核心的社区基础设施，当前重点之一是喃字，并持续面向小语种与低资源文字扩展。',
    'zh-TW': '以語言生態為核心的社群基礎設施，目前重點之一是喃字，並持續面向小語種與低資源文字擴展。',
    'vi-Latn': 'Hạ tầng cộng đồng cho hệ sinh thái đa ngôn ngữ và ngôn ngữ ít tài nguyên, với Chữ Nôm là một trọng tâm hiện tại.',
    'vi-Hani': '基礎共同朱系生態多言語吧言語少資源、𥙩𡨸喃𱺵𠬠重點現在。',
  },
  'shopping-app': {
    en: 'Flutter + React + Node commerce stack with Stripe, PostgreSQL, inventory, orders, and administration.',
    'zh-CN': 'Flutter + React + Node 电商全栈，覆盖 Stripe、PostgreSQL、库存、订单与管理后台。',
    'zh-TW': 'Flutter + React + Node 電商全端，涵蓋 Stripe、PostgreSQL、庫存、訂單與管理後台。',
    'vi-Latn': 'Stack thương mại Flutter + React + Node với Stripe, PostgreSQL, tồn kho, đơn hàng và quản trị.',
    'vi-Hani': '棧商買 Flutter + React + Node 固 Stripe、PostgreSQL、存庫、單行吧管理。',
  },
  'language-platform': {
    en: 'ASP.NET Core + PostgreSQL foundation for lexemes, word forms, recordings, dialects, and future language tooling.',
    'zh-CN': '以 ASP.NET Core + PostgreSQL 建设词条、词形、录音、方言与后续语言工具的基础平台。',
    'zh-TW': '以 ASP.NET Core + PostgreSQL 建設詞條、詞形、錄音、方言與後續語言工具的基礎平台。',
    'vi-Latn': 'Nền tảng ASP.NET Core + PostgreSQL cho mục từ, dạng từ, ghi âm, phương ngữ và công cụ ngôn ngữ tiếp theo.',
    'vi-Hani': '平台 ASP.NET Core + PostgreSQL朱詞條、形詞、錄音、方語吧各工具言語接續。',
  },
  'nom-input-method': {
    en: 'Offline Android Chữ Nôm keyboard with Telex parsing, local data, sentence candidates, and ranked output.',
    'zh-CN': '离线 Android 喃字输入法，包含 Telex 解析、本地数据、句级候选与排序。',
    'zh-TW': '離線 Android 喃字輸入法，包含 Telex 解析、本地資料、句級候選與排序。',
    'vi-Latn': 'Bộ gõ Chữ Nôm Android ngoại tuyến với Telex, dữ liệu cục bộ, ứng viên theo câu và xếp hạng.',
    'vi-Hani': '部敲𡨸喃 Android 外線固 Telex、數料局部、候選蹺句吧排行。',
  },
  'ai-code-tutor': {
    en: 'Electron + Monaco editor with Dart semantic navigation, persistent notes, speech, and an in-editor tutor.',
    'zh-CN': 'Electron + Monaco 编辑器，包含 Dart 语义导航、持久笔记、语音与编辑器内导师。',
    'zh-TW': 'Electron + Monaco 編輯器，包含 Dart 語意導覽、持久筆記、語音與編輯器內導師。',
    'vi-Latn': 'Trình soạn Electron + Monaco với điều hướng ngữ nghĩa Dart, ghi chú bền vững, giọng nói và tutor trong editor.',
    'vi-Hani': '程編輯 Electron + Monaco 固導向語義 Dart、𥱬註保存、音聲吧 tutor𥪝 editor。',
  },
  'kyrgyz-inflection-generator': {
    en: 'Rule-based Python generation for Kyrgyz noun and verb inflection with structured dataset exports.',
    'zh-CN': '基于规则的 Python 吉尔吉斯语名词与动词词形生成器，并支持结构化数据集导出。',
    'zh-TW': '基於規則的 Python 吉爾吉斯語名詞與動詞詞形產生器，並支援結構化資料集匯出。',
    'vi-Latn': 'Bộ sinh Python dựa trên quy tắc cho biến hình danh từ và động từ Kyrgyz, kèm xuất dữ liệu có cấu trúc.',
    'vi-Hani': '部生 Python 蹺規則朱形變名詞吧動詞 Kyrgyz、固出數料固結構。',
  },
  'multilanguage-dictionary': {
    en: 'Chinese-centric multilingual dictionary architecture for vocabulary across more than 100 languages.',
    'zh-CN': '以中文为中心、面向 100 多种语言词汇的多语言词典架构。',
    'zh-TW': '以中文為中心、面向 100 多種語言詞彙的多語言詞典架構。',
    'vi-Latn': 'Kiến trúc từ điển đa ngôn ngữ lấy tiếng Trung làm trung tâm cho hơn 100 ngôn ngữ.',
    'vi-Hani': '架構詞典多言語取中文做中心朱超過 100 言語。',
  },
  'morphology-engine': {
    en: 'Reusable Python morphology engine with rule tracing and initial support for Kyrgyz nominal morphology.',
    'zh-CN': '可复用的 Python 形态学引擎，支持规则追踪，并已初步支持吉尔吉斯语名词形态。',
    'zh-TW': '可重用的 Python 形態學引擎，支援規則追蹤，並已初步支援吉爾吉斯語名詞形態。',
    'vi-Latn': 'Engine hình thái học Python có thể tái sử dụng, có truy vết quy tắc và hỗ trợ ban đầu cho hình thái danh từ Kyrgyz.',
    'vi-Hani': 'Engine 形態學 Python 固体再使用、固追規則吧支持初朱形態名詞 Kyrgyz。',
  },
  nestless: {
    en: 'Flutter package for keeping common UI source shallow and readable while preserving normal widget trees.',
    'zh-CN': 'Flutter 软件包，用更浅、更易读的写法组织常见 UI，同时保留正常的 Widget Tree。',
    'zh-TW': 'Flutter 套件，用更淺、更易讀的寫法組織常見 UI，同時保留正常的 Widget Tree。',
    'vi-Latn': 'Package Flutter giúp mã UI thông dụng nông và dễ đọc hơn trong khi vẫn giữ cây widget bình thường.',
    'vi-Hani': 'Package Flutter 朱碼 UI 常用𥘷吧易讀欣、𡀳仍保持樹 widget 平常。',
  },
  'shipin-serverpod': {
    en: 'Archived Serverpod backend source retained after the Shipin backend moved into the main Shipin monorepo.',
    'zh-CN': '已归档的 Serverpod 后端源码；Shipin 后端迁入主 monorepo 后保留作历史参考。',
    'zh-TW': '已封存的 Serverpod 後端原始碼；Shipin 後端移入主 monorepo 後保留作歷史參考。',
    'vi-Latn': 'Mã backend Serverpod đã lưu trữ, được giữ lại làm tham chiếu sau khi backend Shipin chuyển vào monorepo chính.',
    'vi-Hani': '碼 backend Serverpod 㐌留𡨺、得留𨑜做參考後𣈜 backend Shipin 遷入 monorepo chính。',
  },
};

export function projectsCopy(language: AppLocale) {
  return copy[language];
}

export function projectsFilterLabel(
  filter: 'All' | ProjectCategory,
  language: AppLocale,
) {
  if (filter === 'All') {
    const labels: Record<AppLocale, string> = {
      en: 'All',
      'zh-CN': '全部',
      'zh-TW': '全部',
      'vi-Latn': 'Tất cả',
      'vi-Hani': '全部',
    };
    return labels[language];
  }

  return projectCategoryLabel(filter, language);
}

export function projectCategoryLabel(category: ProjectCategory, language: AppLocale) {
  return categoryLabels[language][category] ?? category;
}

export function projectStatusLabel(status: string, language: AppLocale) {
  return statusLabels[language][status] ?? status;
}

export function projectSummary(slug: string, language: AppLocale, fallback: string) {
  return summaries[slug]?.[language] ?? fallback;
}
