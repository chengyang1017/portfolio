import type { AppLocale } from './types';

export type HomeCopy = {
  hero: {
    eyebrow: string;
    lead: string;
    accent: string;
    tail: string;
    description: string;
    projects: string;
    github: string;
    focus: [string, string, string];
  };
  work: {
    eyebrow: string;
    title: string;
    description: string;
    allProjects: string;
    viewProject: string;
  };
  areas: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  stack: {
    eyebrow: string;
    title: string;
    client: string;
    backend: string;
    platform: string;
  };
  about: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    link: string;
    label: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
  };
  footer: {
    summary: string;
    verified: string;
  };
};

const copy: Record<AppLocale, HomeCopy> = {
  en: {
    hero: {
      eyebrow: 'Software developer · language ecosystem builder',
      lead: 'Building software for',
      accent: 'languages that need more infrastructure.',
      tail: 'Then taking the same systems thinking into developer tools and full-stack products.',
      description: 'My work ranges from Chữ Nôm and underrepresented-language tooling to Flutter, backend systems, commerce, and code tools.',
      projects: 'Explore projects',
      github: 'GitHub profile',
      focus: ['Chữ Nôm', 'Language ecosystems', 'Developer infrastructure'],
    },
    work: {
      eyebrow: 'Selected work',
      title: 'Project',
      description: '',
      allProjects: 'All projects ↗',
      viewProject: 'Open project',
    },
    areas: {
      eyebrow: 'What I build',
      title: 'Three directions, one engineering practice.',
      items: [
        { title: 'Language ecosystems', description: 'Input, morphology, dictionaries, scripts, recording, and community infrastructure for languages with fewer digital tools.' },
        { title: 'Developer infrastructure', description: 'IDEs, Flutter learning environments, code navigation, UI libraries, and workflow tooling.' },
        { title: 'Full-stack products', description: 'Flutter, React, Node, .NET, PostgreSQL, Firebase, payments, and real-time product systems.' },
      ],
    },
    stack: {
      eyebrow: 'Verified technology',
      title: 'Technology that appears in the actual projects.',
      client: 'Client',
      backend: 'Backend & data',
      platform: 'Platforms & services',
    },
    about: {
      eyebrow: 'About the work',
      title: 'The through-line is',
      accent: 'infrastructure people can actually use.',
      description: 'Language projects are the distinctive core, but the portfolio also shows ordinary product engineering: mobile apps, commerce, backend APIs, desktop tooling, databases, real-time systems, and reusable packages.',
      link: 'About this portfolio ↗',
      label: 'LANGUAGE · PRODUCT · TOOLING',
    },
    contact: {
      eyebrow: 'Source first',
      title: 'Read the code, not just the claims.',
      description: 'Public repositories are linked throughout the portfolio so implementation can be inspected directly.',
      action: 'GitHub profile ↗',
    },
    footer: {
      summary: 'Language ecosystems, developer tools, mobile products, and backend systems.',
      verified: 'Project information verified from source',
    },
  },
  'zh-CN': {
    hero: {
      eyebrow: '软件开发者 · 语言生态建设',
      lead: '为',
      accent: '缺少数字基础设施的语言',
      tail: '做软件，也把同样的系统思维延伸到开发者工具与全栈产品。',
      description: '项目从喃字、小语种与低资源语言工具，一直延伸到 Flutter、后端系统、电商与代码工具。',
      projects: '查看项目',
      github: 'GitHub 主页',
      focus: ['喃字', '语言生态', '开发者基础设施'],
    },
    work: {
      eyebrow: '精选项目',
      title: '项目',
      description: '',
      allProjects: '全部项目 ↗',
      viewProject: '打开项目',
    },
    areas: {
      eyebrow: '我在做什么',
      title: '三个方向，共用一套工程能力。',
      items: [
        { title: '语言生态', description: '为数字工具较少的语言建设输入法、词形、词典、文字系统、录音与社区基础设施。' },
        { title: '开发者基础设施', description: 'IDE、Flutter 学习环境、代码导航、UI 库，以及开发工作流工具。' },
        { title: '全栈产品', description: 'Flutter、React、Node、.NET、PostgreSQL、Firebase、支付与实时产品系统。' },
      ],
    },
    stack: {
      eyebrow: '已验证技术',
      title: '这些技术都真实出现在项目实现里。',
      client: '客户端',
      backend: '后端与数据',
      platform: '平台与服务',
    },
    about: {
      eyebrow: '关于这些项目',
      title: '贯穿所有项目的核心是',
      accent: '真正能被使用的基础设施。',
      description: '语言项目是最有辨识度的主线，但作品集同样覆盖常规产品工程：移动应用、电商、后端 API、桌面工具、数据库、实时系统与可复用软件包。',
      link: '关于这个作品集 ↗',
      label: '语言 · 产品 · 工具',
    },
    contact: {
      eyebrow: '源码优先',
      title: '不只看介绍，直接看实现。',
      description: '作品集中的公开项目都连接到源码仓库，可以直接检查真实实现。',
      action: 'GitHub 主页 ↗',
    },
    footer: {
      summary: '语言生态、开发者工具、移动产品与后端系统。',
      verified: '项目信息依据源码验证',
    },
  },
  'zh-TW': {
    hero: {
      eyebrow: '軟體開發者 · 語言生態建設',
      lead: '為',
      accent: '缺少數位基礎設施的語言',
      tail: '做軟體，也把同樣的系統思維延伸到開發者工具與全端產品。',
      description: '專案從喃字、小語種與低資源語言工具，一路延伸到 Flutter、後端系統、電商與程式碼工具。',
      projects: '查看專案',
      github: 'GitHub 首頁',
      focus: ['喃字', '語言生態', '開發者基礎設施'],
    },
    work: {
      eyebrow: '精選專案',
      title: '專案',
      description: '',
      allProjects: '全部專案 ↗',
      viewProject: '開啟專案',
    },
    areas: {
      eyebrow: '我在做什麼',
      title: '三個方向，共用一套工程能力。',
      items: [
        { title: '語言生態', description: '為數位工具較少的語言建設輸入法、詞形、詞典、文字系統、錄音與社群基礎設施。' },
        { title: '開發者基礎設施', description: 'IDE、Flutter 學習環境、程式碼導覽、UI 套件，以及開發工作流程工具。' },
        { title: '全端產品', description: 'Flutter、React、Node、.NET、PostgreSQL、Firebase、付款與即時產品系統。' },
      ],
    },
    stack: {
      eyebrow: '已驗證技術',
      title: '這些技術都真實出現在專案實作裡。',
      client: '用戶端',
      backend: '後端與資料',
      platform: '平台與服務',
    },
    about: {
      eyebrow: '關於這些專案',
      title: '貫穿所有專案的核心是',
      accent: '真正能被使用的基礎設施。',
      description: '語言專案是最有辨識度的主線，但作品集同樣涵蓋一般產品工程：行動應用、電商、後端 API、桌面工具、資料庫、即時系統與可重用套件。',
      link: '關於這個作品集 ↗',
      label: '語言 · 產品 · 工具',
    },
    contact: {
      eyebrow: '原始碼優先',
      title: '不只看介紹，直接看實作。',
      description: '作品集中的公開專案都連到原始碼儲存庫，可以直接檢查真實實作。',
      action: 'GitHub 首頁 ↗',
    },
    footer: {
      summary: '語言生態、開發者工具、行動產品與後端系統。',
      verified: '專案資訊依據原始碼驗證',
    },
  },
  'vi-Latn': {
    hero: {
      eyebrow: 'Lập trình viên · xây hệ sinh thái ngôn ngữ',
      lead: 'Xây phần mềm cho',
      accent: 'những ngôn ngữ còn thiếu hạ tầng số.',
      tail: 'Rồi mang cùng tư duy hệ thống đó sang công cụ lập trình và sản phẩm full-stack.',
      description: 'Các dự án trải từ Chữ Nôm, ngôn ngữ ít tài nguyên và công cụ ngôn ngữ đến Flutter, hệ thống backend, thương mại điện tử và công cụ mã nguồn.',
      projects: 'Xem dự án',
      github: 'Trang GitHub',
      focus: ['Chữ Nôm', 'Hệ sinh thái ngôn ngữ', 'Hạ tầng cho lập trình viên'],
    },
    work: {
      eyebrow: 'Dự án nổi bật',
      title: 'Dự án',
      description: '',
      allProjects: 'Tất cả dự án ↗',
      viewProject: 'Mở dự án',
    },
    areas: {
      eyebrow: 'Tôi xây gì',
      title: 'Ba hướng, cùng một nền tảng kỹ thuật.',
      items: [
        { title: 'Hệ sinh thái ngôn ngữ', description: 'Bộ gõ, hình thái học, từ điển, hệ chữ, ghi âm và hạ tầng cộng đồng cho các ngôn ngữ có ít công cụ số.' },
        { title: 'Hạ tầng cho lập trình viên', description: 'IDE, môi trường luyện Flutter, điều hướng mã, thư viện UI và công cụ quy trình phát triển.' },
        { title: 'Sản phẩm full-stack', description: 'Flutter, React, Node, .NET, PostgreSQL, Firebase, thanh toán và hệ thống thời gian thực.' },
      ],
    },
    stack: {
      eyebrow: 'Công nghệ đã xác minh',
      title: 'Các công nghệ thực sự xuất hiện trong dự án.',
      client: 'Client',
      backend: 'Backend & dữ liệu',
      platform: 'Nền tảng & dịch vụ',
    },
    about: {
      eyebrow: 'Về công việc',
      title: 'Điểm xuyên suốt là',
      accent: 'hạ tầng thực sự có thể sử dụng.',
      description: 'Các dự án ngôn ngữ là nét riêng rõ nhất, nhưng portfolio cũng cho thấy kỹ thuật sản phẩm thông thường: ứng dụng di động, thương mại, API backend, công cụ desktop, cơ sở dữ liệu, hệ thống thời gian thực và package tái sử dụng.',
      link: 'Về portfolio này ↗',
      label: 'NGÔN NGỮ · SẢN PHẨM · CÔNG CỤ',
    },
    contact: {
      eyebrow: 'Ưu tiên mã nguồn',
      title: 'Đọc mã, không chỉ đọc lời giới thiệu.',
      description: 'Các dự án công khai đều liên kết tới kho mã để có thể kiểm tra trực tiếp phần triển khai.',
      action: 'Trang GitHub ↗',
    },
    footer: {
      summary: 'Hệ sinh thái ngôn ngữ, công cụ lập trình, sản phẩm di động và hệ thống backend.',
      verified: 'Thông tin dự án được xác minh từ mã nguồn',
    },
  },
  'vi-Hani': {
    hero: {
      eyebrow: '立程 · 𡏦系生態言語',
      lead: '𡏦軟件朱',
      accent: '各言語少基礎數。',
      tail: '吧𢪏同思維系統𧗱𦤾工具立程吧產品全棧。',
      description: '各預案自𡨸喃、言語少資源吧工具言語𦤾 Flutter、系統 backend、商買吧工具碼源。',
      projects: '䀡各預案',
      github: '頁 GitHub',
      focus: ['𡨸喃', '系生態言語', '基礎朱立程'],
    },
    work: {
      eyebrow: '各預案重點',
      title: '預案',
      description: '',
      allProjects: '各預案 ↗',
      viewProject: '䀡預案',
    },
    areas: {
      eyebrow: '寔現主要',
      title: '𠀧方向、𠬠基礎工程。',
      items: [
        { title: '系生態言語', description: '部敲、形態、詞典、系𡨸、錄音吧基礎共同朱各言語少工具數。' },
        { title: '基礎朱立程', description: 'IDE、環境練 Flutter、導向碼、庫 UI吧工具流程發展。' },
        { title: '產品全棧', description: 'Flutter、React、Node、.NET、PostgreSQL、Firebase、清算吧系統即時。' },
      ],
    },
    stack: {
      eyebrow: '工藝㐌確認',
      title: '各工藝尼寔際固𥪝預案。',
      client: 'Client',
      backend: 'Backend & 數料',
      platform: '平台 & 服務',
    },
    about: {
      eyebrow: '關於各預案',
      title: '點共同𨑜各預案𱺵',
      accent: '基礎固体使用寔際。',
      description: '各預案言語𱺵主線固辨識高、𡀳作品集拱固應用移動、商買、API backend、工具 desktop、基礎數料、系統即時吧 package固体再使用。',
      link: '關於作品集尼 ↗',
      label: '言語 · 產品 · 工具',
    },
    contact: {
      eyebrow: '優先碼源',
      title: '讀碼、空只讀介紹。',
      description: '各預案公開調固聯結𦤾庫碼抵固体檢查份寔現直接。',
      action: '頁 GitHub ↗',
    },
    footer: {
      summary: '系生態言語、工具立程、產品移動吧系統 backend。',
      verified: '信息預案得確認自碼源',
    },
  },
};

const projectDescriptions: Record<string, Partial<Record<AppLocale, string>>> = {
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
};

export function homeCopy(language: AppLocale) {
  return copy[language];
}

export function homeProjectDescription(slug: string, language: AppLocale, fallback: string) {
  return projectDescriptions[slug]?.[language] ?? fallback;
}

export function homeCategory(category: string, language: AppLocale) {
  const values: Record<AppLocale, Record<string, string>> = {
    en: { Product: 'Product', Language: 'Language', 'AI & Developer Tools': 'AI & Developer Tools' },
    'zh-CN': { Product: '产品', Language: '语言', 'AI & Developer Tools': 'AI 与开发者工具' },
    'zh-TW': { Product: '產品', Language: '語言', 'AI & Developer Tools': 'AI 與開發者工具' },
    'vi-Latn': { Product: 'Sản phẩm', Language: 'Ngôn ngữ', 'AI & Developer Tools': 'AI & Công cụ lập trình' },
    'vi-Hani': { Product: '產品', Language: '言語', 'AI & Developer Tools': 'AI & 工具立程' },
  };
  return values[language][category] ?? category;
}

export function homeStatus(status: string, language: AppLocale) {
  const values: Record<AppLocale, Record<string, string>> = {
    en: {},
    'zh-CN': { 'Active development': '持续开发', 'In Development': '开发中', 'Public repository': '公开仓库', Archived: '已归档', 'Alpha 0.14': 'Alpha 0.14' },
    'zh-TW': { 'Active development': '持續開發', 'In Development': '開發中', 'Public repository': '公開儲存庫', Archived: '已封存', 'Alpha 0.14': 'Alpha 0.14' },
    'vi-Latn': { 'Active development': 'Đang phát triển', 'In Development': 'Đang phát triển', 'Public repository': 'Kho mã công khai', Archived: 'Đã lưu trữ', 'Alpha 0.14': 'Alpha 0.14' },
    'vi-Hani': { 'Active development': '正在發展', 'In Development': '正在發展', 'Public repository': '庫碼公開', Archived: '㐌留𡨺', 'Alpha 0.14': 'Alpha 0.14' },
  };
  return values[language][status] ?? status;
}
