import type { AppLocale } from '../i18n/types';

export interface AdminUiCopy {
  adminAccessTitle: string;
  adminAccessDescription: string;
  adminPassword: string;
  enterAdminPassword: string;
  checkingAccess: string;
  unlockAdmin: string;
  checkingAdminAccess: string;
  restoringAdminSession: string;
  unableVerifyAdmin: string;
  unableRestoreSession: string;
  adminTitle: string;
  adminDescription: string;
  projects: string;
  technologies: string;
  githubConnected: string;
  aiConnected: string;
  analyzerMode: string;
  lockAdmin: string;
  translationCenter: string;
  repositoryAssistant: string;
  repositoryDraft: string;
  repositoryAssistantDescription: string;
  analyzing: string;
  analyzeRepository: string;
  applyToSelectedProject: string;
  addAsNewProject: string;
  projectContent: string;
  addProject: string;
  resetDrafts: string;
  deleteSelected: string;
  projectList: string;
  title: string;
  shortTitle: string;
  slug: string;
  projectNumber: string;
  category: string;
  status: string;
  tone: string;
  mockup: string;
  githubUrl: string;
  summary: string;
  overview: string;
  technologiesHint: string;
  featuresHint: string;
  challengesHint: string;
  architectureHint: string;
  galleryHint: string;
  noProjectSelected: string;
  languagesTools: string;
  technologyDescription: string;
  clientLanguages: string;
  backendData: string;
  platformsTools: string;
  add: string;
  technologyName: string;
  brandColor: string;
  logoUrl: string;
  remove: string;
  writeChanges: string;
  publishDescription: string;
  verifiedRepository: string;
  branch: string;
  publishing: string;
  publishToGitHub: string;
  newTechnology: string;
  newProject: string;
  inDevelopment: string;
  resetComplete: string;
  repositoryAnalysisFailed: string;
  publishingPortfolio: string;
  published: string;
  publishingFailed: string;
  translationAccessTitle: string;
  translationAccessDescription: string;
  unlockTranslations: string;
  backToAdmin: string;
  projectTranslator: string;
  translatorDescription: string;
  mainAdmin: string;
  lock: string;
  project: string;
  translationCoverage: string;
  translatingAll: string;
  aiTranslateAll: string;
  englishSource: string;
  sourcePreservationNote: string;
  translationLanguage: string;
  ready: string;
  empty: string;
  notGenerated: string;
  runAiTranslate: string;
  allProjectCopy: string;
  featuresOnePerLine: string;
  challenges: string;
  architecture: string;
  gallery: string;
  githubPublish: string;
  translationPublishDescription: string;
  publishTranslations: string;
  translatingMessage: string;
  translationComplete: string;
  translationFailed: string;
  publishingTranslations: string;
  publishedTranslations: string;
}

const en: AdminUiCopy = {
  adminAccessTitle: 'Admin access',
  adminAccessDescription: 'Sign in with your portfolio admin password. GitHub write credentials stay on the Cloudflare Worker and are never sent to or stored by this browser. A secure session cookie keeps you signed in until you choose Lock admin or the session expires.',
  adminPassword: 'Admin password',
  enterAdminPassword: 'Enter admin password',
  checkingAccess: 'Checking access…',
  unlockAdmin: 'Unlock admin',
  checkingAdminAccess: 'Checking admin access…',
  restoringAdminSession: 'Restoring admin session…',
  unableVerifyAdmin: 'Unable to verify admin access.',
  unableRestoreSession: 'Unable to restore admin session.',
  adminTitle: 'Admin',
  adminDescription: 'Manage projects, programming languages, frameworks, and tools. Publishing writes the edited source data back to GitHub.',
  projects: 'PROJECTS',
  technologies: 'TECHNOLOGIES',
  githubConnected: 'GITHUB CONNECTED',
  aiConnected: 'AI ENDPOINT CONNECTED',
  analyzerMode: 'REPO ANALYZER MODE',
  lockAdmin: 'Lock admin',
  translationCenter: 'AI translations',
  repositoryAssistant: 'REPOSITORY ASSISTANT',
  repositoryDraft: 'GitHub → portfolio draft',
  repositoryAssistantDescription: 'Paste a repository URL. The assistant reads repository metadata, languages, root files, and package dependencies. If the AI endpoint is configured, the same evidence is also used for richer copy and feature suggestions.',
  analyzing: 'Analyzing…',
  analyzeRepository: 'Analyze repository',
  applyToSelectedProject: 'Apply to selected project',
  addAsNewProject: 'Add as new project',
  projectContent: 'Project content',
  addProject: 'Add project',
  resetDrafts: 'Reset drafts',
  deleteSelected: 'Delete selected',
  projectList: 'Projects',
  title: 'Title',
  shortTitle: 'Short title',
  slug: 'Slug',
  projectNumber: 'Project number',
  category: 'Category',
  status: 'Status',
  tone: 'Tone',
  mockup: 'Mockup',
  githubUrl: 'GitHub URL',
  summary: 'Summary',
  overview: 'Overview',
  technologiesHint: 'Technologies · comma or new line separated',
  featuresHint: 'Features · one per line',
  challengesHint: 'Challenges · title | description',
  architectureHint: 'Architecture · label | detail',
  galleryHint: 'Gallery · title | caption',
  noProjectSelected: 'No project selected.',
  languagesTools: 'Languages & tools',
  technologyDescription: 'This catalog powers the Technology section on the home page. Repository detection places known technologies into the right group and uses their established brand colors.',
  clientLanguages: 'Client / Languages',
  backendData: 'Backend / Data',
  platformsTools: 'Platforms / Tools',
  add: 'Add',
  technologyName: 'Technology name',
  brandColor: 'Brand color',
  logoUrl: 'Logo URL',
  remove: 'Remove',
  writeChanges: 'Write changes to GitHub',
  publishDescription: 'Publishing updates the portfolio project and technology data on the selected branch through the authenticated Cloudflare Worker.',
  verifiedRepository: 'Verified repository',
  branch: 'Branch',
  publishing: 'Publishing…',
  publishToGitHub: 'Publish to GitHub',
  newTechnology: 'New technology',
  newProject: 'New project',
  inDevelopment: 'In Development',
  resetComplete: 'Drafts reset to the version loaded with this deployment.',
  repositoryAnalysisFailed: 'Repository analysis failed.',
  publishingPortfolio: 'Publishing project and technology data to GitHub…',
  published: 'Published.',
  publishingFailed: 'Publishing failed.',
  translationAccessTitle: 'Translation access',
  translationAccessDescription: 'Use the same portfolio admin password as the main dashboard. GitHub credentials remain on the Cloudflare Worker; this browser receives only a secure admin session cookie.',
  unlockTranslations: 'Unlock translations',
  backToAdmin: 'Back to admin',
  projectTranslator: 'Project translator',
  translatorDescription: 'Translate one project’s complete portfolio copy into Simplified Chinese, Traditional Chinese, Vietnamese, and Chữ Nôm in one AI run.',
  mainAdmin: 'Main admin',
  lock: 'Lock',
  project: 'Project',
  translationCoverage: 'Translation coverage',
  translatingAll: 'Translating all languages…',
  aiTranslateAll: 'AI translate all 4 languages',
  englishSource: 'English source',
  sourcePreservationNote: 'Technologies, URLs, slugs, code identifiers, and brand names are kept as source data rather than translated.',
  translationLanguage: 'Translation language',
  ready: 'READY',
  empty: 'EMPTY',
  notGenerated: 'has not been generated yet.',
  runAiTranslate: 'Run “AI translate all 4 languages” to create the complete translation set.',
  allProjectCopy: 'ALL PROJECT COPY',
  featuresOnePerLine: 'Features · one per line',
  challenges: 'Challenges',
  architecture: 'Architecture',
  gallery: 'Gallery',
  githubPublish: 'GitHub publish',
  translationPublishDescription: 'Writes the reviewed translation catalog to GitHub. The normal Cloudflare deployment then publishes it.',
  publishTranslations: 'Publish translations',
  translatingMessage: 'Translating every project field into all four locales…',
  translationComplete: 'AI translation complete. Review each language before publishing.',
  translationFailed: 'AI translation failed.',
  publishingTranslations: 'Publishing multilingual project content to GitHub…',
  publishedTranslations: 'Published project translations.',
};

const zhCN: AdminUiCopy = {
  ...en,
  adminAccessTitle: '管理员登录',
  adminAccessDescription: '使用作品集管理员密码登录。GitHub 写入凭证只保存在 Cloudflare Worker，不会发送到浏览器或存储在浏览器中。安全会话会保持登录状态，直到你点击“锁定后台”或会话过期。',
  adminPassword: '管理员密码',
  enterAdminPassword: '输入管理员密码',
  checkingAccess: '正在验证…',
  unlockAdmin: '进入后台',
  checkingAdminAccess: '正在验证管理员权限…',
  restoringAdminSession: '正在恢复管理员会话…',
  unableVerifyAdmin: '无法验证管理员权限。',
  unableRestoreSession: '无法恢复管理员会话。',
  adminTitle: '管理员后台',
  adminDescription: '管理项目、编程语言、框架和工具。发布后会把编辑后的数据写回 GitHub。',
  projects: '项目',
  technologies: '技术',
  githubConnected: 'GitHub 已连接',
  aiConnected: 'AI 接口已连接',
  analyzerMode: '仓库分析模式',
  lockAdmin: '锁定后台',
  translationCenter: 'AI 多语言翻译',
  repositoryAssistant: '仓库助手',
  repositoryDraft: 'GitHub → 作品集草稿',
  repositoryAssistantDescription: '粘贴 GitHub 仓库网址。助手会读取仓库信息、编程语言、根目录文件和依赖；若 AI 接口可用，还会基于这些证据生成更完整的项目介绍与功能建议。',
  analyzing: '正在分析…',
  analyzeRepository: '分析仓库',
  applyToSelectedProject: '应用到当前项目',
  addAsNewProject: '新增为项目',
  projectContent: '项目内容',
  addProject: '新增项目',
  resetDrafts: '重置草稿',
  deleteSelected: '删除当前项目',
  projectList: '项目列表',
  title: '标题',
  shortTitle: '短标题',
  slug: 'Slug',
  projectNumber: '项目编号',
  category: '分类',
  status: '状态',
  tone: '主题色',
  mockup: '展示模型',
  githubUrl: 'GitHub 地址',
  summary: '摘要',
  overview: '项目概览',
  technologiesHint: '技术栈 · 用逗号或换行分隔',
  featuresHint: '功能 · 每行一个',
  challengesHint: '挑战 · 标题 | 描述',
  architectureHint: '架构 · 标签 | 详情',
  galleryHint: '图库 · 标题 | 说明',
  noProjectSelected: '未选择项目。',
  languagesTools: '编程语言与工具',
  technologyDescription: '这里的技术目录会驱动首页 Technology 区域。仓库检测会把已知技术放到正确分组，并使用对应的品牌色。',
  clientLanguages: '客户端 / 编程语言',
  backendData: '后端 / 数据',
  platformsTools: '平台 / 工具',
  add: '新增',
  technologyName: '技术名称',
  brandColor: '品牌色',
  logoUrl: 'Logo 地址',
  remove: '删除',
  writeChanges: '写入 GitHub',
  publishDescription: '通过已登录的 Cloudflare Worker，把项目与技术数据写入所选 GitHub 分支。',
  verifiedRepository: '已验证仓库',
  branch: '分支',
  publishing: '正在发布…',
  publishToGitHub: '发布到 GitHub',
  newTechnology: '新技术',
  newProject: '新项目',
  inDevelopment: '开发中',
  resetComplete: '草稿已重置为当前部署版本。',
  repositoryAnalysisFailed: '仓库分析失败。',
  publishingPortfolio: '正在把项目和技术数据发布到 GitHub…',
  published: '已发布。',
  publishingFailed: '发布失败。',
  translationAccessTitle: '翻译后台登录',
  translationAccessDescription: '使用与主后台相同的管理员密码。GitHub 凭证只保存在 Cloudflare Worker，浏览器只接收安全的管理员会话 Cookie。',
  unlockTranslations: '进入翻译后台',
  backToAdmin: '返回管理员后台',
  projectTranslator: '项目多语言翻译',
  translatorDescription: '一次 AI 任务把一个项目的完整作品集内容翻译成简体中文、繁體中文、越南语和喃字。',
  mainAdmin: '主后台',
  lock: '锁定',
  project: '项目',
  translationCoverage: '翻译完成度',
  translatingAll: '正在翻译全部语言…',
  aiTranslateAll: 'AI 一键翻译 4 种语言',
  englishSource: '英文原文',
  sourcePreservationNote: '技术名、URL、slug、代码标识符和品牌名会保留原始写法，不会被错误翻译。',
  translationLanguage: '翻译语言',
  ready: '已完成',
  empty: '未生成',
  notGenerated: '尚未生成。',
  runAiTranslate: '点击“AI 一键翻译 4 种语言”生成完整翻译。',
  allProjectCopy: '全部项目文案',
  featuresOnePerLine: '功能 · 每行一个',
  challenges: '挑战',
  architecture: '架构',
  gallery: '图库',
  githubPublish: 'GitHub 发布',
  translationPublishDescription: '把审核后的多语言翻译目录写回 GitHub，随后由 Cloudflare 正常部署上线。',
  publishTranslations: '发布翻译',
  translatingMessage: '正在把项目全部字段翻译成 4 种语言…',
  translationComplete: 'AI 翻译完成，请逐个语言检查后再发布。',
  translationFailed: 'AI 翻译失败。',
  publishingTranslations: '正在把多语言项目内容发布到 GitHub…',
  publishedTranslations: '项目翻译已发布。',
};

const zhTW: AdminUiCopy = {
  ...zhCN,
  adminAccessTitle: '管理員登入',
  adminAccessDescription: '使用作品集管理員密碼登入。GitHub 寫入憑證只保存在 Cloudflare Worker，不會傳送到瀏覽器或儲存在瀏覽器中。安全工作階段會保持登入狀態，直到你按下「鎖定後台」或工作階段過期。',
  adminPassword: '管理員密碼',
  enterAdminPassword: '輸入管理員密碼',
  checkingAccess: '正在驗證…',
  unlockAdmin: '進入後台',
  checkingAdminAccess: '正在驗證管理員權限…',
  restoringAdminSession: '正在恢復管理員工作階段…',
  unableVerifyAdmin: '無法驗證管理員權限。',
  unableRestoreSession: '無法恢復管理員工作階段。',
  adminTitle: '管理員後台',
  adminDescription: '管理專案、程式語言、框架與工具。發佈後會把編輯後的資料寫回 GitHub。',
  projects: '專案',
  technologies: '技術',
  githubConnected: 'GitHub 已連線',
  aiConnected: 'AI 介面已連線',
  analyzerMode: '儲存庫分析模式',
  lockAdmin: '鎖定後台',
  translationCenter: 'AI 多語言翻譯',
  repositoryAssistant: '儲存庫助手',
  repositoryDraft: 'GitHub → 作品集草稿',
  repositoryAssistantDescription: '貼上 GitHub 儲存庫網址。助手會讀取儲存庫資訊、程式語言、根目錄檔案與相依套件；若 AI 介面可用，還會依據這些證據產生更完整的專案介紹與功能建議。',
  analyzing: '正在分析…',
  analyzeRepository: '分析儲存庫',
  applyToSelectedProject: '套用到目前專案',
  addAsNewProject: '新增為專案',
  projectContent: '專案內容',
  addProject: '新增專案',
  resetDrafts: '重設草稿',
  deleteSelected: '刪除目前專案',
  projectList: '專案列表',
  title: '標題',
  shortTitle: '短標題',
  projectNumber: '專案編號',
  category: '分類',
  status: '狀態',
  tone: '主題色',
  mockup: '展示模型',
  githubUrl: 'GitHub 網址',
  summary: '摘要',
  overview: '專案概覽',
  technologiesHint: '技術棧 · 用逗號或換行分隔',
  featuresHint: '功能 · 每行一個',
  challengesHint: '挑戰 · 標題 | 描述',
  architectureHint: '架構 · 標籤 | 詳情',
  galleryHint: '圖庫 · 標題 | 說明',
  noProjectSelected: '未選擇專案。',
  languagesTools: '程式語言與工具',
  technologyDescription: '這裡的技術目錄會驅動首頁 Technology 區域。儲存庫偵測會把已知技術放到正確分組，並使用對應的品牌色。',
  clientLanguages: '客戶端 / 程式語言',
  backendData: '後端 / 資料',
  platformsTools: '平台 / 工具',
  add: '新增',
  technologyName: '技術名稱',
  brandColor: '品牌色',
  logoUrl: 'Logo 網址',
  remove: '刪除',
  writeChanges: '寫入 GitHub',
  publishDescription: '透過已登入的 Cloudflare Worker，把專案與技術資料寫入所選 GitHub 分支。',
  verifiedRepository: '已驗證儲存庫',
  branch: '分支',
  publishing: '正在發佈…',
  publishToGitHub: '發佈到 GitHub',
  newTechnology: '新技術',
  newProject: '新專案',
  inDevelopment: '開發中',
  resetComplete: '草稿已重設為目前部署版本。',
  repositoryAnalysisFailed: '儲存庫分析失敗。',
  publishingPortfolio: '正在把專案與技術資料發佈到 GitHub…',
  published: '已發佈。',
  publishingFailed: '發佈失敗。',
  translationAccessTitle: '翻譯後台登入',
  translationAccessDescription: '使用與主後台相同的管理員密碼。GitHub 憑證只保存在 Cloudflare Worker，瀏覽器只接收安全的管理員工作階段 Cookie。',
  unlockTranslations: '進入翻譯後台',
  backToAdmin: '返回管理員後台',
  projectTranslator: '專案多語言翻譯',
  translatorDescription: '一次 AI 任務把一個專案的完整作品集內容翻譯成簡體中文、繁體中文、越南語和喃字。',
  mainAdmin: '主後台',
  lock: '鎖定',
  project: '專案',
  translationCoverage: '翻譯完成度',
  translatingAll: '正在翻譯全部語言…',
  aiTranslateAll: 'AI 一鍵翻譯 4 種語言',
  englishSource: '英文原文',
  sourcePreservationNote: '技術名、URL、slug、程式碼識別字與品牌名會保留原始寫法，不會被錯誤翻譯。',
  translationLanguage: '翻譯語言',
  ready: '已完成',
  empty: '未產生',
  notGenerated: '尚未產生。',
  runAiTranslate: '按下「AI 一鍵翻譯 4 種語言」產生完整翻譯。',
  allProjectCopy: '全部專案文案',
  featuresOnePerLine: '功能 · 每行一個',
  challenges: '挑戰',
  architecture: '架構',
  gallery: '圖庫',
  githubPublish: 'GitHub 發佈',
  translationPublishDescription: '把審核後的多語言翻譯目錄寫回 GitHub，隨後由 Cloudflare 正常部署上線。',
  publishTranslations: '發佈翻譯',
  translatingMessage: '正在把專案全部欄位翻譯成 4 種語言…',
  translationComplete: 'AI 翻譯完成，請逐個語言檢查後再發佈。',
  translationFailed: 'AI 翻譯失敗。',
  publishingTranslations: '正在把多語言專案內容發佈到 GitHub…',
  publishedTranslations: '專案翻譯已發佈。',
};

const viLatn: AdminUiCopy = {
  ...en,
  adminAccessTitle: 'Đăng nhập quản trị',
  adminAccessDescription: 'Đăng nhập bằng mật khẩu quản trị portfolio. Thông tin ghi GitHub chỉ nằm trên Cloudflare Worker, không được gửi hoặc lưu trong trình duyệt. Phiên đăng nhập an toàn được giữ cho đến khi bạn khóa trang quản trị hoặc phiên hết hạn.',
  adminPassword: 'Mật khẩu quản trị',
  enterAdminPassword: 'Nhập mật khẩu quản trị',
  checkingAccess: 'Đang kiểm tra…',
  unlockAdmin: 'Mở trang quản trị',
  checkingAdminAccess: 'Đang kiểm tra quyền quản trị…',
  restoringAdminSession: 'Đang khôi phục phiên quản trị…',
  unableVerifyAdmin: 'Không thể xác minh quyền quản trị.',
  unableRestoreSession: 'Không thể khôi phục phiên quản trị.',
  adminTitle: 'Quản trị',
  adminDescription: 'Quản lý dự án, ngôn ngữ lập trình, framework và công cụ. Khi xuất bản, dữ liệu đã chỉnh sửa sẽ được ghi lại lên GitHub.',
  projects: 'DỰ ÁN',
  technologies: 'CÔNG NGHỆ',
  githubConnected: 'GITHUB ĐÃ KẾT NỐI',
  aiConnected: 'AI ĐÃ KẾT NỐI',
  analyzerMode: 'CHẾ ĐỘ PHÂN TÍCH REPO',
  lockAdmin: 'Khóa quản trị',
  translationCenter: 'AI dịch đa ngôn ngữ',
  repositoryAssistant: 'TRỢ LÝ KHO MÃ',
  repositoryDraft: 'GitHub → bản nháp portfolio',
  repositoryAssistantDescription: 'Dán URL kho GitHub. Trợ lý đọc metadata, ngôn ngữ, tệp gốc và dependencies; khi AI khả dụng, các bằng chứng này cũng được dùng để tạo mô tả và gợi ý tính năng đầy đủ hơn.',
  analyzing: 'Đang phân tích…',
  analyzeRepository: 'Phân tích kho mã',
  applyToSelectedProject: 'Áp dụng cho dự án đang chọn',
  addAsNewProject: 'Thêm thành dự án mới',
  projectContent: 'Nội dung dự án',
  addProject: 'Thêm dự án',
  resetDrafts: 'Đặt lại bản nháp',
  deleteSelected: 'Xóa dự án đang chọn',
  projectList: 'Danh sách dự án',
  title: 'Tiêu đề',
  shortTitle: 'Tiêu đề ngắn',
  projectNumber: 'Số dự án',
  category: 'Danh mục',
  status: 'Trạng thái',
  tone: 'Tông màu',
  mockup: 'Mockup',
  githubUrl: 'URL GitHub',
  summary: 'Tóm tắt',
  overview: 'Tổng quan',
  technologiesHint: 'Công nghệ · phân cách bằng dấu phẩy hoặc xuống dòng',
  featuresHint: 'Tính năng · mỗi dòng một mục',
  challengesHint: 'Thách thức · tiêu đề | mô tả',
  architectureHint: 'Kiến trúc · nhãn | chi tiết',
  galleryHint: 'Bộ sưu tập · tiêu đề | chú thích',
  noProjectSelected: 'Chưa chọn dự án.',
  languagesTools: 'Ngôn ngữ & công cụ',
  technologyDescription: 'Danh mục này điều khiển phần Technology trên trang chủ. Hệ thống nhận diện kho mã sẽ đưa công nghệ đã biết vào đúng nhóm và dùng màu thương hiệu tương ứng.',
  clientLanguages: 'Client / Ngôn ngữ',
  backendData: 'Backend / Dữ liệu',
  platformsTools: 'Nền tảng / Công cụ',
  add: 'Thêm',
  technologyName: 'Tên công nghệ',
  brandColor: 'Màu thương hiệu',
  logoUrl: 'URL logo',
  remove: 'Xóa',
  writeChanges: 'Ghi thay đổi lên GitHub',
  publishDescription: 'Thông qua Cloudflare Worker đã xác thực để ghi dữ liệu dự án và công nghệ lên nhánh GitHub đã chọn.',
  verifiedRepository: 'Kho mã đã xác minh',
  branch: 'Nhánh',
  publishing: 'Đang xuất bản…',
  publishToGitHub: 'Xuất bản lên GitHub',
  newTechnology: 'Công nghệ mới',
  newProject: 'Dự án mới',
  inDevelopment: 'Đang phát triển',
  resetComplete: 'Đã đặt lại bản nháp theo phiên bản triển khai hiện tại.',
  repositoryAnalysisFailed: 'Phân tích kho mã thất bại.',
  publishingPortfolio: 'Đang xuất bản dữ liệu dự án và công nghệ lên GitHub…',
  published: 'Đã xuất bản.',
  publishingFailed: 'Xuất bản thất bại.',
  translationAccessTitle: 'Đăng nhập trang dịch',
  translationAccessDescription: 'Dùng cùng mật khẩu quản trị với trang chính. Thông tin GitHub chỉ nằm trên Cloudflare Worker; trình duyệt chỉ nhận cookie phiên quản trị an toàn.',
  unlockTranslations: 'Mở trang dịch',
  backToAdmin: 'Quay lại quản trị',
  projectTranslator: 'Dịch dự án',
  translatorDescription: 'Dịch toàn bộ nội dung portfolio của một dự án sang tiếng Trung giản thể, tiếng Trung phồn thể, tiếng Việt và Chữ Nôm trong một lần chạy AI.',
  mainAdmin: 'Quản trị chính',
  lock: 'Khóa',
  project: 'Dự án',
  translationCoverage: 'Mức độ hoàn thành',
  translatingAll: 'Đang dịch tất cả ngôn ngữ…',
  aiTranslateAll: 'AI dịch cả 4 ngôn ngữ',
  englishSource: 'Nguồn tiếng Anh',
  sourcePreservationNote: 'Tên công nghệ, URL, slug, định danh mã và tên thương hiệu được giữ nguyên thay vì dịch.',
  translationLanguage: 'Ngôn ngữ dịch',
  ready: 'SẴN SÀNG',
  empty: 'CHƯA CÓ',
  notGenerated: 'chưa được tạo.',
  runAiTranslate: 'Chạy “AI dịch cả 4 ngôn ngữ” để tạo bộ bản dịch đầy đủ.',
  allProjectCopy: 'TOÀN BỘ NỘI DUNG DỰ ÁN',
  featuresOnePerLine: 'Tính năng · mỗi dòng một mục',
  challenges: 'Thách thức',
  architecture: 'Kiến trúc',
  gallery: 'Bộ sưu tập',
  githubPublish: 'Xuất bản GitHub',
  translationPublishDescription: 'Ghi bộ bản dịch đã duyệt lên GitHub, sau đó quy trình Cloudflare bình thường sẽ triển khai nội dung.',
  publishTranslations: 'Xuất bản bản dịch',
  translatingMessage: 'Đang dịch toàn bộ trường của dự án sang 4 ngôn ngữ…',
  translationComplete: 'AI đã dịch xong. Hãy kiểm tra từng ngôn ngữ trước khi xuất bản.',
  translationFailed: 'AI dịch thất bại.',
  publishingTranslations: 'Đang xuất bản nội dung đa ngôn ngữ lên GitHub…',
  publishedTranslations: 'Đã xuất bản bản dịch dự án.',
};

export function getAdminUiCopy(locale: AppLocale): AdminUiCopy {
  if (locale === 'zh-CN') return zhCN;
  if (locale === 'zh-TW') return zhTW;
  if (locale === 'vi-Latn' || locale === 'vi-Hani') return viLatn;
  return en;
}
