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

const adminAuthTranslations:
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
    },
  };

export const sourceProjectModule = {
  explanation: {
    ...shoppingAppSourceExplanation,

    categories: [
      ...shoppingAppSourceExplanation.categories,
      adminAuthenticationCategory,
    ],
  },

  translations: {
    en: {
      ...shoppingTranslations.en,
      ...adminAuthTranslations.en,
    },

    'zh-CN': {
      ...shoppingTranslations['zh-CN'],
      ...adminAuthTranslations['zh-CN'],
    },

    'zh-TW': {
      ...shoppingTranslations['zh-TW'],
      ...adminAuthTranslations['zh-TW'],
    },
  },
} satisfies SourceProjectModule;
