from pathlib import Path

admin_path = Path('src/pages/AdminPage.tsx')
admin = admin_path.read_text(encoding='utf-8')

import_anchor = "import { useI18n } from '../i18n/I18nProvider';\n"
legacy_import = "import { localizeProjectDetail as legacyLocalizeProjectDetail } from '../i18n/projectDetailTranslations';\n"
if legacy_import not in admin:
    if import_anchor not in admin:
        raise SystemExit('AdminPage import anchor not found')
    admin = admin.replace(import_anchor, import_anchor + legacy_import, 1)

old_clone = """function cloneProjectTranslations(): ProjectTranslationCatalog {\n  return JSON.parse(JSON.stringify(projectTranslationCatalog)) as ProjectTranslationCatalog;\n}\n"""
new_clone = """function toProjectTranslation(project: Project): ProjectTranslation {\n  return {\n    title: project.title,\n    shortTitle: project.shortTitle,\n    summary: project.summary,\n    overview: project.overview,\n    features: project.features.map((item) => item),\n    challenges: project.challenges.map((item) => ({ ...item })),\n    architecture: project.architecture.map((item) => ({ ...item })),\n    gallery: project.gallery.map((item) => ({ ...item })),\n  };\n}\n\nfunction cloneProjectTranslations(): ProjectTranslationCatalog {\n  const next = JSON.parse(JSON.stringify(projectTranslationCatalog)) as ProjectTranslationCatalog;\n\n  for (const project of initialProjects) {\n    const locales = { ...(next[project.slug] ?? {}) };\n    const english = toProjectTranslation(project);\n\n    for (const locale of PROJECT_TRANSLATION_LOCALES) {\n      if (locales[locale]) continue;\n\n      const localized = toProjectTranslation(legacyLocalizeProjectDetail(project, locale));\n      if (JSON.stringify(localized) !== JSON.stringify(english)) {\n        locales[locale] = localized;\n      }\n    }\n\n    if (Object.keys(locales).length > 0) next[project.slug] = locales;\n  }\n\n  return next;\n}\n\nfunction syncPublishedPortfolioData(\n  nextProjects: Project[],\n  nextTechnologyCatalog: TechnologyCatalog,\n  nextTranslations: ProjectTranslationCatalog,\n) {\n  const projectCopies = JSON.parse(JSON.stringify(nextProjects)) as Project[];\n  initialProjects.splice(0, initialProjects.length, ...projectCopies);\n\n  initialTechnologyCatalog.client = nextTechnologyCatalog.client.map((item) => ({ ...item }));\n  initialTechnologyCatalog.backend = nextTechnologyCatalog.backend.map((item) => ({ ...item }));\n  initialTechnologyCatalog.platform = nextTechnologyCatalog.platform.map((item) => ({ ...item }));\n\n  for (const slug of Object.keys(projectTranslationCatalog)) {\n    delete projectTranslationCatalog[slug];\n  }\n  Object.assign(\n    projectTranslationCatalog,\n    JSON.parse(JSON.stringify(nextTranslations)) as ProjectTranslationCatalog,\n  );\n}\n"""
if old_clone in admin:
    admin = admin.replace(old_clone, new_clone, 1)
elif 'function syncPublishedPortfolioData(' not in admin:
    raise SystemExit('cloneProjectTranslations anchor not found')

old_translation_state = """  const [translationDrafts, setTranslationDrafts] = useState<ProjectTranslationCatalog>(\n    () => initialDraftSnapshot?.translations ?? cloneProjectTranslations(),\n  );\n"""
new_translation_state = """  const [translationDrafts, setTranslationDrafts] = useState<ProjectTranslationCatalog>(() => {\n    const baseline = cloneProjectTranslations();\n    if (!initialDraftSnapshot?.translations) return baseline;\n\n    const restored = JSON.parse(\n      JSON.stringify(initialDraftSnapshot.translations),\n    ) as ProjectTranslationCatalog;\n\n    for (const [slug, locales] of Object.entries(baseline)) {\n      restored[slug] = { ...locales, ...(restored[slug] ?? {}) };\n    }\n\n    return restored;\n  });\n"""
if old_translation_state in admin:
    admin = admin.replace(old_translation_state, new_translation_state, 1)
elif 'for (const [slug, locales] of Object.entries(baseline))' not in admin:
    raise SystemExit('translation draft state anchor not found')

publish_anchor = """      const translationCommitUrl = await publishProjectTranslationCatalog({\n        branch: publishBranch,\n        catalog: translationDrafts,\n      });\n\n      if (typeof window !== 'undefined') window.localStorage.removeItem(ADMIN_DRAFT_STORAGE_KEY);\n"""
publish_replacement = """      const translationCommitUrl = await publishProjectTranslationCatalog({\n        branch: publishBranch,\n        catalog: translationDrafts,\n      });\n\n      // Keep the already-running SPA in sync with the data just saved to Cloudflare.\n      // Without this, navigating to Home/Projects before a hard refresh still showed\n      // the old in-memory project array.\n      syncPublishedPortfolioData(projectDrafts, technologyDrafts, translationDrafts);\n\n      if (typeof window !== 'undefined') window.localStorage.removeItem(ADMIN_DRAFT_STORAGE_KEY);\n"""
if publish_anchor in admin:
    admin = admin.replace(publish_anchor, publish_replacement, 1)
elif 'syncPublishedPortfolioData(projectDrafts, technologyDrafts, translationDrafts);' not in admin:
    raise SystemExit('publish sync anchor not found')

button_anchor = """            <button type=\"button\" onClick={addBlankProject}>{ui.addProject}</button>\n            <button type=\"button\" className=\"secondary\" onClick={saveDrafts}>{ui.saveDraft}</button>\n"""
button_replacement = """            <button type=\"button\" onClick={addBlankProject}>{ui.addProject}</button>\n            <button\n              type=\"button\"\n              onClick={() => void handlePublish()}\n              disabled={publishState === 'saving'}\n            >\n              {publishState === 'saving' ? ui.publishing : ui.publishToGitHub}\n            </button>\n            <button type=\"button\" className=\"secondary\" onClick={saveDrafts}>{ui.saveDraft}</button>\n"""
if button_anchor in admin:
    admin = admin.replace(button_anchor, button_replacement, 1)
elif "publishState === 'saving' ? ui.publishing : ui.publishToGitHub" not in admin:
    raise SystemExit('project action save button anchor not found')

admin_path.write_text(admin, encoding='utf-8')

home_path = Path('src/pages/HomePage.tsx')
home = home_path.read_text(encoding='utf-8')
home = home.replace(
    "import { homeCategory, homeCopy, homeProjectDescription, homeStatus } from '../i18n/homeTranslations';",
    "import { homeCategory, homeCopy, homeStatus } from '../i18n/homeTranslations';",
)
home = home.replace(
    '<p>{homeProjectDescription(project.slug, language, localizedProject.summary)}</p>',
    '<p>{localizedProject.summary}</p>',
)
if 'homeProjectDescription(' in home:
    raise SystemExit('HomePage still uses hard-coded project description override')
home_path.write_text(home, encoding='utf-8')

card_path = Path('src/components/ProjectCard.tsx')
card = card_path.read_text(encoding='utf-8')
card = card.replace('  projectSummary,\n', '')
old_summary = """        <p>\n          {projectSummary(\n            project.slug,\n            language,\n            localizedProject.summary,\n          )}\n        </p>\n"""
new_summary = """        <p>{localizedProject.summary}</p>\n"""
if old_summary in card:
    card = card.replace(old_summary, new_summary, 1)
elif 'projectSummary(' in card:
    raise SystemExit('ProjectCard summary override anchor changed')
card_path.write_text(card, encoding='utf-8')

copy_path = Path('src/admin/adminUiCopy.ts')
copy = copy_path.read_text(encoding='utf-8')
replacements = {
    "writeChanges: 'Publish portfolio changes'": "writeChanges: 'Save portfolio changes'",
    "publishing: 'Publishing…'": "publishing: 'Saving…'",
    "publishToGitHub: 'Publish changes'": "publishToGitHub: 'Save changes'",
    "publishingPortfolio: 'Publishing portfolio data…'": "publishingPortfolio: 'Saving portfolio data…'",
    "published: 'Published.'": "published: 'Saved and live.'",
    "writeChanges: '发布作品集修改'": "writeChanges: '保存作品集修改'",
    "publishing: '正在发布…'": "publishing: '正在保存…'",
    "publishToGitHub: '发布修改'": "publishToGitHub: '保存修改'",
    "publishingPortfolio: '正在发布作品集数据…'": "publishingPortfolio: '正在保存作品集数据…'",
    "published: '已发布。'": "published: '已保存并上线。'",
    "writeChanges: '發佈作品集修改'": "writeChanges: '儲存作品集修改'",
    "publishing: '正在發佈…'": "publishing: '正在儲存…'",
    "publishToGitHub: '發佈修改'": "publishToGitHub: '儲存修改'",
    "publishingPortfolio: '正在發佈作品集資料…'": "publishingPortfolio: '正在儲存作品集資料…'",
    "published: '已發佈。'": "published: '已儲存並上線。'",
    "writeChanges: 'Xuất bản thay đổi portfolio'": "writeChanges: 'Lưu thay đổi portfolio'",
    "publishing: 'Đang xuất bản…'": "publishing: 'Đang lưu…'",
    "publishToGitHub: 'Xuất bản thay đổi'": "publishToGitHub: 'Lưu thay đổi'",
    "publishingPortfolio: 'Đang xuất bản dữ liệu portfolio…'": "publishingPortfolio: 'Đang lưu dữ liệu portfolio…'",
    "published: 'Đã xuất bản.'": "published: 'Đã lưu và cập nhật trực tiếp.'",
}
for old, new in replacements.items():
    copy = copy.replace(old, new)
copy_path.write_text(copy, encoding='utf-8')
