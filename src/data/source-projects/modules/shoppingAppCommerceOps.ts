import type {
  SourceProjectModule,
} from '../types';

const repository =
  'chengyang1017/shoppingapp123';

export const sourceProjectModule = {
  explanation: {
    projectSlug: 'shopping-app',
    titleKey: 'source.shopping.title',
    summaryKey: 'source.shopping.summary',
    categories: [
      {
        slug: 'catalog-administration',
        nameKey:
          'source.shopping.catalogAdmin.name',
        summaryKey:
          'source.shopping.catalogAdmin.summary',
        features: [
          {
            slug: 'product-lifecycle',
            nameKey:
              'source.shopping.catalogAdmin.products.name',
            summaryKey:
              'source.shopping.catalogAdmin.products.summary',
            explanationKeys: [
              'source.shopping.catalogAdmin.products.explanation.1',
              'source.shopping.catalogAdmin.products.explanation.2',
            ],
            relatedFiles: [
              {
                path:
                  'apps/admin/src/features/products/admin_product_api.ts',
              },
              {
                path:
                  'server/src/app.ts',
              },
            ],
            codeFlow: [
              {
                id: 'submit-product-change',
                titleKey:
                  'source.shopping.catalogAdmin.products.flow.1.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.products.flow.1.description',
                filePath:
                  'apps/admin/src/features/products/admin_product_api.ts',
              },
              {
                id: 'validate-product-input',
                titleKey:
                  'source.shopping.catalogAdmin.products.flow.2.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.products.flow.2.description',
                filePath:
                  'server/src/app.ts',
              },
              {
                id: 'enforce-active-category',
                titleKey:
                  'source.shopping.catalogAdmin.products.flow.3.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.products.flow.3.description',
                filePath:
                  'server/src/app.ts',
              },
              {
                id: 'soft-deactivate-product',
                titleKey:
                  'source.shopping.catalogAdmin.products.flow.4.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.products.flow.4.description',
                filePath:
                  'server/src/app.ts',
              },
            ],
            codeBlocks: [
              {
                id: 'product-admin-client',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'apps/admin/src/features/products/admin_product_api.ts',
                  symbol:
                    'createAdminProduct',
                },
                captionKey:
                  'source.shopping.catalogAdmin.products.code.client',
              },
              {
                id: 'product-create-server',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path: 'server/src/app.ts',
                  startAnchor:
                    'app.post("/api/admin/products", async',
                  endAnchor:
                    'app.patch(',
                },
                captionKey:
                  'source.shopping.catalogAdmin.products.code.server',
              },
              {
                id: 'product-category-guard',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path: 'server/src/app.ts',
                  symbol:
                    'ensureActiveCategory',
                },
                captionKey:
                  'source.shopping.catalogAdmin.products.code.categoryGuard',
              },
            ],
            relatedFeatureSlugs: [
              'category-lifecycle',
            ],
          },
          {
            slug: 'category-lifecycle',
            nameKey:
              'source.shopping.catalogAdmin.categories.name',
            summaryKey:
              'source.shopping.catalogAdmin.categories.summary',
            explanationKeys: [
              'source.shopping.catalogAdmin.categories.explanation.1',
              'source.shopping.catalogAdmin.categories.explanation.2',
            ],
            relatedFiles: [
              {
                path:
                  'apps/admin/src/features/categories/admin_category_api.ts',
              },
              {
                path:
                  'server/src/routes/admin_category_routes.ts',
              },
            ],
            codeFlow: [
              {
                id: 'create-or-edit-category',
                titleKey:
                  'source.shopping.catalogAdmin.categories.flow.1.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.categories.flow.1.description',
                filePath:
                  'apps/admin/src/features/categories/admin_category_api.ts',
              },
              {
                id: 'validate-category-metadata',
                titleKey:
                  'source.shopping.catalogAdmin.categories.flow.2.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.categories.flow.2.description',
                filePath:
                  'server/src/routes/admin_category_routes.ts',
              },
              {
                id: 'prevent-duplicate-category',
                titleKey:
                  'source.shopping.catalogAdmin.categories.flow.3.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.categories.flow.3.description',
                filePath:
                  'server/src/routes/admin_category_routes.ts',
              },
              {
                id: 'guard-category-deactivation',
                titleKey:
                  'source.shopping.catalogAdmin.categories.flow.4.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.categories.flow.4.description',
                filePath:
                  'server/src/routes/admin_category_routes.ts',
              },
            ],
            codeBlocks: [
              {
                id: 'category-admin-client',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'apps/admin/src/features/categories/admin_category_api.ts',
                  symbol:
                    'createAdminCategory',
                },
                captionKey:
                  'source.shopping.catalogAdmin.categories.code.client',
              },
              {
                id: 'category-update-server',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'server/src/routes/admin_category_routes.ts',
                  startAnchor:
                    'adminCategoryRouter.patch(',
                  endAnchor:
                    'adminCategoryRouter.delete(',
                },
                captionKey:
                  'source.shopping.catalogAdmin.categories.code.server',
              },
              {
                id: 'category-deactivation-guard',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'server/src/routes/admin_category_routes.ts',
                  symbol:
                    'ensureCategoryCanDeactivate',
                },
                captionKey:
                  'source.shopping.catalogAdmin.categories.code.guard',
              },
            ],
            relatedFeatureSlugs: [
              'product-lifecycle',
            ],
          },
          {
            slug: 'inventory-movement-ledger',
            nameKey:
              'source.shopping.catalogAdmin.inventory.name',
            summaryKey:
              'source.shopping.catalogAdmin.inventory.summary',
            explanationKeys: [
              'source.shopping.catalogAdmin.inventory.explanation.1',
              'source.shopping.catalogAdmin.inventory.explanation.2',
            ],
            relatedFiles: [
              {
                path:
                  'apps/admin/src/features/inventory/admin_inventory_api.ts',
              },
              {
                path:
                  'server/src/routes/admin_inventory_routes.ts',
              },
              {
                path:
                  'server/src/services/inventory_service.ts',
              },
            ],
            codeFlow: [
              {
                id: 'submit-inventory-operation',
                titleKey:
                  'source.shopping.catalogAdmin.inventory.flow.1.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.inventory.flow.1.description',
                filePath:
                  'apps/admin/src/features/inventory/admin_inventory_api.ts',
              },
              {
                id: 'normalize-inventory-operation',
                titleKey:
                  'source.shopping.catalogAdmin.inventory.flow.2.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.inventory.flow.2.description',
                filePath:
                  'server/src/routes/admin_inventory_routes.ts',
              },
              {
                id: 'lock-product-and-change-stock',
                titleKey:
                  'source.shopping.catalogAdmin.inventory.flow.3.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.inventory.flow.3.description',
                filePath:
                  'server/src/services/inventory_service.ts',
              },
              {
                id: 'write-and-query-ledger',
                titleKey:
                  'source.shopping.catalogAdmin.inventory.flow.4.title',
                descriptionKey:
                  'source.shopping.catalogAdmin.inventory.flow.4.description',
                filePath:
                  'server/src/routes/admin_inventory_routes.ts',
              },
            ],
            codeBlocks: [
              {
                id: 'inventory-admin-client',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'apps/admin/src/features/inventory/admin_inventory_api.ts',
                  symbol:
                    'changeInventory',
                },
                captionKey:
                  'source.shopping.catalogAdmin.inventory.code.client',
              },
              {
                id: 'inventory-service-transaction',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'server/src/services/inventory_service.ts',
                  symbol:
                    'changeInventory',
                },
                captionKey:
                  'source.shopping.catalogAdmin.inventory.code.service',
              },
              {
                id: 'inventory-ledger-query',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'server/src/routes/admin_inventory_routes.ts',
                  startAnchor:
                    'adminInventoryRouter.get(',
                  endAnchor:
                    'adminInventoryRouter.post(',
                },
                captionKey:
                  'source.shopping.catalogAdmin.inventory.code.ledger',
              },
            ],
            relatedFeatureSlugs: [],
          },
        ],
      },
      {
        slug: 'customer-order-lifecycle',
        nameKey:
          'source.shopping.customerOrders.name',
        summaryKey:
          'source.shopping.customerOrders.summary',
        features: [
          {
            slug: 'cancel-pending-order',
            nameKey:
              'source.shopping.customerOrders.cancel.name',
            summaryKey:
              'source.shopping.customerOrders.cancel.summary',
            explanationKeys: [
              'source.shopping.customerOrders.cancel.explanation.1',
              'source.shopping.customerOrders.cancel.explanation.2',
            ],
            relatedFiles: [
              {
                path:
                  'server/src/routes/customer_order_routes.ts',
              },
              {
                path:
                  'server/src/services/customer_order_service.ts',
              },
            ],
            codeFlow: [
              {
                id: 'authorize-customer-order',
                titleKey:
                  'source.shopping.customerOrders.cancel.flow.1.title',
                descriptionKey:
                  'source.shopping.customerOrders.cancel.flow.1.description',
                filePath:
                  'server/src/routes/customer_order_routes.ts',
              },
              {
                id: 'verify-cancellable-state',
                titleKey:
                  'source.shopping.customerOrders.cancel.flow.2.title',
                descriptionKey:
                  'source.shopping.customerOrders.cancel.flow.2.description',
                filePath:
                  'server/src/services/customer_order_service.ts',
              },
              {
                id: 'cancel-stripe-intent',
                titleKey:
                  'source.shopping.customerOrders.cancel.flow.3.title',
                descriptionKey:
                  'source.shopping.customerOrders.cancel.flow.3.description',
                filePath:
                  'server/src/services/customer_order_service.ts',
              },
              {
                id: 'cancel-and-release-stock',
                titleKey:
                  'source.shopping.customerOrders.cancel.flow.4.title',
                descriptionKey:
                  'source.shopping.customerOrders.cancel.flow.4.description',
                filePath:
                  'server/src/services/customer_order_service.ts',
              },
            ],
            codeBlocks: [
              {
                id: 'customer-cancel-route',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'server/src/routes/customer_order_routes.ts',
                  startAnchor:
                    'customerOrderRouter.post(\n  "/:id/cancel",',
                  endAnchor:
                    'customerOrderRouter.post(\n  "/:id/payment-intent",',
                },
                captionKey:
                  'source.shopping.customerOrders.cancel.code.route',
              },
              {
                id: 'customer-cancel-service',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'server/src/services/customer_order_service.ts',
                  symbol:
                    'cancelCustomerOrder',
                },
                captionKey:
                  'source.shopping.customerOrders.cancel.code.service',
              },
            ],
            relatedFeatureSlugs: [],
          },
        ],
      },
      {
        slug: 'public-catalog-delivery',
        nameKey:
          'source.shopping.publicCatalog.name',
        summaryKey:
          'source.shopping.publicCatalog.summary',
        features: [
          {
            slug: 'sellable-stock-projection',
            nameKey:
              'source.shopping.publicCatalog.stock.name',
            summaryKey:
              'source.shopping.publicCatalog.stock.summary',
            explanationKeys: [
              'source.shopping.publicCatalog.stock.explanation.1',
              'source.shopping.publicCatalog.stock.explanation.2',
            ],
            relatedFiles: [
              {
                path:
                  'apps/mobile/lib/features/product/data/services/product_service.dart',
              },
              {
                path:
                  'server/src/app.ts',
              },
            ],
            codeFlow: [
              {
                id: 'request-public-products',
                titleKey:
                  'source.shopping.publicCatalog.stock.flow.1.title',
                descriptionKey:
                  'source.shopping.publicCatalog.stock.flow.1.description',
                filePath:
                  'apps/mobile/lib/features/product/data/services/product_service.dart',
              },
              {
                id: 'filter-inactive-catalog',
                titleKey:
                  'source.shopping.publicCatalog.stock.flow.2.title',
                descriptionKey:
                  'source.shopping.publicCatalog.stock.flow.2.description',
                filePath:
                  'server/src/app.ts',
              },
              {
                id: 'project-available-stock',
                titleKey:
                  'source.shopping.publicCatalog.stock.flow.3.title',
                descriptionKey:
                  'source.shopping.publicCatalog.stock.flow.3.description',
                filePath:
                  'server/src/app.ts',
              },
              {
                id: 'validate-mobile-response',
                titleKey:
                  'source.shopping.publicCatalog.stock.flow.4.title',
                descriptionKey:
                  'source.shopping.publicCatalog.stock.flow.4.description',
                filePath:
                  'apps/mobile/lib/features/product/data/services/product_service.dart',
              },
            ],
            codeBlocks: [
              {
                id: 'mobile-product-service',
                language: 'dart',
                source: {
                  type: 'github',
                  repository,
                  path:
                    'apps/mobile/lib/features/product/data/services/product_service.dart',
                  symbol: 'getProducts',
                },
                captionKey:
                  'source.shopping.publicCatalog.stock.code.mobile',
              },
              {
                id: 'public-product-endpoint',
                language: 'typescript',
                source: {
                  type: 'github',
                  repository,
                  path: 'server/src/app.ts',
                  startAnchor:
                    'app.get("/api/products", async',
                  endAnchor:
                    'app.use(\n  "/api/customer/orders",',
                },
                captionKey:
                  'source.shopping.publicCatalog.stock.code.server',
              },
            ],
            relatedFeatureSlugs: [],
          },
        ],
      },
    ],
  },

  translations: {
    en: {
      'source.shopping.catalogAdmin.name':
        'Catalog administration',
      'source.shopping.catalogAdmin.summary':
        'Product, category, and inventory operations used by the React administration dashboard and enforced by the Node.js backend.',

      'source.shopping.catalogAdmin.products.name':
        'Product lifecycle and availability rules',
      'source.shopping.catalogAdmin.products.summary':
        'Create, edit, reactivate, deactivate, and list products while enforcing valid pricing, stock, and active-category relationships.',
      'source.shopping.catalogAdmin.products.explanation.1':
        'The React admin API exposes list, create, patch, deactivate, and reactivate operations. The server validates required product fields, converts display prices into integer minor units, validates stock on creation, and returns stock, reservedStock, and availableStock separately.',
      'source.shopping.catalogAdmin.products.explanation.2':
        'A product can only be created in, moved into, or reactivated inside an active category. Deletion is implemented as a soft deactivation by setting isActive to false, so historical product and order references remain intact.',
      'source.shopping.catalogAdmin.products.flow.1.title':
        'Send typed product operations',
      'source.shopping.catalogAdmin.products.flow.1.description':
        'The admin client maps create, patch, deactivate, and reactivate actions onto protected /api/admin/products endpoints.',
      'source.shopping.catalogAdmin.products.flow.2.title':
        'Validate product fields on the server',
      'source.shopping.catalogAdmin.products.flow.2.description':
        'The API requires categoryId, title and imageUrl, validates non-negative pricing, and requires integer stock when a product is created.',
      'source.shopping.catalogAdmin.products.flow.3.title':
        'Require an active category',
      'source.shopping.catalogAdmin.products.flow.3.description':
        'ensureActiveCategory rejects missing or inactive categories before creation, category changes, or product reactivation.',
      'source.shopping.catalogAdmin.products.flow.4.title':
        'Deactivate instead of deleting records',
      'source.shopping.catalogAdmin.products.flow.4.description':
        'DELETE marks the product inactive rather than removing the row, preserving data referenced by past orders and inventory history.',
      'source.shopping.catalogAdmin.products.code.client':
        'The React admin client sends a typed product-create request and returns the normalized server product.',
      'source.shopping.catalogAdmin.products.code.server':
        'Product creation validates catalog data, verifies the category, stores price in minor units, and initializes the product as active.',
      'source.shopping.catalogAdmin.products.code.categoryGuard':
        'The category guard prevents products from being created, moved, or reactivated under an inactive category.',

      'source.shopping.catalogAdmin.categories.name':
        'Category lifecycle with safe deactivation',
      'source.shopping.catalogAdmin.categories.summary':
        'Create and reorder categories, reject duplicate names, and prevent a category from being deactivated while it still contains active products.',
      'source.shopping.catalogAdmin.categories.explanation.1':
        'Category creation and editing validate non-empty names and non-negative integer sortOrder values. Duplicate names are checked case-insensitively, and the list response includes product counts for administration views.',
      'source.shopping.catalogAdmin.categories.explanation.2':
        'Deactivation has a catalog-integrity guard: before isActive can become false, the server counts active products in the category and rejects the operation until those products are handled.',
      'source.shopping.catalogAdmin.categories.flow.1.title':
        'Create, edit, activate, or deactivate',
      'source.shopping.catalogAdmin.categories.flow.1.description':
        'The admin client exposes CRUD-style category actions while activation is implemented through the regular patch endpoint.',
      'source.shopping.catalogAdmin.categories.flow.2.title':
        'Validate category metadata',
      'source.shopping.catalogAdmin.categories.flow.2.description':
        'The backend trims names and accepts only non-negative integer sortOrder values.',
      'source.shopping.catalogAdmin.categories.flow.3.title':
        'Reject duplicate names',
      'source.shopping.catalogAdmin.categories.flow.3.description':
        'Case-insensitive duplicate checks prevent two categories from representing the same visible name.',
      'source.shopping.catalogAdmin.categories.flow.4.title':
        'Protect active products during deactivation',
      'source.shopping.catalogAdmin.categories.flow.4.description':
        'A category cannot be deactivated while any active product still belongs to it.',
      'source.shopping.catalogAdmin.categories.code.client':
        'The React admin client creates categories through the protected category API.',
      'source.shopping.catalogAdmin.categories.code.server':
        'Category updates validate changed fields, duplicate names, status values, and safe deactivation.',
      'source.shopping.catalogAdmin.categories.code.guard':
        'The deactivation guard counts active products and blocks category shutdown until the catalog is consistent.',

      'source.shopping.catalogAdmin.inventory.name':
        'Inventory operations and movement ledger',
      'source.shopping.catalogAdmin.inventory.summary':
        'Apply stock-in, stock-out, and adjustment operations under row locking, then persist who changed stock and the before/after quantities.',
      'source.shopping.catalogAdmin.inventory.explanation.1':
        'The inventory endpoint normalizes STOCK_IN, STOCK_OUT, and ADJUSTMENT operations and records the authenticated administrator as createdByUserId. The service locks the product row with FOR UPDATE before calculating a new stock value.',
      'source.shopping.catalogAdmin.inventory.explanation.2':
        'Reserved stock is protected from manual removal, and every successful change writes an InventoryMovement containing quantityDelta, stockBefore, stockAfter, note, timestamp, and administrator identity. The ledger can be queried globally or by product with a bounded limit.',
      'source.shopping.catalogAdmin.inventory.flow.1.title':
        'Submit an inventory operation',
      'source.shopping.catalogAdmin.inventory.flow.1.description':
        'The admin client posts a typed inventory change or requests recent movement records.',
      'source.shopping.catalogAdmin.inventory.flow.2.title':
        'Normalize operation type and administrator',
      'source.shopping.catalogAdmin.inventory.flow.2.description':
        'The route validates operation fields and requires the authenticated administrator identity from response locals.',
      'source.shopping.catalogAdmin.inventory.flow.3.title':
        'Lock the product row before changing stock',
      'source.shopping.catalogAdmin.inventory.flow.3.description':
        'The service uses SELECT ... FOR UPDATE, calculates the operation, protects reservedStock, and updates the product inside one transaction.',
      'source.shopping.catalogAdmin.inventory.flow.4.title':
        'Persist and query the movement ledger',
      'source.shopping.catalogAdmin.inventory.flow.4.description':
        'Each change writes a movement row, while the GET endpoint returns newest records with product and administrator metadata.',
      'source.shopping.catalogAdmin.inventory.code.client':
        'The admin client posts stock operations to the inventory movement endpoint.',
      'source.shopping.catalogAdmin.inventory.code.service':
        'The inventory service row-locks the product, validates available stock, updates stock, and writes the movement record in one transaction.',
      'source.shopping.catalogAdmin.inventory.code.ledger':
        'The ledger query returns recent movements with product identity, before/after stock, notes, and the administrator who made the change.',

      'source.shopping.customerOrders.name':
        'Customer order lifecycle',
      'source.shopping.customerOrders.summary':
        'Server-side operations that keep a customer order consistent as payment and inventory state changes.',
      'source.shopping.customerOrders.cancel.name':
        'Cancel a pending order safely',
      'source.shopping.customerOrders.cancel.summary':
        'Authorize the customer, reject non-cancellable states, cancel an unfinished Stripe PaymentIntent, and release reserved inventory atomically.',
      'source.shopping.customerOrders.cancel.explanation.1':
        'The cancel route takes the authenticated customer ID from server-side request context rather than from the request body. The service requires ownership, allows idempotent reads of already-cancelled orders, and otherwise limits cancellation to unpaid PENDING_PAYMENT orders.',
      'source.shopping.customerOrders.cancel.explanation.2':
        'If a PaymentIntent exists, Stripe is checked before the database cancellation. A succeeded payment stops cancellation. Once safe, the order status change and reserved-stock release run inside one Prisma transaction with update guards that detect concurrent state changes.',
      'source.shopping.customerOrders.cancel.flow.1.title':
        'Bind cancellation to the authenticated customer',
      'source.shopping.customerOrders.cancel.flow.1.description':
        'The route reads customerId from response.locals and passes it with the route order ID to the service.',
      'source.shopping.customerOrders.cancel.flow.2.title':
        'Verify ownership and cancellable state',
      'source.shopping.customerOrders.cancel.flow.2.description':
        'Only the owner can cancel, and a non-cancelled order must still be unpaid and PENDING_PAYMENT.',
      'source.shopping.customerOrders.cancel.flow.3.title':
        'Cancel Stripe before releasing the order',
      'source.shopping.customerOrders.cancel.flow.3.description':
        'An unfinished PaymentIntent is cancelled; a succeeded intent blocks cancellation so paid orders cannot lose inventory.',
      'source.shopping.customerOrders.cancel.flow.4.title':
        'Update order and release stock atomically',
      'source.shopping.customerOrders.cancel.flow.4.description':
        'A guarded transaction marks the order cancelled and releases reserved stock, rejecting the operation if concurrent state changed first.',
      'source.shopping.customerOrders.cancel.code.route':
        'The protected cancel endpoint binds the route order ID to the authenticated customer identity.',
      'source.shopping.customerOrders.cancel.code.service':
        'Cancellation coordinates Stripe state, optimistic update guards, order status changes, and inventory release.',

      'source.shopping.publicCatalog.name':
        'Public catalog delivery',
      'source.shopping.publicCatalog.summary':
        'How the Flutter customer app receives only active, sellable catalog data from the backend.',
      'source.shopping.publicCatalog.stock.name':
        'Sellable-stock projection',
      'source.shopping.publicCatalog.stock.summary':
        'Hide inactive products and categories, expose available stock instead of raw stock, and validate the product response before creating Flutter models.',
      'source.shopping.publicCatalog.stock.explanation.1':
        'GET /api/products filters to active products whose categories are also active. The backend does not expose reservedStock as sellable quantity; the public stock field is max(0, stock - reservedStock).',
      'source.shopping.publicCatalog.stock.explanation.2':
        'The Flutter ProductService builds the endpoint from API_BASE_URL, applies a 10-second timeout, requires HTTP 200, validates that the payload is a list of maps, and converts each record through Product.fromJson.',
      'source.shopping.publicCatalog.stock.flow.1.title':
        'Request the public catalog',
      'source.shopping.publicCatalog.stock.flow.1.description':
        'Flutter calls GET /api/products through ProductService with a bounded request timeout.',
      'source.shopping.publicCatalog.stock.flow.2.title':
        'Filter inactive catalog records',
      'source.shopping.publicCatalog.stock.flow.2.description':
        'The server returns only products where both the product and its category remain active.',
      'source.shopping.publicCatalog.stock.flow.3.title':
        'Project only sellable stock',
      'source.shopping.publicCatalog.stock.flow.3.description':
        'The response stock is calculated as stock minus reservedStock and clamped at zero.',
      'source.shopping.publicCatalog.stock.flow.4.title':
        'Validate and decode the response',
      'source.shopping.publicCatalog.stock.flow.4.description':
        'Flutter rejects network failures, non-200 responses, and malformed payloads before constructing Product models.',
      'source.shopping.publicCatalog.stock.code.mobile':
        'ProductService fetches the public catalog with timeout and response-shape validation.',
      'source.shopping.publicCatalog.stock.code.server':
        'The public endpoint filters inactive catalog records and exposes available stock rather than raw warehouse stock.',
    },

    'zh-CN': {
      'source.shopping.catalogAdmin.name':
        '商品目录后台管理',
      'source.shopping.catalogAdmin.summary':
        '展示 React 管理后台与 Node.js 后端如何处理商品、分类和库存操作，并由服务端统一执行约束。',

      'source.shopping.catalogAdmin.products.name':
        '商品生命周期与可用性规则',
      'source.shopping.catalogAdmin.products.summary':
        '创建、编辑、重新上架、下架和读取商品，同时约束价格、库存与有效分类之间的关系。',
      'source.shopping.catalogAdmin.products.explanation.1':
        'React 管理后台提供列表、创建、PATCH、下架和重新上架操作。服务端会验证商品必填字段，把展示价格转换成整数 minor unit，在创建时验证库存，并分别返回 stock、reservedStock 与 availableStock。',
      'source.shopping.catalogAdmin.products.explanation.2':
        '商品只能创建在有效分类中，也只能移动到有效分类或在有效分类下重新上架。删除并不真正删除数据库记录，而是把 isActive 改成 false，因此历史订单和库存记录仍能保留引用。',
      'source.shopping.catalogAdmin.products.flow.1.title':
        '发送类型化商品操作',
      'source.shopping.catalogAdmin.products.flow.1.description':
        '管理后台把创建、修改、下架和重新上架动作映射到受保护的 /api/admin/products 接口。',
      'source.shopping.catalogAdmin.products.flow.2.title':
        '服务端验证商品字段',
      'source.shopping.catalogAdmin.products.flow.2.description':
        'API 要求 categoryId、title、imageUrl，验证非负价格，并要求新商品库存必须是非负整数。',
      'source.shopping.catalogAdmin.products.flow.3.title':
        '强制要求有效分类',
      'source.shopping.catalogAdmin.products.flow.3.description':
        'ensureActiveCategory 会在创建、换分类或重新上架前拒绝不存在或已下架的分类。',
      'source.shopping.catalogAdmin.products.flow.4.title':
        '下架而不是物理删除',
      'source.shopping.catalogAdmin.products.flow.4.description':
        'DELETE 只把商品标记为 inactive，从而保留历史订单和库存流水所依赖的数据。',
      'source.shopping.catalogAdmin.products.code.client':
        'React 管理后台发送类型化商品创建请求，并读取服务端标准化后的商品数据。',
      'source.shopping.catalogAdmin.products.code.server':
        '商品创建会验证目录数据、检查分类、用最小货币单位保存价格，并初始化为上架状态。',
      'source.shopping.catalogAdmin.products.code.categoryGuard':
        '分类守卫阻止商品被创建、移动或重新上架到已下架分类。',

      'source.shopping.catalogAdmin.categories.name':
        '分类生命周期与安全下架',
      'source.shopping.catalogAdmin.categories.summary':
        '创建和排序分类，拒绝重复名称，并阻止仍包含上架商品的分类被直接下架。',
      'source.shopping.catalogAdmin.categories.explanation.1':
        '分类创建和编辑会验证非空名称与非负整数 sortOrder。重复名称按大小写不敏感方式检查，列表接口还会返回每个分类的商品数量。',
      'source.shopping.catalogAdmin.categories.explanation.2':
        '分类下架带有目录完整性保护：在 isActive 变为 false 之前，服务端会统计分类中的上架商品，只要仍存在上架商品就拒绝下架。',
      'source.shopping.catalogAdmin.categories.flow.1.title':
        '创建、编辑、上架或下架分类',
      'source.shopping.catalogAdmin.categories.flow.1.description':
        '管理后台提供分类管理操作，其中重新上架通过普通 PATCH 接口完成。',
      'source.shopping.catalogAdmin.categories.flow.2.title':
        '验证分类元数据',
      'source.shopping.catalogAdmin.categories.flow.2.description':
        '后端会 trim 分类名称，并只接受非负整数 sortOrder。',
      'source.shopping.catalogAdmin.categories.flow.3.title':
        '拒绝重复分类名',
      'source.shopping.catalogAdmin.categories.flow.3.description':
        '大小写不敏感的重复检查避免出现两个视觉上相同的分类名称。',
      'source.shopping.catalogAdmin.categories.flow.4.title':
        '下架分类前保护上架商品',
      'source.shopping.catalogAdmin.categories.flow.4.description':
        '只要分类中仍有任何上架商品，该分类就不能被下架。',
      'source.shopping.catalogAdmin.categories.code.client':
        'React 管理后台通过受保护的分类 API 创建分类。',
      'source.shopping.catalogAdmin.categories.code.server':
        '分类更新会验证修改字段、重复名称、状态值以及是否允许安全下架。',
      'source.shopping.catalogAdmin.categories.code.guard':
        '下架守卫统计上架商品数量，在目录尚未整理完成时阻止分类下架。',

      'source.shopping.catalogAdmin.inventory.name':
        '库存操作与库存流水',
      'source.shopping.catalogAdmin.inventory.summary':
        '在行锁保护下执行入库、出库和盘点调整，并记录操作者以及库存变化前后的数量。',
      'source.shopping.catalogAdmin.inventory.explanation.1':
        '库存接口会标准化 STOCK_IN、STOCK_OUT 和 ADJUSTMENT 操作，并把当前认证管理员记录为 createdByUserId。服务层在计算新库存前会用 FOR UPDATE 锁定商品行。',
      'source.shopping.catalogAdmin.inventory.explanation.2':
        '手动操作不能移走已经被 reservedStock 占用的库存。每次成功修改都会写入 InventoryMovement，包括 quantityDelta、stockBefore、stockAfter、备注、时间与管理员身份；流水可以全局查询，也可以按商品筛选，并限制返回数量。',
      'source.shopping.catalogAdmin.inventory.flow.1.title':
        '提交库存操作',
      'source.shopping.catalogAdmin.inventory.flow.1.description':
        '管理后台可以提交类型化库存修改，也可以读取最近的库存流水。',
      'source.shopping.catalogAdmin.inventory.flow.2.title':
        '标准化操作类型与管理员身份',
      'source.shopping.catalogAdmin.inventory.flow.2.description':
        '路由验证操作字段，并要求 response locals 中存在已经认证的管理员身份。',
      'source.shopping.catalogAdmin.inventory.flow.3.title':
        '修改库存前锁定商品行',
      'source.shopping.catalogAdmin.inventory.flow.3.description':
        '服务层使用 SELECT ... FOR UPDATE，在同一个事务中计算操作、保护 reservedStock 并更新商品。',
      'source.shopping.catalogAdmin.inventory.flow.4.title':
        '写入并查询库存流水',
      'source.shopping.catalogAdmin.inventory.flow.4.description':
        '每次库存变化都会写入 movement；GET 接口按最新优先返回商品和管理员元数据。',
      'source.shopping.catalogAdmin.inventory.code.client':
        '管理后台把库存修改发送到 inventory movement 接口。',
      'source.shopping.catalogAdmin.inventory.code.service':
        '库存服务锁定商品行、验证可用库存、更新 stock，并在同一个事务中写入流水。',
      'source.shopping.catalogAdmin.inventory.code.ledger':
        '库存流水查询返回商品、变化前后库存、备注以及执行操作的管理员。',

      'source.shopping.customerOrders.name':
        '客户订单生命周期',
      'source.shopping.customerOrders.summary':
        '展示支付与库存状态变化时，服务端如何维持客户订单的一致性。',
      'source.shopping.customerOrders.cancel.name':
        '安全取消待付款订单',
      'source.shopping.customerOrders.cancel.summary':
        '确认客户身份、拒绝不可取消状态、取消未完成的 Stripe PaymentIntent，并原子释放锁定库存。',
      'source.shopping.customerOrders.cancel.explanation.1':
        '取消路由从服务端认证上下文读取 customer ID，而不是相信请求 body 传来的用户身份。服务层会验证订单归属；如果订单已经取消则可安全返回，否则只允许取消仍未付款的 PENDING_PAYMENT 订单。',
      'source.shopping.customerOrders.cancel.explanation.2':
        '存在 PaymentIntent 时会先检查 Stripe，再进入数据库取消流程；如果付款已经 succeeded 就禁止取消。确认安全后，订单状态修改和 reservedStock 释放会在同一个 Prisma 事务中执行，并通过 update guard 检测并发状态变化。',
      'source.shopping.customerOrders.cancel.flow.1.title':
        '把取消操作绑定到当前客户',
      'source.shopping.customerOrders.cancel.flow.1.description':
        '路由从 response.locals 读取 customerId，并与 URL 中的订单 ID 一起交给服务层。',
      'source.shopping.customerOrders.cancel.flow.2.title':
        '验证归属与可取消状态',
      'source.shopping.customerOrders.cancel.flow.2.description':
        '只有订单拥有者可以取消，而且未取消订单必须仍处于未付款 PENDING_PAYMENT。',
      'source.shopping.customerOrders.cancel.flow.3.title':
        '释放订单前先处理 Stripe',
      'source.shopping.customerOrders.cancel.flow.3.description':
        '未完成 PaymentIntent 会被取消；已经 succeeded 的 intent 会阻止取消，避免已付款订单丢失库存。',
      'source.shopping.customerOrders.cancel.flow.4.title':
        '原子更新订单并释放库存',
      'source.shopping.customerOrders.cancel.flow.4.description':
        '带条件保护的事务把订单标记为取消并释放 reservedStock；如果并发请求已经先改变状态，则当前操作会失败。',
      'source.shopping.customerOrders.cancel.code.route':
        '受保护的取消接口把 URL 订单 ID 与当前认证客户身份绑定。',
      'source.shopping.customerOrders.cancel.code.service':
        '取消服务协调 Stripe 状态、并发更新保护、订单状态修改和库存释放。',

      'source.shopping.publicCatalog.name':
        '公开商品目录交付',
      'source.shopping.publicCatalog.summary':
        '展示 Flutter 客户端如何只接收到仍然有效且可销售的商品目录数据。',
      'source.shopping.publicCatalog.stock.name':
        '可售库存投影',
      'source.shopping.publicCatalog.stock.summary':
        '隐藏已下架商品和分类，只暴露可售库存而不是原始库存，并在 Flutter 建模前验证响应结构。',
      'source.shopping.publicCatalog.stock.explanation.1':
        'GET /api/products 只查询上架商品，并要求所属分类也处于上架状态。后端不会把 reservedStock 当成可售数量；公开 stock 字段实际是 max(0, stock - reservedStock)。',
      'source.shopping.publicCatalog.stock.explanation.2':
        'Flutter ProductService 使用 API_BASE_URL 生成请求地址，设置 10 秒超时，要求 HTTP 200，检查 payload 必须是 Map 列表，然后逐项交给 Product.fromJson。',
      'source.shopping.publicCatalog.stock.flow.1.title':
        '请求公开商品目录',
      'source.shopping.publicCatalog.stock.flow.1.description':
        'Flutter 通过 ProductService 调用 GET /api/products，并为请求设置超时。',
      'source.shopping.publicCatalog.stock.flow.2.title':
        '过滤已下架目录记录',
      'source.shopping.publicCatalog.stock.flow.2.description':
        '服务端只返回商品和所属分类都处于 active 的记录。',
      'source.shopping.publicCatalog.stock.flow.3.title':
        '只投影真正可售库存',
      'source.shopping.publicCatalog.stock.flow.3.description':
        '响应中的 stock 使用 stock - reservedStock 计算，并最小限制为 0。',
      'source.shopping.publicCatalog.stock.flow.4.title':
        '验证并解析响应',
      'source.shopping.publicCatalog.stock.flow.4.description':
        'Flutter 会在建立 Product 模型前拒绝网络异常、非 200 响应和错误 payload 结构。',
      'source.shopping.publicCatalog.stock.code.mobile':
        'ProductService 带超时请求公开商品目录，并验证响应结构。',
      'source.shopping.publicCatalog.stock.code.server':
        '公开接口过滤已下架目录，并暴露可用库存而不是仓库原始库存。',
    },

    'zh-TW': {
      'source.shopping.catalogAdmin.name':
        '商品目錄後台管理',
      'source.shopping.catalogAdmin.summary':
        '展示 React 管理後台與 Node.js 後端如何處理商品、分類和庫存操作，並由伺服器統一執行約束。',

      'source.shopping.catalogAdmin.products.name':
        '商品生命週期與可用性規則',
      'source.shopping.catalogAdmin.products.summary':
        '建立、編輯、重新上架、下架和讀取商品，同時約束價格、庫存與有效分類之間的關係。',
      'source.shopping.catalogAdmin.products.explanation.1':
        'React 管理後台提供列表、建立、PATCH、下架和重新上架操作。伺服器會驗證商品必填欄位，把顯示價格轉換成整數 minor unit，在建立時驗證庫存，並分別回傳 stock、reservedStock 與 availableStock。',
      'source.shopping.catalogAdmin.products.explanation.2':
        '商品只能建立在有效分類中，也只能移動到有效分類或在有效分類下重新上架。刪除並不真正刪除資料庫紀錄，而是把 isActive 改成 false，因此歷史訂單和庫存紀錄仍能保留引用。',
      'source.shopping.catalogAdmin.products.flow.1.title':
        '送出型別化商品操作',
      'source.shopping.catalogAdmin.products.flow.1.description':
        '管理後台把建立、修改、下架和重新上架動作映射到受保護的 /api/admin/products 介面。',
      'source.shopping.catalogAdmin.products.flow.2.title':
        '伺服器驗證商品欄位',
      'source.shopping.catalogAdmin.products.flow.2.description':
        'API 要求 categoryId、title、imageUrl，驗證非負價格，並要求新商品庫存必須是非負整數。',
      'source.shopping.catalogAdmin.products.flow.3.title':
        '強制要求有效分類',
      'source.shopping.catalogAdmin.products.flow.3.description':
        'ensureActiveCategory 會在建立、換分類或重新上架前拒絕不存在或已下架的分類。',
      'source.shopping.catalogAdmin.products.flow.4.title':
        '下架而不是物理刪除',
      'source.shopping.catalogAdmin.products.flow.4.description':
        'DELETE 只把商品標記為 inactive，從而保留歷史訂單和庫存流水所依賴的資料。',
      'source.shopping.catalogAdmin.products.code.client':
        'React 管理後台送出型別化商品建立請求，並讀取伺服器標準化後的商品資料。',
      'source.shopping.catalogAdmin.products.code.server':
        '商品建立會驗證目錄資料、檢查分類、用最小貨幣單位儲存價格，並初始化為上架狀態。',
      'source.shopping.catalogAdmin.products.code.categoryGuard':
        '分類守衛阻止商品被建立、移動或重新上架到已下架分類。',

      'source.shopping.catalogAdmin.categories.name':
        '分類生命週期與安全下架',
      'source.shopping.catalogAdmin.categories.summary':
        '建立和排序分類，拒絕重複名稱，並阻止仍包含上架商品的分類被直接下架。',
      'source.shopping.catalogAdmin.categories.explanation.1':
        '分類建立和編輯會驗證非空名稱與非負整數 sortOrder。重複名稱按大小寫不敏感方式檢查，列表介面還會回傳每個分類的商品數量。',
      'source.shopping.catalogAdmin.categories.explanation.2':
        '分類下架帶有目錄完整性保護：在 isActive 變為 false 之前，伺服器會統計分類中的上架商品，只要仍存在上架商品就拒絕下架。',
      'source.shopping.catalogAdmin.categories.flow.1.title':
        '建立、編輯、上架或下架分類',
      'source.shopping.catalogAdmin.categories.flow.1.description':
        '管理後台提供分類管理操作，其中重新上架透過普通 PATCH 介面完成。',
      'source.shopping.catalogAdmin.categories.flow.2.title':
        '驗證分類中繼資料',
      'source.shopping.catalogAdmin.categories.flow.2.description':
        '後端會 trim 分類名稱，並只接受非負整數 sortOrder。',
      'source.shopping.catalogAdmin.categories.flow.3.title':
        '拒絕重複分類名',
      'source.shopping.catalogAdmin.categories.flow.3.description':
        '大小寫不敏感的重複檢查避免出現兩個視覺上相同的分類名稱。',
      'source.shopping.catalogAdmin.categories.flow.4.title':
        '下架分類前保護上架商品',
      'source.shopping.catalogAdmin.categories.flow.4.description':
        '只要分類中仍有任何上架商品，該分類就不能被下架。',
      'source.shopping.catalogAdmin.categories.code.client':
        'React 管理後台透過受保護的分類 API 建立分類。',
      'source.shopping.catalogAdmin.categories.code.server':
        '分類更新會驗證修改欄位、重複名稱、狀態值以及是否允許安全下架。',
      'source.shopping.catalogAdmin.categories.code.guard':
        '下架守衛統計上架商品數量，在目錄尚未整理完成時阻止分類下架。',

      'source.shopping.catalogAdmin.inventory.name':
        '庫存操作與庫存流水',
      'source.shopping.catalogAdmin.inventory.summary':
        '在列鎖保護下執行入庫、出庫和盤點調整，並記錄操作者以及庫存變化前後的數量。',
      'source.shopping.catalogAdmin.inventory.explanation.1':
        '庫存介面會標準化 STOCK_IN、STOCK_OUT 和 ADJUSTMENT 操作，並把目前認證管理員記錄為 createdByUserId。服務層在計算新庫存前會用 FOR UPDATE 鎖定商品列。',
      'source.shopping.catalogAdmin.inventory.explanation.2':
        '手動操作不能移走已經被 reservedStock 佔用的庫存。每次成功修改都會寫入 InventoryMovement，包括 quantityDelta、stockBefore、stockAfter、備註、時間與管理員身分；流水可以全域查詢，也可以按商品篩選，並限制回傳數量。',
      'source.shopping.catalogAdmin.inventory.flow.1.title':
        '提交庫存操作',
      'source.shopping.catalogAdmin.inventory.flow.1.description':
        '管理後台可以提交型別化庫存修改，也可以讀取最近的庫存流水。',
      'source.shopping.catalogAdmin.inventory.flow.2.title':
        '標準化操作類型與管理員身分',
      'source.shopping.catalogAdmin.inventory.flow.2.description':
        '路由驗證操作欄位，並要求 response locals 中存在已認證的管理員身分。',
      'source.shopping.catalogAdmin.inventory.flow.3.title':
        '修改庫存前鎖定商品列',
      'source.shopping.catalogAdmin.inventory.flow.3.description':
        '服務層使用 SELECT ... FOR UPDATE，在同一個交易中計算操作、保護 reservedStock 並更新商品。',
      'source.shopping.catalogAdmin.inventory.flow.4.title':
        '寫入並查詢庫存流水',
      'source.shopping.catalogAdmin.inventory.flow.4.description':
        '每次庫存變化都會寫入 movement；GET 介面按最新優先回傳商品和管理員中繼資料。',
      'source.shopping.catalogAdmin.inventory.code.client':
        '管理後台把庫存修改送到 inventory movement 介面。',
      'source.shopping.catalogAdmin.inventory.code.service':
        '庫存服務鎖定商品列、驗證可用庫存、更新 stock，並在同一個交易中寫入流水。',
      'source.shopping.catalogAdmin.inventory.code.ledger':
        '庫存流水查詢回傳商品、變化前後庫存、備註以及執行操作的管理員。',

      'source.shopping.customerOrders.name':
        '客戶訂單生命週期',
      'source.shopping.customerOrders.summary':
        '展示付款與庫存狀態變化時，伺服器如何維持客戶訂單的一致性。',
      'source.shopping.customerOrders.cancel.name':
        '安全取消待付款訂單',
      'source.shopping.customerOrders.cancel.summary':
        '確認客戶身分、拒絕不可取消狀態、取消未完成的 Stripe PaymentIntent，並原子釋放鎖定庫存。',
      'source.shopping.customerOrders.cancel.explanation.1':
        '取消路由從伺服器認證上下文讀取 customer ID，而不是相信 request body 傳來的使用者身分。服務層會驗證訂單歸屬；如果訂單已經取消則可安全回傳，否則只允許取消仍未付款的 PENDING_PAYMENT 訂單。',
      'source.shopping.customerOrders.cancel.explanation.2':
        '存在 PaymentIntent 時會先檢查 Stripe，再進入資料庫取消流程；如果付款已經 succeeded 就禁止取消。確認安全後，訂單狀態修改和 reservedStock 釋放會在同一個 Prisma 交易中執行，並透過 update guard 偵測並行狀態變化。',
      'source.shopping.customerOrders.cancel.flow.1.title':
        '把取消操作綁定到目前客戶',
      'source.shopping.customerOrders.cancel.flow.1.description':
        '路由從 response.locals 讀取 customerId，並與 URL 中的訂單 ID 一起交給服務層。',
      'source.shopping.customerOrders.cancel.flow.2.title':
        '驗證歸屬與可取消狀態',
      'source.shopping.customerOrders.cancel.flow.2.description':
        '只有訂單擁有者可以取消，而且未取消訂單必須仍處於未付款 PENDING_PAYMENT。',
      'source.shopping.customerOrders.cancel.flow.3.title':
        '釋放訂單前先處理 Stripe',
      'source.shopping.customerOrders.cancel.flow.3.description':
        '未完成 PaymentIntent 會被取消；已經 succeeded 的 intent 會阻止取消，避免已付款訂單丟失庫存。',
      'source.shopping.customerOrders.cancel.flow.4.title':
        '原子更新訂單並釋放庫存',
      'source.shopping.customerOrders.cancel.flow.4.description':
        '帶條件保護的交易把訂單標記為取消並釋放 reservedStock；如果並行請求已先改變狀態，則目前操作會失敗。',
      'source.shopping.customerOrders.cancel.code.route':
        '受保護的取消介面把 URL 訂單 ID 與目前認證客戶身分綁定。',
      'source.shopping.customerOrders.cancel.code.service':
        '取消服務協調 Stripe 狀態、並行更新保護、訂單狀態修改和庫存釋放。',

      'source.shopping.publicCatalog.name':
        '公開商品目錄交付',
      'source.shopping.publicCatalog.summary':
        '展示 Flutter 客戶端如何只接收到仍然有效且可銷售的商品目錄資料。',
      'source.shopping.publicCatalog.stock.name':
        '可售庫存投影',
      'source.shopping.publicCatalog.stock.summary':
        '隱藏已下架商品和分類，只暴露可售庫存而不是原始庫存，並在 Flutter 建模前驗證回應結構。',
      'source.shopping.publicCatalog.stock.explanation.1':
        'GET /api/products 只查詢上架商品，並要求所屬分類也處於上架狀態。後端不會把 reservedStock 當成可售數量；公開 stock 欄位實際是 max(0, stock - reservedStock)。',
      'source.shopping.publicCatalog.stock.explanation.2':
        'Flutter ProductService 使用 API_BASE_URL 產生請求位址，設定 10 秒逾時，要求 HTTP 200，檢查 payload 必須是 Map 列表，然後逐項交給 Product.fromJson。',
      'source.shopping.publicCatalog.stock.flow.1.title':
        '請求公開商品目錄',
      'source.shopping.publicCatalog.stock.flow.1.description':
        'Flutter 透過 ProductService 呼叫 GET /api/products，並為請求設定逾時。',
      'source.shopping.publicCatalog.stock.flow.2.title':
        '過濾已下架目錄紀錄',
      'source.shopping.publicCatalog.stock.flow.2.description':
        '伺服器只回傳商品和所屬分類都處於 active 的紀錄。',
      'source.shopping.publicCatalog.stock.flow.3.title':
        '只投影真正可售庫存',
      'source.shopping.publicCatalog.stock.flow.3.description':
        '回應中的 stock 使用 stock - reservedStock 計算，並最小限制為 0。',
      'source.shopping.publicCatalog.stock.flow.4.title':
        '驗證並解析回應',
      'source.shopping.publicCatalog.stock.flow.4.description':
        'Flutter 會在建立 Product 模型前拒絕網路異常、非 200 回應和錯誤 payload 結構。',
      'source.shopping.publicCatalog.stock.code.mobile':
        'ProductService 帶逾時請求公開商品目錄，並驗證回應結構。',
      'source.shopping.publicCatalog.stock.code.server':
        '公開介面過濾已下架目錄，並暴露可用庫存而不是倉庫原始庫存。',
    },
  },
} satisfies SourceProjectModule;
