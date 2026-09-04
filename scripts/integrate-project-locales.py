from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'Missing patch target: {label}')
    return text.replace(old, new, 1)

admin = Path('src/pages/AdminPage.tsx')
text = admin.read_text(encoding='utf-8')
text = replace_once(text, "import { Link } from 'react-router-dom';\n", "", 'remove Link import')
text = replace_once(text, "import { projects as initialProjects } from '../data/projects';\n", "import { projects as initialProjects } from '../data/projects';\nimport {\n  PROJECT_TRANSLATION_LOCALES,\n  projectTranslationCatalog,\n  type ProjectTranslation,\n  type ProjectTranslationCatalog,\n  type ProjectTranslationLocale,\n} from '../data/projectTranslationCatalog';\n", 'translation catalog import')
text = replace_once(text, "import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';\n", "import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';\nimport {\n  mergeProjectTranslations,\n  publishProjectTranslationCatalog,\n  translateProjectAllLocales,\n} from '../admin/projectTranslationManager';\n", 'translation manager import')
text = replace_once(text, "const GROUPS: Array<{ id: TechnologyGroupId; label: string }> = [", "type ContentLocale = 'en' | ProjectTranslationLocale;\n\nconst CONTENT_LOCALES: Array<{ id: ContentLocale; label: string }> = [\n  { id: 'en', label: 'English' },\n  { id: 'zh-CN', label: '简体中文' },\n  { id: 'zh-TW', label: '繁體中文' },\n  { id: 'vi-Latn', label: 'Tiếng Việt' },\n  { id: 'vi-Hani', label: '𡨸喃' },\n];\n\nconst GROUPS: Array<{ id: TechnologyGroupId; label: string }> = [", 'content locales')
text = replace_once(text, "function cloneTechnologyCatalog(): TechnologyCatalog {\n  return {\n    client: initialTechnologyCatalog.client.map((item) => ({ ...item })),\n    backend: initialTechnologyCatalog.backend.map((item) => ({ ...item })),\n    platform: initialTechnologyCatalog.platform.map((item) => ({ ...item })),\n  };\n}\n", "function cloneTechnologyCatalog(): TechnologyCatalog {\n  return {\n    client: initialTechnologyCatalog.client.map((item) => ({ ...item })),\n    backend: initialTechnologyCatalog.backend.map((item) => ({ ...item })),\n    platform: initialTechnologyCatalog.platform.map((item) => ({ ...item })),\n  };\n}\n\nfunction cloneProjectTranslations(): ProjectTranslationCatalog {\n  return JSON.parse(JSON.stringify(projectTranslationCatalog)) as ProjectTranslationCatalog;\n}\n\nfunction emptyProjectTranslation(): ProjectTranslation {\n  return {\n    title: '',\n    shortTitle: '',\n    summary: '',\n    overview: '',\n    features: [],\n    challenges: [],\n    architecture: [],\n    gallery: [],\n  };\n}\n", 'translation helpers')
text = text.replace('function challengesToText(project: Project) {', "function challengesToText(project: Pick<Project, 'challenges'>) {")
text = text.replace('function architectureToText(project: Project) {', "function architectureToText(project: Pick<Project, 'architecture'>) {")
text = text.replace('function galleryToText(project: Project) {', "function galleryToText(project: Pick<Project, 'gallery'>) {")
text = replace_once(text, "  const [technologyDrafts, setTechnologyDrafts] = useState<TechnologyCatalog>(\n    cloneTechnologyCatalog,\n  );\n", "  const [technologyDrafts, setTechnologyDrafts] = useState<TechnologyCatalog>(\n    cloneTechnologyCatalog,\n  );\n  const [translationDrafts, setTranslationDrafts] = useState<ProjectTranslationCatalog>(\n    cloneProjectTranslations,\n  );\n  const [contentLocale, setContentLocale] = useState<ContentLocale>('en');\n  const [translationState, setTranslationState] = useState<'idle' | 'loading' | 'error'>('idle');\n  const [translationMessage, setTranslationMessage] = useState('');\n", 'translation state')
text = replace_once(text, "  const allTechnologyNames = useMemo(\n    () => Object.values(technologyDrafts).flat().map((technology) => technology.name),\n    [technologyDrafts],\n  );\n", "  const allTechnologyNames = useMemo(\n    () => Object.values(technologyDrafts).flat().map((technology) => technology.name),\n    [technologyDrafts],\n  );\n\n  const selectedTranslation = useMemo(() => {\n    if (!selectedProject || contentLocale === 'en') return null;\n    return translationDrafts[selectedProject.slug]?.[contentLocale] ?? emptyProjectTranslation();\n  }, [contentLocale, selectedProject, translationDrafts]);\n", 'selected translation memo')
text = replace_once(text, "    setTechnologyDrafts(cloneTechnologyCatalog());\n    setSelectedSlug(nextProjects[0]?.slug ?? '');\n    setAnalysis(null);\n", "    setTechnologyDrafts(cloneTechnologyCatalog());\n    setTranslationDrafts(cloneProjectTranslations());\n    setContentLocale('en');\n    setTranslationState('idle');\n    setTranslationMessage('');\n    setSelectedSlug(nextProjects[0]?.slug ?? '');\n    setAnalysis(null);\n", 'reset translations')
text = replace_once(text, "  function updateTechnology(\n", "  function updateTranslation(patch: Partial<ProjectTranslation>) {\n    if (!selectedProject || contentLocale === 'en') return;\n    setTranslationDrafts((current) => {\n      const existing = current[selectedProject.slug]?.[contentLocale] ?? emptyProjectTranslation();\n      return {\n        ...current,\n        [selectedProject.slug]: {\n          ...(current[selectedProject.slug] ?? {}),\n          [contentLocale]: { ...existing, ...patch },\n        },\n      };\n    });\n  }\n\n  async function handleAiFillTranslations() {\n    if (!selectedProject) return;\n    setTranslationState('loading');\n    setTranslationMessage(ui.translatingMessage);\n    try {\n      const translations = await translateProjectAllLocales({ project: selectedProject });\n      setTranslationDrafts((current) =>\n        mergeProjectTranslations(current, selectedProject.slug, translations),\n      );\n      setTranslationState('idle');\n      setTranslationMessage(ui.translationComplete);\n    } catch (error) {\n      setTranslationState('error');\n      setTranslationMessage(error instanceof Error ? error.message : ui.translationFailed);\n    }\n  }\n\n  function updateTechnology(\n", 'translation update functions')
text = replace_once(text, "    const next = projectDrafts.filter((project) => project.slug !== selectedProject.slug);\n    setProjectDrafts(next);\n    setSelectedSlug(next[0]?.slug ?? '');\n", "    const next = projectDrafts.filter((project) => project.slug !== selectedProject.slug);\n    setProjectDrafts(next);\n    setTranslationDrafts((current) => {\n      const nextTranslations = { ...current };\n      delete nextTranslations[selectedProject.slug];\n      return nextTranslations;\n    });\n    setSelectedSlug(next[0]?.slug ?? '');\n", 'remove translations with project')
text = replace_once(text, "      const result = await publishPortfolioContent({\n        branch: branch.trim() || 'main',\n        projects: projectDrafts,\n        technologyCatalog: technologyDrafts,\n      });\n\n      setPublishState('success');\n      setPublishMessage(\n        `${ui.published} ${result.projectCommitUrl ?? ''} ${result.technologyCommitUrl ?? ''}`.trim(),\n      );", "      const publishBranch = branch.trim() || 'main';\n      const result = await publishPortfolioContent({\n        branch: publishBranch,\n        projects: projectDrafts,\n        technologyCatalog: technologyDrafts,\n      });\n      const translationCommitUrl = await publishProjectTranslationCatalog({\n        branch: publishBranch,\n        catalog: translationDrafts,\n      });\n\n      setPublishState('success');\n      setPublishMessage(\n        `${ui.published} ${result.projectCommitUrl ?? ''} ${result.technologyCommitUrl ?? ''} ${translationCommitUrl ?? ''}`.trim(),\n      );", 'publish translations together')
text = replace_once(text, "          <LanguageSwitcher />\n          <Link className=\"admin-translation-link\" to=\"/admin/translations\">{ui.translationCenter}</Link>\n", "          <LanguageSwitcher />\n", 'remove separate translation link')
text = replace_once(text, "            <button type=\"button\" onClick={addBlankProject}>{ui.addProject}</button>\n            <button type=\"button\" className=\"secondary\" onClick={resetDrafts}>{ui.resetDrafts}</button>\n", "            <button type=\"button\" onClick={addBlankProject}>{ui.addProject}</button>\n            <button\n              type=\"button\"\n              className=\"secondary\"\n              onClick={() => void handleAiFillTranslations()}\n              disabled={!selectedProject || translationState === 'loading'}\n            >\n              {translationState === 'loading' ? ui.translatingAll : ui.aiTranslateAll}\n            </button>\n            <button type=\"button\" className=\"secondary\" onClick={resetDrafts}>{ui.resetDrafts}</button>\n", 'AI optional button')

start = "          {selectedProject ? (\n            <div className=\"admin-form-grid\">"
end = "            </div>\n          ) : (\n            <p className=\"admin-message\">{ui.noProjectSelected}</p>"
if start not in text or end not in text:
    raise SystemExit('Could not locate project editor block')
before, rest = text.split(start, 1)
english_form, after = rest.split(end, 1)
english_form = replace_once(english_form, "                    setSelectedSlug(nextSlug);\n", "                    setTranslationDrafts((current) => {\n                      if (!current[previousSlug] || previousSlug === nextSlug) return current;\n                      const nextTranslations = { ...current };\n                      nextTranslations[nextSlug] = nextTranslations[previousSlug];\n                      delete nextTranslations[previousSlug];\n                      return nextTranslations;\n                    });\n                    setSelectedSlug(nextSlug);\n", 'slug translation migration')
localized_form = r'''          {selectedProject ? (
            <div className="admin-project-editor">
              <div className="admin-content-locale-bar" aria-label={ui.translationLanguage}>
                {CONTENT_LOCALES.map((locale) => {
                  const ready = locale.id === 'en' || Boolean(
                    locale.id !== 'en' && translationDrafts[selectedProject.slug]?.[locale.id],
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
                <div className="admin-form-grid">''' + english_form + r'''            </div>
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
            <p className="admin-message">{ui.noProjectSelected}</p>'''
text = before + localized_form + after
admin.write_text(text, encoding='utf-8')

app = Path('src/App.tsx')
text = app.read_text(encoding='utf-8')
text = replace_once(text, "import { Route, Routes, useLocation } from 'react-router-dom';", "import { Navigate, Route, Routes, useLocation } from 'react-router-dom';", 'Navigate import')
text = text.replace("import { AdminTranslationsPage } from './pages/AdminTranslationsPage';\n", '')
text = text.replace("pathname === '/admin' ? 'Admin' : pathname === '/admin/translations' ? 'Project translator' : 'Portfolio'", "pathname === '/admin' || pathname === '/admin/translations' ? 'Admin' : 'Portfolio'")
text = replace_once(text, '<Route path="/admin/translations" element={<AdminTranslationsPage/>}/>', '<Route path="/admin/translations" element={<Navigate to="/admin" replace/>}/>', 'translation route redirect')
app.write_text(text, encoding='utf-8')

css = Path('src/styles/admin.css')
text = css.read_text(encoding='utf-8')
if '.admin-project-editor {' not in text:
    text += r'''

.admin-project-editor {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 16px;
}

.admin-content-locale-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 0 16px;
  border-bottom: 1px solid #2f3f37;
}

.admin-page .admin-locale-tab {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 0 13px;
  border-color: #3c4d44;
  background: transparent;
  color: #b8c6bf;
}

.admin-page .admin-locale-tab small {
  font-size: 0.56rem;
  letter-spacing: 0.08em;
  color: #718179;
}

.admin-page .admin-locale-tab.active {
  border-color: #c7ff4a;
  background: #c7ff4a;
  color: #0d1210;
}

.admin-page .admin-locale-tab.active small { color: #33411f; }

.admin-language-note {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 18px;
  padding: 13px 15px;
  border: 1px solid #314139;
  border-radius: 10px;
  background: #0f1713;
}

.admin-language-note strong { color: #edf3ef; }
.admin-language-note span {
  color: #8fa098;
  font-size: 0.72rem;
  line-height: 1.5;
  text-align: right;
}

@media (max-width: 760px) {
  .admin-content-locale-bar { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .admin-page .admin-locale-tab { justify-content: space-between; }
  .admin-language-note { align-items: flex-start; flex-direction: column; }
  .admin-language-note span { text-align: left; }
}
'''
css.write_text(text, encoding='utf-8')
