import type { Language, TranslationDictionary } from './types';

const en: TranslationDictionary = {
  'source.glyphora.title': 'Glyphora source code',
  'source.glyphora.summary':
    'Trace verified production paths across Flutter, repository boundaries, the Node.js API, Prisma, PostgreSQL, Firestore, and scheduled cleanup jobs.',
  'source.glyphora.posts.name': 'Posts & engagement',
  'source.glyphora.posts.summary':
    'How publishing, likes, bookmarks, reports, multilingual versions, edit history, and post lifecycle operations cross client-server boundaries without losing consistency.',
  'source.glyphora.publish.name': 'Publish a multilingual post',
  'source.glyphora.publish.summary':
    'Validate Quill content, upload media, cross the repository boundary, and atomically create the post and its original language version.',
  'source.glyphora.publish.explanation.1':
    'CreatePostScreen validates the title and rich-text body, keeps both plain text and a Quill Delta, copies inline images imported from a note, uploads media, and builds a PostModel with category and language metadata.',
  'source.glyphora.publish.explanation.2':
    'PostNodeService validates the client boundary before PostApi sends POST /posts. The API resolves the Firebase identity to a PostgreSQL user, treats firestoreId as an idempotency key, and creates the post, original language version, and images in a Prisma transaction.',
  'source.glyphora.publish.flow.1.title': 'Validate content and upload media',
  'source.glyphora.publish.flow.1.description':
    'Reject empty or oversized content, preserve the Quill Delta, copy imported note images, and upload selected images under a stable draft ID.',
  'source.glyphora.publish.flow.2.title': 'Cross the repository boundary',
  'source.glyphora.publish.flow.2.description':
    'The screen passes a PostModel to PostRepository; PostNodeService checks the required ID, title, category, and primary language.',
  'source.glyphora.publish.flow.3.title': 'Send the API payload',
  'source.glyphora.publish.flow.3.description':
    'PostApi sends firestoreId, content, Delta, category, language, and image URLs to POST /posts.',
  'source.glyphora.publish.flow.4.title':
    'Create one consistent database state',
  'source.glyphora.publish.flow.4.description':
    'The route resolves the author, returns the matching post on a retry, or creates the post, original version, and images in one Prisma transaction.',
  'source.glyphora.publish.code.client':
    'The Flutter screen assembles the verified post payload after media upload.',
  'source.glyphora.publish.code.server':
    'The API creates the post shell and original language version in the same transaction.',
  'source.glyphora.like.name': 'Optimistic, idempotent likes',
  'source.glyphora.like.summary':
    'Update the interface immediately, use idempotent HTTP operations, recount fact rows, and reconcile with the server result.',
  'source.glyphora.like.explanation.1':
    'PostDetailScreen saves the previous state, applies the next liked state immediately, then calls through PostProvider and PostRepository. A failure restores the exact previous state.',
  'source.glyphora.like.explanation.2':
    'PUT means “ensure liked” and DELETE means “ensure not liked.” A unique constraint and skipDuplicates prevent duplicates, while each transaction recounts PostLike rows and writes the authoritative likeCount to Post.',
  'source.glyphora.like.flow.1.title': 'Apply the optimistic state',
  'source.glyphora.like.flow.1.description':
    'The detail page flips the icon and adjusts the count before waiting for the network.',
  'source.glyphora.like.flow.2.title': 'Send an idempotent operation',
  'source.glyphora.like.flow.2.description':
    'PostApi uses PUT /posts/:id/like for liking and DELETE on the same resource for unliking.',
  'source.glyphora.like.flow.3.title': 'Recount from database facts',
  'source.glyphora.like.flow.3.description':
    'The API inserts or deletes the user-post relation, counts PostLike rows, and updates Post.likeCount in one transaction.',
  'source.glyphora.like.flow.4.title': 'Confirm or roll back the UI',
  'source.glyphora.like.flow.4.description':
    'The confirmed count replaces the optimistic count; an exception restores the saved liked state and count.',
  'source.glyphora.like.code.client':
    'The interface responds immediately but keeps enough state for a precise rollback.',
  'source.glyphora.like.code.server':
    'Repeated PUT requests are harmless and the counter is derived from PostLike rows.',
  'source.glyphora.bookmark.name': 'Bookmark posts',
  'source.glyphora.bookmark.summary':
    'Keep bookmark interactions immediate while persisting one user-post relation and exposing a dedicated saved-post collection.',
  'source.glyphora.bookmark.explanation.1':
    'PostDetailScreen applies an optimistic bookmark state and rolls back on failure. PostNodeService chooses bookmark or remove-bookmark based on the desired state, while PostApi maps those operations to POST and DELETE on the same resource.',
  'source.glyphora.bookmark.explanation.2':
    'The backend resolves the authenticated user and post, uses upsert for bookmark creation and deleteMany for removal, so repeated requests stay idempotent. Saved posts are returned in reverse bookmark time order.',
  'source.glyphora.bookmark.flow.1.title': 'Update the bookmark state immediately',
  'source.glyphora.bookmark.flow.1.description':
    'The detail screen updates the icon first, keeps the previous value, and marks the operation busy until the server confirms it.',
  'source.glyphora.bookmark.flow.2.title': 'Choose the desired repository operation',
  'source.glyphora.bookmark.flow.2.description':
    'PostNodeService converts the desired boolean state into bookmarkPost or removeBookmark without exposing transport details to the UI.',
  'source.glyphora.bookmark.flow.3.title': 'Use one idempotent HTTP resource',
  'source.glyphora.bookmark.flow.3.description':
    'PostApi sends POST /posts/:id/bookmark to save and DELETE on the same path to remove the bookmark.',
  'source.glyphora.bookmark.flow.4.title': 'Persist one user-post relation',
  'source.glyphora.bookmark.flow.4.description':
    'The API resolves both records, uses upsert to prevent duplicate bookmarks, and deleteMany to make repeated removals harmless.',
  'source.glyphora.bookmark.code.client':
    'The detail screen provides optimistic feedback and an exact rollback path.',
  'source.glyphora.bookmark.code.service':
    'The service selects save or remove from the desired bookmark state.',
  'source.glyphora.bookmark.code.api':
    'PostApi maps bookmark state changes onto POST and DELETE requests.',
  'source.glyphora.bookmark.code.server':
    'The backend creates a bookmark with an idempotent upsert.',
  'source.glyphora.report.name': 'Report posts',
  'source.glyphora.report.summary':
    'Collect a structured reason, cross the repository boundary, validate the request, and prevent self-reports or duplicate reports.',
  'source.glyphora.report.explanation.1':
    'PostDetailScreen opens the report interaction and prevents overlapping submissions. The repository path forwards only the post ID, reason, and optional details to the Node-backed service.',
  'source.glyphora.report.explanation.2':
    'PostApi maps backend error codes into user-facing failures. The server validates the reason enum and details length, rejects self-reports, checks for an existing user-post report, and also relies on the database unique constraint.',
  'source.glyphora.report.flow.1.title': 'Collect and submit the report',
  'source.glyphora.report.flow.1.description':
    'The detail screen gathers a reason and optional details, prevents duplicate taps, and submits through PostRepository.',
  'source.glyphora.report.flow.2.title': 'Cross the repository boundary',
  'source.glyphora.report.flow.2.description':
    'PostNodeService forwards a transport-independent report request to PostApi.',
  'source.glyphora.report.flow.3.title': 'Map HTTP errors into app errors',
  'source.glyphora.report.flow.3.description':
    'PostApi sends POST /posts/:id/reports and translates duplicate, self-report, missing-post, and validation responses.',
  'source.glyphora.report.flow.4.title': 'Validate identity and uniqueness',
  'source.glyphora.report.flow.4.description':
    'The backend verifies the authenticated user and post, rejects reporting your own post, and creates at most one report per user and post.',
  'source.glyphora.report.code.client':
    'The detail page owns the user interaction and busy-state protection.',
  'source.glyphora.report.code.service':
    'The service forwards the normalized report request.',
  'source.glyphora.report.code.api':
    'PostApi sends the report payload and maps backend error codes.',
  'source.glyphora.report.code.server':
    'The backend validates, authorizes, deduplicates, and creates the report.',
  'source.glyphora.versions.name': 'Multilingual post versions',
  'source.glyphora.versions.summary':
    'Publish additional language versions without duplicating the post identity, media, engagement counters, or ownership.',
  'source.glyphora.versions.explanation.1':
    'PostDetailScreen lets the user choose another language and opens PostTranslationScreen. The translation screen keeps the new title, content, Delta, and translation type separate from the existing post identity.',
  'source.glyphora.versions.explanation.2':
    'PostNodeService requires authentication before PostApi sends POST /posts/:id/versions. The backend attaches a new PostVersion to the existing post so availableLanguageCodes can expose all published versions.',
  'source.glyphora.versions.flow.1.title': 'Choose a target language',
  'source.glyphora.versions.flow.1.description':
    'The detail screen filters already-published languages and opens the translation editor for the selected target.',
  'source.glyphora.versions.flow.2.title': 'Compose the new language version',
  'source.glyphora.versions.flow.2.description':
    'PostTranslationScreen validates the translated title and body, preserves rich-text Delta data, and submits the selected translation type.',
  'source.glyphora.versions.flow.3.title': 'Send the version payload',
  'source.glyphora.versions.flow.3.description':
    'PostApi posts languageCode, title, content, bodyDelta, and type to /posts/:id/versions.',
  'source.glyphora.versions.flow.4.title': 'Attach a PostVersion to the existing post',
  'source.glyphora.versions.flow.4.description':
    'The backend resolves the post and authenticated owner, then creates the new language version without creating a second Post record.',
  'source.glyphora.versions.code.open':
    'The post detail page selects an unpublished language and opens the translation workflow.',
  'source.glyphora.versions.code.publish':
    'The translation screen validates and publishes the translated version.',
  'source.glyphora.versions.code.service':
    'The service protects the version-creation boundary with authentication.',
  'source.glyphora.versions.code.api':
    'PostApi sends the additional language version to the existing post resource.',
  'source.glyphora.versions.code.server':
    'The API creates a new PostVersion under the existing post.',
  'source.glyphora.history.name': 'Post edit history',
  'source.glyphora.history.summary':
    'Expose owner-only snapshots of previous post versions and media states created by the authoritative edit transaction.',
  'source.glyphora.history.explanation.1':
    'The edit-history screen requests history through PostRepository. PostRepositoryImpl converts transport maps into PostEditHistoryEntry domain objects before the UI renders them.',
  'source.glyphora.history.explanation.2':
    'PostApi reads /posts/:id/edit-history. The backend only allows the post owner to access the history and returns snapshots ordered by editedAt descending, including title, content, Delta, image URLs, language, and edit type.',
  'source.glyphora.history.flow.1.title': 'Load history for the selected post',
  'source.glyphora.history.flow.1.description':
    'The screen stores one Future for the current post and can replace it when the user reloads.',
  'source.glyphora.history.flow.2.title': 'Map transport data into domain entries',
  'source.glyphora.history.flow.2.description':
    'PostRepositoryImpl turns each returned JSON record into a PostEditHistoryEntry.',
  'source.glyphora.history.flow.3.title': 'Request the owner history endpoint',
  'source.glyphora.history.flow.3.description':
    'PostApi performs GET /posts/:id/edit-history and validates that the returned history is a list.',
  'source.glyphora.history.flow.4.title': 'Authorize and order snapshots',
  'source.glyphora.history.flow.4.description':
    'The backend verifies post ownership and returns PostEditHistory rows ordered from newest to oldest.',
  'source.glyphora.history.code.client':
    'The history screen can replace its Future to reload the latest snapshots.',
  'source.glyphora.history.code.repository':
    'The repository maps raw history records into domain entries.',
  'source.glyphora.history.code.api':
    'PostApi loads and validates the edit-history response.',
  'source.glyphora.history.code.server':
    'The server restricts history to the owner and returns ordered snapshots.',
  'source.glyphora.editDelete.name': 'Edit and delete posts',
  'source.glyphora.editDelete.summary':
    'Edit rich text and media through an authoritative version transaction, preserve history, and delete post data with storage cleanup.',
  'source.glyphora.editDelete.explanation.1':
    'PostDetailScreen opens the rich editor with the current title, content, Delta, and image URLs. Saving goes through updateLanguageVersionContent and PostApi.updateLanguageVersion to the authoritative PATCH route.',
  'source.glyphora.editDelete.explanation.2':
    'The PATCH transaction verifies ownership, snapshots the previous version and image list when something changed, updates the PostVersion and PostImage records, and advances Post.updatedAt. Deletion removes backend metadata first and then the service deletes returned Firebase Storage objects without letting stale media fail the completed post deletion.',
  'source.glyphora.editDelete.flow.1.title': 'Edit the current rich-text version',
  'source.glyphora.editDelete.flow.1.description':
    'The detail page opens the editor with title, content, Delta, and images, then updates local state after a successful save.',
  'source.glyphora.editDelete.flow.2.title': 'Snapshot and update in one transaction',
  'source.glyphora.editDelete.flow.2.description':
    'The authoritative PATCH route checks ownership, records the previous version and images when changed, then updates version, media, and post timestamps.',
  'source.glyphora.editDelete.flow.3.title': 'Delete the post metadata',
  'source.glyphora.editDelete.flow.3.description':
    'The delete API removes the post-side data and returns image URLs that may still need storage cleanup.',
  'source.glyphora.editDelete.flow.4.title': 'Clean up remaining storage objects',
  'source.glyphora.editDelete.flow.4.description':
    'PostNodeService deletes returned Firebase Storage URLs one by one and ignores stale-object failures after metadata deletion succeeds.',
  'source.glyphora.editDelete.code.client':
    'The detail screen owns the rich-edit navigation and local reconciliation.',
  'source.glyphora.editDelete.code.service':
    'The service validates edited content before crossing to the HTTP API.',
  'source.glyphora.editDelete.code.api':
    'PostApi sends the edited version and optional image list to the PATCH endpoint.',
  'source.glyphora.editDelete.code.server':
    'The server snapshots previous data and applies the edit atomically.',
  'source.glyphora.editDelete.code.delete':
    'Deletion completes backend metadata removal first, then cleans up Storage objects.',
  'source.glyphora.chat.name': 'Real-time chat lifecycle',
  'source.glyphora.chat.summary':
    'Repository-separated Firestore messaging with atomic previews, unread counters, logical deletion, and delayed physical cleanup.',
  'source.glyphora.chat.send.name': 'Send and stream a chat message',
  'source.glyphora.chat.send.summary':
    'Write the message, chat preview, and unread counts in one Firestore batch, then stream ordered domain models to the UI.',
  'source.glyphora.chat.send.explanation.1':
    'ChatProvider depends only on ChatRepository. The Firebase implementation maps snapshots into ChatMessage models, so transport details do not cross the domain contract.',
  'source.glyphora.chat.send.explanation.2':
    'ChatService verifies that the sender is the authenticated user and a room member. One batch creates the message and updates the room preview plus unread counters.',
  'source.glyphora.chat.send.flow.1.title': 'Receive the UI command',
  'source.glyphora.chat.send.flow.1.description':
    'ChatProvider forwards the chat ID, sender ID, and text without exposing Firebase types to presentation code.',
  'source.glyphora.chat.send.flow.2.title': 'Pass through the domain contract',
  'source.glyphora.chat.send.flow.2.description':
    'ChatRepository defines application terms; ChatRepositoryImpl owns the Firebase adapter.',
  'source.glyphora.chat.send.flow.3.title':
    'Commit message and room state together',
  'source.glyphora.chat.send.flow.3.description':
    'ChatService verifies identity and membership, writes the message, refreshes the preview, updates unread counts, and commits one batch.',
  'source.glyphora.chat.send.flow.4.title': 'Stream ordered messages',
  'source.glyphora.chat.send.flow.4.description':
    'Snapshots ordered by timestamp are mapped into ChatMessage objects and emitted as a domain stream.',
  'source.glyphora.chat.send.code':
    'One Firestore batch keeps the message, room preview, and unread counters synchronized.',
  'source.glyphora.chat.delete.name': 'Logical deletion and seven-day cleanup',
  'source.glyphora.chat.delete.summary':
    'Support “delete for me” and “delete for everyone” without immediately losing cleanup information.',
  'source.glyphora.chat.delete.explanation.1':
    'Delete-for-me adds the user to hiddenFor and schedules cleanup when every participant has hidden the message. Delete-for-everyone is sender-only, marks it deleted, clears visible content, and schedules cleanup seven days later.',
  'source.glyphora.chat.delete.explanation.2':
    'The Node job queries expired cleanupAt values, verifies deletion or universal hiding, removes attached media, and then deletes the document. Invalid candidates lose cleanupAt instead of being deleted.',
  'source.glyphora.chat.delete.flow.1.title': 'Perform a logical deletion',
  'source.glyphora.chat.delete.flow.1.description':
    'The client preserves the document while changing hiddenFor or status and clearing content that should no longer be displayed.',
  'source.glyphora.chat.delete.flow.2.title': 'Schedule delayed cleanup',
  'source.glyphora.chat.delete.flow.2.description':
    'cleanupAt is set seven days ahead when everyone hides the message or the sender deletes it for everyone.',
  'source.glyphora.chat.delete.flow.3.title': 'Query expired candidates',
  'source.glyphora.chat.delete.flow.3.description':
    'The backend scans the messages collection group for expired cleanupAt values in bounded batches.',
  'source.glyphora.chat.delete.flow.4.title': 'Verify and physically remove',
  'source.glyphora.chat.delete.flow.4.description':
    'The job rechecks the condition, deletes stored media, removes the message document, and reports result totals.',
  'source.glyphora.chat.delete.code.client':
    'Delete-for-everyone keeps lifecycle metadata while removing the visible payload.',
  'source.glyphora.chat.delete.code.server':
    'The cleanup job refuses to delete a message that no longer satisfies the rules.',
  'source.glyphora.notes.name': 'Collaborative notes',
  'source.glyphora.notes.summary':
    'Framework-independent note models and repository contracts with owner-controlled sharing and transactional edit authorization.',
  'source.glyphora.notes.permissions.name': 'Shared-note edit permissions',
  'source.glyphora.notes.permissions.summary':
    'Build a deduplicated participant list, keep sharing under owner control, and authorize every update in a Firestore transaction.',
  'source.glyphora.notes.permissions.explanation.1':
    'The Notes UI depends on NoteRepository and NoteMediaRepository instead of Firebase services. NoteModel stays framework-independent while mapping remains in the data layer.',
  'source.glyphora.notes.permissions.explanation.2':
    'Creation removes blank, duplicate, and owner IDs from sharedUserIds, then builds participantIds from the owner plus shared users. Updates reload current permissions and allow the owner, or a participant when allowOthersEdit is true.',
  'source.glyphora.notes.permissions.flow.1.title': 'Normalize shared members',
  'source.glyphora.notes.permissions.flow.1.description':
    'Remove empty IDs, the owner ID, and duplicates before participant data is stored.',
  'source.glyphora.notes.permissions.flow.2.title': 'Store both sharing views',
  'source.glyphora.notes.permissions.flow.2.description':
    'sharedUserIds records invitees while participantIds contains the owner and all shared users for membership queries.',
  'source.glyphora.notes.permissions.flow.3.title':
    'Authorize against fresh data',
  'source.glyphora.notes.permissions.flow.3.description':
    'The transaction reads ownerId, participantIds, and allowOthersEdit before deciding whether the editor may write.',
  'source.glyphora.notes.permissions.flow.4.title':
    'Write content and editor metadata',
  'source.glyphora.notes.permissions.flow.4.description':
    'An authorized write includes server-timestamped updatedAt and the editor ID in updatedBy.',
  'source.glyphora.notes.permissions.code':
    'Edit authorization is evaluated in the same transaction that writes the note changes.',
    'source.glyphora.publish.annotation.transaction':
  'Create the post and its dependent records in one atomic transaction.',

'source.glyphora.publish.annotation.createPost':
  'Create the main Post record first.',

'source.glyphora.publish.annotation.version':
  'Store the original-language content as the first PostVersion.',

'source.glyphora.publish.annotation.images':
  'Attach uploaded image URLs to the newly created post.',

'source.glyphora.publish.annotation.response':
  'Return the fully serialized post to the Flutter client.',
};

const simplifiedChinese: TranslationDictionary = {
  'source.glyphora.title': 'Glyphora 源代码',
  'source.glyphora.summary':
    '沿着经过核实的真实代码路径，查看 Flutter 客户端、Repository 边界、Node.js API、Prisma、PostgreSQL、Firestore 与定时清理任务如何协作。',
  'source.glyphora.posts.name': '帖子与互动',
  'source.glyphora.posts.summary':
    '发布、点赞、收藏、举报、多语言版本、编辑历史与帖子生命周期如何跨越客户端和服务端边界，同时保持一致性。',
  'source.glyphora.publish.name': '发布多语言帖子',
  'source.glyphora.publish.summary':
    '校验 Quill 内容、上传媒体、经过 Repository 边界，并以事务创建帖子及其原始语言版本。',
  'source.glyphora.publish.explanation.1':
    'CreatePostScreen 校验标题和富文本正文，同时保留纯文本与 Quill Delta；从笔记导入时会复制正文图片，随后上传媒体，并用分类与语言信息构造 PostModel。',
  'source.glyphora.publish.explanation.2':
    'PostNodeService 先校验客户端边界，再由 PostApi 请求 POST /posts。API 把 Firebase 身份解析为 PostgreSQL 用户，以 firestoreId 作为幂等键，并在一个 Prisma 事务中创建帖子、原始语言版本和图片。',
  'source.glyphora.publish.flow.1.title': '校验内容并上传媒体',
  'source.glyphora.publish.flow.1.description':
    '拒绝空内容或超长正文，保留 Quill Delta，复制笔记图片，并用稳定的草稿 ID 上传所选图片。',
  'source.glyphora.publish.flow.2.title': '经过 Repository 边界',
  'source.glyphora.publish.flow.2.description':
    '页面把 PostModel 交给 PostRepository；PostNodeService 再检查 ID、标题、分类和主语言。',
  'source.glyphora.publish.flow.3.title': '发送 API 数据',
  'source.glyphora.publish.flow.3.description':
    'PostApi 把 firestoreId、正文、Delta、分类、语言和图片 URL 发往 POST /posts。',
  'source.glyphora.publish.flow.4.title': '建立一致的数据库状态',
  'source.glyphora.publish.flow.4.description':
    '路由解析作者；重试时返回同一篇帖子，否则在一个 Prisma 事务中创建帖子、原始版本和图片。',
  'source.glyphora.publish.code.client':
    'Flutter 页面在媒体上传完成后组装经过校验的帖子数据。',
  'source.glyphora.publish.code.server':
    'API 在同一事务中创建帖子主体和原始语言版本。',
  'source.glyphora.like.name': '乐观更新与幂等点赞',
  'source.glyphora.like.summary':
    '界面立即响应，HTTP 操作保持幂等，再从真实记录重算数量并与服务端结果对齐。',
  'source.glyphora.like.explanation.1':
    'PostDetailScreen 先保存旧状态，再立即显示新状态，然后经由 PostProvider 与 PostRepository 发出操作。请求失败时会精确恢复之前的状态。',
  'source.glyphora.like.explanation.2':
    'PUT 表示“确保已经点赞”，DELETE 表示“确保没有点赞”。唯一约束和 skipDuplicates 阻止重复点赞；事务重算 PostLike 并把权威 likeCount 写回 Post。',
  'source.glyphora.like.flow.1.title': '先更新界面状态',
  'source.glyphora.like.flow.1.description':
    '详情页不等待网络，先切换图标并调整显示数量。',
  'source.glyphora.like.flow.2.title': '发送幂等操作',
  'source.glyphora.like.flow.2.description':
    'PostApi 用 PUT /posts/:id/like 点赞，用同一资源的 DELETE 取消点赞。',
  'source.glyphora.like.flow.3.title': '从数据库事实重算',
  'source.glyphora.like.flow.3.description':
    'API 新增或删除用户与帖子的关系，统计 PostLike，并在同一事务中更新 Post.likeCount。',
  'source.glyphora.like.flow.4.title': '确认或回滚界面',
  'source.glyphora.like.flow.4.description':
    '服务端数量替换乐观数量；发生异常时恢复保存的点赞状态与数量。',
  'source.glyphora.like.code.client':
    '界面立即响应，同时保留足够的旧状态以便精确回滚。',
  'source.glyphora.like.code.server':
    '重复 PUT 不产生副作用，计数由 PostLike 记录推导。',
  'source.glyphora.bookmark.name': '收藏帖子',
  'source.glyphora.bookmark.summary':
    '让收藏按钮立即响应，同时只保存一条用户与帖子的关系，并提供独立的收藏列表。',
  'source.glyphora.bookmark.explanation.1':
    'PostDetailScreen 先乐观更新收藏状态，失败时回滚。PostNodeService 根据目标状态选择收藏或取消收藏，PostApi 再把它们映射为同一资源上的 POST 与 DELETE。',
  'source.glyphora.bookmark.explanation.2':
    '后端解析当前用户与帖子；创建收藏时使用 upsert 防止重复，取消时使用 deleteMany，让重复请求保持幂等。收藏列表按收藏时间倒序返回。',
  'source.glyphora.bookmark.flow.1.title': '立即更新收藏状态',
  'source.glyphora.bookmark.flow.1.description':
    '详情页先更新图标，保留旧值，并在服务端确认前把操作标记为 busy。',
  'source.glyphora.bookmark.flow.2.title': '选择对应的 Repository 操作',
  'source.glyphora.bookmark.flow.2.description':
    'PostNodeService 根据目标布尔状态选择 bookmarkPost 或 removeBookmark，不让界面接触传输细节。',
  'source.glyphora.bookmark.flow.3.title': '使用同一个幂等 HTTP 资源',
  'source.glyphora.bookmark.flow.3.description':
    'PostApi 用 POST /posts/:id/bookmark 收藏，用同一路径的 DELETE 取消收藏。',
  'source.glyphora.bookmark.flow.4.title': '保存唯一的用户帖子关系',
  'source.glyphora.bookmark.flow.4.description':
    'API 解析用户和帖子，使用 upsert 防止重复收藏，并用 deleteMany 让重复取消也不会出错。',
  'source.glyphora.bookmark.code.client':
    '详情页立即反馈收藏状态，并保留精确回滚路径。',
  'source.glyphora.bookmark.code.service':
    'Service 根据目标收藏状态选择保存或取消。',
  'source.glyphora.bookmark.code.api':
    'PostApi 把收藏状态变化映射为 POST 与 DELETE 请求。',
  'source.glyphora.bookmark.code.server':
    '后端通过幂等 upsert 创建收藏记录。',
  'source.glyphora.report.name': '举报帖子',
  'source.glyphora.report.summary':
    '收集结构化举报原因，经过 Repository 边界，校验请求，并阻止自我举报和重复举报。',
  'source.glyphora.report.explanation.1':
    'PostDetailScreen 负责举报交互并阻止重复提交。Repository 路径只向 Node 服务传递帖子 ID、原因和可选详情。',
  'source.glyphora.report.explanation.2':
    'PostApi 把后端错误码转换为用户可理解的失败信息。服务端校验原因枚举和详情长度，拒绝举报自己的帖子，检查已有举报，并同时依赖数据库唯一约束。',
  'source.glyphora.report.flow.1.title': '收集并提交举报',
  'source.glyphora.report.flow.1.description':
    '详情页收集原因和可选详情，防止重复点击，再通过 PostRepository 提交。',
  'source.glyphora.report.flow.2.title': '经过 Repository 边界',
  'source.glyphora.report.flow.2.description':
    'PostNodeService 把与传输无关的举报请求转交给 PostApi。',
  'source.glyphora.report.flow.3.title': '把 HTTP 错误映射为应用错误',
  'source.glyphora.report.flow.3.description':
    'PostApi 请求 POST /posts/:id/reports，并处理重复举报、自我举报、帖子不存在和校验失败等响应。',
  'source.glyphora.report.flow.4.title': '校验身份与唯一性',
  'source.glyphora.report.flow.4.description':
    '后端验证当前用户和帖子，禁止举报自己的帖子，并保证每个用户对同一帖子最多只有一条举报。',
  'source.glyphora.report.code.client':
    '详情页负责举报交互和 busy 状态保护。',
  'source.glyphora.report.code.service':
    'Service 转发规范化后的举报请求。',
  'source.glyphora.report.code.api':
    'PostApi 发送举报数据并映射后端错误码。',
  'source.glyphora.report.code.server':
    '后端完成校验、授权、去重并创建举报。',
  'source.glyphora.versions.name': '多语言帖子版本',
  'source.glyphora.versions.summary':
    '在不复制帖子身份、媒体、互动计数和所有权的情况下，为同一帖子发布额外语言版本。',
  'source.glyphora.versions.explanation.1':
    'PostDetailScreen 让用户选择另一种语言并打开 PostTranslationScreen。翻译页面把新标题、正文、Delta 和翻译类型与原帖身份分开处理。',
  'source.glyphora.versions.explanation.2':
    'PostNodeService 先要求登录，再由 PostApi 请求 POST /posts/:id/versions。后端把新的 PostVersion 绑定到现有帖子，因此 availableLanguageCodes 可以展示全部已发布版本。',
  'source.glyphora.versions.flow.1.title': '选择目标语言',
  'source.glyphora.versions.flow.1.description':
    '详情页过滤已经发布的语言，并为选中的目标语言打开翻译编辑器。',
  'source.glyphora.versions.flow.2.title': '编写新的语言版本',
  'source.glyphora.versions.flow.2.description':
    'PostTranslationScreen 校验翻译标题和正文，保留富文本 Delta，并提交选定的翻译类型。',
  'source.glyphora.versions.flow.3.title': '发送语言版本数据',
  'source.glyphora.versions.flow.3.description':
    'PostApi 把 languageCode、title、content、bodyDelta 和 type 发到 /posts/:id/versions。',
  'source.glyphora.versions.flow.4.title': '把 PostVersion 绑定到现有帖子',
  'source.glyphora.versions.flow.4.description':
    '后端解析帖子和当前作者，在不创建第二条 Post 的情况下创建新的语言版本。',
  'source.glyphora.versions.code.open':
    '帖子详情页选择尚未发布的语言并进入翻译流程。',
  'source.glyphora.versions.code.publish':
    '翻译页面校验并发布新的语言版本。',
  'source.glyphora.versions.code.service':
    'Service 在创建语言版本前保护认证边界。',
  'source.glyphora.versions.code.api':
    'PostApi 把额外语言版本发送到现有帖子资源。',
  'source.glyphora.versions.code.server':
    'API 在现有帖子下面创建新的 PostVersion。',
  'source.glyphora.history.name': '帖子编辑历史',
  'source.glyphora.history.summary':
    '展示由权威编辑事务生成的旧版本与媒体快照，并只允许帖子作者读取。',
  'source.glyphora.history.explanation.1':
    '编辑历史页面通过 PostRepository 请求数据。PostRepositoryImpl 先把传输层 Map 转成 PostEditHistoryEntry 领域对象，再交给界面显示。',
  'source.glyphora.history.explanation.2':
    'PostApi 请求 /posts/:id/edit-history。后端只允许帖子作者读取，并按 editedAt 倒序返回标题、正文、Delta、图片 URL、语言和编辑类型等快照。',
  'source.glyphora.history.flow.1.title': '加载当前帖子的历史',
  'source.glyphora.history.flow.1.description':
    '页面为当前帖子保存一个 Future，并在用户重新加载时替换它。',
  'source.glyphora.history.flow.2.title': '把传输数据映射为领域对象',
  'source.glyphora.history.flow.2.description':
    'PostRepositoryImpl 把每条返回记录转换为 PostEditHistoryEntry。',
  'source.glyphora.history.flow.3.title': '请求作者专属历史接口',
  'source.glyphora.history.flow.3.description':
    'PostApi 请求 GET /posts/:id/edit-history，并确认 history 响应确实是列表。',
  'source.glyphora.history.flow.4.title': '授权并排序历史快照',
  'source.glyphora.history.flow.4.description':
    '后端验证帖子所有权，并按从新到旧的顺序返回 PostEditHistory。',
  'source.glyphora.history.code.client':
    '历史页面通过替换 Future 重新加载最新快照。',
  'source.glyphora.history.code.repository':
    'Repository 把原始历史记录映射为领域对象。',
  'source.glyphora.history.code.api':
    'PostApi 加载并校验编辑历史响应。',
  'source.glyphora.history.code.server':
    '服务端只允许作者读取，并返回按时间排序的历史快照。',
  'source.glyphora.editDelete.name': '编辑与删除帖子',
  'source.glyphora.editDelete.summary':
    '通过权威版本事务编辑富文本和媒体、保留编辑历史，并在删除帖子后清理 Storage。',
  'source.glyphora.editDelete.explanation.1':
    'PostDetailScreen 用当前标题、正文、Delta 和图片 URL 打开富文本编辑器。保存后经过 updateLanguageVersionContent 和 PostApi.updateLanguageVersion 到达权威 PATCH 路由。',
  'source.glyphora.editDelete.explanation.2':
    'PATCH 事务验证作者身份；内容发生变化时先保存旧版本和图片列表，再更新 PostVersion、PostImage 与 Post.updatedAt。删除时先移除后端元数据，再由 Service 删除返回的 Firebase Storage 对象；即使媒体已经不存在，也不会让已完成的帖子删除失败。',
  'source.glyphora.editDelete.flow.1.title': '编辑当前富文本版本',
  'source.glyphora.editDelete.flow.1.description':
    '详情页用标题、正文、Delta 和图片打开编辑器，保存成功后再更新本地状态。',
  'source.glyphora.editDelete.flow.2.title': '在一个事务中快照并更新',
  'source.glyphora.editDelete.flow.2.description':
    '权威 PATCH 路由验证作者，内容变化时记录旧版本和图片，再更新语言版本、媒体与帖子时间。',
  'source.glyphora.editDelete.flow.3.title': '删除帖子元数据',
  'source.glyphora.editDelete.flow.3.description':
    '删除 API 移除帖子侧数据，并返回可能仍需从 Storage 清理的图片 URL。',
  'source.glyphora.editDelete.flow.4.title': '清理剩余 Storage 对象',
  'source.glyphora.editDelete.flow.4.description':
    'PostNodeService 逐个删除返回的 Firebase Storage URL；后端元数据删除成功后，失效媒体对象不会让操作回滚。',
  'source.glyphora.editDelete.code.client':
    '详情页负责富文本编辑导航和本地状态对齐。',
  'source.glyphora.editDelete.code.service':
    'Service 在进入 HTTP API 前校验编辑后的内容。',
  'source.glyphora.editDelete.code.api':
    'PostApi 把编辑后的语言版本和可选图片列表发送到 PATCH 接口。',
  'source.glyphora.editDelete.code.server':
    '服务端在一个事务中保存旧数据快照并应用编辑。',
  'source.glyphora.editDelete.code.delete':
    '删除先完成后端元数据移除，再清理 Storage 对象。',
  'source.glyphora.chat.name': '实时聊天生命周期',
  'source.glyphora.chat.summary':
    '通过 Repository 隔离 Firestore，并用原子预览、未读计数、逻辑删除与延迟清理管理消息。',
  'source.glyphora.chat.send.name': '发送并实时监听消息',
  'source.glyphora.chat.send.summary':
    '在一个 Firestore batch 中写入消息、聊天预览和未读数，再把排序后的领域模型流回界面。',
  'source.glyphora.chat.send.explanation.1':
    'ChatProvider 只依赖 ChatRepository。Firebase 实现把快照映射为 ChatMessage，所以传输细节不会越过领域接口。',
  'source.glyphora.chat.send.explanation.2':
    'ChatService 确认发送者就是当前认证用户且属于聊天室。一个 batch 同时创建消息、更新房间预览和未读数。',
  'source.glyphora.chat.send.flow.1.title': '接收界面命令',
  'source.glyphora.chat.send.flow.1.description':
    'ChatProvider 转发聊天 ID、发送者 ID 和文本，不让 presentation 层接触 Firebase 类型。',
  'source.glyphora.chat.send.flow.2.title': '通过领域接口',
  'source.glyphora.chat.send.flow.2.description':
    'ChatRepository 用领域表达定义功能，ChatRepositoryImpl 负责 Firebase 适配。',
  'source.glyphora.chat.send.flow.3.title': '一起提交消息和房间状态',
  'source.glyphora.chat.send.flow.3.description':
    'ChatService 校验身份与成员关系，写入消息、更新预览和未读数，最后一次提交 batch。',
  'source.glyphora.chat.send.flow.4.title': '输出排序后的消息流',
  'source.glyphora.chat.send.flow.4.description':
    '按 timestamp 排序的快照被映射成 ChatMessage，并以领域 Stream 输出。',
  'source.glyphora.chat.send.code':
    '一个 Firestore batch 让消息、房间预览和未读计数保持同步。',
  'source.glyphora.chat.delete.name': '逻辑删除与七天清理',
  'source.glyphora.chat.delete.summary':
    '同时支持“仅自己删除”和“双方删除”，又不会立刻丢失清理所需的信息。',
  'source.glyphora.chat.delete.explanation.1':
    '仅自己删除会把用户加入 hiddenFor，并在所有参与者都隐藏后安排清理。双方删除只允许发送者执行，会标记 deleted、清空可见内容，并把 cleanupAt 设为七天后。',
  'source.glyphora.chat.delete.explanation.2':
    'Node 任务查询到期的 cleanupAt，确认消息已删除或已被所有人隐藏，先删附件，再删文档。不符合条件的候选会移除 cleanupAt，而不是被误删。',
  'source.glyphora.chat.delete.flow.1.title': '执行逻辑删除',
  'source.glyphora.chat.delete.flow.1.description':
    '客户端保留文档，只修改 hiddenFor 或 status，并清除不应继续显示的内容。',
  'source.glyphora.chat.delete.flow.2.title': '安排延迟清理',
  'source.glyphora.chat.delete.flow.2.description':
    '当所有人都隐藏消息，或发送者选择双方删除时，把 cleanupAt 设为七天后。',
  'source.glyphora.chat.delete.flow.3.title': '查询到期候选',
  'source.glyphora.chat.delete.flow.3.description':
    '后端以限定批次扫描 messages collection group 中已到期的 cleanupAt。',
  'source.glyphora.chat.delete.flow.4.title': '验证并物理删除',
  'source.glyphora.chat.delete.flow.4.description':
    '任务再次检查条件，删除媒体与消息文档，并统计处理结果。',
  'source.glyphora.chat.delete.code.client':
    '双方删除保留生命周期元数据，同时移除用户可见数据。',
  'source.glyphora.chat.delete.code.server':
    '清理任务拒绝删除已不再满足规则的消息。',
  'source.glyphora.notes.name': '协作笔记',
  'source.glyphora.notes.summary':
    '框架无关的笔记模型与 Repository 接口，由创建者控制共享，并通过事务校验编辑权限。',
  'source.glyphora.notes.permissions.name': '共享笔记编辑权限',
  'source.glyphora.notes.permissions.summary':
    '建立去重后的参与者列表，把共享控制权留给创建者，并在每次更新时通过 Firestore 事务授权。',
  'source.glyphora.notes.permissions.explanation.1':
    'Notes 界面依赖 NoteRepository 与 NoteMediaRepository，而不是 Firebase 服务。NoteModel 保持框架无关，映射留在 data 层。',
  'source.glyphora.notes.permissions.explanation.2':
    '创建时从 sharedUserIds 移除空值、重复值和创建者 ID，再组成 participantIds。更新时重读最新权限，只允许创建者，或在 allowOthersEdit 为 true 时允许参与者编辑。',
  'source.glyphora.notes.permissions.flow.1.title': '规范化共享成员',
  'source.glyphora.notes.permissions.flow.1.description':
    '保存前移除空 ID、创建者 ID 与重复值。',
  'source.glyphora.notes.permissions.flow.2.title': '保存两种共享视图',
  'source.glyphora.notes.permissions.flow.2.description':
    'sharedUserIds 记录被邀请者，participantIds 包含创建者和所有共享用户。',
  'source.glyphora.notes.permissions.flow.3.title': '根据最新数据授权',
  'source.glyphora.notes.permissions.flow.3.description':
    '事务先读取 ownerId、participantIds 和 allowOthersEdit，再判断编辑者能否写入。',
  'source.glyphora.notes.permissions.flow.4.title': '写入内容与编辑者信息',
  'source.glyphora.notes.permissions.flow.4.description':
    '授权后同时写入服务端时间 updatedAt 和编辑者 ID updatedBy。',
  'source.glyphora.notes.permissions.code':
    '编辑权限判断与笔记内容写入发生在同一个事务中。',
  'source.glyphora.publish.annotation.transaction':
  '把帖子及其关联数据放进同一个事务中创建。',

'source.glyphora.publish.annotation.createPost':
  '先创建帖子的主 Post 记录。',

'source.glyphora.publish.annotation.version':
  '把原始语言内容保存为第一条 PostVersion。',

'source.glyphora.publish.annotation.images':
  '把已经上传的图片 URL 绑定到新创建的帖子。',

'source.glyphora.publish.annotation.response':
  '把完整序列化后的帖子返回给 Flutter 客户端。',
};

const traditionalChinese: TranslationDictionary = {
  'source.glyphora.title': 'Glyphora 原始碼',
  'source.glyphora.summary':
    '沿著經過核實的真實程式路徑，查看 Flutter 用戶端、Repository 邊界、Node.js API、Prisma、PostgreSQL、Firestore 與排程清理工作如何協作。',
  'source.glyphora.posts.name': '貼文與互動',
  'source.glyphora.posts.summary':
    '發布、按讚、收藏、檢舉、多語言版本、編輯歷史與貼文生命週期如何跨越用戶端和伺服器端邊界，同時保持一致性。',
  'source.glyphora.publish.name': '發布多語言貼文',
  'source.glyphora.publish.summary':
    '驗證 Quill 內容、上傳媒體、經過 Repository 邊界，並以交易建立貼文及其原始語言版本。',
  'source.glyphora.publish.explanation.1':
    'CreatePostScreen 驗證標題和富文字本文，同時保留純文字與 Quill Delta；從筆記匯入時會複製本文圖片，接著上傳媒體，並用分類與語言資訊建立 PostModel。',
  'source.glyphora.publish.explanation.2':
    'PostNodeService 先驗證用戶端邊界，再由 PostApi 請求 POST /posts。API 把 Firebase 身分解析為 PostgreSQL 使用者，以 firestoreId 作為冪等鍵，並在一個 Prisma 交易中建立貼文、原始語言版本和圖片。',
  'source.glyphora.publish.flow.1.title': '驗證內容並上傳媒體',
  'source.glyphora.publish.flow.1.description':
    '拒絕空內容或過長本文，保留 Quill Delta，複製筆記圖片，並用穩定的草稿 ID 上傳所選圖片。',
  'source.glyphora.publish.flow.2.title': '經過 Repository 邊界',
  'source.glyphora.publish.flow.2.description':
    '頁面把 PostModel 交給 PostRepository；PostNodeService 再檢查 ID、標題、分類和主要語言。',
  'source.glyphora.publish.flow.3.title': '傳送 API 資料',
  'source.glyphora.publish.flow.3.description':
    'PostApi 把 firestoreId、本文、Delta、分類、語言和圖片 URL 傳往 POST /posts。',
  'source.glyphora.publish.flow.4.title': '建立一致的資料庫狀態',
  'source.glyphora.publish.flow.4.description':
    '路由解析作者；重試時傳回同一篇貼文，否則在一個 Prisma 交易中建立貼文、原始版本和圖片。',
  'source.glyphora.publish.code.client':
    'Flutter 頁面在媒體上傳完成後組裝經過驗證的貼文資料。',
  'source.glyphora.publish.code.server':
    'API 在同一交易中建立貼文主體和原始語言版本。',
  'source.glyphora.like.name': '樂觀更新與冪等按讚',
  'source.glyphora.like.summary':
    '介面立即回應，HTTP 操作保持冪等，再從真實記錄重算數量並與伺服器端結果對齊。',
  'source.glyphora.like.explanation.1':
    'PostDetailScreen 先儲存舊狀態，再立即顯示新狀態，接著經由 PostProvider 與 PostRepository 發出操作。請求失敗時會精確恢復先前狀態。',
  'source.glyphora.like.explanation.2':
    'PUT 表示「確保已經按讚」，DELETE 表示「確保沒有按讚」。唯一約束和 skipDuplicates 阻止重複按讚；交易重算 PostLike 並把權威 likeCount 寫回 Post。',
  'source.glyphora.like.flow.1.title': '先更新介面狀態',
  'source.glyphora.like.flow.1.description':
    '詳情頁不等待網路，先切換圖示並調整顯示數量。',
  'source.glyphora.like.flow.2.title': '傳送冪等操作',
  'source.glyphora.like.flow.2.description':
    'PostApi 用 PUT /posts/:id/like 按讚，用同一資源的 DELETE 取消按讚。',
  'source.glyphora.like.flow.3.title': '從資料庫事實重算',
  'source.glyphora.like.flow.3.description':
    'API 新增或刪除使用者與貼文的關係，統計 PostLike，並在同一交易中更新 Post.likeCount。',
  'source.glyphora.like.flow.4.title': '確認或回復介面',
  'source.glyphora.like.flow.4.description':
    '伺服器端數量取代樂觀數量；發生例外時恢復儲存的按讚狀態與數量。',
  'source.glyphora.like.code.client':
    '介面立即回應，同時保留足夠的舊狀態以便精確回復。',
  'source.glyphora.like.code.server':
    '重複 PUT 不產生副作用，計數由 PostLike 記錄推導。',
  'source.glyphora.bookmark.name': '收藏貼文',
  'source.glyphora.bookmark.summary':
    '讓收藏按鈕立即回應，同時只儲存一筆使用者與貼文的關係，並提供獨立的收藏清單。',
  'source.glyphora.bookmark.explanation.1':
    'PostDetailScreen 先樂觀更新收藏狀態，失敗時回復。PostNodeService 根據目標狀態選擇收藏或取消收藏，PostApi 再把它們映射為同一資源上的 POST 與 DELETE。',
  'source.glyphora.bookmark.explanation.2':
    '後端解析目前使用者與貼文；建立收藏時使用 upsert 防止重複，取消時使用 deleteMany，讓重複請求保持冪等。收藏清單按收藏時間倒序回傳。',
  'source.glyphora.bookmark.flow.1.title': '立即更新收藏狀態',
  'source.glyphora.bookmark.flow.1.description':
    '詳情頁先更新圖示，保留舊值，並在伺服器端確認前把操作標記為 busy。',
  'source.glyphora.bookmark.flow.2.title': '選擇對應的 Repository 操作',
  'source.glyphora.bookmark.flow.2.description':
    'PostNodeService 根據目標布林狀態選擇 bookmarkPost 或 removeBookmark，不讓介面接觸傳輸細節。',
  'source.glyphora.bookmark.flow.3.title': '使用同一個冪等 HTTP 資源',
  'source.glyphora.bookmark.flow.3.description':
    'PostApi 用 POST /posts/:id/bookmark 收藏，用同一路徑的 DELETE 取消收藏。',
  'source.glyphora.bookmark.flow.4.title': '儲存唯一的使用者貼文關係',
  'source.glyphora.bookmark.flow.4.description':
    'API 解析使用者和貼文，使用 upsert 防止重複收藏，並用 deleteMany 讓重複取消也不會出錯。',
  'source.glyphora.bookmark.code.client':
    '詳情頁立即回饋收藏狀態，並保留精確回復路徑。',
  'source.glyphora.bookmark.code.service':
    'Service 根據目標收藏狀態選擇儲存或取消。',
  'source.glyphora.bookmark.code.api':
    'PostApi 把收藏狀態變化映射為 POST 與 DELETE 請求。',
  'source.glyphora.bookmark.code.server':
    '後端透過冪等 upsert 建立收藏記錄。',
  'source.glyphora.report.name': '檢舉貼文',
  'source.glyphora.report.summary':
    '收集結構化檢舉原因，經過 Repository 邊界，驗證請求，並阻止自我檢舉和重複檢舉。',
  'source.glyphora.report.explanation.1':
    'PostDetailScreen 負責檢舉互動並阻止重複提交。Repository 路徑只向 Node 服務傳遞貼文 ID、原因和可選詳情。',
  'source.glyphora.report.explanation.2':
    'PostApi 把後端錯誤碼轉換為使用者可理解的失敗資訊。伺服器端驗證原因列舉和詳情長度，拒絕檢舉自己的貼文，檢查已有檢舉，並同時依賴資料庫唯一約束。',
  'source.glyphora.report.flow.1.title': '收集並提交檢舉',
  'source.glyphora.report.flow.1.description':
    '詳情頁收集原因和可選詳情，防止重複點擊，再透過 PostRepository 提交。',
  'source.glyphora.report.flow.2.title': '經過 Repository 邊界',
  'source.glyphora.report.flow.2.description':
    'PostNodeService 把與傳輸無關的檢舉請求交給 PostApi。',
  'source.glyphora.report.flow.3.title': '把 HTTP 錯誤映射為應用程式錯誤',
  'source.glyphora.report.flow.3.description':
    'PostApi 請求 POST /posts/:id/reports，並處理重複檢舉、自我檢舉、貼文不存在和驗證失敗等回應。',
  'source.glyphora.report.flow.4.title': '驗證身分與唯一性',
  'source.glyphora.report.flow.4.description':
    '後端驗證目前使用者和貼文，禁止檢舉自己的貼文，並保證每個使用者對同一貼文最多只有一筆檢舉。',
  'source.glyphora.report.code.client':
    '詳情頁負責檢舉互動和 busy 狀態保護。',
  'source.glyphora.report.code.service':
    'Service 轉發正規化後的檢舉請求。',
  'source.glyphora.report.code.api':
    'PostApi 傳送檢舉資料並映射後端錯誤碼。',
  'source.glyphora.report.code.server':
    '後端完成驗證、授權、去重並建立檢舉。',
  'source.glyphora.versions.name': '多語言貼文版本',
  'source.glyphora.versions.summary':
    '在不複製貼文身分、媒體、互動計數和所有權的情況下，為同一貼文發布額外語言版本。',
  'source.glyphora.versions.explanation.1':
    'PostDetailScreen 讓使用者選擇另一種語言並開啟 PostTranslationScreen。翻譯頁面把新標題、本文、Delta 和翻譯類型與原貼文身分分開處理。',
  'source.glyphora.versions.explanation.2':
    'PostNodeService 先要求登入，再由 PostApi 請求 POST /posts/:id/versions。後端把新的 PostVersion 綁定到現有貼文，因此 availableLanguageCodes 可以展示全部已發布版本。',
  'source.glyphora.versions.flow.1.title': '選擇目標語言',
  'source.glyphora.versions.flow.1.description':
    '詳情頁過濾已經發布的語言，並為選中的目標語言開啟翻譯編輯器。',
  'source.glyphora.versions.flow.2.title': '編寫新的語言版本',
  'source.glyphora.versions.flow.2.description':
    'PostTranslationScreen 驗證翻譯標題和本文，保留富文字 Delta，並提交選定的翻譯類型。',
  'source.glyphora.versions.flow.3.title': '傳送語言版本資料',
  'source.glyphora.versions.flow.3.description':
    'PostApi 把 languageCode、title、content、bodyDelta 和 type 傳到 /posts/:id/versions。',
  'source.glyphora.versions.flow.4.title': '把 PostVersion 綁定到現有貼文',
  'source.glyphora.versions.flow.4.description':
    '後端解析貼文和目前作者，在不建立第二筆 Post 的情況下建立新的語言版本。',
  'source.glyphora.versions.code.open':
    '貼文詳情頁選擇尚未發布的語言並進入翻譯流程。',
  'source.glyphora.versions.code.publish':
    '翻譯頁面驗證並發布新的語言版本。',
  'source.glyphora.versions.code.service':
    'Service 在建立語言版本前保護驗證邊界。',
  'source.glyphora.versions.code.api':
    'PostApi 把額外語言版本傳送到現有貼文資源。',
  'source.glyphora.versions.code.server':
    'API 在現有貼文下面建立新的 PostVersion。',
  'source.glyphora.history.name': '貼文編輯歷史',
  'source.glyphora.history.summary':
    '展示由權威編輯交易產生的舊版本與媒體快照，並只允許貼文作者讀取。',
  'source.glyphora.history.explanation.1':
    '編輯歷史頁面透過 PostRepository 請求資料。PostRepositoryImpl 先把傳輸層 Map 轉成 PostEditHistoryEntry 領域物件，再交給介面顯示。',
  'source.glyphora.history.explanation.2':
    'PostApi 請求 /posts/:id/edit-history。後端只允許貼文作者讀取，並按 editedAt 倒序回傳標題、本文、Delta、圖片 URL、語言和編輯類型等快照。',
  'source.glyphora.history.flow.1.title': '載入目前貼文的歷史',
  'source.glyphora.history.flow.1.description':
    '頁面為目前貼文儲存一個 Future，並在使用者重新載入時替換它。',
  'source.glyphora.history.flow.2.title': '把傳輸資料映射為領域物件',
  'source.glyphora.history.flow.2.description':
    'PostRepositoryImpl 把每筆回傳記錄轉換為 PostEditHistoryEntry。',
  'source.glyphora.history.flow.3.title': '請求作者專屬歷史介面',
  'source.glyphora.history.flow.3.description':
    'PostApi 請求 GET /posts/:id/edit-history，並確認 history 回應確實是清單。',
  'source.glyphora.history.flow.4.title': '授權並排序歷史快照',
  'source.glyphora.history.flow.4.description':
    '後端驗證貼文所有權，並按從新到舊的順序回傳 PostEditHistory。',
  'source.glyphora.history.code.client':
    '歷史頁面透過替換 Future 重新載入最新快照。',
  'source.glyphora.history.code.repository':
    'Repository 把原始歷史記錄映射為領域物件。',
  'source.glyphora.history.code.api':
    'PostApi 載入並驗證編輯歷史回應。',
  'source.glyphora.history.code.server':
    '伺服器端只允許作者讀取，並回傳按時間排序的歷史快照。',
  'source.glyphora.editDelete.name': '編輯與刪除貼文',
  'source.glyphora.editDelete.summary':
    '透過權威版本交易編輯富文字和媒體、保留編輯歷史，並在刪除貼文後清理 Storage。',
  'source.glyphora.editDelete.explanation.1':
    'PostDetailScreen 用目前標題、本文、Delta 和圖片 URL 開啟富文字編輯器。儲存後經過 updateLanguageVersionContent 和 PostApi.updateLanguageVersion 到達權威 PATCH 路由。',
  'source.glyphora.editDelete.explanation.2':
    'PATCH 交易驗證作者身分；內容發生變化時先儲存舊版本和圖片清單，再更新 PostVersion、PostImage 與 Post.updatedAt。刪除時先移除後端中繼資料，再由 Service 刪除回傳的 Firebase Storage 物件；即使媒體已經不存在，也不會讓已完成的貼文刪除失敗。',
  'source.glyphora.editDelete.flow.1.title': '編輯目前富文字版本',
  'source.glyphora.editDelete.flow.1.description':
    '詳情頁用標題、本文、Delta 和圖片開啟編輯器，儲存成功後再更新本機狀態。',
  'source.glyphora.editDelete.flow.2.title': '在一個交易中快照並更新',
  'source.glyphora.editDelete.flow.2.description':
    '權威 PATCH 路由驗證作者，內容變化時記錄舊版本和圖片，再更新語言版本、媒體與貼文時間。',
  'source.glyphora.editDelete.flow.3.title': '刪除貼文中繼資料',
  'source.glyphora.editDelete.flow.3.description':
    '刪除 API 移除貼文側資料，並回傳可能仍需從 Storage 清理的圖片 URL。',
  'source.glyphora.editDelete.flow.4.title': '清理剩餘 Storage 物件',
  'source.glyphora.editDelete.flow.4.description':
    'PostNodeService 逐一刪除回傳的 Firebase Storage URL；後端中繼資料刪除成功後，失效媒體物件不會讓操作回復。',
  'source.glyphora.editDelete.code.client':
    '詳情頁負責富文字編輯導覽和本機狀態對齊。',
  'source.glyphora.editDelete.code.service':
    'Service 在進入 HTTP API 前驗證編輯後的內容。',
  'source.glyphora.editDelete.code.api':
    'PostApi 把編輯後的語言版本和可選圖片清單傳送到 PATCH 介面。',
  'source.glyphora.editDelete.code.server':
    '伺服器端在一個交易中儲存舊資料快照並套用編輯。',
  'source.glyphora.editDelete.code.delete':
    '刪除先完成後端中繼資料移除，再清理 Storage 物件。',
  'source.glyphora.chat.name': '即時聊天生命週期',
  'source.glyphora.chat.summary':
    '透過 Repository 隔離 Firestore，並用原子預覽、未讀計數、邏輯刪除與延遲清理管理訊息。',
  'source.glyphora.chat.send.name': '傳送並即時監聽訊息',
  'source.glyphora.chat.send.summary':
    '在一個 Firestore batch 中寫入訊息、聊天預覽和未讀數，再把排序後的領域模型串流回介面。',
  'source.glyphora.chat.send.explanation.1':
    'ChatProvider 只依賴 ChatRepository。Firebase 實作把快照映射為 ChatMessage，所以傳輸細節不會越過領域介面。',
  'source.glyphora.chat.send.explanation.2':
    'ChatService 確認傳送者就是目前驗證使用者且屬於聊天室。一個 batch 同時建立訊息、更新房間預覽和未讀數。',
  'source.glyphora.chat.send.flow.1.title': '接收介面命令',
  'source.glyphora.chat.send.flow.1.description':
    'ChatProvider 轉發聊天 ID、傳送者 ID 和文字，不讓 presentation 層接觸 Firebase 型別。',
  'source.glyphora.chat.send.flow.2.title': '通過領域介面',
  'source.glyphora.chat.send.flow.2.description':
    'ChatRepository 用領域表達定義功能，ChatRepositoryImpl 負責 Firebase 轉接。',
  'source.glyphora.chat.send.flow.3.title': '一起提交訊息和房間狀態',
  'source.glyphora.chat.send.flow.3.description':
    'ChatService 驗證身分與成員關係，寫入訊息、更新預覽和未讀數，最後一次提交 batch。',
  'source.glyphora.chat.send.flow.4.title': '輸出排序後的訊息流',
  'source.glyphora.chat.send.flow.4.description':
    '按 timestamp 排序的快照被映射成 ChatMessage，並以領域 Stream 輸出。',
  'source.glyphora.chat.send.code':
    '一個 Firestore batch 讓訊息、房間預覽和未讀計數保持同步。',
  'source.glyphora.chat.delete.name': '邏輯刪除與七天清理',
  'source.glyphora.chat.delete.summary':
    '同時支援「僅自己刪除」和「雙方刪除」，又不會立刻遺失清理所需的資訊。',
  'source.glyphora.chat.delete.explanation.1':
    '僅自己刪除會把使用者加入 hiddenFor，並在所有參與者都隱藏後安排清理。雙方刪除只允許傳送者執行，會標記 deleted、清空可見內容，並把 cleanupAt 設為七天後。',
  'source.glyphora.chat.delete.explanation.2':
    'Node 工作查詢到期的 cleanupAt，確認訊息已刪除或已被所有人隱藏，先刪附件，再刪文件。不符合條件的候選會移除 cleanupAt，而不是被誤刪。',
  'source.glyphora.chat.delete.flow.1.title': '執行邏輯刪除',
  'source.glyphora.chat.delete.flow.1.description':
    '用戶端保留文件，只修改 hiddenFor 或 status，並清除不應繼續顯示的內容。',
  'source.glyphora.chat.delete.flow.2.title': '安排延遲清理',
  'source.glyphora.chat.delete.flow.2.description':
    '當所有人都隱藏訊息，或傳送者選擇雙方刪除時，把 cleanupAt 設為七天後。',
  'source.glyphora.chat.delete.flow.3.title': '查詢到期候選',
  'source.glyphora.chat.delete.flow.3.description':
    '後端以限定批次掃描 messages collection group 中已到期的 cleanupAt。',
  'source.glyphora.chat.delete.flow.4.title': '驗證並實體刪除',
  'source.glyphora.chat.delete.flow.4.description':
    '工作再次檢查條件，刪除媒體與訊息文件，並統計處理結果。',
  'source.glyphora.chat.delete.code.client':
    '雙方刪除保留生命週期中繼資料，同時移除使用者可見資料。',
  'source.glyphora.chat.delete.code.server':
    '清理工作拒絕刪除已不再符合規則的訊息。',
  'source.glyphora.notes.name': '協作筆記',
  'source.glyphora.notes.summary':
    '框架無關的筆記模型與 Repository 介面，由建立者控制共享，並透過交易驗證編輯權限。',
  'source.glyphora.notes.permissions.name': '共享筆記編輯權限',
  'source.glyphora.notes.permissions.summary':
    '建立去重後的參與者清單，把共享控制權留給建立者，並在每次更新時透過 Firestore 交易授權。',
  'source.glyphora.notes.permissions.explanation.1':
    'Notes 介面依賴 NoteRepository 與 NoteMediaRepository，而不是 Firebase 服務。NoteModel 保持框架無關，映射留在 data 層。',
  'source.glyphora.notes.permissions.explanation.2':
    '建立時從 sharedUserIds 移除空值、重複值和建立者 ID，再組成 participantIds。更新時重讀最新權限，只允許建立者，或在 allowOthersEdit 為 true 時允許參與者編輯。',
  'source.glyphora.notes.permissions.flow.1.title': '正規化共享成員',
  'source.glyphora.notes.permissions.flow.1.description':
    '儲存前移除空 ID、建立者 ID 與重複值。',
  'source.glyphora.notes.permissions.flow.2.title': '儲存兩種共享檢視',
  'source.glyphora.notes.permissions.flow.2.description':
    'sharedUserIds 記錄受邀者，participantIds 包含建立者和所有共享使用者。',
  'source.glyphora.notes.permissions.flow.3.title': '根據最新資料授權',
  'source.glyphora.notes.permissions.flow.3.description':
    '交易先讀取 ownerId、participantIds 和 allowOthersEdit，再判斷編輯者能否寫入。',
  'source.glyphora.notes.permissions.flow.4.title': '寫入內容與編輯者資訊',
  'source.glyphora.notes.permissions.flow.4.description':
    '授權後同時寫入伺服器端時間 updatedAt 和編輯者 ID updatedBy。',
  'source.glyphora.notes.permissions.code':
    '編輯權限判斷與筆記內容寫入發生在同一個交易中。',
    'source.glyphora.publish.annotation.transaction':
  '把貼文及其關聯資料放進同一個交易中建立。',

'source.glyphora.publish.annotation.createPost':
  '先建立貼文的主要 Post 記錄。',

'source.glyphora.publish.annotation.version':
  '把原始語言內容儲存為第一筆 PostVersion。',

'source.glyphora.publish.annotation.images':
  '把已上傳的圖片 URL 綁定到新建立的貼文。',

'source.glyphora.publish.annotation.response':
  '把完整序列化後的貼文回傳給 Flutter 用戶端。',
};

export const glyphoraTranslations: Record<Language, TranslationDictionary> = {
  en,
  'zh-CN': simplifiedChinese,
  'zh-TW': traditionalChinese,
};