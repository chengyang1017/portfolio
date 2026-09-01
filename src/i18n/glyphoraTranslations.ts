import type { Language, TranslationDictionary } from './types';

const en: TranslationDictionary = {
  'source.glyphora.title': 'Glyphora source code',
  'source.glyphora.summary':
    'Trace verified production paths across Flutter, repository boundaries, the Node.js API, Prisma, PostgreSQL, Firestore, and scheduled cleanup jobs.',
  'source.glyphora.posts.name': 'Posts & engagement',
  'source.glyphora.posts.summary':
    'How multilingual posts cross the client-server boundary and how likes stay responsive without losing database consistency.',
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
};

const simplifiedChinese: TranslationDictionary = {
  'source.glyphora.title': 'Glyphora 源代码',
  'source.glyphora.summary':
    '沿着经过核实的真实代码路径，查看 Flutter 客户端、Repository 边界、Node.js API、Prisma、PostgreSQL、Firestore 与定时清理任务如何协作。',
  'source.glyphora.posts.name': '帖子与互动',
  'source.glyphora.posts.summary':
    '多语言帖子如何跨越客户端与服务端边界，以及点赞如何兼顾即时反馈与数据库一致性。',
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
};

const traditionalChinese: TranslationDictionary = {
  'source.glyphora.title': 'Glyphora 原始碼',
  'source.glyphora.summary':
    '沿著經過核實的真實程式路徑，查看 Flutter 用戶端、Repository 邊界、Node.js API、Prisma、PostgreSQL、Firestore 與排程清理工作如何協作。',
  'source.glyphora.posts.name': '貼文與互動',
  'source.glyphora.posts.summary':
    '多語言貼文如何跨越用戶端與伺服器端邊界，以及按讚如何兼顧即時回饋與資料庫一致性。',
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
};

export const glyphoraTranslations: Record<Language, TranslationDictionary> = {
  en,
  'zh-CN': simplifiedChinese,
  'zh-TW': traditionalChinese,
};
