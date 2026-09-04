import type { AppLocale } from './types';

type AboutArea = {
  title: string;
  description: string;
  meta: string;
};

export type AboutCopy = {
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    facts: Array<{
      label: string;
      value: string;
    }>;
  };

  source: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
    quote: string;

    repository: {
      label: string;
      value: string;
    };

    implementation: {
      label: string;
      value: string;
    };

    readme: {
      label: string;
      value: string;
    };
  };

  areas: {
    eyebrow: string;
    title: string;
    description: string;
    items: AboutArea[];
  };

  cta: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
  };
};

const copy: Record<AppLocale, AboutCopy> = {
  en: {
    hero: {
      eyebrow: 'About',
      titleLead: 'Software work,',
      titleAccent: 'documented from the source.',
      description:
        'This portfolio belongs to Lim Cheng Yang and tracks software work across language infrastructure, mobile products, developer tools, commerce, and backend systems.',
      facts: [
        {
          label: 'Owner',
          value: 'Lim Cheng Yang',
        },
        {
          label: 'Evidence',
          value: 'Source code + README',
        },
        {
          label: 'Direction',
          value: 'Language · Product · Tooling',
        },
      ],
    },

    source: {
      eyebrow: 'Source of truth',
      title: 'Every claim should point back to implementation.',
      description:
        'Project descriptions, technology stacks, features, and implementation details are based on the source code and README material associated with each project.',
      note:
        'The Language Platform is shown separately as an in-development project using ASP.NET Core, Entity Framework Core, and PostgreSQL. Where no public repository or demo exists, that limitation is stated explicitly.',
      quote:
        'The work shown here is grounded in implementation that can be inspected.',

      repository: {
        label: 'Public repositories',
        value: 'Linked project by project',
      },

      implementation: {
        label: 'Implementation',
        value: 'Features verified from code',
      },

      readme: {
        label: 'Project context',
        value: 'README and repository documentation',
      },
    },

    areas: {
      eyebrow: 'Verified project areas',
      title: 'Four areas, one engineering practice.',
      description:
        'The projects span language infrastructure and ordinary product engineering rather than one single application category.',

      items: [
        {
          title: 'Language tools',
          description:
            'Dictionaries, morphology engines, language metadata, writing systems, and Chữ Nôm input infrastructure.',
          meta: 'DICTIONARY · MORPHOLOGY · NÔM',
        },
        {
          title: 'Mobile software',
          description:
            'Flutter applications and native Android work, including a Kotlin input method.',
          meta: 'FLUTTER · DART · KOTLIN',
        },
        {
          title: 'Developer tools',
          description:
            'Code-learning environments, Electron tooling, Monaco-based editors, and reusable Flutter packages.',
          meta: 'ELECTRON · MONACO · FLUTTER',
        },
        {
          title: 'Backend systems',
          description:
            'APIs, databases, commerce systems, authentication, payments, and service-side infrastructure.',
          meta: 'NODE · .NET · POSTGRESQL',
        },
      ],
    },

    cta: {
      eyebrow: 'Source first',
      title: 'See the repositories behind the portfolio.',
      description:
        'The portfolio explains the work. The repositories show how it is actually built.',
      action: 'Open GitHub profile',
    },
  },

  'zh-CN': {
    hero: {
      eyebrow: '关于',
      titleLead: '软件作品，',
      titleAccent: '以源码为证。',
      description:
        '这个作品集属于 Lim Cheng Yang，项目覆盖语言基础设施、移动产品、开发者工具、电商与后端系统。',
      facts: [
        {
          label: '所有者',
          value: 'Lim Cheng Yang',
        },
        {
          label: '验证依据',
          value: '源码 + README',
        },
        {
          label: '主要方向',
          value: '语言 · 产品 · 工具',
        },
      ],
    },

    source: {
      eyebrow: '事实依据',
      title: '每一项说明，都应该能回到真实实现。',
      description:
        '项目描述、技术栈、功能与实现细节，都以对应项目的源码、README 与仓库资料为依据。',
      note:
        'Language Platform 目前作为开发中的独立项目展示，使用 ASP.NET Core、Entity Framework Core 与 PostgreSQL。没有公开仓库或 Demo 的部分会明确标注。',
      quote:
        '这里展示的工作，以能够被检查的真实实现为依据。',

      repository: {
        label: '公开仓库',
        value: '按项目分别链接',
      },

      implementation: {
        label: '真实实现',
        value: '功能依据源码验证',
      },

      readme: {
        label: '项目资料',
        value: 'README 与仓库文档',
      },
    },

    areas: {
      eyebrow: '已验证项目方向',
      title: '四个方向，共用一套工程能力。',
      description:
        '这些项目既包括语言基础设施，也包括常规产品工程，并不局限于单一类型的应用。',

      items: [
        {
          title: '语言工具',
          description:
            '词典、词形引擎、语言元数据、文字系统，以及喃字输入基础设施。',
          meta: '词典 · 词形 · 喃字',
        },
        {
          title: '移动软件',
          description:
            'Flutter 应用与原生 Android 开发，包括 Kotlin 输入法。',
          meta: 'FLUTTER · DART · KOTLIN',
        },
        {
          title: '开发者工具',
          description:
            '代码学习环境、Electron 工具、Monaco 编辑器，以及可复用 Flutter 软件包。',
          meta: 'ELECTRON · MONACO · FLUTTER',
        },
        {
          title: '后端系统',
          description:
            'API、数据库、电商系统、身份验证、支付与服务端基础设施。',
          meta: 'NODE · .NET · POSTGRESQL',
        },
      ],
    },

    cta: {
      eyebrow: '源码优先',
      title: '直接查看作品集背后的仓库。',
      description:
        '作品集负责解释项目，而源码负责证明它是怎样真正实现的。',
      action: '打开 GitHub 主页',
    },
  },

  'zh-TW': {
    hero: {
      eyebrow: '關於',
      titleLead: '軟體作品，',
      titleAccent: '以原始碼為證。',
      description:
        '這個作品集屬於 Lim Cheng Yang，專案涵蓋語言基礎設施、行動產品、開發者工具、電商與後端系統。',
      facts: [
        {
          label: '所有者',
          value: 'Lim Cheng Yang',
        },
        {
          label: '驗證依據',
          value: '原始碼 + README',
        },
        {
          label: '主要方向',
          value: '語言 · 產品 · 工具',
        },
      ],
    },

    source: {
      eyebrow: '事實依據',
      title: '每一項說明，都應該能回到真實實作。',
      description:
        '專案描述、技術棧、功能與實作細節，都以對應專案的原始碼、README 與儲存庫資料為依據。',
      note:
        'Language Platform 目前作為開發中的獨立專案展示，使用 ASP.NET Core、Entity Framework Core 與 PostgreSQL。沒有公開儲存庫或 Demo 的部分會明確標示。',
      quote:
        '這裡展示的工作，以能夠被檢查的真實實作為依據。',

      repository: {
        label: '公開儲存庫',
        value: '按專案分別連結',
      },

      implementation: {
        label: '真實實作',
        value: '功能依據原始碼驗證',
      },

      readme: {
        label: '專案資料',
        value: 'README 與儲存庫文件',
      },
    },

    areas: {
      eyebrow: '已驗證專案方向',
      title: '四個方向，共用一套工程能力。',
      description:
        '這些專案既包含語言基礎設施，也包含一般產品工程，並不侷限於單一類型的應用。',

      items: [
        {
          title: '語言工具',
          description:
            '詞典、詞形引擎、語言中繼資料、文字系統，以及喃字輸入基礎設施。',
          meta: '詞典 · 詞形 · 喃字',
        },
        {
          title: '行動軟體',
          description:
            'Flutter 應用與原生 Android 開發，包括 Kotlin 輸入法。',
          meta: 'FLUTTER · DART · KOTLIN',
        },
        {
          title: '開發者工具',
          description:
            '程式碼學習環境、Electron 工具、Monaco 編輯器，以及可重用 Flutter 套件。',
          meta: 'ELECTRON · MONACO · FLUTTER',
        },
        {
          title: '後端系統',
          description:
            'API、資料庫、電商系統、身分驗證、付款與伺服器端基礎設施。',
          meta: 'NODE · .NET · POSTGRESQL',
        },
      ],
    },

    cta: {
      eyebrow: '原始碼優先',
      title: '直接查看作品集背後的儲存庫。',
      description:
        '作品集負責解釋專案，而原始碼負責證明它是如何真正實作的。',
      action: '開啟 GitHub 首頁',
    },
  },

  'vi-Latn': {
    hero: {
      eyebrow: 'Giới thiệu',
      titleLead: 'Các sản phẩm phần mềm,',
      titleAccent: 'được chứng minh bằng mã nguồn.',
      description:
        'Portfolio này thuộc về Lim Cheng Yang và bao gồm hạ tầng ngôn ngữ, sản phẩm di động, công cụ lập trình, thương mại điện tử và hệ thống backend.',
      facts: [
        {
          label: 'Chủ sở hữu',
          value: 'Lim Cheng Yang',
        },
        {
          label: 'Bằng chứng',
          value: 'Mã nguồn + README',
        },
        {
          label: 'Hướng chính',
          value: 'Ngôn ngữ · Sản phẩm · Công cụ',
        },
      ],
    },

    source: {
      eyebrow: 'Nguồn xác thực',
      title: 'Mỗi tuyên bố đều phải quay lại được phần triển khai thật.',
      description:
        'Mô tả dự án, công nghệ, tính năng và chi tiết triển khai đều dựa trên mã nguồn, README và tài liệu kho mã của từng dự án.',
      note:
        'Language Platform hiện được trình bày riêng như một dự án đang phát triển với ASP.NET Core, Entity Framework Core và PostgreSQL. Những phần chưa có kho mã hoặc demo công khai sẽ được ghi rõ.',
      quote:
        'Những gì được trình bày ở đây dựa trên phần triển khai thực tế có thể kiểm tra.',

      repository: {
        label: 'Kho mã công khai',
        value: 'Liên kết theo từng dự án',
      },

      implementation: {
        label: 'Triển khai thực tế',
        value: 'Tính năng được kiểm chứng từ mã',
      },

      readme: {
        label: 'Tài liệu dự án',
        value: 'README và tài liệu kho mã',
      },
    },

    areas: {
      eyebrow: 'Các hướng dự án đã xác minh',
      title: 'Bốn hướng, cùng một nền tảng kỹ thuật.',
      description:
        'Các dự án trải từ hạ tầng ngôn ngữ đến kỹ thuật sản phẩm thông thường, thay vì chỉ tập trung vào một loại ứng dụng.',

      items: [
        {
          title: 'Công cụ ngôn ngữ',
          description:
            'Từ điển, bộ máy hình thái, metadata ngôn ngữ, hệ chữ và hạ tầng nhập Chữ Nôm.',
          meta: 'TỪ ĐIỂN · HÌNH THÁI · CHỮ NÔM',
        },
        {
          title: 'Phần mềm di động',
          description:
            'Ứng dụng Flutter và phát triển Android native, bao gồm bộ gõ viết bằng Kotlin.',
          meta: 'FLUTTER · DART · KOTLIN',
        },
        {
          title: 'Công cụ lập trình',
          description:
            'Môi trường học code, công cụ Electron, editor dựa trên Monaco và package Flutter tái sử dụng.',
          meta: 'ELECTRON · MONACO · FLUTTER',
        },
        {
          title: 'Hệ thống backend',
          description:
            'API, cơ sở dữ liệu, thương mại điện tử, xác thực, thanh toán và hạ tầng phía máy chủ.',
          meta: 'NODE · .NET · POSTGRESQL',
        },
      ],
    },

    cta: {
      eyebrow: 'Ưu tiên mã nguồn',
      title: 'Xem trực tiếp các kho mã đứng sau portfolio.',
      description:
        'Portfolio giải thích dự án; mã nguồn cho thấy chúng thực sự được xây dựng như thế nào.',
      action: 'Mở trang GitHub',
    },
  },

  'vi-Hani': {
    hero: {
      eyebrow: '關於',
      titleLead: '各作品軟件、',
      titleAccent: '以碼源爲證。',
      description:
        '作品集尼屬 Lim Cheng Yang，包各工程基礎言語、產品移動、工具立程、商買吧系統 backend。',
      facts: [
        {
          label: '主人',
          value: 'Lim Cheng Yang',
        },
        {
          label: '證據',
          value: '碼源 + README',
        },
        {
          label: '方向',
          value: '言語 · 產品 · 工具',
        },
      ],
    },

    source: {
      eyebrow: '源確認',
      title: '每𠬠說明調沛固体迴來份寔現。',
      description:
        '描述預案、技術、功能吧細節寔現調據於碼源、README 吧資料庫碼𧵑每預案。',
      note:
        'Language Platform 現得展示別如𠬠預案正在發展、使用 ASP.NET Core、Entity Framework Core 吧 PostgreSQL。份欺未固庫碼公開抑 demo 會得記明。',
      quote:
        '各工作展示𠓨尼據於份寔現固体檢查得。',

      repository: {
        label: '庫碼公開',
        value: '聯結蹺每預案',
      },

      implementation: {
        label: '份寔現',
        value: '功能得確認自碼',
      },

      readme: {
        label: '資料預案',
        value: 'README 吧文料庫碼',
      },
    },

    areas: {
      eyebrow: '各方向預案㐌確認',
      title: '𦊚方向、𠬠基礎工程。',
      description:
        '各預案自基礎言語𦤾工程產品普通、空只集中於𠬠類應用。',

      items: [
        {
          title: '工具言語',
          description:
            '詞典、機形態、數料言語、系𡨸吧基礎輸入𡨸喃。',
          meta: '詞典 · 形態 · 𡨸喃',
        },
        {
          title: '軟件移動',
          description:
            '各應用 Flutter 吧 Android native、包括部敲寫 bằng Kotlin。',
          meta: 'FLUTTER · DART · KOTLIN',
        },
        {
          title: '工具立程',
          description:
            '環境學碼、工具 Electron、editor Monaco 吧各 package Flutter 固体再使用。',
          meta: 'ELECTRON · MONACO · FLUTTER',
        },
        {
          title: '系統 backend',
          description:
            'API、基礎數料、商買、確認身份、清算吧基礎服務。',
          meta: 'NODE · .NET · POSTGRESQL',
        },
      ],
    },

    cta: {
      eyebrow: '優先碼源',
      title: '䀡直接各庫碼𨑜作品集。',
      description:
        '作品集解釋預案、碼源朱𫡿各預案得𡏦真正如何。',
      action: '開頁 GitHub',
    },
  },
};

export function aboutCopy(language: AppLocale) {
  return copy[language];
}