import type {
  ProjectSourceExplanation,
} from './types';

export const shoppingAppSourceExplanation:
  ProjectSourceExplanation = {
    projectSlug: 'shopping-app',

    titleKey:
      'source.shopping.title',

    summaryKey:
      'source.shopping.summary',

    categories: [
      {
        slug: 'checkout-payments',

        nameKey:
          'source.shopping.payments.name',

        summaryKey:
          'source.shopping.payments.summary',

        features: [
          {
            slug: 'stripe-payment',

            nameKey:
              'source.shopping.stripe.name',

            summaryKey:
              'source.shopping.stripe.summary',

            explanationKeys: [
              'source.shopping.stripe.explanation.1',
              'source.shopping.stripe.explanation.2',
            ],

            relatedFiles: [
              {
                path:
                  'apps/mobile/lib/features/payment/data/services/payment_service.dart',
              },
              {
                path:
                  'server/src/routes/customer_order_routes.ts',
              },
              {
                path:
                  'server/src/services/customer_payment_service.ts',
              },
              {
                path:
                  'server/src/routes/stripe_webhook_routes.ts',
              },
            ],

            codeFlow: [
              {
                id: 'start-payment',

                titleKey:
                  'source.shopping.stripe.flow.1.title',

                descriptionKey:
                  'source.shopping.stripe.flow.1.description',

                filePath:
                  'apps/mobile/lib/features/payment/data/services/payment_service.dart',
              },
              {
                id: 'create-payment-intent',

                titleKey:
                  'source.shopping.stripe.flow.2.title',

                descriptionKey:
                  'source.shopping.stripe.flow.2.description',

                filePath:
                  'server/src/services/customer_payment_service.ts',
              },
              {
                id: 'present-payment-sheet',

                titleKey:
                  'source.shopping.stripe.flow.3.title',

                descriptionKey:
                  'source.shopping.stripe.flow.3.description',

                filePath:
                  'apps/mobile/lib/features/payment/data/services/payment_service.dart',
              },
              {
                id: 'confirm-payment',

                titleKey:
                  'source.shopping.stripe.flow.4.title',

                descriptionKey:
                  'source.shopping.stripe.flow.4.description',

                filePath:
                  'server/src/routes/stripe_webhook_routes.ts',
              },
            ],

            codeBlocks: [
              {
                id: 'stripe-payment-client',

                language: 'dart',

                source: {
                  type: 'github',

                  repository:
                    'chengyang1017/shoppingapp123',

                  path:
                    'apps/mobile/lib/features/payment/data/services/payment_service.dart',

                  symbol: 'pay',
                },

                captionKey:
                  'source.shopping.stripe.code.client',
              },
              {
                id: 'stripe-payment-server',

                language: 'typescript',

                source: {
                  type: 'github',

                  repository:
                    'chengyang1017/shoppingapp123',

                  path:
                    'server/src/services/customer_payment_service.ts',

                  symbol:
                    'createCustomerPaymentIntent',
                },

                captionKey:
                  'source.shopping.stripe.code.server',
              },
              {
                id: 'stripe-webhook',

                language: 'typescript',

                source: {
                  type: 'github',

                  repository:
                    'chengyang1017/shoppingapp123',

                  path:
                    'server/src/routes/stripe_webhook_routes.ts',

                  symbol:
                    'stripeWebhookHandler',
                },

                captionKey:
                  'source.shopping.stripe.code.webhook',
              },
            ],

            relatedFeatureSlugs: [],
          },
        ],
      },
      {
        slug: 'orders-inventory',

        nameKey:
          'source.shopping.orders.name',

        summaryKey:
          'source.shopping.orders.summary',

        features: [
          {
            slug: 'reserved-stock-expiration',

            nameKey:
              'source.shopping.reservation.name',

            summaryKey:
              'source.shopping.reservation.summary',

            explanationKeys: [
              'source.shopping.reservation.explanation.1',
              'source.shopping.reservation.explanation.2',
            ],

            relatedFiles: [
              {
                path:
                  'server/src/services/customer_order_service.ts',
              },
              {
                path:
                  'server/src/services/order_expiration_service.ts',
              },
              {
                path:
                  'server/src/services/inventory_service.ts',
              },
            ],

            codeFlow: [
              {
                id: 'rebuild-order-pricing',

                titleKey:
                  'source.shopping.reservation.flow.1.title',

                descriptionKey:
                  'source.shopping.reservation.flow.1.description',

                filePath:
                  'server/src/services/customer_order_service.ts',
              },
              {
                id: 'reserve-stock',

                titleKey:
                  'source.shopping.reservation.flow.2.title',

                descriptionKey:
                  'source.shopping.reservation.flow.2.description',

                filePath:
                  'server/src/services/customer_order_service.ts',
              },
              {
                id: 'create-expiring-order',

                titleKey:
                  'source.shopping.reservation.flow.3.title',

                descriptionKey:
                  'source.shopping.reservation.flow.3.description',

                filePath:
                  'server/src/services/customer_order_service.ts',
              },
              {
                id: 'release-expired-stock',

                titleKey:
                  'source.shopping.reservation.flow.4.title',

                descriptionKey:
                  'source.shopping.reservation.flow.4.description',

                filePath:
                  'server/src/services/order_expiration_service.ts',
              },
            ],

            codeBlocks: [
              {
                id: 'create-order-reservation',

                language: 'typescript',

                source: {
                  type: 'github',

                  repository:
                    'chengyang1017/shoppingapp123',

                  path:
                    'server/src/services/customer_order_service.ts',

                  symbol:
                    'createCustomerOrder',
                },

                captionKey:
                  'source.shopping.reservation.code.order',
              },
              {
                id: 'expire-pending-orders',

                language: 'typescript',

                source: {
                  type: 'github',

                  repository:
                    'chengyang1017/shoppingapp123',

                  path:
                    'server/src/services/order_expiration_service.ts',

                  symbol:
                    'expirePendingOrders',
                },

                captionKey:
                  'source.shopping.reservation.code.expiration',
              },
              {
                id: 'inventory-row-lock',

                language: 'typescript',

                source: {
                  type: 'github',

                  repository:
                    'chengyang1017/shoppingapp123',

                  path:
                    'server/src/services/inventory_service.ts',

                  symbol:
                    'changeInventory',
                },

                captionKey:
                  'source.shopping.reservation.code.inventory',
              },
            ],

            relatedFeatureSlugs: [],
          },
        ],
      },
    ],
  };
