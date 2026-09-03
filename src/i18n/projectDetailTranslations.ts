import type { Project } from '../data/projects';
import type { Language } from './types';

type DetailCopy = Pick<Project, 'summary' | 'overview' | 'features' | 'challenges' | 'architecture' | 'gallery'>;

const glyphora: Record<Exclude<Language, 'en'>, DetailCopy> = {
  'zh-CN': {
    summary: '一个以语言生态为核心的多语言社区，重点支持喃字，并面向更多小语种、方言与低资源文字系统持续扩展。',
    overview: 'Glyphora（万文社）不是在普通社交平台上附加“多语言”功能，而是把语言本身作为社区的组织方式。用户可以围绕自己使用的语言与文字发帖、发现内容、聊天和共享笔记。喃字是当前重点之一，长期方向是继续支持更多小语种、方言与低资源文字系统，让这些语言拥有持续产生内容、交流、记录，并与后续语言工具连接的数字社区与生态。仓库包含 Flutter 与 React Native 客户端、Node.js API、React 管理后台、PostgreSQL 数据层，以及 Firebase 服务。',
    features: ['文字与图片发帖', '点赞、评论、分类与信息流', '好友、私信与实时聊天', '共享富文本笔记', '喃字与多语言社区空间', '个人主页、发现与管理后台'],
    challenges: [
      { title: '消息生命周期', description: '仓库中实现了消息逻辑删除、定时清理、媒体清理，以及聊天预览刷新的完整处理流程。' },
      { title: '混合数据服务', description: '服务端业务数据使用 Node.js、Prisma 与 PostgreSQL，而身份验证、聊天、存储及其他实时能力则使用 Firebase。' },
    ],
    architecture: [
      { label: 'Flutter', detail: '移动端客户端' },
      { label: 'Node.js API', detail: 'Express + Prisma' },
      { label: 'PostgreSQL', detail: '业务数据' },
      { label: 'Firebase', detail: '身份验证 + 实时服务' },
    ],
    gallery: [
      { title: '社区帖子', caption: '文字、图片、分类、点赞与评论。' },
      { title: '实时聊天', caption: '私信、聊天预览与消息生命周期处理。' },
      { title: '共享笔记', caption: '聊天参与者之间共享的富文本笔记。' },
    ],
  },
  'zh-TW': {
    summary: '一個以語言生態為核心的多語言社群，重點支援喃字，並持續面向更多小語種、方言與低資源文字系統擴展。',
    overview: 'Glyphora（萬文社）不是在一般社群平台上附加「多語言」功能，而是把語言本身作為社群的組織方式。使用者可以圍繞自己使用的語言與文字發文、探索內容、聊天與共享筆記。喃字是目前的重點之一，長期方向是繼續支援更多小語種、方言與低資源文字系統，讓這些語言擁有持續產生內容、交流、記錄，並與後續語言工具連接的數位社群與生態。儲存庫包含 Flutter 與 React Native 用戶端、Node.js API、React 管理後台、PostgreSQL 資料層，以及 Firebase 服務。',
    features: ['文字與圖片發文', '按讚、留言、分類與動態牆', '好友、私訊與即時聊天', '共享富文字筆記', '喃字與多語言社群空間', '個人頁面、探索與管理後台'],
    challenges: [
      { title: '訊息生命週期', description: '儲存庫中實作了訊息邏輯刪除、排程清理、媒體清理，以及聊天預覽更新的完整處理流程。' },
      { title: '混合資料服務', description: '伺服器端業務資料使用 Node.js、Prisma 與 PostgreSQL，而身分驗證、聊天、儲存及其他即時能力則使用 Firebase。' },
    ],
    architecture: [
      { label: 'Flutter', detail: '行動端用戶端' },
      { label: 'Node.js API', detail: 'Express + Prisma' },
      { label: 'PostgreSQL', detail: '應用資料' },
      { label: 'Firebase', detail: '身分驗證 + 即時服務' },
    ],
    gallery: [
      { title: '社群貼文', caption: '文字、圖片、分類、按讚與留言。' },
      { title: '即時聊天', caption: '私訊、聊天預覽與訊息生命週期處理。' },
      { title: '共享筆記', caption: '聊天參與者之間共享的富文字筆記。' },
    ],
  },
};

export function glyphoraEcosystemCopy(language: Language) {
  if (language === 'zh-CN') {
    return {
      eyebrow: '语言生态定位',
      title: '不是“支持多语言”，而是为语言本身建立社区生态。',
      description: '喃字是当前重点之一。万文社希望继续扩展更多小语种、方言与低资源文字系统，让它们不只被“支持显示”，而是拥有自己的内容、交流、记录、发现与后续工具生态。',
      tags: ['喃字', '小语种生态', '方言', '低资源文字', '多语言社区'],
    };
  }

  if (language === 'zh-TW') {
    return {
      eyebrow: '語言生態定位',
      title: '不是「支援多語言」，而是為語言本身建立社群生態。',
      description: '喃字是目前的重點之一。萬文社希望繼續擴展更多小語種、方言與低資源文字系統，讓它們不只是被「支援顯示」，而是擁有自己的內容、交流、記錄、探索與後續工具生態。',
      tags: ['喃字', '小語種生態', '方言', '低資源文字', '多語言社群'],
    };
  }

  return {
    eyebrow: 'Language ecosystem positioning',
    title: 'Not merely multilingual support — a community ecosystem built around languages themselves.',
    description: 'Chữ Nôm is one of the current focal areas. Glyphora is designed to expand toward more underrepresented languages, dialects, and low-resource writing systems so they can have their own content, conversations, archives, discovery surfaces, and connected language tools.',
    tags: ['Chữ Nôm', 'Underrepresented languages', 'Dialects', 'Low-resource scripts', 'Language communities'],
  };
}

export function localizeProjectDetail(project: Project, language: Language): Project {
  if (language === 'en') return project;

  const localized = project.slug === 'glyphora' ? glyphora[language] : undefined;
  if (!localized) return project;

  return {
    ...project,
    ...localized,
  };
}

export function projectDetailUi(language: Language) {
  if (language === 'zh-CN') {
    return {
      allProjects: '← 所有项目',
      status: '状态',
      coreStack: '核心技术栈',
      source: '源码',
      publicRepository: '公开仓库',
      notPublic: '未公开',
      overview: '01 / 项目概览',
      snapshot: '项目概览',
      verifiedFeatures: '已验证功能',
      architectureNodes: '架构节点',
      technologies: '技术',
      explore: '查看',
      githubRepository: 'GitHub 仓库',
      sourceWalkthrough: '源码 / 代码解释',
      featureSection: '02 / 已验证功能',
      featureHeading: '这个产品实际支持什么。',
      featureSummary: '基于仓库中已验证实现整理出的产品能力，而不是简单的功能清单。',
      architecture: '03 / 架构',
      architectureHeading: '已验证的仓库结构与技术栈。',
      sourceWalkthroughLabel: '源码导览',
      sourceWalkthroughTitle: '从功能一路追踪到仓库中的具体实现。',
      sourceWalkthroughDescription: '直接在作品集中查看项目区域、已验证文件、代码流程与实现说明。',
      exploreSource: '查看源码架构 ↗',
      implementation: '04 / 实现细节',
      projectAreas: '05 / 项目区域',
      projectAreasHeading: '精选产品区域与实现界面。',
      previousProject: '← 上一个项目',
      nextProject: '下一个项目 →',
    };
  }

  if (language === 'zh-TW') {
    return {
      allProjects: '← 所有專案',
      status: '狀態',
      coreStack: '核心技術棧',
      source: '原始碼',
      publicRepository: '公開儲存庫',
      notPublic: '未公開',
      overview: '01 / 專案概覽',
      snapshot: '專案概覽',
      verifiedFeatures: '已驗證功能',
      architectureNodes: '架構節點',
      technologies: '技術',
      explore: '查看',
      githubRepository: 'GitHub 儲存庫',
      sourceWalkthrough: '原始碼 / 程式碼解釋',
      featureSection: '02 / 已驗證功能',
      featureHeading: '這個產品實際支援什麼。',
      featureSummary: '依據儲存庫中已驗證實作整理出的產品能力，而不是單純的功能清單。',
      architecture: '03 / 架構',
      architectureHeading: '已驗證的儲存庫結構與技術棧。',
      sourceWalkthroughLabel: '原始碼導覽',
      sourceWalkthroughTitle: '從功能一路追蹤到儲存庫中的具體實作。',
      sourceWalkthroughDescription: '直接在作品集中查看專案區域、已驗證檔案、程式碼流程與實作說明。',
      exploreSource: '查看原始碼架構 ↗',
      implementation: '04 / 實作細節',
      projectAreas: '05 / 專案區域',
      projectAreasHeading: '精選產品區域與實作介面。',
      previousProject: '← 上一個專案',
      nextProject: '下一個專案 →',
    };
  }

  return {
    allProjects: '← All projects',
    status: 'Status',
    coreStack: 'Core stack',
    source: 'Source',
    publicRepository: 'Public repository',
    notPublic: 'Not public',
    overview: '01 / Overview',
    snapshot: 'Project snapshot',
    verifiedFeatures: 'Verified features',
    architectureNodes: 'Architecture nodes',
    technologies: 'Technologies',
    explore: 'Explore',
    githubRepository: 'GitHub repository',
    sourceWalkthrough: 'Source / Code explanation',
    featureSection: '02 / Verified features',
    featureHeading: 'What the product actually supports.',
    featureSummary: 'Repository-backed capabilities presented as product surfaces, not a plain feature checklist.',
    architecture: '03 / Architecture',
    architectureHeading: 'Verified repository structure and technologies.',
    sourceWalkthroughLabel: 'Source walkthrough',
    sourceWalkthroughTitle: 'Follow the implementation from feature to repository code.',
    sourceWalkthroughDescription: 'Browse project areas, verified files, code flow, and implementation notes without leaving the portfolio.',
    exploreSource: 'Explore source architecture ↗',
    implementation: '04 / Implementation details',
    projectAreas: '05 / Project areas',
    projectAreasHeading: 'Selected product areas and implementation surfaces.',
    previousProject: '← Previous project',
    nextProject: 'Next project →',
  };
}
