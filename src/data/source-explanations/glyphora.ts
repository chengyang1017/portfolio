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
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/create_post_screen.dart',
              captionKey: 'source.glyphora.publish.code.client',
              code: `final postId = _draftPostId;
final imageUrls = await uploadImages(postId);

await postRepository.createPost(
  PostModel(
    id: postId,
    userId: user.id,
    title: title.text.trim(),
    content: plainContent,
    bodyDelta: bodyDelta,
    category: widget.category,
    categoryId: _selectedCategoryId,
    categoryPath: _resolvedCategoryPath,
    languageCode: widget.languageCode,
    primaryLanguageCode: widget.languageCode,
    availableLanguageCodes: <String>[widget.languageCode],
    imageUrls: imageUrls,
  ),
);`,
            },
            {
              id: 'publish-server',
              language: 'typescript',
              filePath: 'apps/api/src/routes/post_route.ts',
              captionKey: 'source.glyphora.publish.code.server',
              code: `const post = await prisma.$transaction(async (transaction) => {
  const createdPost = await transaction.post.create({
    data: {
      firestoreId,
      authorId: author.id,
      category,
      primaryLanguageCode: languageCode,
      likeCount: 0,
      commentCount: 0,
    },
  });

  await transaction.postVersion.create({
    data: {
      postId: createdPost.id,
      authorId: author.id,
      languageCode,
      title,
      content,
      bodyDelta: bodyDelta as Prisma.InputJsonValue,
      type: 'original',
    },
  });
});`,
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
              filePath:
                'apps/mobile-flutter/lib/features/post/presentation/screens/post_detail_screen.dart',
              captionKey: 'source.glyphora.like.code.client',
              code: `final previousLiked = _isLiked;
final previousLikeCount = _likeCount;
final nextLiked = !previousLiked;

setState(() {
  _isLiked = nextLiked;
  _likeCount = nextLiked
      ? previousLikeCount + 1
      : (previousLikeCount > 0 ? previousLikeCount - 1 : 0);
});

try {
  final confirmedLikeCount = await postProvider.toggleLike(
    widget.postId,
    liked: nextLiked,
  );
  setState(() => _likeCount = confirmedLikeCount);
} catch (_) {
  setState(() {
    _isLiked = previousLiked;
    _likeCount = previousLikeCount;
  });
}`,
            },
            {
              id: 'like-server-transaction',
              language: 'typescript',
              filePath: 'apps/api/src/routes/post_route.ts',
              captionKey: 'source.glyphora.like.code.server',
              code: `await transaction.postLike.createMany({
  data: [{ postId: post.id, userId: user.id }],
  skipDuplicates: true,
});

const likeCount = await transaction.postLike.count({
  where: { postId: post.id },
});

await transaction.post.update({
  where: { id: post.id },
  data: { likeCount },
});

return { liked: true, likeCount };`,
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
              filePath:
                'apps/mobile-flutter/lib/features/chat/data/services/chat_service.dart',
              captionKey: 'source.glyphora.chat.send.code',
              code: `batch.set(messageRef, {
  'type': 'text',
  'senderId': senderId,
  'content': cleanContent,
  'timestamp': now,
  'hiddenFor': <String>[],
  'status': 'active',
  'cleanupAt': null,
});

final chatUpdates = <String, dynamic>{
  'lastMessage': cleanContent,
  'lastMessageId': messageRef.id,
  'lastSenderId': senderId,
  'updatedAt': now,
};

for (final userId in users) {
  chatUpdates['unreadCount.$userId'] =
      userId == senderId ? 0 : FieldValue.increment(1);
}

batch.update(chatRef, chatUpdates);
await batch.commit();`,
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
              filePath:
                'apps/mobile-flutter/lib/features/chat/data/services/chat_service.dart',
              captionKey: 'source.glyphora.chat.delete.code.client',
              code: `final updates = <String, dynamic>{
  'status': 'deleted',
  'deletedBy': currentUserId,
  'deletedAt': FieldValue.serverTimestamp(),
  'cleanupAt': _buildCleanupAt(),
  'content': '',
  'imageUrl': null,
  'editedAt': null,
};

transaction.update(messageRef, updates);`,
            },
            {
              id: 'cleanup-code',
              language: 'typescript',
              filePath: 'apps/api/src/jobs/cleanup_expired_chat_messages.ts',
              captionKey: 'source.glyphora.chat.delete.code.server',
              code: `const cleanupSnapshot = await firebaseFirestore
  .collectionGroup('messages')
  .where('cleanupAt', '<=', now)
  .orderBy('cleanupAt')
  .limit(CLEANUP_BATCH_SIZE)
  .get();

const canPhysicallyDelete =
  status === 'deleted' || hiddenForEveryone;

if (!canPhysicallyDelete) {
  await messageDocument.ref.update({
    cleanupAt: FieldValue.delete(),
  });
  continue;
}`,
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
              filePath:
                'apps/mobile-flutter/lib/features/notes/data/repositories/firebase_note_repository.dart',
              captionKey: 'source.glyphora.notes.permissions.code',
              code: `await _firestore.runTransaction((transaction) async {
  final snapshot = await transaction.get(reference);

  if (!snapshot.exists) {
    throw StateError('笔记不存在');
  }

  final data = snapshot.data() ?? const <String, dynamic>{};
  final ownerId = data['ownerId']?.toString() ?? '';
  final allowOthersEdit = data['allowOthersEdit'] as bool? ?? false;
  final participantIds = List<String>.from(
    data['participantIds'] ?? const <String>[],
  );

  final isOwner = ownerId == userId;
  final isParticipant = participantIds.contains(userId);
  final canEdit = isOwner || (isParticipant && allowOthersEdit);

  if (!canEdit) {
    throw StateError('无权编辑这条笔记');
  }

  transaction.update(reference, updates);
});`,
            },
          ],
          relatedFeatureSlugs: [],
        },
      ],
    },
  ],
};
