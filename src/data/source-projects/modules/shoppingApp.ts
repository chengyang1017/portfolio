import {
  shoppingAppSourceExplanation,
} from '../../source-explanations/shoppingApp';

import {
  shoppingTranslations,
} from '../../../i18n/shoppingTranslations';

import type {
  SourceCategoryExplanation,
} from '../../source-explanations/types';

import type {
  SourceProjectModule,
} from '../types';

const adminAuthenticationCategory:
  SourceCategoryExplanation = {
    slug: 'admin-authentication',

    nameKey:
      'source.shopping.auth.name',

    summaryKey:
      'source.shopping.auth.summary',

    features: [
      {
        slug: 'access-token-refresh',

        nameKey:
          'source.shopping.auth.refresh.name',

        summaryKey:
          'source.shopping.auth.refresh.summary',

        explanationKeys: [
          'source.shopping.auth.refresh.explanation.1',
          'source.shopping.auth.refresh.explanation.2',
        ],

        relatedFiles: [
          {
            path:
              'apps/admin/src/api/http_client.ts',
          },
          {
            path:
              'apps/admin/src/auth/admin_auth_api.ts',
          },
          {
            path:
              'server/src/routes/admin_auth_routes.ts',
          },
          {
            path:
              'server/src/services/admin_auth_service.ts',
          },
        ],

        codeFlow: [
          {
            id: 'attach-access-token',
            titleKey:
              'source.shopping.auth.refresh.flow.1.title',
            descriptionKey:
              'source.shopping.auth.refresh.flow.1.description',
            filePath:
              'apps/admin/src/api/http_client.ts',
          },
          {
            id: 'refresh-on-401',
            titleKey:
              'source.shopping.auth.refresh.flow.2.title',
            descriptionKey:
              'source.shopping.auth.refresh.flow.2.description',
            filePath:
              'apps/admin/src/api/http_client.ts',
          },
          {
            id: 'rotate-refresh-token',
            titleKey:
              'source.shopping.auth.refresh.flow.3.title',
            descriptionKey:
              'source.shopping.auth.refresh.flow.3.description',
            filePath:
              'server/src/services/admin_auth_service.ts',
          },
          {
            id: 'restore-or-expire-session',
            titleKey:
              'source.shopping.auth.refresh.flow.4.title',
            descriptionKey:
              'source.shopping.auth.refresh.flow.4.description',
            filePath:
              'apps/admin/src/auth/admin_auth_api.ts',
          },
        ],

        codeBlocks: [
          {
            id: 'admin-http-refresh',
            language: 'typescript',
            source: {
              type: 'github',
              repository:
                'chengyang1017/shoppingapp123',
              path:
                'apps/admin/src/api/http_client.ts',
              startAnchor:
                'httpClient.interceptors.response.use(',
            },
            captionKey:
              'source.shopping.auth.refresh.code.client',
          },
          {
            id: 'restore-admin-session',
            language: 'typescript',
            source: {
              type: 'github',
              repository:
                'chengyang1017/shoppingapp123',
              path:
                'apps/admin/src/auth/admin_auth_api.ts',
              symbol:
                'restoreAdminSession',
            },
            captionKey:
              'source.shopping.auth.refresh.code.restore',
          },
          {
            id: 'rotate-admin-refresh-token',
            language: 'typescript',
            source: {
              type: 'github',
              repository:
                'chengyang1017/shoppingapp123',
              path:
                'server/src/services/admin_auth_service.ts',
              symbol:
                'refreshAdminSession',
            },
            captionKey:
              'source.shopping.auth.refresh.code.server',
          },
        ],

        relatedFeatureSlugs: [],
      },
    ],
  };

const adminOrdersCategory:
  SourceCategoryExplanation = {
    slug: 'admin-orders',

    nameKey:
      'source.shopping.adminOrders.name',

    summaryKey:
      'source.shopping.adminOrders.summary',

    features: [
      {
        slug: 'search-and-detail',

        nameKey:
          'source.shopping.adminOrders.search.name',

        summaryKey:
          'source.shopping.adminOrders.search.summary',

        explanationKeys: [
          'source.shopping.adminOrders.search.explanation.1',
          'source.shopping.adminOrders.search.explanation.2',
        ],

        relatedFiles: [
          {
            path:
              'apps/admin/src/features/orders/admin_order_api.ts',
          },
          {
            path:
              'server/src/routes/admin_order_routes.ts',
          },
          {
            path:
              'server/src/services/admin_order_service.ts',
          },
        ],

        codeFlow: [
          {
            id: 'send-order-filters',
            titleKey:
              'source.shopping.adminOrders.search.flow.1.title',
            descriptionKey:
              'source.shopping.adminOrders.search.flow.1.description',
            filePath:
              'apps/admin/src/features/orders/admin_order_api.ts',
          },
          {
            id: 'normalize-order-query',
            titleKey:
              'source.shopping.adminOrders.search.flow.2.title',
            descriptionKey:
              'source.shopping.adminOrders.search.flow.2.description',
            filePath:
              'server/src/routes/admin_order_routes.ts',
          },
          {
            id: 'validate-and-search-orders',
            titleKey:
              'source.shopping.adminOrders.search.flow.3.title',
            descriptionKey:
              'source.shopping.adminOrders.search.flow.3.description',
            filePath:
              'server/src/services/admin_order_service.ts',
          },
          {
            id: 'load-order-detail',
            titleKey:
              'source.shopping.adminOrders.search.flow.4.title',
            descriptionKey:
              'source.shopping.adminOrders.search.flow.4.description',
            filePath:
              'server/src/services/admin_order_service.ts',
          },
        ],

        codeBlocks: [
          {
            id: 'admin-order-client-search',
            language: 'typescript',
            source: {
              type: 'github',
              repository:
                'chengyang1017/shoppingapp123',
              path:
                'apps/admin/src/features/orders/admin_order_api.ts',
              symbol:
                'getAdminOrders',
            },
            captionKey:
              'source.shopping.adminOrders.search.code.client',
          },
          {
            id: 'admin-order-server-search',
            language: 'typescript',
            source: {
              type: 'github',
              repository:
                'chengyang1017/shoppingapp123',
              path:
                'server/src/services/admin_order_service.ts',
              symbol:
                'getAdminOrders',
            },
            captionKey:
              'source.shopping.adminOrders.search.code.server',
          },
          {
            id: 'admin-order-server-detail',
            language: 'typescript',
            source: {
              type: 'github',
              repository:
                'chengyang1017/shoppingapp123',
              path:
                'server/src/services/admin_order_service.ts',
              symbol:
                'getAdminOrderDetail',
            },
            captionKey:
              'source.shopping.adminOrders.search.code.detail',
          },
        ],

        relatedFeatureSlugs: [],
      },
    ],
  };

const extensionTranslations:
  SourceProjectModule['translations'] = {
    en: {
      'source.shopping.auth.name':
        'Admin authentication',
      'source.shopping.auth.summary':
        'How the React administration dashboard keeps short-lived access tokens in memory while the server rotates refresh tokens through an HttpOnly cookie.',
      'source.shopping.auth.refresh.name':
        'Automatic access-token refresh',
      'source.shopping.auth.refresh.summary':
        'Attach the current access token to API calls, recover once from a 401 response, rotate the server-side refresh token, and expire the admin session if recovery fails.',
      'source.shopping.auth.refresh.explanation.1':
        'The admin Axios client reads the access token from the local token store and attaches it as a Bearer token. If a protected request returns 401, the response interceptor retries only once, calls the dedicated refresh endpoint with credentials enabled, stores the new access token, and repeats the original request.',
      'source.shopping.auth.refresh.explanation.2':
        'The refresh token is not returned to application JavaScript. The Express route reads it from the admin_refresh_token HttpOnly cookie. refreshAdminSession hashes the token, checks revocation, expiry, admin role and account status, revokes the used token inside a transaction, creates the next refresh token, and returns a fresh short-lived access token. A failed refresh clears the client access token and emits admin-auth-expired.',
      'source.shopping.auth.refresh.flow.1.title':
        'Attach the in-memory access token',
      'source.shopping.auth.refresh.flow.1.description':
        'Before each admin API request, the Axios request interceptor reads the current access token and adds Authorization: Bearer when one exists.',
      'source.shopping.auth.refresh.flow.2.title':
        'Recover once from HTTP 401',
      'source.shopping.auth.refresh.flow.2.description':
        'The response interceptor ignores login and refresh endpoints, marks the failed request with _retry, requests a new access token, then replays the original request once.',
      'source.shopping.auth.refresh.flow.3.title':
        'Rotate the refresh token on the server',
      'source.shopping.auth.refresh.flow.3.description':
        'The backend hashes the cookie token, verifies the stored session, revokes the old refresh token atomically, creates a replacement, and issues a new admin access token.',
      'source.shopping.auth.refresh.flow.4.title':
        'Restore or expire the admin session',
      'source.shopping.auth.refresh.flow.4.description':
        'On session restore, the admin app calls the refresh endpoint and stores the returned access token. If refresh later fails, the token is cleared and an admin-auth-expired event is dispatched.',
      'source.shopping.auth.refresh.code.client':
        'The Axios response interceptor performs a single refresh-and-retry cycle for unauthorized protected requests.',
      'source.shopping.auth.refresh.code.restore':
        'Session restoration obtains a fresh access token through the refresh cookie without requiring the administrator to log in again.',
      'source.shopping.auth.refresh.code.server':
        'The backend validates and rotates one-time refresh-token records before issuing the next access token and refresh token.',

      'source.shopping.adminOrders.name':
        'Admin order inspection',
      'source.shopping.adminOrders.summary':
        'How the administration dashboard searches orders by operational filters and loads complete order details from PostgreSQL.',
      'source.shopping.adminOrders.search.name':
        'Order search and detail loading',
      'source.shopping.adminOrders.search.summary':
        'Filter orders by order status, payment status, keyword and bounded result count, then load a complete order with customer and item snapshots.',
      'source.shopping.adminOrders.search.explanation.1':
        'The React admin API sends status, paymentStatus, keyword and limit as query parameters. The Express route normalizes optional strings and converts the limit before passing the request into the service layer.',
      'source.shopping.adminOrders.search.explanation.2':
        'The service validates known order and payment statuses, defaults the result limit to 100 and caps it at 200. Keyword search covers order number, recipient name, recipient phone and customer email. The detail query loads customer data and stored order-item snapshots, returning 404 when the order does not exist.',
      'source.shopping.adminOrders.search.flow.1.title':
        'Send typed admin filters',
      'source.shopping.adminOrders.search.flow.1.description':
        'The React admin client sends the selected order status, payment status, keyword and limit to /api/admin/orders.',
      'source.shopping.adminOrders.search.flow.2.title':
        'Normalize query parameters',
      'source.shopping.adminOrders.search.flow.2.description':
        'The Express route trims optional strings and converts the limit before handing the filters to the service.',
      'source.shopping.adminOrders.search.flow.3.title':
        'Validate filters and query PostgreSQL',
      'source.shopping.adminOrders.search.flow.3.description':
        'The service rejects unknown status values, caps the limit, builds the keyword OR conditions and queries newest orders first.',
      'source.shopping.adminOrders.search.flow.4.title':
        'Load the complete order detail',
      'source.shopping.adminOrders.search.flow.4.description':
        'A detail request fetches the customer and order-item snapshots, including stored product title, image, unit price, quantity and line total.',
      'source.shopping.adminOrders.search.code.client':
        'The admin client maps UI filters into query parameters and exposes a separate detail request.',
      'source.shopping.adminOrders.search.code.server':
        'The service validates filters, performs multi-field keyword search and maps database rows into compact admin order summaries.',
      'source.shopping.adminOrders.search.code.detail':
        'The detail query returns shipping data, customer data and immutable order-item snapshots, or an ORDER_NOT_FOUND error.',
    },

    'zh-CN': {
      'source.shopping.auth.name':
        '管理员身份验证',
      'source.shopping.auth.summary':
        '查看 React 管理后台如何把短生命周期 access token 保存在客户端内存中，同时由服务端通过 HttpOnly Cookie 轮换 refresh token。',
      'source.shopping.auth.refresh.name':
        'Access Token 自动刷新',
      'source.shopping.auth.refresh.summary':
        '为后台 API 请求附加当前 access token，在收到 401 时只恢复一次，由服务端轮换 refresh token，并在恢复失败时结束管理员会话。',
      'source.shopping.auth.refresh.explanation.1':
        '管理员 Axios 客户端会从本地 token store 读取 access token，并以 Bearer Token 形式附加到请求。如果受保护接口返回 401，response interceptor 只允许重试一次，通过启用 credentials 的独立 refresh 请求取得新的 access token，保存后再重新执行原请求。',
      'source.shopping.auth.refresh.explanation.2':
        'Refresh token 不会直接交给应用 JavaScript。Express 路由从 admin_refresh_token HttpOnly Cookie 中读取它。refreshAdminSession 会哈希 token，检查撤销状态、有效期、管理员角色与账号状态，然后在事务里撤销已经使用的 refresh token、创建下一枚 token，并返回新的短生命周期 access token。刷新失败时，客户端会清除 access token，并发出 admin-auth-expired 事件。',
      'source.shopping.auth.refresh.flow.1.title':
        '附加内存中的 Access Token',
      'source.shopping.auth.refresh.flow.1.description':
        '每次管理员 API 请求之前，Axios request interceptor 会读取当前 access token；存在时加入 Authorization: Bearer。',
      'source.shopping.auth.refresh.flow.2.title':
        '收到 401 后只恢复一次',
      'source.shopping.auth.refresh.flow.2.description':
        'Response interceptor 会跳过 login 和 refresh 接口，为失败请求标记 _retry，请求新的 access token，然后只重新执行一次原请求。',
      'source.shopping.auth.refresh.flow.3.title':
        '服务端轮换 Refresh Token',
      'source.shopping.auth.refresh.flow.3.description':
        '后端哈希 Cookie 中的 token，验证数据库会话，在事务中原子撤销旧 refresh token、创建替代 token，并签发新的管理员 access token。',
      'source.shopping.auth.refresh.flow.4.title':
        '恢复或结束管理员会话',
      'source.shopping.auth.refresh.flow.4.description':
        '恢复会话时，管理后台直接调用 refresh 接口并保存返回的 access token；之后如果 refresh 失败，则清除 token 并派发 admin-auth-expired 事件。',
      'source.shopping.auth.refresh.code.client':
        'Axios response interceptor 对未授权的受保护请求执行一次 refresh + retry。',
      'source.shopping.auth.refresh.code.restore':
        '会话恢复利用 refresh cookie 获取新的 access token，不需要管理员再次输入账号密码。',
      'source.shopping.auth.refresh.code.server':
        '后端验证并轮换一次性 refresh-token 记录，然后签发下一枚 access token 与 refresh token。',

      'source.shopping.adminOrders.name':
        '管理员订单查询',
      'source.shopping.adminOrders.summary':
        '查看管理后台如何按业务筛选条件搜索订单，并从 PostgreSQL 读取完整订单详情。',
      'source.shopping.adminOrders.search.name':
        '订单搜索与详情读取',
      'source.shopping.adminOrders.search.summary':
        '按订单状态、付款状态、关键词和受限结果数量筛选订单，再读取包含客户与订单项快照的完整详情。',
      'source.shopping.adminOrders.search.explanation.1':
        'React 管理后台把 status、paymentStatus、keyword 和 limit 作为查询参数发送。Express 路由负责整理可选字符串并转换 limit，然后再交给 service 层。',
      'source.shopping.adminOrders.search.explanation.2':
        'Service 会验证订单状态和付款状态，只接受系统已定义的值；默认返回 100 笔并把上限限制在 200。关键词可同时匹配订单编号、收货人姓名、电话和客户邮箱。详情查询会读取客户资料以及下单时保存的订单项快照；订单不存在时返回 404。',
      'source.shopping.adminOrders.search.flow.1.title':
        '发送后台筛选条件',
      'source.shopping.adminOrders.search.flow.1.description':
        'React 管理端把订单状态、付款状态、关键词和 limit 发送到 /api/admin/orders。',
      'source.shopping.adminOrders.search.flow.2.title':
        '整理查询参数',
      'source.shopping.adminOrders.search.flow.2.description':
        'Express 路由会 trim 可选字符串并转换 limit，然后把筛选条件交给 service。',
      'source.shopping.adminOrders.search.flow.3.title':
        '验证条件并查询 PostgreSQL',
      'source.shopping.adminOrders.search.flow.3.description':
        'Service 拒绝未知状态、限制最大查询数量、建立关键词 OR 条件，并按创建时间倒序读取订单。',
      'source.shopping.adminOrders.search.flow.4.title':
        '读取完整订单详情',
      'source.shopping.adminOrders.search.flow.4.description':
        '详情接口读取客户和订单项快照，包括下单时保存的商品标题、图片、单价、数量与行金额。',
      'source.shopping.adminOrders.search.code.client':
        '管理端 API 把 UI 筛选条件映射为查询参数，并提供独立的订单详情请求。',
      'source.shopping.adminOrders.search.code.server':
        'Service 验证筛选值、执行多字段关键词搜索，并把数据库结果映射成后台订单摘要。',
      'source.shopping.adminOrders.search.code.detail':
        '订单详情查询返回收货资料、客户资料和订单项快照；不存在时抛出 ORDER_NOT_FOUND。',
    },

    'zh-TW': {
      'source.shopping.auth.name':
        '管理員身分驗證',
      'source.shopping.auth.summary':
        '查看 React 管理後台如何把短生命週期 access token 保存在客戶端記憶體中，同時由伺服器透過 HttpOnly Cookie 輪換 refresh token。',
      'source.shopping.auth.refresh.name':
        'Access Token 自動刷新',
      'source.shopping.auth.refresh.summary':
        '為後台 API 請求附加目前 access token，在收到 401 時只恢復一次，由伺服器輪換 refresh token，並在恢復失敗時結束管理員工作階段。',
      'source.shopping.auth.refresh.explanation.1':
        '管理員 Axios 客戶端會從本地 token store 讀取 access token，並以 Bearer Token 形式附加到請求。如果受保護介面回傳 401，response interceptor 只允許重試一次，透過啟用 credentials 的獨立 refresh 請求取得新的 access token，儲存後再重新執行原請求。',
      'source.shopping.auth.refresh.explanation.2':
        'Refresh token 不會直接交給應用程式 JavaScript。Express 路由從 admin_refresh_token HttpOnly Cookie 中讀取它。refreshAdminSession 會雜湊 token，檢查撤銷狀態、有效期、管理員角色與帳號狀態，然後在交易中撤銷已使用的 refresh token、建立下一枚 token，並回傳新的短生命週期 access token。刷新失敗時，客戶端會清除 access token，並發出 admin-auth-expired 事件。',
      'source.shopping.auth.refresh.flow.1.title':
        '附加記憶體中的 Access Token',
      'source.shopping.auth.refresh.flow.1.description':
        '每次管理員 API 請求之前，Axios request interceptor 會讀取目前 access token；存在時加入 Authorization: Bearer。',
      'source.shopping.auth.refresh.flow.2.title':
        '收到 401 後只恢復一次',
      'source.shopping.auth.refresh.flow.2.description':
        'Response interceptor 會跳過 login 和 refresh 介面，為失敗請求標記 _retry，請求新的 access token，然後只重新執行一次原請求。',
      'source.shopping.auth.refresh.flow.3.title':
        '伺服器輪換 Refresh Token',
      'source.shopping.auth.refresh.flow.3.description':
        '後端雜湊 Cookie 中的 token，驗證資料庫工作階段，在交易中原子撤銷舊 refresh token、建立替代 token，並簽發新的管理員 access token。',
      'source.shopping.auth.refresh.flow.4.title':
        '恢復或結束管理員工作階段',
      'source.shopping.auth.refresh.flow.4.description':
        '恢復工作階段時，管理後台直接呼叫 refresh 介面並儲存回傳的 access token；之後如果 refresh 失敗，則清除 token 並派發 admin-auth-expired 事件。',
      'source.shopping.auth.refresh.code.client':
        'Axios response interceptor 對未授權的受保護請求執行一次 refresh + retry。',
      'source.shopping.auth.refresh.code.restore':
        '工作階段恢復利用 refresh cookie 取得新的 access token，不需要管理員再次輸入帳號密碼。',
      'source.shopping.auth.refresh.code.server':
        '後端驗證並輪換一次性 refresh-token 紀錄，然後簽發下一枚 access token 與 refresh token。',

      'source.shopping.adminOrders.name':
        '管理員訂單查詢',
      'source.shopping.adminOrders.summary':
        '查看管理後台如何按業務篩選條件搜尋訂單，並從 PostgreSQL 讀取完整訂單詳情。',
      'source.shopping.adminOrders.search.name':
        '訂單搜尋與詳情讀取',
      'source.shopping.adminOrders.search.summary':
        '按訂單狀態、付款狀態、關鍵字和受限結果數量篩選訂單，再讀取包含客戶與訂單項目快照的完整詳情。',
      'source.shopping.adminOrders.search.explanation.1':
        'React 管理後台把 status、paymentStatus、keyword 和 limit 作為查詢參數送出。Express 路由負責整理可選字串並轉換 limit，然後再交給 service 層。',
      'source.shopping.adminOrders.search.explanation.2':
        'Service 會驗證訂單狀態和付款狀態，只接受系統已定義的值；預設回傳 100 筆並把上限限制在 200。關鍵字可同時比對訂單編號、收貨人姓名、電話和客戶信箱。詳情查詢會讀取客戶資料以及下單時保存的訂單項目快照；訂單不存在時回傳 404。',
      'source.shopping.adminOrders.search.flow.1.title':
        '送出後台篩選條件',
      'source.shopping.adminOrders.search.flow.1.description':
        'React 管理端把訂單狀態、付款狀態、關鍵字和 limit 送到 /api/admin/orders。',
      'source.shopping.adminOrders.search.flow.2.title':
        '整理查詢參數',
      'source.shopping.adminOrders.search.flow.2.description':
        'Express 路由會 trim 可選字串並轉換 limit，然後把篩選條件交給 service。',
      'source.shopping.adminOrders.search.flow.3.title':
        '驗證條件並查詢 PostgreSQL',
      'source.shopping.adminOrders.search.flow.3.description':
        'Service 拒絕未知狀態、限制最大查詢數量、建立關鍵字 OR 條件，並按建立時間倒序讀取訂單。',
      'source.shopping.adminOrders.search.flow.4.title':
        '讀取完整訂單詳情',
      'source.shopping.adminOrders.search.flow.4.description':
        '詳情介面讀取客戶和訂單項目快照，包括下單時保存的商品標題、圖片、單價、數量與行金額。',
      'source.shopping.adminOrders.search.code.client':
        '管理端 API 把 UI 篩選條件映射為查詢參數，並提供獨立的訂單詳情請求。',
      'source.shopping.adminOrders.search.code.server':
        'Service 驗證篩選值、執行多欄位關鍵字搜尋，並把資料庫結果映射成後台訂單摘要。',
      'source.shopping.adminOrders.search.code.detail':
        '訂單詳情查詢回傳收貨資料、客戶資料和訂單項目快照；不存在時拋出 ORDER_NOT_FOUND。',
    },
  };

export const sourceProjectModule = {
  explanation: {
    ...shoppingAppSourceExplanation,

    categories: [
      ...shoppingAppSourceExplanation.categories,
      adminAuthenticationCategory,
      adminOrdersCategory,
    ],
  },

  translations: {
    en: {
      ...shoppingTranslations.en,
      ...extensionTranslations.en,
    },

    'zh-CN': {
      ...shoppingTranslations['zh-CN'],
      ...extensionTranslations['zh-CN'],
    },

    'zh-TW': {
      ...shoppingTranslations['zh-TW'],
      ...extensionTranslations['zh-TW'],
    },
  },
} satisfies SourceProjectModule;
