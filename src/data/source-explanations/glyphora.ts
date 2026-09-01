

export const glyphoraSourceExplanation: ProjectSourceExplanation = {
  projectSlug: 'glyphora',
  titleKey: 'source.glyphora.title',
  summaryKey: 'source.glyphora.summary',
  categories: [
    {
      slug: 'posts-engagement',
      nameKey: 'source.glyphora.posts.name',
      summaryKey: 'source.glyphora.posts.summary',
      features: [
        {
          slug: 'publish-post',
          nameKey: 'source.glyphora.publish.name',
          summaryKey: 'source.glyphora.publish.summary',
          explanationKeys: [
            'source.glyphora.publish.explanation.1',
            'source.glyphora.publish.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/post/presentation/screens/create_post_screen.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            { path: 'apps/api/src/routes/post_route.ts' },
          ],
          codeFlow: [
            {
              id: 'validate-and-upload',
              titleKey: 'source.glyphora.publish.flow.1.title',
              descriptionKey: 'source.glyphora.publish.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/create_post_screen.dart',
            },
            {
              id: 'cross-boundary',
              titleKey: 'source.glyphora.publish.flow.2.title',
              descriptionKey: 'source.glyphora.publish.flow.2.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
            },
            {
              id: 'send-api-request',
              titleKey: 'source.glyphora.publish.flow.3.title',
              descriptionKey: 'source.glyphora.publish.flow.3.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              id: 'database-transaction',
              titleKey: 'source.glyphora.publish.flow.4.title',
              descriptionKey: 'source.glyphora.publish.flow.4.description',
              filePath: 'apps/api/src/routes/post_route.ts',
            },
          ],
          codeBlocks: [
            {
              id: 'publish-client',
              language: 'dart',

              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/presentation/screens/create_post_screen.dart',
                symbol: 'uploadPost',
              },

              captionKey:
                'source.glyphora.publish.code.client',
            },
            {
              id: 'publish-service',
              language: 'dart',

              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
                symbol: 'createPost',
              },
            },
            {
              id: 'publish-api',
              language: 'dart',

              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
                symbol: 'createPost',
              },
            },
            {
              id: 'publish-server',
              language: 'typescript',

              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/api/src/routes/post_route.ts',
                startAnchor: 'const post =',
                endAnchor:
                  '// ============================================================',
              },

              annotations: [
                {
                  anchor: 'const post =',
                  textKey:
                    'source.glyphora.publish.annotation.transaction',
                },
                {
                  anchor: 'const createdPost =',
                  textKey:
                    'source.glyphora.publish.annotation.createPost',
                },
                {
                  anchor:
                    'await transaction.postVersion',
                  textKey:
                    'source.glyphora.publish.annotation.version',
                },
                {
                  anchor:
                    'if (images.length > 0)',
                  textKey:
                    'source.glyphora.publish.annotation.images',
                },
                {
                  anchor:
                    'response.status(201).json',
                  textKey:
                    'source.glyphora.publish.annotation.response',
                },
              ],

              captionKey:
                'source.glyphora.publish.code.server',
            },
          ],
          relatedFeatureSlugs: ['optimistic-like'],
        },
        {
          slug: 'optimistic-like',
          nameKey: 'source.glyphora.like.name',
          summaryKey: 'source.glyphora.like.summary',
          explanationKeys: [
            'source.glyphora.like.explanation.1',
            'source.glyphora.like.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            { path: 'apps/api/src/routes/post_route.ts' },
            { path: 'apps/api/prisma/schema.prisma' },
          ],
          codeFlow: [
            {
              id: 'optimistic-state',
              titleKey: 'source.glyphora.like.flow.1.title',
              descriptionKey: 'source.glyphora.like.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              id: 'idempotent-request',
              titleKey: 'source.glyphora.like.flow.2.title',
              descriptionKey: 'source.glyphora.like.flow.2.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              id: 'recount-likes',
              titleKey: 'source.glyphora.like.flow.3.title',
              descriptionKey: 'source.glyphora.like.flow.3.description',
              filePath: 'apps/api/src/routes/post_route.ts',
            },
            {
              id: 'reconcile-state',
              titleKey: 'source.glyphora.like.flow.4.title',
              descriptionKey: 'source.glyphora.like.flow.4.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
          ],
          codeBlocks: [
            {
  id: 'optimistic-like-client',
  language: 'dart',

  source: {
    type: 'github',
    repository: 'chengyang1017/glyphora',
    path:
      'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
    symbol: '_toggleLike',
  },

  captionKey: 'source.glyphora.like.code.client',
},
            {
  id: 'like-server-transaction',
  language: 'typescript',

  source: {
    type: 'github',
    repository: 'chengyang1017/glyphora',
    path: 'apps/api/src/routes/post_route.ts',

    startAnchor: 'postRouter.put(',
    endAnchor:
      '// ============================================================',
  },

  captionKey: 'source.glyphora.like.code.server',
},
          ],
          relatedFeatureSlugs: ['publish-post'],
        },
        {
          slug: 'bookmark-posts',
          nameKey: 'source.glyphora.bookmark.name',
          summaryKey: 'source.glyphora.bookmark.summary',
          explanationKeys: [
            'source.glyphora.bookmark.explanation.1',
            'source.glyphora.bookmark.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              path: 'apps/api/src/routes/bookmark_route.ts',
            },
          ],
          codeFlow: [
            {
              id: 'bookmark-optimistic-state',
              titleKey: 'source.glyphora.bookmark.flow.1.title',
              descriptionKey: 'source.glyphora.bookmark.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              id: 'bookmark-service-boundary',
              titleKey: 'source.glyphora.bookmark.flow.2.title',
              descriptionKey: 'source.glyphora.bookmark.flow.2.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
            },
            {
              id: 'bookmark-api-operation',
              titleKey: 'source.glyphora.bookmark.flow.3.title',
              descriptionKey: 'source.glyphora.bookmark.flow.3.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              id: 'bookmark-idempotent-persistence',
              titleKey: 'source.glyphora.bookmark.flow.4.title',
              descriptionKey: 'source.glyphora.bookmark.flow.4.description',
              filePath: 'apps/api/src/routes/bookmark_route.ts',
            },
          ],
          codeBlocks: [
            {
              id: 'bookmark-client',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
                symbol: '_toggleBookmark',
              },
              captionKey: 'source.glyphora.bookmark.code.client',
            },
            {
              id: 'bookmark-service',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
                symbol: 'toggleBookmark',
              },
              captionKey: 'source.glyphora.bookmark.code.service',
            },
            {
              id: 'bookmark-api',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
                symbol: 'bookmarkPost',
              },
              captionKey: 'source.glyphora.bookmark.code.api',
            },
            {
              id: 'bookmark-server',
              language: 'typescript',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path: 'apps/api/src/routes/bookmark_route.ts',
                startAnchor: 'postBookmarkRouter.post(',
                endAnchor:
                  '// ============================================================',
              },
              captionKey: 'source.glyphora.bookmark.code.server',
            },
          ],
          relatedFeatureSlugs: ['optimistic-like', 'report-posts'],
        },
        {
          slug: 'report-posts',
          nameKey: 'source.glyphora.report.name',
          summaryKey: 'source.glyphora.report.summary',
          explanationKeys: [
            'source.glyphora.report.explanation.1',
            'source.glyphora.report.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              path: 'apps/api/src/routes/report_route.ts',
            },
          ],
          codeFlow: [
            {
              id: 'report-collect-reason',
              titleKey: 'source.glyphora.report.flow.1.title',
              descriptionKey: 'source.glyphora.report.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              id: 'report-repository-boundary',
              titleKey: 'source.glyphora.report.flow.2.title',
              descriptionKey: 'source.glyphora.report.flow.2.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
            },
            {
              id: 'report-http-request',
              titleKey: 'source.glyphora.report.flow.3.title',
              descriptionKey: 'source.glyphora.report.flow.3.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              id: 'report-validate-and-create',
              titleKey: 'source.glyphora.report.flow.4.title',
              descriptionKey: 'source.glyphora.report.flow.4.description',
              filePath: 'apps/api/src/routes/report_route.ts',
            },
          ],
          codeBlocks: [
            {
              id: 'report-client',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
                symbol: '_reportPost',
              },
              captionKey: 'source.glyphora.report.code.client',
            },
            {
              id: 'report-service',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
                symbol: 'reportPost',
              },
              captionKey: 'source.glyphora.report.code.service',
            },
            {
              id: 'report-api',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
                symbol: 'reportPost',
              },
              captionKey: 'source.glyphora.report.code.api',
            },
            {
              id: 'report-server',
              language: 'typescript',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path: 'apps/api/src/routes/report_route.ts',
                startAnchor: 'postReportRouter.post(',
              },
              captionKey: 'source.glyphora.report.code.server',
            },
          ],
          relatedFeatureSlugs: ['bookmark-posts'],
        },
        {
          slug: 'multilingual-versions',
          nameKey: 'source.glyphora.versions.name',
          summaryKey: 'source.glyphora.versions.summary',
          explanationKeys: [
            'source.glyphora.versions.explanation.1',
            'source.glyphora.versions.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/translation/presentation/screens/post_translation_screen.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              path: 'apps/api/src/routes/post_route.ts',
            },
          ],
          codeFlow: [
            {
              id: 'version-select-language',
              titleKey: 'source.glyphora.versions.flow.1.title',
              descriptionKey: 'source.glyphora.versions.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              id: 'version-compose-translation',
              titleKey: 'source.glyphora.versions.flow.2.title',
              descriptionKey: 'source.glyphora.versions.flow.2.description',
              filePath:
                'apps/mobile-flutter/lib/features/translation/presentation/screens/post_translation_screen.dart',
            },
            {
              id: 'version-send-api',
              titleKey: 'source.glyphora.versions.flow.3.title',
              descriptionKey: 'source.glyphora.versions.flow.3.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              id: 'version-create-record',
              titleKey: 'source.glyphora.versions.flow.4.title',
              descriptionKey: 'source.glyphora.versions.flow.4.description',
              filePath: 'apps/api/src/routes/post_route.ts',
            },
          ],
          codeBlocks: [
            {
              id: 'version-open-client',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
                symbol: '_openTranslation',
              },
              captionKey: 'source.glyphora.versions.code.open',
            },
            {
              id: 'version-publish-client',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/translation/presentation/screens/post_translation_screen.dart',
                symbol: '_publishTranslation',
              },
              captionKey: 'source.glyphora.versions.code.publish',
            },
            {
              id: 'version-service',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
                symbol: 'addLanguageVersion',
              },
              captionKey: 'source.glyphora.versions.code.service',
            },
            {
              id: 'version-api',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
                symbol: 'addLanguageVersion',
              },
              captionKey: 'source.glyphora.versions.code.api',
            },
            {
              id: 'version-server',
              language: 'typescript',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path: 'apps/api/src/routes/post_route.ts',
                startAnchor:
                  '// POST /api/v1/posts/:id/versions',
                endAnchor:
                  '// ============================================================',
              },
              captionKey: 'source.glyphora.versions.code.server',
            },
          ],
          relatedFeatureSlugs: ['publish-post', 'edit-delete-posts'],
        },
        {
          slug: 'edit-history',
          nameKey: 'source.glyphora.history.name',
          summaryKey: 'source.glyphora.history.summary',
          explanationKeys: [
            'source.glyphora.history.explanation.1',
            'source.glyphora.history.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/post/presentation/screens/post_edit_history_screen.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/repositories/post_repository_impl.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              path: 'apps/api/src/routes/post_data_route.ts',
            },
          ],
          codeFlow: [
            {
              id: 'history-load-screen',
              titleKey: 'source.glyphora.history.flow.1.title',
              descriptionKey: 'source.glyphora.history.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/post_edit_history_screen.dart',
            },
            {
              id: 'history-map-domain',
              titleKey: 'source.glyphora.history.flow.2.title',
              descriptionKey: 'source.glyphora.history.flow.2.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/repositories/post_repository_impl.dart',
            },
            {
              id: 'history-request-api',
              titleKey: 'source.glyphora.history.flow.3.title',
              descriptionKey: 'source.glyphora.history.flow.3.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              id: 'history-owner-query',
              titleKey: 'source.glyphora.history.flow.4.title',
              descriptionKey: 'source.glyphora.history.flow.4.description',
              filePath: 'apps/api/src/routes/post_data_route.ts',
            },
          ],
          codeBlocks: [
            {
              id: 'history-client-reload',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/presentation/screens/post_edit_history_screen.dart',
                symbol: '_reload',
              },
              captionKey: 'source.glyphora.history.code.client',
            },
            {
              id: 'history-repository',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/repositories/post_repository_impl.dart',
                symbol: 'getEditHistory',
              },
              captionKey: 'source.glyphora.history.code.repository',
            },
            {
              id: 'history-api',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
                symbol: 'getEditHistory',
              },
              captionKey: 'source.glyphora.history.code.api',
            },
            {
              id: 'history-server',
              language: 'typescript',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path: 'apps/api/src/routes/post_data_route.ts',
                startAnchor:
                  '// GET /api/v1/posts/:id/edit-history',
              },
              captionKey: 'source.glyphora.history.code.server',
            },
          ],
          relatedFeatureSlugs: ['edit-delete-posts'],
        },
        {
          slug: 'edit-delete-posts',
          nameKey: 'source.glyphora.editDelete.name',
          summaryKey: 'source.glyphora.editDelete.summary',
          explanationKeys: [
            'source.glyphora.editDelete.explanation.1',
            'source.glyphora.editDelete.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
            },
            {
              path: 'apps/api/src/routes/post_data_route.ts',
            },
            {
              path: 'apps/api/src/routes/post_route.ts',
            },
          ],
          codeFlow: [
            {
              id: 'edit-open-rich-editor',
              titleKey: 'source.glyphora.editDelete.flow.1.title',
              descriptionKey: 'source.glyphora.editDelete.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
            },
            {
              id: 'edit-save-version',
              titleKey: 'source.glyphora.editDelete.flow.2.title',
              descriptionKey: 'source.glyphora.editDelete.flow.2.description',
              filePath:
                'apps/api/src/routes/post_data_route.ts',
            },
            {
              id: 'delete-post-metadata',
              titleKey: 'source.glyphora.editDelete.flow.3.title',
              descriptionKey: 'source.glyphora.editDelete.flow.3.description',
              filePath: 'apps/api/src/routes/post_route.ts',
            },
            {
              id: 'delete-storage-cleanup',
              titleKey: 'source.glyphora.editDelete.flow.4.title',
              descriptionKey: 'source.glyphora.editDelete.flow.4.description',
              filePath:
                'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
            },
          ],
          codeBlocks: [
            {
              id: 'edit-client',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
                symbol: '_editPost',
              },
              captionKey: 'source.glyphora.editDelete.code.client',
            },
            {
              id: 'edit-service',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
                symbol: 'updateLanguageVersionContent',
              },
              captionKey: 'source.glyphora.editDelete.code.service',
            },
            {
              id: 'edit-api',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_api.dart',
                symbol: 'updateLanguageVersion',
              },
              captionKey: 'source.glyphora.editDelete.code.api',
            },
            {
              id: 'edit-server',
              language: 'typescript',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path: 'apps/api/src/routes/post_data_route.ts',
                startAnchor:
                  '// PATCH /api/v1/posts/:id/versions/:languageCode',
                endAnchor:
                  '// GET /api/v1/posts/:id/edit-history',
              },
              captionKey: 'source.glyphora.editDelete.code.server',
            },
            {
              id: 'delete-service',
              language: 'dart',
              source: {
                type: 'github',
                repository: 'chengyang1017/glyphora',
                path:
                  'apps/mobile-flutter/lib/features/post/data/services/post_node_service.dart',
                symbol: 'deletePost',
              },
              captionKey: 'source.glyphora.editDelete.code.delete',
            },
          ],
          relatedFeatureSlugs: ['multilingual-versions', 'edit-history'],
        },
      ],
    },
    {
      slug: 'chat-lifecycle',
      nameKey: 'source.glyphora.chat.name',
      summaryKey: 'source.glyphora.chat.summary',
      features: [
        {
          slug: 'send-message',
          nameKey: 'source.glyphora.chat.send.name',
          summaryKey: 'source.glyphora.chat.send.summary',
          explanationKeys: [
            'source.glyphora.chat.send.explanation.1',
            'source.glyphora.chat.send.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/chat/presentation/providers/chat_provider.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/chat/domain/repositories/chat_repository.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/chat/data/repositories/chat_repository_impl.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/chat/data/services/chat_service.dart',
            },
          ],
          codeFlow: [
            {
              id: 'provider-call',
              titleKey: 'source.glyphora.chat.send.flow.1.title',
              descriptionKey: 'source.glyphora.chat.send.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/chat/presentation/providers/chat_provider.dart',
            },
            {
              id: 'repository-boundary',
              titleKey: 'source.glyphora.chat.send.flow.2.title',
              descriptionKey: 'source.glyphora.chat.send.flow.2.description',
              filePath:
                'apps/mobile-flutter/lib/features/chat/domain/repositories/chat_repository.dart',
            },
            {
              id: 'firestore-batch',
              titleKey: 'source.glyphora.chat.send.flow.3.title',
              descriptionKey: 'source.glyphora.chat.send.flow.3.description',
              filePath:
                'apps/mobile-flutter/lib/features/chat/data/services/chat_service.dart',
            },
            {
              id: 'snapshot-stream',
              titleKey: 'source.glyphora.chat.send.flow.4.title',
              descriptionKey: 'source.glyphora.chat.send.flow.4.description',
              filePath:
                'apps/mobile-flutter/lib/features/chat/data/repositories/chat_repository_impl.dart',
            },
          ],
          codeBlocks: [
            {
  id: 'chat-send-batch',
  language: 'dart',

  source: {
    type: 'github',

    repository: 'chengyang1017/glyphora',

    path:
      'apps/mobile-flutter/lib/features/chat/data/services/chat_service.dart',

    symbol: 'sendMessage',
  },

  captionKey:
    'source.glyphora.chat.send.code',
},
          ],
          relatedFeatureSlugs: ['message-deletion'],
        },
        {
          slug: 'message-deletion',
          nameKey: 'source.glyphora.chat.delete.name',
          summaryKey: 'source.glyphora.chat.delete.summary',
          explanationKeys: [
            'source.glyphora.chat.delete.explanation.1',
            'source.glyphora.chat.delete.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/chat/data/services/chat_service.dart',
            },
            { path: 'apps/api/src/jobs/cleanup_expired_chat_messages.ts' },
            { path: 'apps/api/src/jobs/run_cleanup_expired_chat_messages.ts' },
            { path: 'apps/api/tests/chat_cleanup.test.ts' },
          ],
          codeFlow: [
            {
              id: 'logical-delete',
              titleKey: 'source.glyphora.chat.delete.flow.1.title',
              descriptionKey: 'source.glyphora.chat.delete.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/chat/data/services/chat_service.dart',
            },
            {
              id: 'schedule-cleanup',
              titleKey: 'source.glyphora.chat.delete.flow.2.title',
              descriptionKey: 'source.glyphora.chat.delete.flow.2.description',
              filePath:
                'apps/mobile-flutter/lib/features/chat/data/services/chat_service.dart',
            },
            {
              id: 'query-expired',
              titleKey: 'source.glyphora.chat.delete.flow.3.title',
              descriptionKey: 'source.glyphora.chat.delete.flow.3.description',
              filePath: 'apps/api/src/jobs/cleanup_expired_chat_messages.ts',
            },
            {
              id: 'physical-delete',
              titleKey: 'source.glyphora.chat.delete.flow.4.title',
              descriptionKey: 'source.glyphora.chat.delete.flow.4.description',
              filePath: 'apps/api/src/jobs/cleanup_expired_chat_messages.ts',
            },
          ],
          codeBlocks: [
            {
              id: 'logical-delete-code',
              language: 'dart',

              source: {
                type: 'github',

                repository: 'chengyang1017/glyphora',

                path:
                  'apps/mobile-flutter/lib/features/chat/data/services/chat_service.dart',

                symbol: 'deleteMessageForEveryone',
              },

              captionKey: 'source.glyphora.chat.delete.code.client',
            },
            {
              id: 'cleanup-code',
              language: 'typescript',

              source: {
                type: 'github',

                repository: 'chengyang1017/glyphora',

                path:
                  'apps/api/src/jobs/cleanup_expired_chat_messages.ts',

                symbol: 'cleanupExpiredChatMessages',
              },

              captionKey: 'source.glyphora.chat.delete.code.server',
            },
          ],
          relatedFeatureSlugs: ['send-message'],
        },
      ],
    },
    {
      slug: 'collaborative-notes',
      nameKey: 'source.glyphora.notes.name',
      summaryKey: 'source.glyphora.notes.summary',
      features: [
        {
          slug: 'shared-note-permissions',
          nameKey: 'source.glyphora.notes.permissions.name',
          summaryKey: 'source.glyphora.notes.permissions.summary',
          explanationKeys: [
            'source.glyphora.notes.permissions.explanation.1',
            'source.glyphora.notes.permissions.explanation.2',
          ],
          relatedFiles: [
            {
              path: 'apps/mobile-flutter/lib/features/notes/domain/models/note_model.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/notes/domain/repositories/note_repository.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/notes/data/repositories/firebase_note_repository.dart',
            },
            {
              path: 'apps/mobile-flutter/lib/features/notes/presentation/screens/note_editor_screen.dart',
            },
          ],
          codeFlow: [
            {
              id: 'clean-members',
              titleKey: 'source.glyphora.notes.permissions.flow.1.title',
              descriptionKey:
                'source.glyphora.notes.permissions.flow.1.description',
              filePath:
                'apps/mobile-flutter/lib/features/notes/data/repositories/firebase_note_repository.dart',
            },
            {
              id: 'save-note-data',
              titleKey: 'source.glyphora.notes.permissions.flow.2.title',
              descriptionKey:
                'source.glyphora.notes.permissions.flow.2.description',
              filePath:
                'apps/mobile-flutter/lib/features/notes/data/repositories/firebase_note_repository.dart',
            },
            {
              id: 'authorize-update',
              titleKey: 'source.glyphora.notes.permissions.flow.3.title',
              descriptionKey:
                'source.glyphora.notes.permissions.flow.3.description',
              filePath:
                'apps/mobile-flutter/lib/features/notes/data/repositories/firebase_note_repository.dart',
            },
            {
              id: 'record-editor',
              titleKey: 'source.glyphora.notes.permissions.flow.4.title',
              descriptionKey:
                'source.glyphora.notes.permissions.flow.4.description',
              filePath:
                'apps/mobile-flutter/lib/features/notes/data/repositories/firebase_note_repository.dart',
            },
          ],
          codeBlocks: [
            {
              id: 'note-permission-transaction',
              language: 'dart',

              source: {
                type: 'github',

                repository: 'chengyang1017/glyphora',

                path:
                  'apps/mobile-flutter/lib/features/notes/data/repositories/firebase_note_repository.dart',

                symbol: 'updateNote',
              },

              captionKey: 'source.glyphora.notes.permissions.code',
            },
          ],
          relatedFeatureSlugs: [],
        },
      ],
    },
  ],
};