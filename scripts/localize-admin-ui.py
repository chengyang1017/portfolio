from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'Missing patch target: {label}')
    return text.replace(old, new, 1)


# Main admin page
path = Path('src/pages/AdminPage.tsx')
text = path.read_text(encoding='utf-8')

if "getAdminUiCopy" not in text:
    text = replace_once(
        text,
        "import { useEffect, useMemo, useState } from 'react';\n",
        "import { useEffect, useMemo, useState } from 'react';\nimport { Link } from 'react-router-dom';\n",
        'AdminPage router import',
    )
    text = replace_once(
        text,
        "import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';\n",
        "import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';\nimport { getAdminUiCopy } from '../admin/adminUiCopy';\nimport { LanguageSwitcher } from '../components/LanguageSwitcher';\nimport { useI18n } from '../i18n/I18nProvider';\n",
        'AdminPage i18n imports',
    )
    text = replace_once(
        text,
        "export function AdminPage() {\n",
        "export function AdminPage() {\n  const { language } = useI18n();\n  const ui = getAdminUiCopy(language);\n",
        'AdminPage ui copy',
    )

replacements = [
    ("setAccessMessage('Checking admin access…');", "setAccessMessage(ui.checkingAdminAccess);", 'check access message'),
    ("'Unable to verify admin access.'", "ui.unableVerifyAdmin", 'verify fallback'),
    ("setAccessMessage('Restoring admin session…');", "setAccessMessage(ui.restoringAdminSession);", 'restore message'),
    ("'Unable to restore admin session.'", "ui.unableRestoreSession", 'restore fallback'),
    ("setPublishMessage('Drafts reset to the version loaded with this deployment.');", "setPublishMessage(ui.resetComplete);", 'reset message'),
    ("name: 'New technology',", "name: ui.newTechnology,", 'new technology'),
    ("'Repository analysis failed.'", "ui.repositoryAnalysisFailed", 'analysis fallback'),
    ("title: 'New project',", "title: ui.newProject,", 'new project title'),
    ("shortTitle: 'New project',", "shortTitle: ui.newProject,", 'new project short title'),
    ("status: 'In Development',", "status: ui.inDevelopment,", 'new project status'),
    ("setPublishMessage('Publishing project and technology data to GitHub…');", "setPublishMessage(ui.publishingPortfolio);", 'publish progress'),
    ("`Published. ${result.projectCommitUrl ?? ''} ${result.technologyCommitUrl ?? ''}`", "`${ui.published} ${result.projectCommitUrl ?? ''} ${result.technologyCommitUrl ?? ''}`", 'published message'),
    ("'Publishing failed.'", "ui.publishingFailed", 'publish fallback'),
    ("<h1>Admin access</h1>", "<h1>{ui.adminAccessTitle}</h1>", 'access title'),
    ("              Sign in with your portfolio admin password. GitHub write credentials stay on the\n              Cloudflare Worker and are never sent to or stored by this browser. A secure session\n              cookie keeps you signed in until you choose Lock admin or the session expires.", "              {ui.adminAccessDescription}", 'access description'),
    ("<span>Admin password</span>", "<span>{ui.adminPassword}</span>", 'password label'),
    ("placeholder=\"Enter admin password\"", "placeholder={ui.enterAdminPassword}", 'password placeholder'),
    ("{accessState === 'checking' ? 'Checking access…' : 'Unlock admin'}", "{accessState === 'checking' ? ui.checkingAccess : ui.unlockAdmin}", 'unlock button'),
    ("<h1>Admin</h1>", "<h1>{ui.adminTitle}</h1>", 'admin title'),
    ("            Manage projects, programming languages, frameworks, and tools. Publishing writes the\n            edited source data back to GitHub.", "            {ui.adminDescription}", 'admin description'),
    ("{String(projectDrafts.length).padStart(2, '0')} PROJECTS", "{String(projectDrafts.length).padStart(2, '0')} {ui.projects}", 'projects count'),
    ("{String(allTechnologyNames.length).padStart(2, '0')} TECHNOLOGIES", "{String(allTechnologyNames.length).padStart(2, '0')} {ui.technologies}", 'tech count'),
    ("{accessInfo?.repository ?? 'GITHUB CONNECTED'}", "{accessInfo?.repository ?? ui.githubConnected}", 'github connected'),
    ("? 'AI ENDPOINT CONNECTED'\n              : 'REPO ANALYZER MODE'", "? ui.aiConnected\n              : ui.analyzerMode", 'AI state'),
    ("Lock admin\n          </button>", "{ui.lockAdmin}\n          </button>", 'lock button'),
    ("<p className=\"eyebrow\">01 / REPOSITORY ASSISTANT</p>", "<p className=\"eyebrow\">01 / {ui.repositoryAssistant}</p>", 'repo eyebrow'),
    ("<h2>GitHub → portfolio draft</h2>", "<h2>{ui.repositoryDraft}</h2>", 'repo title'),
    ("            Paste a repository URL. The assistant reads repository metadata, languages, root files,\n            and package dependencies. If VITE_PORTFOLIO_AI_ENDPOINT is configured, that evidence is\n            also sent to the server-side AI endpoint for richer copy and feature suggestions.", "            {ui.repositoryAssistantDescription}", 'repo description'),
    ("{analysisState === 'loading' ? 'Analyzing…' : 'Analyze repository'}", "{analysisState === 'loading' ? ui.analyzing : ui.analyzeRepository}", 'analyze button'),
    ("Apply to selected project", "{ui.applyToSelectedProject}", 'apply analysis'),
    ("Add as new project", "{ui.addAsNewProject}", 'add analysis'),
    ("<h2>Project content</h2>", "<h2>{ui.projectContent}</h2>", 'project section title'),
    (">Add project</button>", ">{ui.addProject}</button>", 'add project button'),
    (">Reset drafts</button>", ">{ui.resetDrafts}</button>", 'reset button'),
    ("              Delete selected\n", "              {ui.deleteSelected}\n", 'delete button'),
    ("aria-label=\"Projects\"", "aria-label={ui.projectList}", 'project nav label'),
    ("<span>Title</span>", "<span>{ui.title}</span>", 'title field'),
    ("<span>Short title</span>", "<span>{ui.shortTitle}</span>", 'short title field'),
    ("<span>Slug</span>", "<span>{ui.slug}</span>", 'slug field'),
    ("<span>Project number</span>", "<span>{ui.projectNumber}</span>", 'project number field'),
    ("<span>Category</span>", "<span>{ui.category}</span>", 'category field'),
    ("<span>Status</span>", "<span>{ui.status}</span>", 'status field'),
    ("<span>Tone</span>", "<span>{ui.tone}</span>", 'tone field'),
    ("<span>Mockup</span>", "<span>{ui.mockup}</span>", 'mockup field'),
    ("<span>GitHub URL</span>", "<span>{ui.githubUrl}</span>", 'github url field'),
    ("<span>Summary</span>", "<span>{ui.summary}</span>", 'summary field'),
    ("<span>Overview</span>", "<span>{ui.overview}</span>", 'overview field'),
    ("<span>Technologies · comma or new line separated</span>", "<span>{ui.technologiesHint}</span>", 'technologies field'),
    ("<span>Features · one per line</span>", "<span>{ui.featuresHint}</span>", 'features field'),
    ("<span>Challenges · title | description</span>", "<span>{ui.challengesHint}</span>", 'challenges field'),
    ("<span>Architecture · label | detail</span>", "<span>{ui.architectureHint}</span>", 'architecture field'),
    ("<span>Gallery · title | caption</span>", "<span>{ui.galleryHint}</span>", 'gallery field'),
    ("<p className=\"admin-message\">No project selected.</p>", "<p className=\"admin-message\">{ui.noProjectSelected}</p>", 'no project'),
    ("<h2>Languages & tools</h2>", "<h2>{ui.languagesTools}</h2>", 'languages tools title'),
    ("            This catalog powers the Technology section on the home page. Repository detection now\n            puts known technologies into the right group and uses their established brand colors\n            instead of assigning every new item the portfolio lime color.", "            {ui.technologyDescription}", 'technology description'),
    ("<h3>{group.label}</h3>", "<h3>{group.id === 'client' ? ui.clientLanguages : group.id === 'backend' ? ui.backendData : ui.platformsTools}</h3>", 'group label'),
    (">Add</button>", ">{ui.add}</button>", 'tech add button'),
    ("aria-label=\"Technology name\"", "aria-label={ui.technologyName}", 'tech name aria'),
    ("aria-label=\"Brand color\"", "aria-label={ui.brandColor}", 'brand aria'),
    ("aria-label=\"Logo URL\"", "aria-label={ui.logoUrl}", 'logo aria'),
    ("placeholder=\"Logo URL\"", "placeholder={ui.logoUrl}", 'logo placeholder'),
    ("aria-label={`Remove ${technology.name}`}", "aria-label={`${ui.remove} ${technology.name}`}", 'remove aria'),
    ("<h2>Write changes to GitHub</h2>", "<h2>{ui.writeChanges}</h2>", 'publish title'),
    ("            The verified token remains only in this page session. Publishing updates\n            src/data/projects.ts and src/data/technologyCatalog.ts on the selected branch.", "            {ui.publishDescription}", 'publish description'),
    ("<span>Verified repository</span>", "<span>{ui.verifiedRepository}</span>", 'verified repository'),
    ("<span>Branch</span>", "<span>{ui.branch}</span>", 'branch label'),
    ("{publishState === 'saving' ? 'Publishing…' : 'Publish to GitHub'}", "{publishState === 'saving' ? ui.publishing : ui.publishToGitHub}", 'publish button'),
]

for old, new, label in replacements:
    if old in text:
        text = text.replace(old, new, 1)

# Add the language switcher to login and a clearly visible translation entry to the main admin.
if 'admin-access-language' not in text:
    text = replace_once(
        text,
        '<div className="admin-access-card">\n            <p className="eyebrow">PORTFOLIO CONTROL</p>',
        '<div className="admin-access-card">\n            <div className="admin-access-language"><LanguageSwitcher /></div>\n            <p className="eyebrow">PORTFOLIO CONTROL</p>',
        'access language switcher',
    )

if 'admin-translation-link' not in text:
    text = replace_once(
        text,
        '<div className="admin-hero-status">\n',
        '<div className="admin-hero-status">\n          <LanguageSwitcher />\n          <Link className="admin-translation-link" to="/admin/translations">{ui.translationCenter}</Link>\n',
        'translation entry',
    )

path.write_text(text, encoding='utf-8')


# Translation admin page
path = Path('src/pages/AdminTranslationsPage.tsx')
text = path.read_text(encoding='utf-8')
if 'getAdminUiCopy' not in text:
    text = replace_once(
        text,
        "import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';\n",
        "import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';\nimport { getAdminUiCopy } from '../admin/adminUiCopy';\nimport { LanguageSwitcher } from '../components/LanguageSwitcher';\nimport { useI18n } from '../i18n/I18nProvider';\n",
        'translation i18n imports',
    )
    text = replace_once(
        text,
        "export function AdminTranslationsPage() {\n",
        "export function AdminTranslationsPage() {\n  const { language } = useI18n();\n  const ui = getAdminUiCopy(language);\n",
        'translation ui copy',
    )

replacements = [
    ("setAccessMessage('Checking admin access…');", "setAccessMessage(ui.checkingAdminAccess);", 'translation checking'),
    ("'Unable to verify admin access.'", "ui.unableVerifyAdmin", 'translation verify fallback'),
    ("setAccessMessage('Restoring admin session…');", "setAccessMessage(ui.restoringAdminSession);", 'translation restore'),
    ("'Unable to restore admin session.'", "ui.unableRestoreSession", 'translation restore fallback'),
    ("setTranslationMessage('Translating every project field into all four locales…');", "setTranslationMessage(ui.translatingMessage);", 'translation progress'),
    ("setTranslationMessage('AI translation complete. Review each language before publishing.');", "setTranslationMessage(ui.translationComplete);", 'translation complete'),
    ("'AI translation failed.'", "ui.translationFailed", 'translation failed'),
    ("setPublishMessage('Publishing multilingual project content to GitHub…');", "setPublishMessage(ui.publishingTranslations);", 'translation publish progress'),
    ("'Published project translations.'", "ui.publishedTranslations", 'translation published'),
    ("'Publishing failed.'", "ui.publishingFailed", 'translation publish failed'),
    ("<h1>Translation access</h1>", "<h1>{ui.translationAccessTitle}</h1>", 'translation access title'),
    ("            Use the same portfolio admin password as the main dashboard. GitHub credentials remain on the Cloudflare Worker; this browser receives only a secure admin session cookie.", "            {ui.translationAccessDescription}", 'translation access description'),
    ("<span>Admin password</span>", "<span>{ui.adminPassword}</span>", 'translation password label'),
    ("placeholder=\"Enter admin password\"", "placeholder={ui.enterAdminPassword}", 'translation password placeholder'),
    ("{accessState === 'checking' ? 'Checking…' : 'Unlock translations'}", "{accessState === 'checking' ? ui.checkingAccess : ui.unlockTranslations}", 'translation unlock'),
    ("← Back to admin", "← {ui.backToAdmin}", 'back link'),
    ("<h1>Project translator</h1>", "<h1>{ui.projectTranslator}</h1>", 'translator title'),
    ("            Translate one project’s complete portfolio copy into Simplified Chinese, Traditional Chinese,\n            Vietnamese, and Chữ Nôm in one AI run.", "            {ui.translatorDescription}", 'translator description'),
    ("Main admin", "{ui.mainAdmin}", 'main admin link'),
    (">Lock</button>", ">{ui.lock}</button>", 'translation lock'),
    ("<span>Project</span>", "<span>{ui.project}</span>", 'project label'),
    ("<span>Translation coverage</span>", "<span>{ui.translationCoverage}</span>", 'coverage label'),
    ("{translationState === 'loading' ? 'Translating all languages…' : 'AI translate all 4 languages'}", "{translationState === 'loading' ? ui.translatingAll : ui.aiTranslateAll}", 'translate all button'),
    ("<span>English source</span>", "<span>{ui.englishSource}</span>", 'english source'),
    ("            Technologies, URLs, slugs, code identifiers, and brand names are kept as source data rather than translated.", "            {ui.sourcePreservationNote}", 'source note'),
    ("aria-label=\"Translation language\"", "aria-label={ui.translationLanguage}", 'translation tabs aria'),
    ("{selectedTranslations[locale] ? 'READY' : 'EMPTY'}", "{selectedTranslations[locale] ? ui.ready : ui.empty}", 'ready empty'),
    ("<strong>{LOCALE_LABELS[activeLocale]} has not been generated yet.</strong>", "<strong>{LOCALE_LABELS[activeLocale]} {ui.notGenerated}</strong>", 'not generated'),
    ("<p>Run “AI translate all 4 languages” to create the complete translation set.</p>", "<p>{ui.runAiTranslate}</p>", 'run AI note'),
    ("<strong>ALL PROJECT COPY</strong>", "<strong>{ui.allProjectCopy}</strong>", 'all copy'),
    ("<span>Title</span>", "<span>{ui.title}</span>", 'translation title field'),
    ("<span>Short title</span>", "<span>{ui.shortTitle}</span>", 'translation short title'),
    ("<span>Summary</span>", "<span>{ui.summary}</span>", 'translation summary'),
    ("<span>Overview</span>", "<span>{ui.overview}</span>", 'translation overview'),
    ("<span>Features · one per line</span>", "<span>{ui.featuresOnePerLine}</span>", 'translation features'),
    ("<header><span>Challenges</span>", "<header><span>{ui.challenges}</span>", 'translation challenges'),
    ("<header><span>Architecture</span>", "<header><span>{ui.architecture}</span>", 'translation architecture'),
    ("<header><span>Gallery</span>", "<header><span>{ui.gallery}</span>", 'translation gallery'),
    ("<span>GitHub publish</span>", "<span>{ui.githubPublish}</span>", 'translation publish label'),
    ("<p>Writes the reviewed translation catalog to GitHub. The normal Cloudflare deployment then publishes it.</p>", "<p>{ui.translationPublishDescription}</p>", 'translation publish description'),
    ("{publishState === 'saving' ? 'Publishing…' : 'Publish translations'}", "{publishState === 'saving' ? ui.publishing : ui.publishTranslations}", 'translation publish button'),
]
for old, new, label in replacements:
    if old in text:
        text = text.replace(old, new, 1)

if 'translation-access-language' not in text:
    text = replace_once(
        text,
        '<section className="translation-access-card">\n          <p className="eyebrow">PORTFOLIO CONTROL</p>',
        '<section className="translation-access-card">\n          <div className="translation-access-language"><LanguageSwitcher /></div>\n          <p className="eyebrow">PORTFOLIO CONTROL</p>',
        'translation access language switcher',
    )

if '<LanguageSwitcher />' not in text.split('<header className="translation-admin-hero">', 1)[1]:
    text = replace_once(
        text,
        '<div className="translation-admin-actions">\n          <Link to="/admin">',
        '<div className="translation-admin-actions">\n          <LanguageSwitcher />\n          <Link to="/admin">',
        'translation hero language switcher',
    )

path.write_text(text, encoding='utf-8')


# Add small styles for the new navigation entry and language switcher placement.
path = Path('src/styles/admin.css')
text = path.read_text(encoding='utf-8')
if '.admin-translation-link' not in text:
    text += """

.admin-access-language {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
}

.admin-translation-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #c7ff4a;
  border-radius: 9px;
  color: #c7ff4a;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
}

.admin-translation-link:hover {
  background: rgba(199, 255, 74, 0.1);
}
"""
    path.write_text(text, encoding='utf-8')

path = Path('src/styles/admin-translations.css')
text = path.read_text(encoding='utf-8')
if '.translation-access-language' not in text:
    text += """

.translation-access-language {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;
}
"""
    path.write_text(text, encoding='utf-8')
