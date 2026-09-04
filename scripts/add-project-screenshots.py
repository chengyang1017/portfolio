from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'Missing expected block in {path}: {old[:100]!r}')
    file.write_text(text.replace(old, new, 1), encoding='utf-8')


# 1. Project gallery items can point at uploaded screenshots.
replace_once(
    'src/data/projects.ts',
    "  gallery: { title: string; caption: string }[];",
    "  gallery: { title: string; caption: string; image?: string }[];",
)

# 2. Keep canonical screenshot URLs when localized text replaces gallery captions.
Path('src/i18n/localizeProject.ts').write_text("""import { projectTranslationCatalog } from '../data/projectTranslationCatalog';
import type { Project } from '../data/projects';
import { localizeProjectDetail as legacyLocalizeProjectDetail } from './projectDetailTranslations';
import type { AppLocale } from './types';

function mergeCanonicalGalleryMedia(project: Project, localized: Project): Project {
  const size = Math.max(project.gallery.length, localized.gallery.length);
  const gallery = Array.from({ length: size }, (_, index) => {
    const source = project.gallery[index];
    const translated = localized.gallery[index];

    return {
      title: translated?.title ?? source?.title ?? '',
      caption: translated?.caption ?? source?.caption ?? '',
      ...(source?.image ? { image: source.image } : {}),
    };
  }).filter((item) => item.title || item.caption || item.image);

  return { ...localized, gallery };
}

export function localizeProject(project: Project, language: AppLocale): Project {
  if (language === 'en') return project;

  const generated = projectTranslationCatalog[project.slug]?.[language];

  if (generated) {
    return mergeCanonicalGalleryMedia(project, {
      ...project,
      ...generated,
    });
  }

  return mergeCanonicalGalleryMedia(project, legacyLocalizeProjectDetail(project, language));
}
""", encoding='utf-8')

# 3. Same-origin admin media client.
Path('src/admin/projectMedia.ts').write_text("""type UploadedProjectMedia = {
  id: string;
  url: string;
  size: number;
  contentType: string;
};

export async function uploadProjectScreenshot(file: File, slug: string): Promise<UploadedProjectMedia> {
  const response = await fetch(`/api/admin/project-media?slug=${encodeURIComponent(slug)}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': file.type,
      'X-File-Name': encodeURIComponent(file.name),
    },
    body: file,
  });

  const payload = (await response.json().catch(() => null)) as
    | (UploadedProjectMedia & { error?: string })
    | null;

  if (!response.ok || !payload?.url) {
    throw new Error(payload?.error || `Screenshot upload failed (${response.status}).`);
  }

  return payload;
}

export async function deleteProjectScreenshot(imageUrl: string) {
  const url = new URL(imageUrl, window.location.origin);
  const marker = '/api/media/';
  const markerIndex = url.pathname.indexOf(marker);
  if (markerIndex < 0) return;

  const id = decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  if (!id) return;

  const response = await fetch(`/api/admin/project-media?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok && response.status !== 404) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || `Screenshot delete failed (${response.status}).`);
  }
}
""", encoding='utf-8')

# 4. Render actual screenshots in the public project gallery when present.
Path('src/components/ProjectGallery.tsx').write_text("""import type { Project } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';

export function ProjectGallery({ project }: { project: Project }) {
  return (
    <div className=\"gallery\">
      {project.gallery.map((image, index) => (
        <figure key={`${image.title}-${index}`}>
          {image.image ? (
            <img
              className=\"gallery-screenshot\"
              src={image.image}
              alt={image.title || `Project screenshot ${index + 1}`}
              loading=\"lazy\"
            />
          ) : (
            <ProjectVisual
              project={project}
              compact
              focus={{
                title: image.title,
                caption: image.caption,
                index,
              }}
            />
          )}
          <figcaption>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{image.title}</strong>
              <p>{image.caption}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
""", encoding='utf-8')

# 5. Admin screenshot editor.
replace_once(
    'src/pages/AdminPage.tsx',
    "import { getAdminUiCopy } from '../admin/adminUiCopy';",
    "import { getAdminUiCopy } from '../admin/adminUiCopy';\nimport { deleteProjectScreenshot, uploadProjectScreenshot } from '../admin/projectMedia';",
)

replace_once(
    'src/pages/AdminPage.tsx',
    "const PROJECT_MOCKUPS: Project['mockup'][] = [\n  'morphology',\n  'commerce',\n  'language',\n  'keyboard',\n  'ide',\n  'inflection',\n];\n",
    "const PROJECT_MOCKUPS: Project['mockup'][] = [\n  'morphology',\n  'commerce',\n  'language',\n  'keyboard',\n  'ide',\n  'inflection',\n];\n\nconst PROJECT_MEDIA_COPY = {\n  en: { heading: 'Project screenshots', help: 'PNG, JPG or WebP · up to 8 MB each', add: 'Add screenshot', replace: 'Replace image', remove: 'Remove', title: 'Screenshot title', caption: 'Screenshot caption', empty: 'No screenshots yet.', uploading: 'Uploading…', uploaded: 'Screenshot uploaded. Save changes to publish it.', failed: 'Screenshot upload failed.' },\n  'zh-CN': { heading: '项目截图', help: 'PNG、JPG 或 WebP · 每张最大 8 MB', add: '添加截图', replace: '更换图片', remove: '删除', title: '截图标题', caption: '截图说明', empty: '还没有项目截图。', uploading: '正在上传…', uploaded: '截图已上传，点击“保存修改”后正式发布。', failed: '截图上传失败。' },\n  'zh-TW': { heading: '專案截圖', help: 'PNG、JPG 或 WebP · 每張最大 8 MB', add: '新增截圖', replace: '更換圖片', remove: '刪除', title: '截圖標題', caption: '截圖說明', empty: '還沒有專案截圖。', uploading: '正在上傳…', uploaded: '截圖已上傳，按「儲存修改」後正式發佈。', failed: '截圖上傳失敗。' },\n  'vi-Latn': { heading: 'Ảnh chụp dự án', help: 'PNG, JPG hoặc WebP · tối đa 8 MB mỗi ảnh', add: 'Thêm ảnh', replace: 'Thay ảnh', remove: 'Xóa', title: 'Tiêu đề ảnh', caption: 'Chú thích ảnh', empty: 'Chưa có ảnh chụp dự án.', uploading: 'Đang tải lên…', uploaded: 'Đã tải ảnh. Lưu thay đổi để xuất bản.', failed: 'Tải ảnh thất bại.' },\n  'vi-Hani': { heading: '形影預案', help: 'PNG、JPG 或 WebP · 每形影最大 8 MB', add: '添形影', replace: '替形影', remove: '刪', title: '題形影', caption: '註形影', empty: '𣎏固形影預案。', uploading: '當載𨕭…', uploaded: '形影㐌載𨕭。保存修改抵發布。', failed: '載𨕭形影敗。' },\n} as const;\n",
)

replace_once(
    'src/pages/AdminPage.tsx',
    "  const ui = getAdminUiCopy(language);",
    "  const ui = getAdminUiCopy(language);\n  const mediaUi = PROJECT_MEDIA_COPY[language];",
)

replace_once(
    'src/pages/AdminPage.tsx',
    "  const [agentProposal, setAgentProposal] = useState<PortfolioAgentProposal | null>(null);",
    "  const [agentProposal, setAgentProposal] = useState<PortfolioAgentProposal | null>(null);\n  const [mediaBusy, setMediaBusy] = useState<number | 'new' | null>(null);\n  const [mediaMessage, setMediaMessage] = useState('');\n  const [mediaError, setMediaError] = useState(false);",
)

needle = "  async function handleAiFillTranslations() {\n"
insert = """  function updateGalleryItem(index: number, patch: Partial<Project['gallery'][number]>) {
    setProjectDrafts((current) =>
      current.map((project) => {
        if (project.slug !== selectedSlug) return project;
        return {
          ...project,
          gallery: project.gallery.map((item, itemIndex) =>
            itemIndex === index ? { ...item, ...patch } : item,
          ),
        };
      }),
    );
  }

  async function uploadGalleryScreenshot(file: File, index?: number) {
    if (!selectedProject) return;

    const target = index ?? 'new';
    const previousImage = index === undefined ? undefined : selectedProject.gallery[index]?.image;
    setMediaBusy(target);
    setMediaError(false);
    setMediaMessage(mediaUi.uploading);

    try {
      const uploaded = await uploadProjectScreenshot(file, selectedProject.slug);
      const titleFromFile = file.name.replace(/\\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();

      setProjectDrafts((current) =>
        current.map((project) => {
          if (project.slug !== selectedProject.slug) return project;
          const gallery = project.gallery.map((item) => ({ ...item }));
          if (index === undefined) {
            gallery.push({ title: titleFromFile || 'Screenshot', caption: '', image: uploaded.url });
          } else if (gallery[index]) {
            gallery[index] = {
              ...gallery[index],
              title: gallery[index].title || titleFromFile || 'Screenshot',
              image: uploaded.url,
            };
          }
          return { ...project, gallery };
        }),
      );

      if (previousImage && previousImage !== uploaded.url) {
        void deleteProjectScreenshot(previousImage).catch(() => undefined);
      }

      setMediaMessage(mediaUi.uploaded);
    } catch (error) {
      setMediaError(true);
      setMediaMessage(error instanceof Error ? error.message : mediaUi.failed);
    } finally {
      setMediaBusy(null);
    }
  }

  function removeGalleryItem(index: number) {
    if (!selectedProject) return;
    const image = selectedProject.gallery[index]?.image;
    updateProject({ gallery: selectedProject.gallery.filter((_, itemIndex) => itemIndex !== index) });
    if (image) void deleteProjectScreenshot(image).catch(() => undefined);
  }

"""
replace_once('src/pages/AdminPage.tsx', needle, insert + needle)

old_gallery_editor = """              <label className=\"wide\">
                <span>{ui.galleryHint}</span>
                <textarea
                  className=\"large\"
                  value={galleryToText(selectedProject)}
                  onChange={(event) =>
                    updateProject({
                      gallery: pairLines(event.target.value).map(([title, caption]) => ({
                        title,
                        caption,
                      })),
                    })
                  }
                />
              </label>
"""
new_gallery_editor = """              <section className=\"admin-screenshot-editor wide\">
                <div className=\"admin-screenshot-heading\">
                  <div>
                    <strong>{mediaUi.heading}</strong>
                    <small>{mediaUi.help}</small>
                  </div>
                  <label className={`admin-upload-button${mediaBusy !== null ? ' is-disabled' : ''}`}>
                    <span>{mediaBusy === 'new' ? mediaUi.uploading : mediaUi.add}</span>
                    <input
                      type=\"file\"
                      accept=\"image/png,image/jpeg,image/webp\"
                      disabled={mediaBusy !== null}
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        event.currentTarget.value = '';
                        if (file) void uploadGalleryScreenshot(file);
                      }}
                    />
                  </label>
                </div>

                {mediaMessage && (
                  <p className={`admin-message admin-media-message${mediaError ? ' error' : ''}`}>
                    {mediaMessage}
                  </p>
                )}

                {selectedProject.gallery.length === 0 ? (
                  <div className=\"admin-screenshot-empty\">{mediaUi.empty}</div>
                ) : (
                  <div className=\"admin-screenshot-list\">
                    {selectedProject.gallery.map((item, index) => (
                      <article className=\"admin-screenshot-card\" key={`${selectedProject.slug}-${index}`}>
                        <div className=\"admin-screenshot-preview\">
                          {item.image ? (
                            <img src={item.image} alt={item.title || `${mediaUi.heading} ${index + 1}`} />
                          ) : (
                            <span>NO IMAGE</span>
                          )}
                        </div>

                        <div className=\"admin-screenshot-fields\">
                          <label>
                            <span>{mediaUi.title}</span>
                            <input
                              value={item.title}
                              onChange={(event) => updateGalleryItem(index, { title: event.target.value })}
                            />
                          </label>
                          <label>
                            <span>{mediaUi.caption}</span>
                            <textarea
                              value={item.caption}
                              onChange={(event) => updateGalleryItem(index, { caption: event.target.value })}
                            />
                          </label>
                          <div className=\"admin-screenshot-actions\">
                            <label className={`admin-upload-button secondary${mediaBusy !== null ? ' is-disabled' : ''}`}>
                              <span>{mediaBusy === index ? mediaUi.uploading : mediaUi.replace}</span>
                              <input
                                type=\"file\"
                                accept=\"image/png,image/jpeg,image/webp\"
                                disabled={mediaBusy !== null}
                                onChange={(event) => {
                                  const file = event.currentTarget.files?.[0];
                                  event.currentTarget.value = '';
                                  if (file) void uploadGalleryScreenshot(file, index);
                                }}
                              />
                            </label>
                            <button type=\"button\" className=\"danger\" onClick={() => removeGalleryItem(index)}>
                              {mediaUi.remove}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
"""
replace_once('src/pages/AdminPage.tsx', old_gallery_editor, new_gallery_editor)

# 6. Styles for the admin editor and public gallery.
with Path('src/styles/admin.css').open('a', encoding='utf-8') as file:
    file.write("""

/* Project screenshot media editor */
.admin-screenshot-editor {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid #33443a;
  border-radius: 12px;
  background: #0d1511;
}

.admin-screenshot-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.admin-screenshot-heading > div {
  display: grid;
  gap: 4px;
}

.admin-screenshot-heading strong {
  color: #edf3ef;
  font-size: 0.9rem;
}

.admin-screenshot-heading small {
  color: #819188;
  font-size: 0.68rem;
}

.admin-upload-button {
  min-height: 42px;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  border: 1px solid #c7ff4a;
  border-radius: 9px;
  background: #c7ff4a;
  color: #0d1210;
  cursor: pointer;
  font-weight: 700;
}

.admin-upload-button.secondary {
  border-color: #415248;
  background: transparent;
  color: #dce5df;
}

.admin-upload-button.is-disabled {
  opacity: 0.45;
  pointer-events: none;
}

.admin-upload-button > span {
  color: inherit !important;
  font-size: 0.74rem !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.admin-upload-button input {
  display: none !important;
}

.admin-media-message {
  margin-top: 0;
}

.admin-screenshot-empty {
  padding: 30px;
  border: 1px dashed #35463d;
  border-radius: 10px;
  color: #7e8f86;
  text-align: center;
}

.admin-screenshot-list {
  display: grid;
  gap: 12px;
}

.admin-screenshot-card {
  display: grid;
  grid-template-columns: minmax(190px, 0.8fr) minmax(0, 1.2fr);
  gap: 14px;
  padding: 12px;
  border: 1px solid #2d3d35;
  border-radius: 11px;
  background: #101914;
}

.admin-screenshot-preview {
  min-height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #2f4037;
  border-radius: 9px;
  background: #080d0a;
}

.admin-screenshot-preview img {
  width: 100%;
  height: 100%;
  max-height: 260px;
  object-fit: contain;
  display: block;
}

.admin-screenshot-preview > span {
  color: #617269;
  font-size: 0.62rem;
  letter-spacing: 0.12em;
}

.admin-screenshot-fields {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.admin-screenshot-fields label {
  display: grid;
  gap: 7px;
}

.admin-screenshot-fields label > span {
  color: #93a39a;
  font-size: 0.67rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.admin-screenshot-fields textarea {
  min-height: 88px;
}

.admin-screenshot-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

@media (max-width: 760px) {
  .admin-screenshot-heading,
  .admin-screenshot-card {
    grid-template-columns: 1fr;
  }

  .admin-screenshot-heading {
    align-items: stretch;
    flex-direction: column;
  }
}
""")

with Path('src/styles/project-detail.css').open('a', encoding='utf-8') as file:
    file.write("""

.gallery-screenshot {
  width: 100%;
  height: 300px;
  display: block;
  object-fit: contain;
  border: 1px solid var(--line);
  background: #0b0f0d;
}
""")

# 7. Store media in chunked Durable Object storage, so no extra Cloudflare service/bucket setup is required.
prepare = Path('scripts/prepare-site-build.mjs')
text = prepare.read_text(encoding='utf-8')
old_fetch = """  async fetch(request) {
    if (request.method === 'GET') {
      return json((await this.ctx.storage.get('portfolio')) || {});
    }
"""
new_fetch = """  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/media/')) {
      const id = decodeURIComponent(url.pathname.slice('/media/'.length));
      if (!/^[a-zA-Z0-9_-]{12,120}$/.test(id)) return json({ error: 'Invalid media id.' }, 400);
      const metaKey = 'media:' + id + ':meta';

      if (request.method === 'PUT') {
        const bytes = await request.arrayBuffer();
        if (!bytes.byteLength || bytes.byteLength > 8 * 1024 * 1024) {
          return json({ error: 'Screenshot must be between 1 byte and 8 MB.' }, 413);
        }

        const chunkSize = 96 * 1024;
        const chunks = Math.ceil(bytes.byteLength / chunkSize);
        const contentType = request.headers.get('content-type') || 'application/octet-stream';
        const originalName = request.headers.get('x-file-name') || '';

        await this.ctx.storage.put(metaKey, {
          contentType,
          originalName,
          size: bytes.byteLength,
          chunks,
          uploadedAt: new Date().toISOString(),
        });

        for (let index = 0; index < chunks; index += 1) {
          const start = index * chunkSize;
          await this.ctx.storage.put('media:' + id + ':' + index, bytes.slice(start, Math.min(start + chunkSize, bytes.byteLength)));
        }

        return json({ stored: true, id, size: bytes.byteLength, contentType });
      }

      const meta = await this.ctx.storage.get(metaKey);
      if (!meta) return json({ error: 'Media not found.' }, 404);

      if (request.method === 'DELETE') {
        await this.ctx.storage.delete(metaKey);
        for (let index = 0; index < meta.chunks; index += 1) {
          await this.ctx.storage.delete('media:' + id + ':' + index);
        }
        return json({ deleted: true, id });
      }

      if (request.method === 'GET') {
        const parts = [];
        for (let index = 0; index < meta.chunks; index += 1) {
          const part = await this.ctx.storage.get('media:' + id + ':' + index);
          if (!part) return json({ error: 'Media data is incomplete.' }, 500);
          parts.push(part);
        }

        return new Response(new Blob(parts, { type: meta.contentType }), {
          headers: {
            'content-type': meta.contentType,
            'content-length': String(meta.size),
            'cache-control': 'public, max-age=31536000, immutable',
          },
        });
      }

      return json({ error: 'Method not allowed' }, 405);
    }

    if (request.method === 'GET') {
      return json((await this.ctx.storage.get('portfolio')) || {});
    }
"""
if old_fetch not in text:
    raise SystemExit('PortfolioStore fetch block not found')
text = text.replace(old_fetch, new_fetch, 1)

route_anchor = """async function handlePublishTranslations(request, env) {
"""
media_handlers = r"""
function projectMediaPublicUrl(id) {
  return '/api/media/' + encodeURIComponent(id);
}

async function handleProjectMedia(request, env) {
  if (!(await hasAdminSession(request, env))) return json({ error: 'Admin session required.' }, 401);

  if (request.method === 'POST') {
    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(contentType)) {
      return json({ error: 'Only PNG, JPG, and WebP screenshots are supported.' }, 415);
    }

    const declaredLength = Number(request.headers.get('content-length') || '0');
    if (declaredLength > 8 * 1024 * 1024) {
      return json({ error: 'Screenshot must be 8 MB or smaller.' }, 413);
    }

    const bytes = await request.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > 8 * 1024 * 1024) {
      return json({ error: 'Screenshot must be between 1 byte and 8 MB.' }, 413);
    }

    const id = crypto.randomUUID().replace(/-/g, '');
    const internal = new Request('https://portfolio-store.internal/media/' + encodeURIComponent(id), {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'X-File-Name': request.headers.get('x-file-name') || '',
      },
      body: bytes,
    });
    const stored = await portfolioStore(env).fetch(internal);
    if (!stored.ok) {
      const detail = await stored.json().catch(() => null);
      return json({ error: detail?.error || 'Unable to store screenshot.' }, stored.status);
    }

    return json({
      id,
      url: projectMediaPublicUrl(id),
      size: bytes.byteLength,
      contentType,
    });
  }

  if (request.method === 'DELETE') {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || '';
    if (!/^[a-zA-Z0-9_-]{12,120}$/.test(id)) return json({ error: 'Invalid media id.' }, 400);
    const response = await portfolioStore(env).fetch('https://portfolio-store.internal/media/' + encodeURIComponent(id), {
      method: 'DELETE',
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      return json({ error: detail?.error || 'Unable to delete screenshot.' }, response.status);
    }
    return json({ deleted: true, id });
  }

  return json({ error: 'Method not allowed' }, 405);
}

async function handlePublicProjectMedia(request, env, id) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return json({ error: 'Method not allowed' }, 405);
  }
  if (!/^[a-zA-Z0-9_-]{12,120}$/.test(id)) return json({ error: 'Invalid media id.' }, 400);
  const response = await portfolioStore(env).fetch('https://portfolio-store.internal/media/' + encodeURIComponent(id));
  if (request.method === 'HEAD' && response.ok) {
    return new Response(null, { status: 200, headers: response.headers });
  }
  return response;
}

"""
if route_anchor not in text:
    raise SystemExit('Translation route anchor not found')
text = text.replace(route_anchor, media_handlers + route_anchor, 1)

route_old = """    if (url.pathname === '/api/admin/publish-translations') return handlePublishTranslations(request, env);
    if (url.pathname === '/api/agent/content') return handleAgentContent(request, env);
"""
route_new = """    if (url.pathname === '/api/admin/publish-translations') return handlePublishTranslations(request, env);
    if (url.pathname === '/api/admin/project-media') return handleProjectMedia(request, env);
    if (url.pathname.startsWith('/api/media/')) {
      return handlePublicProjectMedia(request, env, decodeURIComponent(url.pathname.slice('/api/media/'.length)));
    }
    if (url.pathname === '/api/agent/content') return handleAgentContent(request, env);
"""
if route_old not in text:
    raise SystemExit('Worker route block not found')
text = text.replace(route_old, route_new, 1)

prepare.write_text(text, encoding='utf-8')

print('Project screenshot upload, storage, admin editor, and public rendering added.')
