import type {
  Language,
  TranslationDictionary,
} from './types';

const en: TranslationDictionary = {
  'source.shopping.title':
    'Commerce Platform source code',

  'source.shopping.summary':
    'Trace verified commerce paths across the Flutter customer app, Node.js API, Stripe, Prisma, PostgreSQL, order reservation, inventory, and expiration jobs.',

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

  'source.shopping.orders.name':
    'Orders & inventory',

  'source.shopping.orders.summary':
    'How the backend prices orders from current product data, reserves sellable stock, protects concurrent inventory changes, and releases abandoned reservations.',

  'source.shopping.reservation.name':
    'Reserved stock and order expiration',

  'source.shopping.reservation.summary':
    'Reserve stock for unpaid online orders, keep cash-on-delivery behavior separate, and automatically cancel expired reservations without racing completed Stripe payments.',

  'source.shopping.reservation.explanation.1':
    'createCustomerOrder rebuilds prices from active database products instead of trusting client totals. Inside one Prisma transaction, it checks available stock as stock minus reservedStock. Cash-on-delivery orders reduce physical stock immediately, while online-payment orders increase reservedStock and receive a 30-minute reservation expiry.',

  'source.shopping.reservation.explanation.2':
    'The expiration worker scans overdue unpaid orders in bounded batches. Before cancelling, it checks the Stripe PaymentIntent so a succeeded or still-processing payment is not released by mistake. A successful expiration marks the order cancelled and failed, then decrements reservedStock in the same database transaction. Manual inventory changes also lock the product row and cannot reduce stock below reservedStock.',

  'source.shopping.reservation.flow.1.title':
    'Rebuild order pricing on the server',

  'source.shopping.reservation.flow.1.description':
    'Load active products from PostgreSQL, use their stored prices, calculate each line total and shipping, and reject unavailable products or unsafe amounts.',

  'source.shopping.reservation.flow.2.title':
    'Reserve only actually available stock',

  'source.shopping.reservation.flow.2.description':
    'Conditional SQL updates require stock minus reservedStock to cover the requested quantity. Online orders increase reservedStock; cash-on-delivery orders reduce stock immediately.',

  'source.shopping.reservation.flow.3.title':
    'Create an order with an expiration boundary',

  'source.shopping.reservation.flow.3.description':
    'Online orders enter PENDING_PAYMENT with a 30-minute reservationExpiresAt timestamp, while cash-on-delivery orders enter PROCESSING without a payment reservation.',

  'source.shopping.reservation.flow.4.title':
    'Verify payment before releasing inventory',

  'source.shopping.reservation.flow.4.description':
    'The worker skips succeeded or processing PaymentIntents, cancels abandoned intents when possible, then atomically cancels the expired order and releases its reserved stock.',

  'source.shopping.reservation.code.order':
    'Order creation calculates authoritative prices and reserves or deducts stock inside one transaction.',

  'source.shopping.reservation.code.expiration':
    'The expiration job checks Stripe before allowing an overdue reservation to be cancelled and released.',

  'source.shopping.reservation.code.inventory':
    'Administrative inventory changes lock the product row and preserve stock already reserved by pending orders.',
};

const simplifiedChinese:
  TranslationDictionary = {
    'source.shopping.title':
      '商城平台源代码',

    'source.shopping.summary':
      '沿着经过核实的真实商城代码路径，查看 Flutter 客户端、Node.js API、Stripe、Prisma、PostgreSQL、订单锁库存、库存管理与超时任务如何协作。',

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

    'source.shopping.orders.name':
      '订单与库存',

    'source.shopping.orders.summary':
      '查看后端如何用当前商品数据重新计算订单金额、锁定可售库存、保护并发库存修改，并释放被放弃的库存预留。',

    'source.shopping.reservation.name':
      '锁库存与订单超时',

    'source.shopping.reservation.summary':
      '为未付款线上订单锁定库存，把货到付款流程单独处理，并在不误伤已完成 Stripe 付款的前提下自动取消超时预留。',

    'source.shopping.reservation.explanation.1':
      'createCustomerOrder 不信任客户端传来的总价，而是从数据库中的有效商品重新取价格并计算订单金额。在一个 Prisma 事务中，它以 stock - reservedStock 作为可售库存。货到付款会立即减少真实 stock；线上付款则增加 reservedStock，并设置 30 分钟的 reservationExpiresAt。',

    'source.shopping.reservation.explanation.2':
      '订单超时 worker 会按批次扫描已经过期且仍未付款的订单。取消之前会先检查 Stripe PaymentIntent，避免把已经成功或仍在 processing 的付款误当成超时。真正过期时，会在同一个数据库事务中把订单改为 CANCELLED / FAILED，并减少 reservedStock。管理员手动改库存时也会锁住商品行，而且不能把 stock 调整到 reservedStock 以下。',

    'source.shopping.reservation.flow.1.title':
      '由服务端重新计算订单价格',

    'source.shopping.reservation.flow.1.description':
      '从 PostgreSQL 读取仍有效的商品和真实价格，重新计算每个订单项、运费与总价，并拒绝已经下架的商品或超出安全整数范围的金额。',

    'source.shopping.reservation.flow.2.title':
      '只锁定真正可售的库存',

    'source.shopping.reservation.flow.2.description':
      '条件 SQL 要求 stock - reservedStock 足以覆盖购买数量。线上订单增加 reservedStock；货到付款则直接减少 stock。',

    'source.shopping.reservation.flow.3.title':
      '创建带超时边界的订单',

    'source.shopping.reservation.flow.3.description':
      '线上订单进入 PENDING_PAYMENT，并写入 30 分钟后的 reservationExpiresAt；货到付款则直接进入 PROCESSING，不建立付款库存预留。',

    'source.shopping.reservation.flow.4.title':
      '释放库存前先确认付款状态',

    'source.shopping.reservation.flow.4.description':
      'Worker 会跳过 succeeded 或 processing 的 PaymentIntent，并尽量取消已经放弃的 intent；确认可以过期后，再原子地取消订单并释放 reservedStock。',

    'source.shopping.reservation.code.order':
      '订单创建在同一事务里使用服务端价格，并根据支付方式锁定或直接扣减库存。',

    'source.shopping.reservation.code.expiration':
      '订单超时任务会先检查 Stripe，再决定是否允许取消超时订单并释放锁定库存。',

    'source.shopping.reservation.code.inventory':
      '管理员库存操作会锁住商品行，并保护已经被待付款订单占用的 reservedStock。',
  };

const traditionalChinese:
  TranslationDictionary = {
    'source.shopping.title':
      '商城平台原始碼',

    'source.shopping.summary':
      '沿著經過核實的真實商城程式碼路徑，查看 Flutter 客戶端、Node.js API、Stripe、Prisma、PostgreSQL、訂單鎖庫存、庫存管理與逾時工作如何協作。',

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

    'source.shopping.orders.name':
      '訂單與庫存',

    'source.shopping.orders.summary':
      '查看後端如何用目前商品資料重新計算訂單金額、鎖定可售庫存、保護並行庫存修改，並釋放被放棄的庫存預留。',

    'source.shopping.reservation.name':
      '鎖庫存與訂單逾時',

    'source.shopping.reservation.summary':
      '為未付款線上訂單鎖定庫存，把貨到付款流程分開處理，並在不誤傷已完成 Stripe 付款的前提下自動取消逾時預留。',

    'source.shopping.reservation.explanation.1':
      'createCustomerOrder 不信任客戶端傳來的總價，而是從資料庫中的有效商品重新取得價格並計算訂單金額。在一個 Prisma 交易中，它以 stock - reservedStock 作為可售庫存。貨到付款會立即減少真實 stock；線上付款則增加 reservedStock，並設定 30 分鐘的 reservationExpiresAt。',

    'source.shopping.reservation.explanation.2':
      '訂單逾時 worker 會分批掃描已經過期且仍未付款的訂單。取消之前會先檢查 Stripe PaymentIntent，避免把已成功或仍在 processing 的付款誤當成逾時。真正過期時，會在同一個資料庫交易中把訂單改成 CANCELLED / FAILED，並減少 reservedStock。管理員手動修改庫存時也會鎖住商品列，而且不能把 stock 調整到 reservedStock 以下。',

    'source.shopping.reservation.flow.1.title':
      '由伺服器重新計算訂單價格',

    'source.shopping.reservation.flow.1.description':
      '從 PostgreSQL 讀取仍有效的商品和真實價格，重新計算每個訂單項目、運費與總價，並拒絕已下架商品或超出安全整數範圍的金額。',

    'source.shopping.reservation.flow.2.title':
      '只鎖定真正可售的庫存',

    'source.shopping.reservation.flow.2.description':
      '條件 SQL 要求 stock - reservedStock 足以覆蓋購買數量。線上訂單增加 reservedStock；貨到付款則直接減少 stock。',

    'source.shopping.reservation.flow.3.title':
      '建立帶逾時邊界的訂單',

    'source.shopping.reservation.flow.3.description':
      '線上訂單進入 PENDING_PAYMENT，並寫入 30 分鐘後的 reservationExpiresAt；貨到付款則直接進入 PROCESSING，不建立付款庫存預留。',

    'source.shopping.reservation.flow.4.title':
      '釋放庫存前先確認付款狀態',

    'source.shopping.reservation.flow.4.description':
      'Worker 會跳過 succeeded 或 processing 的 PaymentIntent，並盡量取消已放棄的 intent；確認可以逾時後，再原子地取消訂單並釋放 reservedStock。',

    'source.shopping.reservation.code.order':
      '訂單建立在同一個交易中使用伺服器價格，並依付款方式鎖定或直接扣減庫存。',

    'source.shopping.reservation.code.expiration':
      '訂單逾時工作會先檢查 Stripe，再決定是否允許取消逾時訂單並釋放鎖定庫存。',

    'source.shopping.reservation.code.inventory':
      '管理員庫存操作會鎖住商品列，並保護已被待付款訂單占用的 reservedStock。',
  };

export const shoppingTranslations: Record<
  Language,
  TranslationDictionary
> = {
  en,
  'zh-CN': simplifiedChinese,
  'zh-TW': traditionalChinese,
};
