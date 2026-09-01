import type {
  Language,
  TranslationDictionary,
} from './types';

const en: TranslationDictionary = {
  'source.shopping.title':
    'Commerce Platform source code',

  'source.shopping.summary':
    'Trace the verified checkout and payment path across the Flutter customer app, Node.js API, Stripe, Prisma, and PostgreSQL.',

  'source.shopping.payments.name':
    'Checkout & payments',

  'source.shopping.payments.summary':
    'How a customer order moves from the Flutter checkout flow into server-controlled Stripe payment processing and final payment confirmation.',

  'source.shopping.stripe.name':
    'Stripe payment lifecycle',

  'source.shopping.stripe.summary':
    'Create or reuse a server-owned PaymentIntent, present Stripe PaymentSheet in Flutter, synchronize the payment result, and finalize state through verified Stripe events.',

  'source.shopping.stripe.explanation.1':
    'StripePaymentService asks the backend to create the payment for an existing order. The Flutter client receives only the PaymentIntent client secret, configures PaymentSheet, presents Stripe’s native payment interface, and then asks the backend to synchronize the result.',

  'source.shopping.stripe.explanation.2':
    'The Node.js backend owns the authoritative payment state. It validates that the order belongs to the customer and is payable, reuses an existing PaymentIntent when possible, creates new intents with an idempotency key, stores the Stripe intent ID in PostgreSQL, and verifies webhook signatures before processing Stripe events.',

  'source.shopping.stripe.flow.1.title':
    'Start payment from Flutter',

  'source.shopping.stripe.flow.1.description':
    'The customer app starts payment for an existing order and requests a PaymentIntent from the authenticated backend endpoint.',

  'source.shopping.stripe.flow.2.title':
    'Create or reuse the PaymentIntent',

  'source.shopping.stripe.flow.2.description':
    'The backend verifies ownership and order state, reuses an active Stripe intent when possible, or creates one with the order ID as part of its idempotency strategy.',

  'source.shopping.stripe.flow.3.title':
    'Present PaymentSheet',

  'source.shopping.stripe.flow.3.description':
    'Flutter initializes Stripe PaymentSheet with the returned client secret, presents the native payment UI, and then polls the backend payment-sync endpoint for confirmation.',

  'source.shopping.stripe.flow.4.title':
    'Confirm the authoritative payment state',

  'source.shopping.stripe.flow.4.description':
    'The backend can synchronize the PaymentIntent directly while Stripe webhooks provide independently signed payment events for final server-side state updates.',

  'source.shopping.stripe.code.client':
    'Flutter coordinates PaymentIntent creation, PaymentSheet presentation, cancellation handling, authentication refresh, and server-side payment confirmation.',

  'source.shopping.stripe.code.server':
    'The backend validates the order, safely creates or reuses a Stripe PaymentIntent, and stores its identifier against the order.',

  'source.shopping.stripe.code.webhook':
    'The webhook handler verifies Stripe-Signature before forwarding trusted events into the payment service.',
};

const simplifiedChinese:
  TranslationDictionary = {
    'source.shopping.title':
      '商城平台源代码',

    'source.shopping.summary':
      '沿着经过核实的真实结账与支付路径，查看 Flutter 客户端、Node.js API、Stripe、Prisma 与 PostgreSQL 如何协作。',

    'source.shopping.payments.name':
      '结账与支付',

    'source.shopping.payments.summary':
      '查看客户订单如何从 Flutter 结账流程进入由服务端控制的 Stripe 支付处理，并最终确认付款状态。',

    'source.shopping.stripe.name':
      'Stripe 支付生命周期',

    'source.shopping.stripe.summary':
      '由服务端创建或复用 PaymentIntent，在 Flutter 中展示 Stripe PaymentSheet，同步支付结果，并通过经过验证的 Stripe 事件完成最终状态更新。',

    'source.shopping.stripe.explanation.1':
      'StripePaymentService 会针对已经建立的订单请求后端创建付款。Flutter 客户端只接收 PaymentIntent 的 client secret，用它配置并展示 Stripe 原生 PaymentSheet；付款界面关闭后，再要求后端同步实际支付结果。',

    'source.shopping.stripe.explanation.2':
      'Node.js 后端掌握权威支付状态。它会确认订单属于当前客户且仍可付款；存在可继续使用的 PaymentIntent 时进行复用，否则使用幂等键建立新的 PaymentIntent，把 Stripe intent ID 保存到 PostgreSQL，并在处理 Stripe webhook 前验证签名。',

    'source.shopping.stripe.flow.1.title':
      '从 Flutter 发起支付',

    'source.shopping.stripe.flow.1.description':
      '客户端针对已经存在的订单开始付款，并通过经过身份验证的后端接口请求 PaymentIntent。',

    'source.shopping.stripe.flow.2.title':
      '创建或复用 PaymentIntent',

    'source.shopping.stripe.flow.2.description':
      '后端检查订单归属与当前状态；可以继续使用现有 Stripe intent 时直接复用，否则结合订单 ID 与幂等策略建立新的 PaymentIntent。',

    'source.shopping.stripe.flow.3.title':
      '展示 PaymentSheet',

    'source.shopping.stripe.flow.3.description':
      'Flutter 使用后端返回的 client secret 初始化 Stripe PaymentSheet，展示原生付款界面，并在完成后轮询后端 payment-sync 接口确认状态。',

    'source.shopping.stripe.flow.4.title':
      '确认权威支付状态',

    'source.shopping.stripe.flow.4.description':
      '后端可以主动向 Stripe 同步 PaymentIntent 状态，同时 Stripe webhook 会提供经过签名验证的独立支付事件，用于完成服务端最终状态更新。',

    'source.shopping.stripe.code.client':
      'Flutter 负责协调 PaymentIntent 请求、PaymentSheet 展示、取消处理、身份令牌刷新以及服务端付款确认。',

    'source.shopping.stripe.code.server':
      '后端验证订单，并安全地创建或复用 Stripe PaymentIntent，同时把它的标识保存到订单记录。',

    'source.shopping.stripe.code.webhook':
      'Webhook Handler 会先验证 Stripe-Signature，再把可信事件交给支付服务处理。',
  };

const traditionalChinese:
  TranslationDictionary = {
    'source.shopping.title':
      '商城平台原始碼',

    'source.shopping.summary':
      '沿著經過核實的真實結帳與付款路徑，查看 Flutter 客戶端、Node.js API、Stripe、Prisma 與 PostgreSQL 如何協作。',

    'source.shopping.payments.name':
      '結帳與付款',

    'source.shopping.payments.summary':
      '查看客戶訂單如何從 Flutter 結帳流程進入由伺服器控制的 Stripe 付款處理，並最終確認付款狀態。',

    'source.shopping.stripe.name':
      'Stripe 付款生命週期',

    'source.shopping.stripe.summary':
      '由伺服器建立或重用 PaymentIntent，在 Flutter 中顯示 Stripe PaymentSheet，同步付款結果，並透過經過驗證的 Stripe 事件完成最終狀態更新。',

    'source.shopping.stripe.explanation.1':
      'StripePaymentService 會針對已建立的訂單要求後端建立付款。Flutter 客戶端只接收 PaymentIntent 的 client secret，用它設定並顯示 Stripe 原生 PaymentSheet；付款介面關閉後，再要求後端同步實際付款結果。',

    'source.shopping.stripe.explanation.2':
      'Node.js 後端掌握權威付款狀態。它會確認訂單屬於目前客戶且仍可付款；存在可繼續使用的 PaymentIntent 時直接重用，否則使用冪等鍵建立新的 PaymentIntent，把 Stripe intent ID 儲存至 PostgreSQL，並在處理 Stripe webhook 前驗證簽章。',

    'source.shopping.stripe.flow.1.title':
      '從 Flutter 發起付款',

    'source.shopping.stripe.flow.1.description':
      '客戶端針對已存在的訂單開始付款，並透過經過身分驗證的後端介面要求 PaymentIntent。',

    'source.shopping.stripe.flow.2.title':
      '建立或重用 PaymentIntent',

    'source.shopping.stripe.flow.2.description':
      '後端檢查訂單歸屬與目前狀態；可以繼續使用現有 Stripe intent 時直接重用，否則結合訂單 ID 與冪等策略建立新的 PaymentIntent。',

    'source.shopping.stripe.flow.3.title':
      '顯示 PaymentSheet',

    'source.shopping.stripe.flow.3.description':
      'Flutter 使用後端回傳的 client secret 初始化 Stripe PaymentSheet，顯示原生付款介面，並在完成後輪詢後端 payment-sync 介面確認狀態。',

    'source.shopping.stripe.flow.4.title':
      '確認權威付款狀態',

    'source.shopping.stripe.flow.4.description':
      '後端可以主動向 Stripe 同步 PaymentIntent 狀態，同時 Stripe webhook 會提供經過簽章驗證的獨立付款事件，用來完成伺服器端最終狀態更新。',

    'source.shopping.stripe.code.client':
      'Flutter 負責協調 PaymentIntent 請求、PaymentSheet 顯示、取消處理、身分權杖更新以及伺服器端付款確認。',

    'source.shopping.stripe.code.server':
      '後端驗證訂單，安全地建立或重用 Stripe PaymentIntent，並把它的識別碼儲存到訂單紀錄。',

    'source.shopping.stripe.code.webhook':
      'Webhook Handler 會先驗證 Stripe-Signature，再把可信事件交給付款服務處理。',
  };

export const shoppingTranslations: Record<
  Language,
  TranslationDictionary
> = {
  en,
  'zh-CN': simplifiedChinese,
  'zh-TW': traditionalChinese,
};