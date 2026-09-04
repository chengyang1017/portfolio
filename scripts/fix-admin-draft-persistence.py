from pathlib import Path

admin_path = Path('src/pages/AdminPage.tsx')
copy_path = Path('src/admin/adminUiCopy.ts')

admin = admin_path.read_text(encoding='utf-8')
copy = copy_path.read_text(encoding='utf-8')

# 1) Add persistent draft helpers.
anchor = "const PROJECT_MOCKUPS: Project['mockup'][] = [\n  'morphology',\n  'commerce',\n  'language',\n  'keyboard',\n  'ide',\n  'inflection',\n];\n"
block = anchor + r'''

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
'''
if 'ADMIN_DRAFT_STORAGE_KEY' not in admin:
    if anchor not in admin:
        raise SystemExit('project mockups anchor not found')
    admin = admin.replace(anchor, block, 1)

# 2) Initialize editor state from saved browser draft.
old = """  const [projectDrafts, setProjectDrafts] = useState<Project[]>(cloneProjects);\n  const [technologyDrafts, setTechnologyDrafts] = useState<TechnologyCatalog>(\n    cloneTechnologyCatalog,\n  );\n  const [translationDrafts, setTranslationDrafts] = useState<ProjectTranslationCatalog>(\n    cloneProjectTranslations,\n  );\n  const [contentLocale, setContentLocale] = useState<ContentLocale>('en');\n"""
new = """  const [initialDraftSnapshot] = useState<AdminDraftSnapshot | null>(() => readAdminDraftSnapshot());\n  const [projectDrafts, setProjectDrafts] = useState<Project[]>(\n    () => initialDraftSnapshot?.projects ?? cloneProjects(),\n  );\n  const [technologyDrafts, setTechnologyDrafts] = useState<TechnologyCatalog>(\n    () => initialDraftSnapshot?.technologyCatalog ?? cloneTechnologyCatalog(),\n  );\n  const [translationDrafts, setTranslationDrafts] = useState<ProjectTranslationCatalog>(\n    () => initialDraftSnapshot?.translations ?? cloneProjectTranslations(),\n  );\n  const [contentLocale, setContentLocale] = useState<ContentLocale>(\n    () => initialDraftSnapshot?.contentLocale ?? 'en',\n  );\n"""
if old in admin:
    admin = admin.replace(old, new, 1)
elif 'initialDraftSnapshot' not in admin:
    raise SystemExit('state initialization anchor not found')

old = "  const [selectedSlug, setSelectedSlug] = useState(initialProjects[0]?.slug ?? '');\n"
new = """  const [selectedSlug, setSelectedSlug] = useState(() => {\n    const draftProjects = initialDraftSnapshot?.projects ?? initialProjects;\n    const preferred = initialDraftSnapshot?.selectedSlug ?? '';\n    return draftProjects.some((project) => project.slug === preferred)\n      ? preferred\n      : draftProjects[0]?.slug ?? '';\n  });\n"""
if old in admin:
    admin = admin.replace(old, new, 1)
elif 'const draftProjects = initialDraftSnapshot?.projects' not in admin:
    raise SystemExit('selected slug anchor not found')

# 3) Add draft status state.
old = "  const [publishMessage, setPublishMessage] = useState('');\n"
new = old + "  const [draftMessage, setDraftMessage] = useState(initialDraftSnapshot ? ui.draftRestored : '');\n"
if 'const [draftMessage, setDraftMessage]' not in admin:
    if old not in admin:
        raise SystemExit('publish message state anchor not found')
    admin = admin.replace(old, new, 1)

# 4) Add explicit save + autosave after resetDrafts.
anchor = """  function resetDrafts() {\n    const nextProjects = cloneProjects();\n    setProjectDrafts(nextProjects);\n    setTechnologyDrafts(cloneTechnologyCatalog());\n    setTranslationDrafts(cloneProjectTranslations());\n    setContentLocale('en');\n    setTranslationState('idle');\n    setTranslationMessage('');\n    setSelectedSlug(nextProjects[0]?.slug ?? '');\n    setAnalysis(null);\n    setPublishState('idle');\n    setPublishMessage(ui.resetComplete);\n  }\n"""
replacement = """  function resetDrafts() {\n    const nextProjects = cloneProjects();\n    if (typeof window !== 'undefined') window.localStorage.removeItem(ADMIN_DRAFT_STORAGE_KEY);\n    setProjectDrafts(nextProjects);\n    setTechnologyDrafts(cloneTechnologyCatalog());\n    setTranslationDrafts(cloneProjectTranslations());\n    setContentLocale('en');\n    setTranslationState('idle');\n    setTranslationMessage('');\n    setSelectedSlug(nextProjects[0]?.slug ?? '');\n    setAnalysis(null);\n    setPublishState('idle');\n    setPublishMessage(ui.resetComplete);\n    setDraftMessage(ui.draftReset);\n  }\n\n  function saveDrafts() {\n    writeAdminDraftSnapshot({\n      projects: projectDrafts,\n      technologyCatalog: technologyDrafts,\n      translations: translationDrafts,\n      selectedSlug,\n      contentLocale,\n    });\n    setDraftMessage(ui.draftSaved);\n  }\n\n  useEffect(() => {\n    if (accessState !== 'granted') return;\n\n    const timer = window.setTimeout(() => {\n      writeAdminDraftSnapshot({\n        projects: projectDrafts,\n        technologyCatalog: technologyDrafts,\n        translations: translationDrafts,\n        selectedSlug,\n        contentLocale,\n      });\n      setDraftMessage(ui.draftAutosaved);\n    }, 350);\n\n    return () => window.clearTimeout(timer);\n  }, [\n    accessState,\n    projectDrafts,\n    technologyDrafts,\n    translationDrafts,\n    selectedSlug,\n    contentLocale,\n  ]);\n"""
if 'function saveDrafts()' not in admin:
    if anchor not in admin:
        raise SystemExit('resetDrafts anchor not found')
    admin = admin.replace(anchor, replacement, 1)

# 5) Clear browser draft after successful publish so next visit reads canonical Cloudflare data.
old = """      setPublishState('success');\n      setPublishMessage(\n        `${ui.published} ${result.projectCommitUrl ?? ''} ${result.technologyCommitUrl ?? ''} ${translationCommitUrl ?? ''}`.trim(),\n      );\n"""
new = """      if (typeof window !== 'undefined') window.localStorage.removeItem(ADMIN_DRAFT_STORAGE_KEY);\n      setDraftMessage('');\n      setPublishState('success');\n      setPublishMessage(\n        `${ui.published} ${result.projectCommitUrl ?? ''} ${result.technologyCommitUrl ?? ''} ${translationCommitUrl ?? ''}`.trim(),\n      );\n"""
if old in admin and "window.localStorage.removeItem(ADMIN_DRAFT_STORAGE_KEY);\n      setDraftMessage('');\n      setPublishState('success')" not in admin:
    admin = admin.replace(old, new, 1)

# 6) Add Save draft button + visible persistence status.
old = """          <div className=\"admin-actions\">\n            <button type=\"button\" onClick={addBlankProject}>{ui.addProject}</button>\n            <button\n"""
new = """          <div className=\"admin-actions\">\n            <button type=\"button\" onClick={addBlankProject}>{ui.addProject}</button>\n            <button type=\"button\" className=\"secondary\" onClick={saveDrafts}>{ui.saveDraft}</button>\n            <button\n"""
if '{ui.saveDraft}' not in admin:
    if old not in admin:
        raise SystemExit('project actions anchor not found')
    admin = admin.replace(old, new, 1)

old = """        </div>\n\n        <div className=\"admin-project-layout\">\n"""
new = """        </div>\n\n        {draftMessage && <p className=\"admin-message\">{draftMessage}</p>}\n\n        <div className=\"admin-project-layout\">\n"""
if '{draftMessage}' not in admin:
    if old not in admin:
        raise SystemExit('project layout anchor not found')
    admin = admin.replace(old, new, 1)

# 7) Admin UI copy fields.
old = "  addProject: string;\n  resetDrafts: string;\n"
new = "  addProject: string;\n  saveDraft: string;\n  draftSaved: string;\n  draftAutosaved: string;\n  draftRestored: string;\n  draftReset: string;\n  resetDrafts: string;\n"
if 'saveDraft: string;' not in copy:
    if old not in copy:
        raise SystemExit('AdminUiCopy interface anchor not found')
    copy = copy.replace(old, new, 1)

# English defaults
old = "  addProject: 'Add project',\n  resetDrafts: 'Reset drafts',\n"
new = "  addProject: 'Add project',\n  saveDraft: 'Save draft',\n  draftSaved: 'Draft saved in this browser.',\n  draftAutosaved: 'Draft autosaved. You can leave this page and come back without losing changes.',\n  draftRestored: 'Restored your unsaved draft from this browser.',\n  draftReset: 'Local draft cleared and reset to the current live data.',\n  resetDrafts: 'Reset drafts',\n"
if "saveDraft: 'Save draft'" not in copy:
    if old not in copy:
        raise SystemExit('English copy anchor not found')
    copy = copy.replace(old, new, 1)

# Simplified Chinese
old = "  addProject: '新增项目',\n  resetDrafts: '重置草稿',\n"
new = "  addProject: '新增项目',\n  saveDraft: '保存草稿',\n  draftSaved: '草稿已保存在这个浏览器。',\n  draftAutosaved: '草稿已自动保存，离开后台再回来也不会丢失。',\n  draftRestored: '已恢复这个浏览器里尚未发布的草稿。',\n  draftReset: '本地草稿已清除，并恢复为当前线上数据。',\n  resetDrafts: '重置草稿',\n"
if "saveDraft: '保存草稿'" not in copy:
    if old not in copy:
        raise SystemExit('zh-CN copy anchor not found')
    copy = copy.replace(old, new, 1)

# Traditional Chinese
old = "  addProject: '新增專案',\n  resetDrafts: '重設草稿',\n"
new = "  addProject: '新增專案',\n  saveDraft: '儲存草稿',\n  draftSaved: '草稿已儲存在這個瀏覽器。',\n  draftAutosaved: '草稿已自動儲存，離開後台再回來也不會遺失。',\n  draftRestored: '已恢復這個瀏覽器裡尚未發佈的草稿。',\n  draftReset: '本機草稿已清除，並恢復為目前線上資料。',\n  resetDrafts: '重設草稿',\n"
if "saveDraft: '儲存草稿'" not in copy:
    if old not in copy:
        raise SystemExit('zh-TW copy anchor not found')
    copy = copy.replace(old, new, 1)

# Vietnamese
old = "  addProject: 'Thêm dự án',\n  resetDrafts: 'Đặt lại bản nháp',\n"
new = "  addProject: 'Thêm dự án',\n  saveDraft: 'Lưu bản nháp',\n  draftSaved: 'Bản nháp đã được lưu trong trình duyệt này.',\n  draftAutosaved: 'Bản nháp đã tự động lưu. Bạn có thể rời trang và quay lại mà không mất thay đổi.',\n  draftRestored: 'Đã khôi phục bản nháp chưa xuất bản trong trình duyệt này.',\n  draftReset: 'Đã xóa bản nháp cục bộ và khôi phục dữ liệu đang hiển thị trực tiếp.',\n  resetDrafts: 'Đặt lại bản nháp',\n"
if "saveDraft: 'Lưu bản nháp'" not in copy:
    if old not in copy:
        raise SystemExit('Vietnamese copy anchor not found')
    copy = copy.replace(old, new, 1)

admin_path.write_text(admin, encoding='utf-8')
copy_path.write_text(copy, encoding='utf-8')
