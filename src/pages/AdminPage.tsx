import { useEffect, useMemo, useState } from 'react';
import type { Project, ProjectCategory } from '../data/projects';
import { projects as initialProjects } from '../data/projects';
import {
  PROJECT_TRANSLATION_LOCALES,
  projectTranslationCatalog,
  type ProjectTranslation,
  type ProjectTranslationCatalog,
  type ProjectTranslationLocale,
} from '../data/projectTranslationCatalog';
import {
  technologyCatalog as initialTechnologyCatalog,
  type TechnologyCatalog,
  type TechnologyGroupId,
  type TechnologyItem,
} from '../data/technologyCatalog';
import {
  analyzeRepository,
  createProjectFromAnalysis,
  mergeTechnologyNames,
  publishPortfolioContent,
  type PortfolioAccess,
  type RepositoryAnalysis,
} from '../admin/githubPortfolio';
import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';
import {
  mergeProjectTranslations,
  publishProjectTranslationCatalog,
  translateProjectAllLocales,
} from '../admin/projectTranslationManager';
import {
  runPortfolioAgent,
  type AgentMessage,
  type PortfolioAgentProposal,
} from '../admin/projectAgent';
import { getAdminUiCopy } from '../admin/adminUiCopy';
import { deleteProjectScreenshot, uploadProjectScreenshot } from '../admin/projectMedia';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useI18n } from '../i18n/I18nProvider';
import { localizeProjectDetail as legacyLocalizeProjectDetail } from '../i18n/projectDetailTranslations';

type ContentLocale = 'en' | ProjectTranslationLocale;

const CONTENT_LOCALES: Array<{ id: ContentLocale; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'zh-CN', label: '简体中文' },
  { id: 'zh-TW', label: '繁體中文' },
  { id: 'vi-Latn', label: 'Tiếng Việt' },
  { id: 'vi-Hani', label: '𡨸喃' },
];

const GROUPS: Array<{ id: TechnologyGroupId; label: string }> = [
  { id: 'client', label: 'Client / Languages' },
  { id: 'backend', label: 'Backend / Data' },
  { id: 'platform', label: 'Platforms / Tools' },
];

const PROJECT_TONES: Project['tone'][] = [
  'lime',
  'blue',
  'sand',
  'lavender',
  'slate',
  'coral',
];

const PROJECT_MOCKUPS: Project['mockup'][] = [
  'morphology',
  'commerce',
  'language',
  'keyboard',
  'ide',
  'inflection',
];

const PROJECT_MEDIA_COPY = {
  en: { heading: 'Project screenshots', help: 'PNG, JPG or WebP · up to 8 MB each', add: 'Add screenshot', replace: 'Replace image', remove: 'Remove', title: 'Screenshot title', caption: 'Screenshot caption', empty: 'No screenshots yet.', uploading: 'Uploading…', uploaded: 'Screenshot uploaded. Save changes to publish it.', failed: 'Screenshot upload failed.' },
  'zh-CN': { heading: '项目截图', help: 'PNG、JPG 或 WebP · 每张最大 8 MB', add: '添加截图', replace: '更换图片', remove: '删除', title: '截图标题', caption: '截图说明', empty: '还没有项目截图。', uploading: '正在上传…', uploaded: '截图已上传，点击“保存修改”后正式发布。', failed: '截图上传失败。' },
  'zh-TW': { heading: '專案截圖', help: 'PNG、JPG 或 WebP · 每張最大 8 MB', add: '新增截圖', replace: '更換圖片', remove: '刪除', title: '截圖標題', caption: '截圖說明', empty: '還沒有專案截圖。', uploading: '正在上傳…', uploaded: '截圖已上傳，按「儲存修改」後正式發佈。', failed: '截圖上傳失敗。' },
  'vi-Latn': { heading: 'Ảnh chụp dự án', help: 'PNG, JPG hoặc WebP · tối đa 8 MB mỗi ảnh', add: 'Thêm ảnh', replace: 'Thay ảnh', remove: 'Xóa', title: 'Tiêu đề ảnh', caption: 'Chú thích ảnh', empty: 'Chưa có ảnh chụp dự án.', uploading: 'Đang tải lên…', uploaded: 'Đã tải ảnh. Lưu thay đổi để xuất bản.', failed: 'Tải ảnh thất bại.' },
  'vi-Hani': { heading: '形影預案', help: 'PNG、JPG 或 WebP · 每形影最大 8 MB', add: '添形影', replace: '替形影', remove: '刪', title: '題形影', caption: '註形影', empty: '𣎏固形影預案。', uploading: '當載𨕭…', uploaded: '形影㐌載𨕭。保存修改抵發布。', failed: '載𨕭形影敗。' },
} as const;


const ADMIN_DRAFT_STORAGE_KEY = 'portfolio-admin-draft-v1';

type AdminDraftSnapshot = {
  projects: Project[];
  technologyCatalog: TechnologyCatalog;
  translations: ProjectTranslationCatalog;
  selectedSlug: string;
  contentLocale: ContentLocale;
  savedAt: string;
};

function readAdminDraftSnapshot(): AdminDraftSnapshot | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(ADMIN_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AdminDraftSnapshot>;

    if (!Array.isArray(parsed.projects)) return null;
    if (!parsed.technologyCatalog || typeof parsed.technologyCatalog !== 'object') return null;
    if (!parsed.translations || typeof parsed.translations !== 'object') return null;

    const locale = CONTENT_LOCALES.some((item) => item.id === parsed.contentLocale)
      ? parsed.contentLocale as ContentLocale
      : 'en';
    const selectedSlug = typeof parsed.selectedSlug === 'string' ? parsed.selectedSlug : '';

    return {
      projects: parsed.projects as Project[],
      technologyCatalog: parsed.technologyCatalog as TechnologyCatalog,
      translations: parsed.translations as ProjectTranslationCatalog,
      selectedSlug,
      contentLocale: locale,
      savedAt: typeof parsed.savedAt === 'string' ? parsed.savedAt : '',
    };
  } catch {
    return null;
  }
}

function writeAdminDraftSnapshot(snapshot: Omit<AdminDraftSnapshot, 'savedAt'>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    ADMIN_DRAFT_STORAGE_KEY,
    JSON.stringify({ ...snapshot, savedAt: new Date().toISOString() }),
  );
}

function cloneProjects() {
  return initialProjects.map((project) => ({
    ...project,
    technologies: [...project.technologies],
    features: [...project.features],
    challenges: project.challenges.map((item) => ({ ...item })),
    architecture: project.architecture.map((item) => ({ ...item })),
    gallery: project.gallery.map((item) => ({ ...item })),
  }));
}

function cloneTechnologyCatalog(): TechnologyCatalog {
  return {
    client: initialTechnologyCatalog.client.map((item) => ({ ...item })),
    backend: initialTechnologyCatalog.backend.map((item) => ({ ...item })),
    platform: initialTechnologyCatalog.platform.map((item) => ({ ...item })),
  };
}

function toProjectTranslation(project: Project): ProjectTranslation {
  return {
    title: project.title,
    shortTitle: project.shortTitle,
    summary: project.summary,
    overview: project.overview,
    features: project.features.map((item) => item),
    challenges: project.challenges.map((item) => ({ ...item })),
    architecture: project.architecture.map((item) => ({ ...item })),
    gallery: project.gallery.map((item) => ({ ...item })),
  };
}

function cloneProjectTranslations(): ProjectTranslationCatalog {
  const next = JSON.parse(JSON.stringify(projectTranslationCatalog)) as ProjectTranslationCatalog;

  for (const project of initialProjects) {
    const locales = { ...(next[project.slug] ?? {}) };
    const english = toProjectTranslation(project);

    for (const locale of PROJECT_TRANSLATION_LOCALES) {
      if (locales[locale]) continue;

      const localized = toProjectTranslation(legacyLocalizeProjectDetail(project, locale));
      if (JSON.stringify(localized) !== JSON.stringify(english)) {
        locales[locale] = localized;
      }
    }

    if (Object.keys(locales).length > 0) next[project.slug] = locales;
  }

  return next;
}

function syncPublishedPortfolioData(
  nextProjects: Project[],
  nextTechnologyCatalog: TechnologyCatalog,
  nextTranslations: ProjectTranslationCatalog,
) {
  const projectCopies = JSON.parse(JSON.stringify(nextProjects)) as Project[];
  initialProjects.splice(0, initialProjects.length, ...projectCopies);

  initialTechnologyCatalog.client = nextTechnologyCatalog.client.map((item) => ({ ...item }));
  initialTechnologyCatalog.backend = nextTechnologyCatalog.backend.map((item) => ({ ...item }));
  initialTechnologyCatalog.platform = nextTechnologyCatalog.platform.map((item) => ({ ...item }));

  for (const slug of Object.keys(projectTranslationCatalog)) {
    delete projectTranslationCatalog[slug];
  }
  Object.assign(
    projectTranslationCatalog,
    JSON.parse(JSON.stringify(nextTranslations)) as ProjectTranslationCatalog,
  );
}

function emptyProjectTranslation(): ProjectTranslation {
  return {
    title: '',
    shortTitle: '',
    summary: '',
    overview: '',
    features: [],
    challenges: [],
    architecture: [],
    gallery: [],
  };
}

function listFromText(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pairLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...right] = line.split('|');
      return [left.trim(), right.join('|').trim()] as const;
    })
    .filter(([left]) => Boolean(left));
}

function challengesToText(project: Pick<Project, 'challenges'>) {
  return project.challenges
    .map((item) => `${item.title} | ${item.description}`)
    .join('\n');
}

function architectureToText(project: Pick<Project, 'architecture'>) {
  return project.architecture
    .map((item) => `${item.label} | ${item.detail}`)
    .join('\n');
}

function galleryToText(project: Pick<Project, 'gallery'>) {
  return project.gallery
    .map((item) => `${item.title} | ${item.caption}`)
    .join('\n');
}

export function AdminPage() {
  const { language } = useI18n();
  const ui = getAdminUiCopy(language);
  const mediaUi = PROJECT_MEDIA_COPY[language];
  const [initialDraftSnapshot] = useState<AdminDraftSnapshot | null>(() => readAdminDraftSnapshot());
  const [projectDrafts, setProjectDrafts] = useState<Project[]>(
    () => initialDraftSnapshot?.projects ?? cloneProjects(),
  );
  const [technologyDrafts, setTechnologyDrafts] = useState<TechnologyCatalog>(
    () => initialDraftSnapshot?.technologyCatalog ?? cloneTechnologyCatalog(),
  );
  const [translationDrafts, setTranslationDrafts] = useState<ProjectTranslationCatalog>(() => {
    const baseline = cloneProjectTranslations();
    if (!initialDraftSnapshot?.translations) return baseline;

    const restored = JSON.parse(
      JSON.stringify(initialDraftSnapshot.translations),
    ) as ProjectTranslationCatalog;

    for (const [slug, locales] of Object.entries(baseline)) {
      restored[slug] = { ...locales, ...(restored[slug] ?? {}) };
    }

    return restored;
  });
  const [contentLocale, setContentLocale] = useState<ContentLocale>(
    () => initialDraftSnapshot?.contentLocale ?? 'en',
  );
  const [translationState, setTranslationState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [translationMessage, setTranslationMessage] = useState('');
  const [selectedSlug, setSelectedSlug] = useState(() => {
    const draftProjects = initialDraftSnapshot?.projects ?? initialProjects;
    const preferred = initialDraftSnapshot?.selectedSlug ?? '';
    return draftProjects.some((project) => project.slug === preferred)
      ? preferred
      : draftProjects[0]?.slug ?? '';
  });
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [analysisState, setAnalysisState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [analysisError, setAnalysisError] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('main');
  const [accessState, setAccessState] = useState<'locked' | 'checking' | 'granted' | 'error'>(
    'locked',
  );
  const [accessInfo, setAccessInfo] = useState<PortfolioAccess | null>(null);
  const [accessMessage, setAccessMessage] = useState('');
  const [publishState, setPublishState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [publishMessage, setPublishMessage] = useState('');
  const [draftMessage, setDraftMessage] = useState(initialDraftSnapshot ? ui.draftRestored : '');
  const [agentInstruction, setAgentInstruction] = useState('');
  const [agentState, setAgentState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [agentStatus, setAgentStatus] = useState('');
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [agentProposal, setAgentProposal] = useState<PortfolioAgentProposal | null>(null);
  const [mediaBusy, setMediaBusy] = useState<number | 'new' | null>(null);
  const [mediaMessage, setMediaMessage] = useState('');
  const [mediaError, setMediaError] = useState(false);

  const selectedProject = useMemo(
    () => projectDrafts.find((project) => project.slug === selectedSlug),
    [projectDrafts, selectedSlug],
  );

  const allTechnologyNames = useMemo(
    () => Object.values(technologyDrafts).flat().map((technology) => technology.name),
    [technologyDrafts],
  );

  const selectedTranslation = useMemo(() => {
    if (!selectedProject || contentLocale === 'en') return null;
    return translationDrafts[selectedProject.slug]?.[contentLocale] ?? emptyProjectTranslation();
  }, [contentLocale, selectedProject, translationDrafts]);


  async function handleUnlock() {
    const cleanPassword = password.trim();
    if (!cleanPassword) return;

    setAccessState('checking');
    setAccessMessage(ui.checkingAdminAccess);

    try {
      const result = await loginAdmin(cleanPassword);
      setAccessInfo(result);
      setBranch(result.defaultBranch || 'main');
      setPassword('');
      setAccessState('granted');
      setAccessMessage('');
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : ui.unableVerifyAdmin);
    }
  }

  useEffect(() => {
    let active = true;
    setAccessState('checking');
    setAccessMessage(ui.restoringAdminSession);

    void getAdminSession()
      .then((session) => {
        if (!active) return;
        if (!session) {
          setAccessState('locked');
          setAccessMessage('');
          return;
        }
        setAccessInfo(session);
        setBranch(session.defaultBranch || 'main');
        setAccessState('granted');
        setAccessMessage('');
      })
      .catch((error) => {
        if (!active) return;
        setAccessState('error');
        setAccessMessage(error instanceof Error ? error.message : ui.unableRestoreSession);
      });

    return () => {
      active = false;
    };
  }, []);

  function lockAdmin() {
    void logoutAdmin();
    setPassword('');
    setAccessInfo(null);
    setAccessState('locked');
    setAccessMessage('');
    setPublishMessage('');
  }

  function resetDrafts() {
    const nextProjects = cloneProjects();
    if (typeof window !== 'undefined') window.localStorage.removeItem(ADMIN_DRAFT_STORAGE_KEY);
    setProjectDrafts(nextProjects);
    setTechnologyDrafts(cloneTechnologyCatalog());
    setTranslationDrafts(cloneProjectTranslations());
    setContentLocale('en');
    setTranslationState('idle');
    setTranslationMessage('');
    setSelectedSlug(nextProjects[0]?.slug ?? '');
    setAnalysis(null);
    setPublishState('idle');
    setPublishMessage(ui.resetComplete);
    setDraftMessage(ui.draftReset);
  }

  function saveDrafts() {
    writeAdminDraftSnapshot({
      projects: projectDrafts,
      technologyCatalog: technologyDrafts,
      translations: translationDrafts,
      selectedSlug,
      contentLocale,
    });
    setDraftMessage(ui.draftSaved);
  }

  useEffect(() => {
    if (accessState !== 'granted') return;

    const timer = window.setTimeout(() => {
      writeAdminDraftSnapshot({
        projects: projectDrafts,
        technologyCatalog: technologyDrafts,
        translations: translationDrafts,
        selectedSlug,
        contentLocale,
      });
      setDraftMessage(ui.draftAutosaved);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [
    accessState,
    projectDrafts,
    technologyDrafts,
    translationDrafts,
    selectedSlug,
    contentLocale,
  ]);

  function updateProject(patch: Partial<Project>) {
    setProjectDrafts((current) =>
      current.map((project) =>
        project.slug === selectedSlug ? { ...project, ...patch } : project,
      ),
    );
  }

  function updateTranslation(patch: Partial<ProjectTranslation>) {
    if (!selectedProject || contentLocale === 'en') return;
    setTranslationDrafts((current) => {
      const existing = current[selectedProject.slug]?.[contentLocale] ?? emptyProjectTranslation();
      return {
        ...current,
        [selectedProject.slug]: {
          ...(current[selectedProject.slug] ?? {}),
          [contentLocale]: { ...existing, ...patch },
        },
      };
    });
  }

  function updateGalleryItem(index: number, patch: Partial<Project['gallery'][number]>) {
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
      const titleFromFile = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();

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

  async function handleAiFillTranslations() {
    if (!selectedProject) return;
    setTranslationState('loading');
    setTranslationMessage(ui.translatingMessage);
    try {
      const translations = await translateProjectAllLocales({ project: selectedProject });
      setTranslationDrafts((current) =>
        mergeProjectTranslations(current, selectedProject.slug, translations),
      );
      setTranslationState('idle');
      setTranslationMessage(ui.translationComplete);
    } catch (error) {
      setTranslationState('error');
      setTranslationMessage(error instanceof Error ? error.message : ui.translationFailed);
    }
  }

  async function handleAgentSubmit(prefill?: string) {
    if (agentState === 'loading') return;

    const instruction = (prefill ?? agentInstruction).trim();
    if (!instruction) return;

    const userMessage: AgentMessage = { role: 'user', content: instruction };
    setAgentMessages((current) => [...current, userMessage].slice(-16));
    if (!prefill) setAgentInstruction('');
    setAgentProposal(null);
    setAgentState('loading');
    setAgentStatus(ui.agentThinking);

    try {
      const proposal = await runPortfolioAgent({
        instruction,
        projects: projectDrafts,
        translations: translationDrafts,
        technologyCatalog: technologyDrafts,
        selectedSlug,
        activeLocale: contentLocale,
        history: agentMessages.slice(-12),
      });

      const assistantMessage: AgentMessage = {
        role: 'assistant',
        content: proposal.message,
      };
      setAgentMessages((current) => [...current, assistantMessage].slice(-16));
      setAgentProposal(proposal);
      setAgentState('idle');
      setAgentStatus(
        proposal.changedFields.length > 0 ? ui.agentReviewBeforeApply : ui.agentNoChanges,
      );
    } catch (error) {
      setAgentState('error');
      setAgentStatus(error instanceof Error ? error.message : ui.agentFailed);
    }
  }

  function applyAgentProposal() {
    if (!agentProposal) return;

    if (agentProposal.projectPatches.length > 0 || agentProposal.newProjects.length > 0 || agentProposal.deleteProjectSlugs.length > 0) {
      setProjectDrafts((current) => {
        const deleteSet = new Set(agentProposal.deleteProjectSlugs);
        let next = current.filter((project) => !deleteSet.has(project.slug));
        next = next.map((project) => {
          const operation = agentProposal.projectPatches.find((item) => item.slug === project.slug);
          return operation ? { ...project, ...operation.patch, slug: project.slug, number: project.number } : project;
        });
        for (const project of agentProposal.newProjects) {
          if (!next.some((item) => item.slug === project.slug)) next.push(project);
        }
        return next;
      });
    }

    if (agentProposal.translationPatches.length > 0 || agentProposal.deleteProjectSlugs.length > 0) {
      setTranslationDrafts((current) => {
        const next = { ...current };
        for (const slug of agentProposal.deleteProjectSlugs) delete next[slug];
        for (const operation of agentProposal.translationPatches) {
          next[operation.slug] = {
            ...(next[operation.slug] ?? {}),
            [operation.locale]: {
              ...(next[operation.slug]?.[operation.locale] ?? emptyProjectTranslation()),
              ...operation.patch,
            },
          };
        }
        return next;
      });
    }

    if (agentProposal.technologyOperations.length > 0) {
      setTechnologyDrafts((current) => {
        const next: TechnologyCatalog = {
          client: current.client.map((item) => ({ ...item })),
          backend: current.backend.map((item) => ({ ...item })),
          platform: current.platform.map((item) => ({ ...item })),
        };
        for (const operation of agentProposal.technologyOperations) {
          if (operation.action === 'add') {
            if (!next[operation.group].some((item) => item.name === operation.item.name)) {
              next[operation.group].push(operation.item);
            }
          } else if (operation.action === 'remove') {
            next[operation.group] = next[operation.group].filter((item) => item.name !== operation.name);
          } else {
            next[operation.group] = next[operation.group].map((item) =>
              item.name === operation.name ? { ...item, ...operation.patch } : item,
            );
          }
        }
        return next;
      });
    }

    if (agentProposal.deleteProjectSlugs.includes(selectedSlug)) {
      const remaining = projectDrafts.filter((project) => !agentProposal.deleteProjectSlugs.includes(project.slug));
      setSelectedSlug(remaining[0]?.slug ?? '');
    }

    setAgentProposal(null);
    setAgentState('idle');
    setAgentStatus(ui.agentApplied);
  }

  function updateTechnology(
    group: TechnologyGroupId,
    index: number,
    patch: Partial<TechnologyItem>,
  ) {
    setTechnologyDrafts((current) => ({
      ...current,
      [group]: current[group].map((technology, technologyIndex) =>
        technologyIndex === index ? { ...technology, ...patch } : technology,
      ),
    }));
  }

  function removeTechnology(group: TechnologyGroupId, index: number) {
    setTechnologyDrafts((current) => ({
      ...current,
      [group]: current[group].filter((_, technologyIndex) => technologyIndex !== index),
    }));
  }

  function addTechnology(group: TechnologyGroupId) {
    setTechnologyDrafts((current) => ({
      ...current,
      [group]: [
        ...current[group],
        {
          name: ui.newTechnology,
          color: '#C7FF4A',
        },
      ],
    }));
  }

  async function handleAnalyze() {
    setAnalysisState('loading');
    setAnalysisError('');

    try {
      const result = await analyzeRepository(repositoryUrl);
      setAnalysis(result);
      setAnalysisState('idle');
    } catch (error) {
      setAnalysisState('error');
      setAnalysisError(error instanceof Error ? error.message : ui.repositoryAnalysisFailed);
    }
  }

  function applyAnalysisToSelected() {
    if (!analysis || !selectedProject) return;

    updateProject({
      title: analysis.title,
      shortTitle: selectedProject.shortTitle || analysis.title,
      summary: analysis.summary,
      overview: analysis.overview,
      github: analysis.github,
      technologies: Array.from(
        new Set([...selectedProject.technologies, ...analysis.technologies]),
      ),
      features: analysis.features.length > 0 ? analysis.features : selectedProject.features,
    });

    setTechnologyDrafts((current) => mergeTechnologyNames(current, analysis.technologies));
  }

  function addAnalysisAsProject() {
    if (!analysis) return;

    const project = createProjectFromAnalysis(analysis, projectDrafts.length);
    const existingIndex = projectDrafts.findIndex((item) => item.slug === project.slug);

    if (existingIndex >= 0) {
      setSelectedSlug(projectDrafts[existingIndex].slug);
      return;
    }

    setProjectDrafts((current) => [...current, project]);
    setTechnologyDrafts((current) => mergeTechnologyNames(current, analysis.technologies));
    setSelectedSlug(project.slug);
  }

  function addBlankProject() {
    const index = projectDrafts.length;
    const slug = `project-${index + 1}`;
    const project: Project = {
      slug,
      title: ui.newProject,
      shortTitle: ui.newProject,
      category: 'Product',
      status: ui.inDevelopment,
      number: String(index + 1).padStart(2, '0'),
      summary: '',
      overview: '',
      technologies: [],
      features: [],
      challenges: [],
      architecture: [],
      gallery: [],
      tone: 'blue',
      mockup: 'language',
    };

    setProjectDrafts((current) => [...current, project]);
    setSelectedSlug(slug);
  }

  function removeSelectedProject() {
    if (!selectedProject) return;

    const next = projectDrafts.filter((project) => project.slug !== selectedProject.slug);
    setProjectDrafts(next);
    setTranslationDrafts((current) => {
      const nextTranslations = { ...current };
      delete nextTranslations[selectedProject.slug];
      return nextTranslations;
    });
    setSelectedSlug(next[0]?.slug ?? '');
  }

  async function handlePublish() {
    setPublishState('saving');
    setPublishMessage(ui.publishingPortfolio);

    try {
      const publishBranch = branch.trim() || 'main';
      const result = await publishPortfolioContent({
        branch: publishBranch,
        projects: projectDrafts,
        technologyCatalog: technologyDrafts,
      });
      const translationCommitUrl = await publishProjectTranslationCatalog({
        branch: publishBranch,
        catalog: translationDrafts,
      });

      // Keep the already-running SPA in sync with the data just saved to Cloudflare.
      // Without this, navigating to Home/Projects before a hard refresh still showed
      // the old in-memory project array.
      syncPublishedPortfolioData(projectDrafts, technologyDrafts, translationDrafts);

      if (typeof window !== 'undefined') window.localStorage.removeItem(ADMIN_DRAFT_STORAGE_KEY);
      setDraftMessage('');
      setPublishState('success');
      setPublishMessage(
        `${ui.published} ${result.projectCommitUrl ?? ''} ${result.technologyCommitUrl ?? ''} ${translationCommitUrl ?? ''}`.trim(),
      );
    } catch (error) {
      setPublishState('error');
      setPublishMessage(error instanceof Error ? error.message : ui.publishingFailed);
    }
  }

  if (accessState !== 'granted') {
    return (
      <main className="admin-page shell">
        <section className="admin-access-shell">
          <div className="admin-access-card">
            <div className="admin-access-language"><LanguageSwitcher /></div>
            <p className="eyebrow">PORTFOLIO CONTROL</p>
            <h1>{ui.adminAccessTitle}</h1>
            <p>
              {ui.adminAccessDescription}
            </p>

            <label className="admin-access-field">
              <span>{ui.adminPassword}</span>
              <input
                type="password"
                value={password}
                autoComplete="off"
                placeholder={ui.enterAdminPassword}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && accessState !== 'checking') {
                    void handleUnlock();
                  }
                }}
              />
            </label>

            <button
              type="button"
              onClick={() => void handleUnlock()}
              disabled={accessState === 'checking' || !password.trim()}
            >
              {accessState === 'checking' ? ui.checkingAccess : ui.unlockAdmin}
            </button>

            {accessMessage && (
              <p className={`admin-message ${accessState === 'error' ? 'error' : ''}`}>
                {accessMessage}
              </p>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page shell">
      <header className="admin-hero">
        <div>
          <p className="eyebrow">PORTFOLIO CONTROL</p>
          <h1>{ui.adminTitle}</h1>
          <p>
            {ui.adminDescription}
          </p>
        </div>

        <div className="admin-hero-status">
          <LanguageSwitcher />
          <span>{String(projectDrafts.length).padStart(2, '0')} {ui.projects}</span>
          <span>{String(allTechnologyNames.length).padStart(2, '0')} {ui.technologies}</span>
          <span>{accessInfo?.repository ?? ui.githubConnected}</span>
          <span>
            {import.meta.env.VITE_PORTFOLIO_AI_ENDPOINT
              ? ui.aiConnected
              : ui.analyzerMode}
          </span>
          <button type="button" className="secondary admin-lock-button" onClick={lockAdmin}>
            {ui.lockAdmin}
          </button>
        </div>
      </header>

      <div className="admin-workspace">
        <div className="admin-workspace-main">
      <section className="admin-panel admin-ai-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">01 / {ui.repositoryAssistant}</p>
            <h2>{ui.repositoryDraft}</h2>
          </div>
          <p>
            {ui.repositoryAssistantDescription}
          </p>
        </div>

        <div className="admin-repo-input-row">
          <input
            value={repositoryUrl}
            onChange={(event) => setRepositoryUrl(event.target.value)}
            placeholder="https://github.com/owner/repository"
          />
          <button type="button" onClick={() => void handleAnalyze()} disabled={analysisState === 'loading'}>
            {analysisState === 'loading' ? ui.analyzing : ui.analyzeRepository}
          </button>
        </div>

        {analysisState === 'error' && <p className="admin-message error">{analysisError}</p>}

        {analysis && (
          <article className="admin-analysis-card">
            <div>
              <span className="admin-analysis-source">
                {analysis.source === 'ai' ? 'AI' : 'REPOSITORY'}
              </span>
              <h3>{analysis.title}</h3>
              <p>{analysis.summary}</p>
            </div>

            <div className="admin-chip-row">
              {analysis.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>

            <div className="admin-actions">
              <button type="button" onClick={applyAnalysisToSelected} disabled={!selectedProject}>
                {ui.applyToSelectedProject}
              </button>
              <button type="button" className="secondary" onClick={addAnalysisAsProject}>
                {ui.addAsNewProject}
              </button>
            </div>
          </article>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">02 / PROJECTS</p>
            <h2>{ui.projectContent}</h2>
          </div>

          <div className="admin-actions">
            <button type="button" onClick={addBlankProject}>{ui.addProject}</button>
            <button
              type="button"
              onClick={() => void handlePublish()}
              disabled={publishState === 'saving'}
            >
              {publishState === 'saving' ? ui.publishing : ui.publishToGitHub}
            </button>
            <button type="button" className="secondary" onClick={saveDrafts}>{ui.saveDraft}</button>
            <button
              type="button"
              className="secondary"
              onClick={() => void handleAiFillTranslations()}
              disabled={!selectedProject || translationState === 'loading'}
            >
              {translationState === 'loading' ? ui.translatingAll : ui.aiTranslateAll}
            </button>
            <button type="button" className="secondary" onClick={resetDrafts}>{ui.resetDrafts}</button>
            <button
              type="button"
              className="danger"
              onClick={removeSelectedProject}
              disabled={!selectedProject}
            >
              {ui.deleteSelected}
            </button>
          </div>
        </div>

        {draftMessage && <p className="admin-message">{draftMessage}</p>}

        <div className="admin-project-layout">
          <nav className="admin-project-list" aria-label={ui.projectList}>
            {projectDrafts.map((project) => (
              <button
                type="button"
                className={project.slug === selectedSlug ? 'active' : ''}
                key={project.slug}
                onClick={() => setSelectedSlug(project.slug)}
              >
                <span>{project.number}</span>
                <strong>{project.title}</strong>
              </button>
            ))}
          </nav>

          {selectedProject ? (
            <div className="admin-project-editor">
              <div className="admin-content-locale-bar" aria-label={ui.translationLanguage}>
                {CONTENT_LOCALES.map((locale) => {
                  const ready = locale.id === 'en' || Boolean(
                    translationDrafts[selectedProject.slug]?.[locale.id],
                  );
                  return (
                    <button
                      type="button"
                      key={locale.id}
                      className={contentLocale === locale.id ? 'admin-locale-tab active' : 'admin-locale-tab'}
                      onClick={() => setContentLocale(locale.id)}
                    >
                      <span>{locale.label}</span>
                      <small>{ready ? ui.ready : ui.empty}</small>
                    </button>
                  );
                })}
              </div>


              {translationMessage && (
                <p className={translationState === 'error' ? 'admin-message error' : 'admin-message'}>
                  {translationMessage}
                </p>
              )}

              {contentLocale === 'en' ? (
                <div className="admin-form-grid">
              <label>
                <span>{ui.title}</span>
                <input
                  value={selectedProject.title}
                  onChange={(event) => updateProject({ title: event.target.value })}
                />
              </label>

              <label>
                <span>{ui.shortTitle}</span>
                <input
                  value={selectedProject.shortTitle}
                  onChange={(event) => updateProject({ shortTitle: event.target.value })}
                />
              </label>

              <label>
                <span>{ui.slug}</span>
                <input
                  value={selectedProject.slug}
                  onChange={(event) => {
                    const previousSlug = selectedProject.slug;
                    const nextSlug = event.target.value;
                    setProjectDrafts((current) =>
                      current.map((project) =>
                        project.slug === previousSlug ? { ...project, slug: nextSlug } : project,
                      ),
                    );
                    setTranslationDrafts((current) => {
                      if (!current[previousSlug] || previousSlug === nextSlug) return current;
                      const nextTranslations = { ...current };
                      nextTranslations[nextSlug] = nextTranslations[previousSlug];
                      delete nextTranslations[previousSlug];
                      return nextTranslations;
                    });
                    setSelectedSlug(nextSlug);
                  }}
                />
              </label>

              <label>
                <span>{ui.projectNumber}</span>
                <input
                  value={selectedProject.number}
                  onChange={(event) => updateProject({ number: event.target.value })}
                />
              </label>

              <label>
                <span>{ui.category}</span>
                <select
                  value={selectedProject.category}
                  onChange={(event) =>
                    updateProject({ category: event.target.value as ProjectCategory })
                  }
                >
                  <option value="Language">Language</option>
                  <option value="AI & Developer Tools">AI & Developer Tools</option>
                  <option value="Product">Product</option>
                </select>
              </label>

              <label>
                <span>{ui.status}</span>
                <input
                  value={selectedProject.status}
                  onChange={(event) => updateProject({ status: event.target.value })}
                />
              </label>

              <label>
                <span>{ui.tone}</span>
                <select
                  value={selectedProject.tone}
                  onChange={(event) =>
                    updateProject({ tone: event.target.value as Project['tone'] })
                  }
                >
                  {PROJECT_TONES.map((tone) => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>{ui.mockup}</span>
                <select
                  value={selectedProject.mockup}
                  onChange={(event) =>
                    updateProject({ mockup: event.target.value as Project['mockup'] })
                  }
                >
                  {PROJECT_MOCKUPS.map((mockup) => (
                    <option key={mockup} value={mockup}>{mockup}</option>
                  ))}
                </select>
              </label>

              <label className="wide">
                <span>{ui.githubUrl}</span>
                <input
                  value={selectedProject.github ?? ''}
                  onChange={(event) =>
                    updateProject({ github: event.target.value || undefined })
                  }
                />
              </label>

              <label className="wide">
                <span>{ui.summary}</span>
                <textarea
                  value={selectedProject.summary}
                  onChange={(event) => updateProject({ summary: event.target.value })}
                />
              </label>

              <label className="wide">
                <span>{ui.overview}</span>
                <textarea
                  className="large"
                  value={selectedProject.overview}
                  onChange={(event) => updateProject({ overview: event.target.value })}
                />
              </label>

              <label className="wide">
                <span>{ui.technologiesHint}</span>
                <textarea
                  value={selectedProject.technologies.join(', ')}
                  onChange={(event) =>
                    updateProject({ technologies: listFromText(event.target.value) })
                  }
                />
              </label>

              <label className="wide">
                <span>{ui.featuresHint}</span>
                <textarea
                  className="large"
                  value={selectedProject.features.join('\n')}
                  onChange={(event) =>
                    updateProject({ features: listFromText(event.target.value) })
                  }
                />
              </label>

              <label className="wide">
                <span>{ui.challengesHint}</span>
                <textarea
                  className="large"
                  value={challengesToText(selectedProject)}
                  onChange={(event) =>
                    updateProject({
                      challenges: pairLines(event.target.value).map(([title, description]) => ({
                        title,
                        description,
                      })),
                    })
                  }
                />
              </label>

              <label className="wide">
                <span>{ui.architectureHint}</span>
                <textarea
                  className="large"
                  value={architectureToText(selectedProject)}
                  onChange={(event) =>
                    updateProject({
                      architecture: pairLines(event.target.value).map(([label, detail]) => ({
                        label,
                        detail,
                      })),
                    })
                  }
                />
              </label>

              <section className="admin-screenshot-editor wide">
                <div className="admin-screenshot-heading">
                  <div>
                    <strong>{mediaUi.heading}</strong>
                    <small>{mediaUi.help}</small>
                  </div>
                  <label className={`admin-upload-button${mediaBusy !== null ? ' is-disabled' : ''}`}>
                    <span>{mediaBusy === 'new' ? mediaUi.uploading : mediaUi.add}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
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
                  <div className="admin-screenshot-empty">{mediaUi.empty}</div>
                ) : (
                  <div className="admin-screenshot-list">
                    {selectedProject.gallery.map((item, index) => (
                      <article className="admin-screenshot-card" key={`${selectedProject.slug}-${index}`}>
                        <div className="admin-screenshot-preview">
                          {item.image ? (
                            <img src={item.image} alt={item.title || `${mediaUi.heading} ${index + 1}`} />
                          ) : (
                            <span>NO IMAGE</span>
                          )}
                        </div>

                        <div className="admin-screenshot-fields">
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
                          <div className="admin-screenshot-actions">
                            <label className={`admin-upload-button secondary${mediaBusy !== null ? ' is-disabled' : ''}`}>
                              <span>{mediaBusy === index ? mediaUi.uploading : mediaUi.replace}</span>
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                disabled={mediaBusy !== null}
                                onChange={(event) => {
                                  const file = event.currentTarget.files?.[0];
                                  event.currentTarget.value = '';
                                  if (file) void uploadGalleryScreenshot(file, index);
                                }}
                              />
                            </label>
                            <button type="button" className="danger" onClick={() => removeGalleryItem(index)}>
                              {mediaUi.remove}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
              ) : selectedTranslation ? (
                <div className="admin-form-grid admin-translation-form-grid">
                  <div className="admin-language-note wide">
                    <strong>{CONTENT_LOCALES.find((locale) => locale.id === contentLocale)?.label}</strong>
                    <span>{ui.sourcePreservationNote}</span>
                  </div>
                  <label><span>{ui.title}</span><input value={selectedTranslation.title} onChange={(event) => updateTranslation({ title: event.target.value })} /></label>
                  <label><span>{ui.shortTitle}</span><input value={selectedTranslation.shortTitle} onChange={(event) => updateTranslation({ shortTitle: event.target.value })} /></label>
                  <label className="wide"><span>{ui.summary}</span><textarea value={selectedTranslation.summary} onChange={(event) => updateTranslation({ summary: event.target.value })} /></label>
                  <label className="wide"><span>{ui.overview}</span><textarea className="large" value={selectedTranslation.overview} onChange={(event) => updateTranslation({ overview: event.target.value })} /></label>
                  <label className="wide"><span>{ui.featuresOnePerLine}</span><textarea className="large" value={selectedTranslation.features.join('\n')} onChange={(event) => updateTranslation({ features: listFromText(event.target.value) })} /></label>
                  <label className="wide"><span>{ui.challengesHint}</span><textarea className="large" value={challengesToText(selectedTranslation)} onChange={(event) => updateTranslation({ challenges: pairLines(event.target.value).map(([title, description]) => ({ title, description })) })} /></label>
                  <label className="wide"><span>{ui.architectureHint}</span><textarea className="large" value={architectureToText(selectedTranslation)} onChange={(event) => updateTranslation({ architecture: pairLines(event.target.value).map(([label, detail]) => ({ label, detail })) })} /></label>
                  <label className="wide"><span>{ui.galleryHint}</span><textarea className="large" value={galleryToText(selectedTranslation)} onChange={(event) => updateTranslation({ gallery: pairLines(event.target.value).map(([title, caption]) => ({ title, caption })) })} /></label>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="admin-message">{ui.noProjectSelected}</p>
          )}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">03 / TECHNOLOGY</p>
            <h2>{ui.languagesTools}</h2>
          </div>
          <p>
            {ui.technologyDescription}
          </p>
        </div>

        <div className="admin-tech-groups">
          {GROUPS.map((group) => (
            <article className="admin-tech-group" key={group.id}>
              <header>
                <div>
                  <span>{group.id.toUpperCase()}</span>
                  <h3>{group.id === 'client' ? ui.clientLanguages : group.id === 'backend' ? ui.backendData : ui.platformsTools}</h3>
                </div>
                <button type="button" onClick={() => addTechnology(group.id)}>{ui.add}</button>
              </header>

              <div className="admin-tech-list">
                {technologyDrafts[group.id].map((technology, index) => (
                  <div className="admin-tech-row" key={`${group.id}-${index}`}>
                    <input
                      value={technology.name}
                      aria-label={ui.technologyName}
                      onChange={(event) =>
                        updateTechnology(group.id, index, { name: event.target.value })
                      }
                    />
                    <input
                      value={technology.color}
                      aria-label={ui.brandColor}
                      onChange={(event) =>
                        updateTechnology(group.id, index, { color: event.target.value })
                      }
                    />
                    <input
                      value={technology.logo ?? ''}
                      aria-label={ui.logoUrl}
                      placeholder={ui.logoUrl}
                      onChange={(event) =>
                        updateTechnology(group.id, index, {
                          logo: event.target.value || undefined,
                        })
                      }
                    />
                    <span
                      className="admin-color-preview"
                      style={{ background: technology.color }}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      className="icon danger"
                      onClick={() => removeTechnology(group.id, index)}
                      aria-label={`${ui.remove} ${technology.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel admin-publish-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">04 / PUBLISH</p>
            <h2>{ui.writeChanges}</h2>
          </div>
          <p>
            {ui.publishDescription}
          </p>
        </div>

        <div className="admin-publish-grid admin-publish-grid-verified">
          <div className="admin-verified-repository">
            <span>{ui.verifiedRepository}</span>
            <strong>{accessInfo?.repository}</strong>
          </div>

          <button
            type="button"
            onClick={() => void handlePublish()}
            disabled={publishState === 'saving'}
          >
            {publishState === 'saving' ? ui.publishing : ui.publishToGitHub}
          </button>
        </div>

        {publishMessage && (
          <p
            className={`admin-message ${
              publishState === 'error'
                ? 'error'
                : publishState === 'success'
                  ? 'success'
                  : ''
            }`}
          >
            {publishMessage}
          </p>
        )}
      </section>
        </div>

      <aside className="admin-global-agent-panel" aria-label={ui.agentTitle}>
        <div className="admin-panel-heading admin-agent-heading">
          <div>
            <p className="eyebrow">AI / GLOBAL AGENT</p>
            <h2>{ui.agentTitle}</h2>
          </div>
          <p>{ui.agentDraftOnly}</p>
        </div>

        <div className="admin-global-agent-context">
          <span>{ui.agentPortfolioScope}</span>
          <strong>{projectDrafts.length} {ui.projects} · {allTechnologyNames.length} {ui.technologies}</strong>
          {selectedProject && (
            <small>{ui.agentCurrentFocus}: {selectedProject.title} · {CONTENT_LOCALES.find((locale) => locale.id === contentLocale)?.label}</small>
          )}
        </div>

        {agentMessages.length > 0 && (
          <div className="admin-agent-thread admin-global-agent-thread">
            {agentMessages.map((message, index) => (
              <div className={`admin-agent-message ${message.role}`} key={`${index}-${message.role}`}>
                <span>{message.role === 'user' ? ui.agentYou : 'AI'}</span>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="admin-agent-quick-actions">
          <button
            type="button"
            className="secondary"
            onClick={() => void handleAgentSubmit('Review the entire portfolio and fill only genuinely empty or incomplete portfolio fields across projects. Preserve good existing content and do not invent facts.')}
            disabled={agentState === 'loading'}
          >
            {ui.agentFillEmpty}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => void handleAgentSubmit('Find missing translations across every project and fill the missing Simplified Chinese, Traditional Chinese, Vietnamese, and Chữ Nôm fields. Do not change English unless necessary for consistency.')}
            disabled={agentState === 'loading'}
          >
            {ui.agentTranslateAll}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => void handleAgentSubmit(`Focus on the currently selected project (${selectedSlug || 'none'}) and active locale (${contentLocale}). Improve only that scope unless another edit is required for consistency.`)}
            disabled={agentState === 'loading' || !selectedProject}
          >
            {ui.agentImproveCurrent}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => void handleAgentSubmit('Audit the portfolio for inconsistent project descriptions, duplicated technologies, missing technology catalog entries, and multilingual coverage problems. Propose only safe draft corrections.')}
            disabled={agentState === 'loading'}
          >
            {ui.agentAuditPortfolio}
          </button>
        </div>

        <div className="admin-agent-compose admin-global-agent-compose">
          <textarea
            value={agentInstruction}
            onChange={(event) => setAgentInstruction(event.target.value)}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                void handleAgentSubmit();
              }
            }}
            placeholder={ui.agentPlaceholder}
            disabled={agentState === 'loading'}
          />
          <button
            type="button"
            onClick={() => void handleAgentSubmit()}
            disabled={agentState === 'loading' || !agentInstruction.trim()}
          >
            {agentState === 'loading' ? ui.agentThinking : ui.agentSend}
          </button>
        </div>

        {agentStatus && (
          <p className={agentState === 'error' ? 'admin-message error' : 'admin-message'}>{agentStatus}</p>
        )}

        {agentProposal && agentProposal.changedFields.length > 0 && (
          <div className="admin-agent-proposal admin-global-agent-proposal">
            <div className="admin-agent-proposal-heading">
              <strong>{ui.agentProposedChanges}</strong>
              <span>{agentProposal.changedFields.length} {ui.agentFields}</span>
            </div>
            <div className="admin-chip-row">
              {agentProposal.changedFields.map((field) => <span key={field}>{field}</span>)}
            </div>
            <div className="admin-actions">
              <button type="button" onClick={applyAgentProposal}>{ui.agentApply}</button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setAgentProposal(null);
                  setAgentStatus(ui.agentDiscarded);
                }}
              >
                {ui.agentDiscard}
              </button>
            </div>
          </div>
        )}
      </aside>
      </div>
    </main>
  );
}
