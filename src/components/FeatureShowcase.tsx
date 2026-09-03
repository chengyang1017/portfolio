import type { LucideIcon } from 'lucide-react';
import {
  BookOpenText,
  Code2,
  CreditCard,
  Database,
  Heart,
  ImageIcon,
  Keyboard,
  Languages,
  MessageCircleMore,
  Search,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import type { AppLocale } from '../i18n/types';

type FeatureMeta = {
  kind:
    | 'publishing'
    | 'engagement'
    | 'communication'
    | 'collaboration'
    | 'operations'
    | 'commerce'
    | 'payments'
    | 'language'
    | 'input'
    | 'data'
    | 'discovery'
    | 'developer'
    | 'verified';
  icon: LucideIcon;
  tone: 'lime' | 'sky' | 'violet' | 'amber' | 'mint';
};

const vietnameseCopy = {
  verified: 'Đã xác minh',
  publishing: ['Xuất bản', 'Luồng tạo nội dung và đăng phương tiện đã được xác minh trong kho mã.', ['Nội dung', 'Phương tiện']],
  engagement: ['Tương tác', 'Các bề mặt tương tác và khám phá giúp cộng đồng luôn kết nối.', ['Xã hội', 'Khám phá']],
  communication: ['Giao tiếp', 'Luồng trò chuyện cho nhắn tin trực tiếp và hoạt động thời gian thực.', ['Thời gian thực', 'Tin nhắn']],
  collaboration: ['Cộng tác', 'Chỉnh sửa chia sẻ và nội dung có cấu trúc cho nhu cầu cộng tác.', ['Rich text', 'Chia sẻ']],
  operations: ['Vận hành', 'Hồ sơ, khám phá, kiểm duyệt và quản trị quanh sản phẩm cốt lõi.', ['Danh tính', 'Quản trị']],
  commerce: ['Thương mại', 'Luồng phía khách hàng và vận hành xuyên suốt trải nghiệm mua sắm.', ['Thương mại', 'Quy trình']],
  payments: ['Thanh toán', 'Xử lý thanh toán được tích hợp vào luồng giao dịch đầu-cuối.', ['Thanh toán', 'Backend']],
  language: ['Hệ sinh thái ngôn ngữ', 'Không gian dành cho cộng đồng ngôn ngữ, hệ chữ và việc mở rộng tới nhiều ngôn ngữ ít tài nguyên hơn.', ['Ngôn ngữ', 'Cộng đồng']],
  input: ['Nhập liệu', 'Xử lý nhập và tổ hợp ký tự trên thiết bị như một năng lực sản phẩm.', ['Nhập liệu', 'Di động']],
  data: ['Dữ liệu', 'Truy cập, chuyển đổi hoặc xuất dữ liệu có cấu trúc để hỗ trợ hệ thống tính năng.', ['Dữ liệu', 'Pipeline']],
  discovery: ['Khám phá', 'Tìm kiếm và duyệt giúp người dùng di chuyển nhanh trong sản phẩm.', ['Tìm kiếm', 'UX']],
  developer: ['Công cụ lập trình', 'Quy trình phát triển hoặc năng lực hiểu mã được xác minh từ kho mã.', ['Developer', 'Tooling']],
  fallback: ['Năng lực đã xác minh', 'Một năng lực sản phẩm có thể kiểm chứng từ triển khai hiện tại.', ['Đã xác minh', 'Sản phẩm']],
} as const;

const nomCopy = {
  verified: '㐌確認',
  publishing: ['發行', '流造成內容吧登媒介㐌得確認𥪝庫碼。', ['內容', '媒介']],
  engagement: ['相互', '各𩈘相互吧探究𢴇共同常結綏。', ['社會', '探究']],
  communication: ['交接', '流呐𡀯朱信𠴍直接吧活動即時。', ['即時', '信𠴍']],
  collaboration: ['共同作', '役編輯𢺹𢩿吧內容固構築朱需求共同作。', ['Rich text', '𢺹𢩿']],
  operations: ['運行', '糊疏、探究、檢閱吧管理圍產品核心。', ['名性', '管理']],
  commerce: ['商買', '流邊客貨吧運行𨑜𠁀經驗買賣。', ['商買', '流程']],
  payments: ['清算', '處理清算得結合𠓨流交易自頭𦤾尾。', ['清算', 'Backend']],
  language: ['系生態言語', '空間朱共同言語、系𡨸吧役𢲫㢅𦤾𡗉言語少資源欣。', ['言語', '共同']],
  input: ['入料', '處理入吧結合記字𨑗設備如𠬠能力產品。', ['入料', '移動']],
  data: ['數料', '訪入、轉換或出數料固構築抵互助系統職能。', ['數料', 'Pipeline']],
  discovery: ['探究', '役尋劍吧䀡𢴇𠊛用移轉𮞊𥪝產品。', ['尋劍', 'UX']],
  developer: ['工具立程', '流程發展或能力曉碼得確認自庫碼。', ['Developer', 'Tooling']],
  fallback: ['能力㐌確認', '𠬠能力產品固体確認自份寔現現在。', ['㐌確認', '產品']],
} as const;

const copy = {
  en: {
    verified: 'Verified',
    publishing: ['Publishing', 'Content creation and media publishing flows verified in the repository.', ['Content', 'Media']],
    engagement: ['Engagement', 'Interaction and discovery surfaces that keep the product socially connected.', ['Social', 'Discovery']],
    communication: ['Communication', 'Conversation flows for direct communication and real-time activity.', ['Realtime', 'Messaging']],
    collaboration: ['Collaboration', 'Shared editing and structured content designed for collaborative use.', ['Rich text', 'Shared']],
    operations: ['Operations', 'Identity, discovery, moderation, and administration surfaces around the core product.', ['Identity', 'Admin']],
    commerce: ['Commerce', 'Customer and operational flows that move data through the commerce experience.', ['Commerce', 'Workflow']],
    payments: ['Payments', 'Payment handling integrated into the project’s end-to-end transaction flow.', ['Payments', 'Backend']],
    language: ['Language ecosystem', 'Language-aware spaces designed for communities, scripts, and future support for underrepresented languages.', ['Languages', 'Community']],
    input: ['Input', 'On-device input and composition behaviour implemented as a product capability.', ['Input', 'Mobile']],
    data: ['Data', 'Structured data access, transformation, or export supporting the feature set.', ['Data', 'Pipeline']],
    discovery: ['Discovery', 'Search and browsing flows that help users move through the product quickly.', ['Search', 'UX']],
    developer: ['Developer tooling', 'Repository-backed developer workflow or code intelligence capability.', ['Developer', 'Tooling']],
    fallback: ['Verified capability', 'A repository-backed product capability represented in the current implementation.', ['Verified', 'Product']],
  },
  'zh-CN': {
    verified: '已验证',
    publishing: ['内容发布', '仓库中已验证的内容创建与媒体发布流程。', ['内容', '媒体']],
    engagement: ['互动', '让产品保持社交连接的互动与发现能力。', ['社交', '发现']],
    communication: ['沟通', '用于私聊与实时活动的会话流程。', ['实时', '消息']],
    collaboration: ['协作', '面向多人协作的共享编辑与结构化内容能力。', ['富文本', '共享']],
    operations: ['运营与管理', '围绕核心产品的身份、发现、审核与管理能力。', ['身份', '管理']],
    commerce: ['电商', '贯穿购物体验的用户端与运营端流程。', ['电商', '流程']],
    payments: ['支付', '集成在端到端交易流程中的支付处理能力。', ['支付', '后端']],
    language: ['语言生态', '围绕语言社区、文字系统与未来更多小语种支持设计的产品空间。', ['小语种', '社区']],
    input: ['输入', '作为产品能力实现的端侧输入与组合处理。', ['输入', '移动端']],
    data: ['数据', '支撑功能体系的数据访问、转换与导出能力。', ['数据', '管线']],
    discovery: ['发现', '帮助用户快速浏览与检索产品内容的能力。', ['搜索', '体验']],
    developer: ['开发者工具', '基于仓库实现的开发工作流或代码智能能力。', ['开发', '工具']],
    fallback: ['已验证能力', '当前实现中可从仓库验证的产品能力。', ['已验证', '产品']],
  },
  'zh-TW': {
    verified: '已驗證',
    publishing: ['內容發布', '儲存庫中已驗證的內容建立與媒體發布流程。', ['內容', '媒體']],
    engagement: ['互動', '讓產品保持社交連結的互動與探索能力。', ['社交', '探索']],
    communication: ['溝通', '用於私訊與即時活動的對話流程。', ['即時', '訊息']],
    collaboration: ['協作', '面向多人協作的共享編輯與結構化內容能力。', ['富文字', '共享']],
    operations: ['營運與管理', '圍繞核心產品的身分、探索、審核與管理能力。', ['身分', '管理']],
    commerce: ['電商', '貫穿購物體驗的使用者端與營運端流程。', ['電商', '流程']],
    payments: ['付款', '整合在端到端交易流程中的付款處理能力。', ['付款', '後端']],
    language: ['語言生態', '圍繞語言社群、文字系統與未來更多小語種支援設計的產品空間。', ['小語種', '社群']],
    input: ['輸入', '作為產品能力實作的裝置端輸入與組字處理。', ['輸入', '行動端']],
    data: ['資料', '支撐功能體系的資料存取、轉換與匯出能力。', ['資料', '管線']],
    discovery: ['探索', '幫助使用者快速瀏覽與搜尋產品內容的能力。', ['搜尋', '體驗']],
    developer: ['開發者工具', '基於儲存庫實作的開發工作流程或程式碼智慧能力。', ['開發', '工具']],
    fallback: ['已驗證能力', '目前實作中可從儲存庫驗證的產品能力。', ['已驗證', '產品']],
  },
  'vi-Latn': vietnameseCopy,
  'vi-Hani': nomCopy,
} as const;

function resolveFeatureMeta(feature: string): FeatureMeta {
  const value = feature.toLowerCase();

  if (/text|image|post|publish|media/.test(value)) return { kind: 'publishing', icon: ImageIcon, tone: 'sky' };
  if (/like|comment|feed|categor|engagement/.test(value)) return { kind: 'engagement', icon: Heart, tone: 'lime' };
  if (/friend|message|chat|conversation|real-time|realtime/.test(value)) return { kind: 'communication', icon: MessageCircleMore, tone: 'violet' };
  if (/note|rich-text|collaborat|editor/.test(value)) return { kind: 'collaboration', icon: BookOpenText, tone: 'amber' };
  if (/profile|admin|moderation|discover|identity/.test(value)) return { kind: 'operations', icon: UsersRound, tone: 'mint' };
  if (/cart|checkout|order|product|catalog|inventory|commerce/.test(value)) return { kind: 'commerce', icon: ShoppingBag, tone: 'amber' };
  if (/stripe|payment/.test(value)) return { kind: 'payments', icon: CreditCard, tone: 'violet' };
  if (/language|locali[sz]|translation|multilingual|nom|nôm/.test(value)) return { kind: 'language', icon: Languages, tone: 'lime' };
  if (/keyboard|input|telex|composition/.test(value)) return { kind: 'input', icon: Keyboard, tone: 'sky' };
  if (/sqlite|database|data|export|csv|json|excel/.test(value)) return { kind: 'data', icon: Database, tone: 'mint' };
  if (/search|discovery|browse/.test(value)) return { kind: 'discovery', icon: Search, tone: 'sky' };
  if (/code|dart|definition|reference|hierarchy|test|cli|package/.test(value)) return { kind: 'developer', icon: Code2, tone: 'violet' };

  return { kind: 'verified', icon: Sparkles, tone: 'lime' };
}

export function FeatureShowcase({
  features,
  displayFeatures = features,
  language = 'en',
}: {
  features: string[];
  displayFeatures?: string[];
  language?: AppLocale;
}) {
  const dictionary = copy[language];

  return (
    <div className="feature-showcase">
      {features.map((feature, index) => {
        const meta = resolveFeatureMeta(feature);
        const Icon = meta.icon;
        const localizedMeta = meta.kind === 'verified' ? dictionary.fallback : dictionary[meta.kind];
        const [label, description, tags] = localizedMeta;
        const displayFeature = displayFeatures[index] ?? feature;

        return (
          <article
            className={`feature-card ${index === 0 ? 'feature-card-featured' : ''}`}
            data-tone={meta.tone}
            key={feature}
          >
            <div className="feature-card-topline">
              <span className="feature-card-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="feature-card-status">{dictionary.verified}</span>
            </div>

            <div className="feature-card-icon" aria-hidden="true">
              <Icon size={28} strokeWidth={1.65} />
            </div>

            <div className="feature-card-copy">
              <span className="feature-card-label">{label}</span>
              <h3>{displayFeature}</h3>
              <p>{description}</p>
            </div>

            <div className="feature-card-tags" aria-label={`${displayFeature} capability tags`}>
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
