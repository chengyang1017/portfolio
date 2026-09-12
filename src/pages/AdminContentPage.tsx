import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminSession } from '../admin/adminSession';
import { publishPortfolioContent } from '../admin/githubPortfolio';
import {
  projects as runtimeProjects,
  type Project,
  type ProjectPageCopy,
  type ProjectPageCopyLocale,
} from '../data/projects';
import type { TechnologyCatalog } from '../data/technologyCatalog';
import { useI18n } from '../i18n/I18nProvider';
import { projectDetailUi } from '../i18n/projectDetailTranslations';

const PAGE_COPY_LOCALES: Array<{ id: ProjectPageCopyLocale; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'zh-CN', label: '简体中文' },
  { id: 'zh-TW', label: '繁體中文' },
  { id: 'vi-Latn', label: 'Tiếng Việt' },
  { id: 'vi-Hani', label: '𡨸喃' },
];

const PAGE_COPY_FIELDS: Array<{
  key: keyof ProjectPageCopy;
  label: string;
  rows?: number;
  fallback: (ui: ReturnType<typeof projectDetailUi>) => string;
}> = [
  { key: 'projectAreasLabel', label: 'Project areas · eyebrow', fallback: (ui) => ui.projectAreas },
  { key: 'projectAreasHeading', label: 'Project areas · heading', fallback: (ui) => ui.projectAreasHeading },
  { key: 'overviewLabel', label: 'Overview · eyebrow', fallback: (ui) => ui.overview },
  { key: 'snapshotLabel', label: 'Overview · snapshot label', fallback: (ui) => ui.snapshot },
  { key: 'featureSectionLabel', label: 'Verified features · eyebrow', fallback: (ui) => ui.featureSection },
  { key: 'featureHeading', label: 'Verified features · heading', fallback: (ui) => ui.featureHeading },
  { key: 'featureSummary', label: 'Verified features · summary', rows: 3, fallback: (ui) => ui.featureSummary },
  { key: 'architectureLabel', label: 'Architecture · eyebrow', fallback: (ui) => ui.architecture },
  { key: 'architectureHeading', label: 'Architecture · heading', fallback: (ui) => ui.architectureHeading },
  { key: 'sourceWalkthroughLabel', label: 'Source walkthrough · label', fallback: (ui) => ui.sourceWalkthroughLabel },
  { key: 'sourceWalkthroughTitle', label: 'Source walkthrough · title', fallback: (ui) => ui.sourceWalkthroughTitle },
  { key: 'sourceWalkthroughDescription', label: 'Source walkthrough · description', rows: 3, fallback: (ui) => ui.sourceWalkthroughDescription },
  { key: 'implementationLabel', label: 'Implementation · eyebrow', fallback: (ui) => ui.implementation },
];

type PortfolioPayload = {
  projects?: Project[];
  technologyCatalog?: TechnologyCatalog;
};

const COPY = {
  en: {
    eyebrow: 'CMS / PROJECT PRESENTATION',
    title: 'Page copy & media',
    description: 'Edit project-detail presentation text without touching source code, and download any uploaded project image in one click.',
    locked: 'The admin session is locked. Unlock the main admin workspace first.',
    unlock: 'Open admin login',
    projects: 'Projects',
    locale: 'Presentation language',
    copyHeading: 'Project page copy',
    copyHelp: 'Empty fields use the translated built-in fallback. Any value entered here is stored with the project and wins over the fallback.',
    useCurrent: 'Use current text for all fields',
    clear: 'Clear overrides',
    publish: 'Publish changes',
    publishing: 'Publishing…',
    published: 'Page copy published.',
    mediaHeading: 'Uploaded project images',
    mediaHelp: 'These are the same gallery images already attached to this project.',
    download: 'Download image',
    downloading: 'Downloading…',
    noMedia: 'This project has no uploaded images.',
    fallback: 'Current fallback',
    preview: 'Preview project',
    loadFailed: 'Unable to load portfolio content.',
  },
  'zh-CN': {
    eyebrow: 'CMS / 项目展示',
    title: '页面文案与媒体',
    description: '无需改源码即可编辑项目详情页的展示文案，并可一键下载已上传的项目图片。',
    locked: '管理员会话尚未解锁，请先在主管理后台登录。',
    unlock: '打开管理员登录',
    projects: '项目',
    locale: '展示语言',
    copyHeading: '项目页面文案',
    copyHelp: '留空时继续使用现有多语言默认文案；填写后将随项目保存，并优先于源码中的兼容默认值。',
    useCurrent: '把当前文案填入全部字段',
    clear: '清空覆盖文案',
    publish: '发布修改',
    publishing: '发布中…',
    published: '页面文案已发布。',
    mediaHeading: '已上传项目图片',
    mediaHelp: '这里显示该项目已有的图库图片。',
    download: '下载图片',
    downloading: '下载中…',
    noMedia: '这个项目暂时没有已上传图片。',
    fallback: '当前默认文案',
    preview: '预览项目',
    loadFailed: '无法读取作品集内容。',
  },
  'zh-TW': {
    eyebrow: 'CMS / 專案展示',
    title: '頁面文案與媒體',
    description: '不用修改原始碼即可編輯專案詳情頁的展示文案，並可一鍵下載已上傳的專案圖片。',
    locked: '管理員工作階段尚未解鎖，請先在主管理後台登入。',
    unlock: '開啟管理員登入',
    projects: '專案',
    locale: '展示語言',
    copyHeading: '專案頁面文案',
    copyHelp: '留空時會沿用現有多語言預設文案；填寫後會隨專案儲存，並優先於原始碼中的相容預設值。',
    useCurrent: '把目前文案填入全部欄位',
    clear: '清除覆寫文案',
    publish: '發佈修改',
    publishing: '發佈中…',
    published: '頁面文案已發佈。',
    mediaHeading: '已上傳專案圖片',
    mediaHelp: '這裡顯示該專案現有的圖庫圖片。',
    download: '下載圖片',
    downloading: '下載中…',
    noMedia: '這個專案目前沒有已上傳圖片。',
    fallback: '目前預設文案',
    preview: '預覽專案',
    loadFailed: '無法讀取作品集內容。',
  },
  'vi-Latn': {
    eyebrow: 'CMS / TRÌNH BÀY DỰ ÁN',
    title: 'Nội dung trang & media',
    description: 'Chỉnh sửa nội dung trình bày của trang dự án mà không cần sửa mã nguồn, đồng thời tải ảnh đã upload chỉ với một lần bấm.',
    locked: 'Phiên quản trị đang bị khóa. Hãy mở khóa trang quản trị chính trước.',
    unlock: 'Mở đăng nhập quản trị',
    projects: 'Dự án',
    locale: 'Ngôn ngữ trình bày',
    copyHeading: 'Nội dung trang dự án',
    copyHelp: 'Trường để trống sẽ dùng bản dịch mặc định hiện tại. Nội dung nhập ở đây được lưu cùng dự án và có ưu tiên cao hơn.',
    useCurrent: 'Dùng nội dung hiện tại cho mọi trường',
    clear: 'Xóa nội dung ghi đè',
    publish: 'Xuất bản thay đổi',
    publishing: 'Đang xuất bản…',
    published: 'Đã xuất bản nội dung trang.',
    mediaHeading: 'Ảnh dự án đã tải lên',
    mediaHelp: 'Đây là các ảnh gallery hiện đang gắn với dự án.',
    download: 'Tải ảnh',
    downloading: 'Đang tải…',
    noMedia: 'Dự án này chưa có ảnh đã tải lên.',
    fallback: 'Nội dung mặc định hiện tại',
    preview: 'Xem trước dự án',
    loadFailed: 'Không thể tải nội dung portfolio.',
  },
  'vi-Hani': {
    eyebrow: 'CMS / PROJECT PRESENTATION',
    title: 'Page copy & media',
    description: '編輯內容頁預案吧下載形影㐌載𨕭、空需改碼源。',
    locked: 'Admin session 當鎖。請解鎖主管理先。',
    unlock: '開 admin login',
    projects: '預案',
    locale: '言語展示',
    copyHeading: '內容頁預案',
    copyHelp: '場空使用內容默認；內容填𠓨尼得保存貝預案吧優先欣。',
    useCurrent: '用內容現在朱全場',
    clear: '刪內容覆寫',
    publish: '發布修改',
    publishing: '當發布…',
    published: '㐌發布內容頁。',
    mediaHeading: '形影預案㐌載𨕭',
    mediaHelp: '仍尼𱺵各形影 gallery 現固𠓨預案。',
    download: '下載形影',
    downloading: '當下載…',
    noMedia: '預案尼𣎏固形影㐌載𨕭。',
    fallback: '內容默認現在',
    preview: '䀡試預案',
    loadFailed: '空体載內容 portfolio。',
  },
} as const;

function extensionFor(contentType: string) {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('gif')) return 'gif';
  if (contentType.includes('svg')) return 'svg';
  return 'jpg';
}

export function AdminContentPage() {
  const { language } = useI18n();
  const uiCopy = COPY[language];
  const [sessionState, setSessionState] = useState<'checking' | 'locked' | 'ready' | 'error'>('checking');
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [draftProjects, setDraftProjects] = useState<Project[]>([]);
  const [technologyCatalog, setTechnologyCatalog] = useState<TechnologyCatalog | null>(null);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [contentLocale, setContentLocale] = useState<ProjectPageCopyLocale>(language);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [publishState, setPublishState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [downloadKey, setDownloadKey] = useState('');

  const selectedProject = useMemo(
    () => draftProjects.find((project) => project.slug === selectedSlug),
    [draftProjects, selectedSlug],
  );
  const localizedDefaults = projectDetailUi(contentLocale);
  const currentCopy = selectedProject?.pageCopy?.[contentLocale] ?? {};

  useEffect(() => {
    let active = true;
    void getAdminSession()
      .then((session) => {
        if (!active) return;
        if (!session) {
          setSessionState('locked');
          return;
        }
        setDefaultBranch(session.defaultBranch || 'main');
        setSessionState('ready');
      })
      .catch(() => {
        if (active) setSessionState('error');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (sessionState !== 'ready') return;
    let active = true;
    setLoadState('loading');

    void fetch('/api/portfolio-data', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(uiCopy.loadFailed);
        return (await response.json()) as PortfolioPayload;
      })
      .then((payload) => {
        if (!active) return;
        if (!Array.isArray(payload.projects) || !payload.technologyCatalog) {
          throw new Error(uiCopy.loadFailed);
        }
        const projectCopies = JSON.parse(JSON.stringify(payload.projects)) as Project[];
        setDraftProjects(projectCopies);
        setTechnologyCatalog(payload.technologyCatalog);
        setSelectedSlug((current) =>
          projectCopies.some((project) => project.slug === current)
            ? current
            : projectCopies[0]?.slug ?? '',
        );
        setLoadState('ready');
      })
      .catch((error) => {
        if (!active) return;
        setLoadState('error');
        setMessage(error instanceof Error ? error.message : uiCopy.loadFailed);
      });

    return () => {
      active = false;
    };
  }, [sessionState, uiCopy.loadFailed]);

  function updatePageCopy(key: keyof ProjectPageCopy, value: string) {
    if (!selectedProject) return;
    setPublishState('idle');
    setMessage('');
    setDraftProjects((current) =>
      current.map((project) => {
        if (project.slug !== selectedProject.slug) return project;
        const localeCopy = { ...(project.pageCopy?.[contentLocale] ?? {}) };
        if (value.trim()) localeCopy[key] = value;
        else delete localeCopy[key];

        const pageCopy = { ...(project.pageCopy ?? {}) };
        if (Object.keys(localeCopy).length > 0) pageCopy[contentLocale] = localeCopy;
        else delete pageCopy[contentLocale];

        return {
          ...project,
          ...(Object.keys(pageCopy).length > 0 ? { pageCopy } : { pageCopy: undefined }),
        };
      }),
    );
  }

  function useCurrentText() {
    for (const field of PAGE_COPY_FIELDS) {
      updatePageCopy(field.key, field.fallback(localizedDefaults));
    }
  }

  function clearCurrentOverrides() {
    if (!selectedProject) return;
    setDraftProjects((current) =>
      current.map((project) => {
        if (project.slug !== selectedProject.slug) return project;
        const pageCopy = { ...(project.pageCopy ?? {}) };
        delete pageCopy[contentLocale];
        return {
          ...project,
          ...(Object.keys(pageCopy).length > 0 ? { pageCopy } : { pageCopy: undefined }),
        };
      }),
    );
    setPublishState('idle');
    setMessage('');
  }

  async function publishChanges() {
    if (!technologyCatalog || draftProjects.length === 0) return;
    setPublishState('saving');
    setMessage(uiCopy.publishing);
    try {
      await publishPortfolioContent({
        branch: defaultBranch,
        projects: draftProjects,
        technologyCatalog,
      });

      const copies = JSON.parse(JSON.stringify(draftProjects)) as Project[];
      runtimeProjects.splice(0, runtimeProjects.length, ...copies);
      setPublishState('success');
      setMessage(uiCopy.published);
    } catch (error) {
      setPublishState('error');
      setMessage(error instanceof Error ? error.message : uiCopy.loadFailed);
    }
  }

  async function downloadImage(image: string, index: number) {
    if (!selectedProject) return;
    const key = `${selectedProject.slug}-${index}`;
    setDownloadKey(key);
    setMessage('');

    try {
      const response = await fetch(image, { credentials: 'include' });
      if (!response.ok) throw new Error(`Image download failed (${response.status}).`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `${selectedProject.slug}-${String(index + 1).padStart(2, '0')}.${extensionFor(blob.type)}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image download failed.');
    } finally {
      setDownloadKey('');
    }
  }

  if (sessionState === 'checking') {
    return (
      <main className="admin-content-page shell">
        <section className="admin-content-state-card">Checking admin session…</section>
      </main>
    );
  }

  if (sessionState === 'locked' || sessionState === 'error') {
    return (
      <main className="admin-content-page shell">
        <section className="admin-content-state-card">
          <p className="eyebrow">{uiCopy.eyebrow}</p>
          <h1>{uiCopy.title}</h1>
          <p>{uiCopy.locked}</p>
          <Link className="admin-content-primary-action" to="/admin">{uiCopy.unlock} →</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-content-page shell">
      <header className="admin-content-hero">
        <div>
          <p className="eyebrow">{uiCopy.eyebrow}</p>
          <h1>{uiCopy.title}</h1>
          <p>{uiCopy.description}</p>
        </div>
        {selectedProject && (
          <Link
            className="admin-content-preview-link"
            to={`/projects/${selectedProject.slug}`}
            target="_blank"
          >
            {uiCopy.preview} ↗
          </Link>
        )}
      </header>

      {loadState === 'loading' && (
        <section className="admin-content-state-card">Loading portfolio content…</section>
      )}

      {loadState === 'error' && (
        <section className="admin-content-state-card error">{message || uiCopy.loadFailed}</section>
      )}

      {loadState === 'ready' && selectedProject && (
        <div className="admin-content-layout">
          <aside className="admin-content-project-rail">
            <div className="admin-content-rail-heading">
              <span>{uiCopy.projects}</span>
              <strong>{String(draftProjects.length).padStart(2, '0')}</strong>
            </div>
            <div className="admin-content-project-list">
              {draftProjects.map((project) => (
                <button
                  type="button"
                  className={project.slug === selectedProject.slug ? 'active' : ''}
                  key={project.slug}
                  onClick={() => setSelectedSlug(project.slug)}
                >
                  <span>{project.number}</span>
                  <strong>{project.shortTitle || project.title}</strong>
                  <small>{project.category}</small>
                </button>
              ))}
            </div>
          </aside>

          <div className="admin-content-main">
            <section className="admin-content-panel admin-content-copy-panel">
              <div className="admin-content-panel-heading">
                <div>
                  <p className="eyebrow">COPY / {selectedProject.shortTitle}</p>
                  <h2>{uiCopy.copyHeading}</h2>
                </div>
                <p>{uiCopy.copyHelp}</p>
              </div>

              <div className="admin-content-locale-tabs" aria-label={uiCopy.locale}>
                {PAGE_COPY_LOCALES.map((locale) => (
                  <button
                    type="button"
                    key={locale.id}
                    className={contentLocale === locale.id ? 'active' : ''}
                    onClick={() => setContentLocale(locale.id)}
                  >
                    <span>{locale.label}</span>
                    <small>
                      {selectedProject.pageCopy?.[locale.id]
                        ? `${Object.keys(selectedProject.pageCopy[locale.id] ?? {}).length} overrides`
                        : 'fallback'}
                    </small>
                  </button>
                ))}
              </div>

              <div className="admin-content-copy-actions">
                <button type="button" onClick={useCurrentText}>{uiCopy.useCurrent}</button>
                <button type="button" className="secondary" onClick={clearCurrentOverrides}>{uiCopy.clear}</button>
              </div>

              <div className="admin-content-copy-grid">
                {PAGE_COPY_FIELDS.map((field) => {
                  const value = currentCopy[field.key] ?? '';
                  const fallback = field.fallback(localizedDefaults);
                  return (
                    <label className={field.rows ? 'wide' : ''} key={field.key}>
                      <span>{field.label}</span>
                      {field.rows ? (
                        <textarea
                          rows={field.rows}
                          value={value}
                          placeholder={fallback}
                          onChange={(event) => updatePageCopy(field.key, event.target.value)}
                        />
                      ) : (
                        <input
                          value={value}
                          placeholder={fallback}
                          onChange={(event) => updatePageCopy(field.key, event.target.value)}
                        />
                      )}
                      <small><b>{uiCopy.fallback}:</b> {fallback}</small>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="admin-content-panel admin-content-media-panel">
              <div className="admin-content-panel-heading">
                <div>
                  <p className="eyebrow">MEDIA / {selectedProject.shortTitle}</p>
                  <h2>{uiCopy.mediaHeading}</h2>
                </div>
                <p>{uiCopy.mediaHelp}</p>
              </div>

              {selectedProject.gallery.filter((item) => item.image).length === 0 ? (
                <div className="admin-content-empty-media">{uiCopy.noMedia}</div>
              ) : (
                <div className="admin-content-media-grid">
                  {selectedProject.gallery.map((item, index) => {
                    if (!item.image) return null;
                    const key = `${selectedProject.slug}-${index}`;
                    return (
                      <article className="admin-content-media-card" key={key}>
                        <div className="admin-content-media-preview">
                          <img src={item.image} alt={item.title || `Screenshot ${index + 1}`} />
                          <span>{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <div className="admin-content-media-copy">
                          <strong>{item.title || `Screenshot ${index + 1}`}</strong>
                          {item.caption && <p>{item.caption}</p>}
                          <button
                            type="button"
                            onClick={() => void downloadImage(item.image!, index)}
                            disabled={Boolean(downloadKey)}
                          >
                            {downloadKey === key ? uiCopy.downloading : uiCopy.download} ↓
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="admin-content-publish-bar">
              <div>
                <strong>{selectedProject.title}</strong>
                <span>{contentLocale} · {Object.keys(currentCopy).length} copy overrides</span>
              </div>
              <button
                type="button"
                onClick={() => void publishChanges()}
                disabled={publishState === 'saving'}
              >
                {publishState === 'saving' ? uiCopy.publishing : uiCopy.publish}
              </button>
            </div>

            {message && (
              <p className={`admin-content-message ${publishState === 'error' ? 'error' : publishState === 'success' ? 'success' : ''}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
