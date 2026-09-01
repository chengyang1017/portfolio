import type { ProjectSourceExplanation } from './types';

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

              captionKey: 'source.glyphora.publish.code.client',
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