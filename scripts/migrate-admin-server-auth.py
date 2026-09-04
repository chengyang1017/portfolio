from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'Missing patch target: {label}')
    return text.replace(old, new, 1)


def replace_regex(text: str, pattern: str, replacement: str, label: str) -> str:
    next_text, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f'Missing or ambiguous patch target: {label} ({count})')
    return next_text


# AdminPage: replace browser GitHub PAT with server-backed password/session.
admin = Path('src/pages/AdminPage.tsx')
text = admin.read_text(encoding='utf-8')
text = text.replace("import { useEffect, useMemo, useState } from 'react';", "import { useEffect, useMemo, useState } from 'react';", 1)
text = replace_regex(
    text,
    r"import \{\n  forgetAdminToken,\n  readSavedAdminToken,\n  saveAdminToken,\n\} from '../admin/adminCredentialStore';\n",
    "import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';\n",
    'AdminPage auth import',
)
text = replace_once(
    text,
    "  const [token, setToken] = useState(readSavedAdminToken);",
    "  const [password, setPassword] = useState('');",
    'AdminPage credential state',
)
text = replace_regex(
    text,
    r"  async function unlockWithToken\(candidateToken: string, persist = true\) \{.*?\n  function lockAdmin\(\) \{\n    forgetAdminToken\(\);\n    setToken\(''\);\n    setAccessInfo\(null\);\n    setAccessState\('locked'\);\n    setAccessMessage\(''\);\n    setPublishMessage\(''\);\n  \}\n",
    """  async function handleUnlock() {
    const cleanPassword = password.trim();
    if (!cleanPassword) return;

    setAccessState('checking');
    setAccessMessage('Checking admin access…');

    try {
      const result = await loginAdmin(cleanPassword);
      setAccessInfo(result);
      setBranch(result.defaultBranch || 'main');
      setPassword('');
      setAccessState('granted');
      setAccessMessage('');
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : 'Unable to verify admin access.');
    }
  }

  useEffect(() => {
    let active = true;
    setAccessState('checking');
    setAccessMessage('Restoring admin session…');

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
        setAccessMessage(error instanceof Error ? error.message : 'Unable to restore admin session.');
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
""",
    'AdminPage unlock/session block',
)
text = text.replace("analyzeRepository(repositoryUrl, token.trim())", "analyzeRepository(repositoryUrl)")
text = text.replace("        token: token.trim(),\n", "")
text = replace_once(
    text,
    "              Unlock this dashboard with a fine-grained GitHub token that can write to\n              chengyang1017/portfolio. After successful verification, the token is remembered only\n              in this browser so reloads and future visits can unlock automatically. Use Lock admin\n              to sign out and forget the saved token.",
    "              Sign in with your portfolio admin password. GitHub write credentials stay on the\n              Cloudflare Worker and are never sent to or stored by this browser. A secure session\n              cookie keeps you signed in until you choose Lock admin or the session expires.",
    'AdminPage access copy',
)
text = replace_once(text, '<span>GitHub token</span>', '<span>Admin password</span>', 'AdminPage label')
text = replace_once(text, '                value={token}', '                value={password}', 'AdminPage input value')
text = replace_once(text, '                placeholder="github_pat_…"', '                placeholder="Enter admin password"', 'AdminPage placeholder')
text = replace_once(text, '                onChange={(event) => setToken(event.target.value)}', '                onChange={(event) => setPassword(event.target.value)}', 'AdminPage input setter')
text = replace_once(text, "              disabled={accessState === 'checking' || !token.trim()}", "              disabled={accessState === 'checking' || !password.trim()}", 'AdminPage button disabled')
admin.write_text(text, encoding='utf-8')


# AdminTranslationsPage: use the same server session and password login.
translations_page = Path('src/pages/AdminTranslationsPage.tsx')
text = translations_page.read_text(encoding='utf-8')
text = replace_regex(
    text,
    r"import \{\n  forgetAdminToken,\n  readSavedAdminToken,\n  saveAdminToken,\n\} from '../admin/adminCredentialStore';\n",
    "import { getAdminSession, loginAdmin, logoutAdmin } from '../admin/adminSession';\n",
    'AdminTranslations auth import',
)
text = replace_once(
    text,
    "  const [tokenInput, setTokenInput] = useState(readSavedAdminToken);\n  const [token, setToken] = useState('');",
    "  const [password, setPassword] = useState('');",
    'AdminTranslations credential state',
)
text = replace_regex(
    text,
    r"  async function unlockWithToken\(candidateToken: string, persist = true\) \{.*?\n  function lock\(\) \{\n    forgetAdminToken\(\);\n    setToken\(''\);\n    setTokenInput\(''\);\n    setAccessState\('locked'\);\n    setAccessMessage\(''\);\n  \}\n",
    """  async function unlock() {
    const cleanPassword = password.trim();
    if (!cleanPassword) return;

    setAccessState('checking');
    setAccessMessage('Checking admin access…');

    try {
      const access = await loginAdmin(cleanPassword);
      setBranch(access.defaultBranch || 'main');
      setPassword('');
      setAccessState('ready');
      setAccessMessage(`Verified ${access.repository} · ${access.defaultBranch}`);
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : 'Unable to verify admin access.');
    }
  }

  useEffect(() => {
    let active = true;
    setAccessState('checking');
    setAccessMessage('Restoring admin session…');

    void getAdminSession()
      .then((session) => {
        if (!active) return;
        if (!session) {
          setAccessState('locked');
          setAccessMessage('');
          return;
        }
        setBranch(session.defaultBranch || 'main');
        setAccessState('ready');
        setAccessMessage(`Verified ${session.repository} · ${session.defaultBranch}`);
      })
      .catch((error) => {
        if (!active) return;
        setAccessState('error');
        setAccessMessage(error instanceof Error ? error.message : 'Unable to restore admin session.');
      });

    return () => {
      active = false;
    };
  }, []);

  function lock() {
    void logoutAdmin();
    setPassword('');
    setAccessState('locked');
    setAccessMessage('');
  }
""",
    'AdminTranslations unlock/session block',
)
text = replace_once(text, "    if (!selectedProject || !token) return;", "    if (!selectedProject) return;", 'translation generation guard')
text = replace_once(text, "        token,\n", "", 'translation generation token')
text = replace_once(text, "    if (!token) return;\n\n", "", 'translation publish guard')
text = replace_once(text, "      const commitUrl = await publishProjectTranslationCatalog({ token, branch, catalog });", "      const commitUrl = await publishProjectTranslationCatalog({ branch, catalog });", 'translation publish call')
text = replace_once(
    text,
    '            Use the same fine-grained GitHub token as the main admin. Once verified, it is remembered in this browser and reused automatically until you sign out.',
    '            Use the same portfolio admin password as the main dashboard. GitHub credentials remain on the Cloudflare Worker; this browser receives only a secure admin session cookie.',
    'AdminTranslations access copy',
)
text = replace_once(text, '<span>GitHub token</span>', '<span>Admin password</span>', 'AdminTranslations label')
text = replace_once(text, '              value={tokenInput}', '              value={password}', 'AdminTranslations value')
text = replace_once(text, '              onChange={(event) => setTokenInput(event.target.value)}', '              onChange={(event) => setPassword(event.target.value)}', 'AdminTranslations setter')
text = replace_once(text, '              placeholder="github_pat_…"', '              placeholder="Enter admin password"', 'AdminTranslations placeholder')
translations_page.write_text(text, encoding='utf-8')


# githubPortfolio: AI requests use session cookies; publishing goes through Worker.
github_portfolio = Path('src/admin/githubPortfolio.ts')
text = github_portfolio.read_text(encoding='utf-8')
text = text.replace("export async function analyzeRepository(\n  repositoryUrl: string,\n  token?: string,\n): Promise<RepositoryAnalysis> {", "export async function analyzeRepository(\n  repositoryUrl: string,\n): Promise<RepositoryAnalysis> {")
text = text.replace("  const headers = githubHeaders(token);", "  const headers = githubHeaders();", 1)
text = text.replace("    maybeReadPackageJson(rootItems, token),\n    collectRepositoryEvidence(rootItems, token),", "    maybeReadPackageJson(rootItems),\n    collectRepositoryEvidence(rootItems),", 1)
text = replace_once(
    text,
    "      headers: {\n        'Content-Type': 'application/json',\n        ...(token ? { Authorization: `Bearer ${token}` } : {}),\n      },",
    "      credentials: 'include',\n      headers: {\n        'Content-Type': 'application/json',\n      },",
    'repository AI auth',
)
text = replace_regex(
    text,
    r"export async function publishPortfolioContent\(\{.*?\n\}\n\nexport function createProjectFromAnalysis",
    """export async function publishPortfolioContent({
  branch,
  projects,
  technologyCatalog,
}: {
  branch: string;
  projects: Project[];
  technologyCatalog: TechnologyCatalog;
}) {
  const response = await fetch('/api/admin/publish-portfolio', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ branch, projects, technologyCatalog }),
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        projectCommitUrl?: string;
        technologyCommitUrl?: string;
        error?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || `Portfolio publish failed (${response.status}).`);
  }

  return {
    projectCommitUrl: payload?.projectCommitUrl,
    technologyCommitUrl: payload?.technologyCommitUrl,
  };
}

export function createProjectFromAnalysis""",
    'publishPortfolioContent function',
)
github_portfolio.write_text(text, encoding='utf-8')


# Translation manager: AI + publish use the authenticated Worker session.
manager = Path('src/admin/projectTranslationManager.ts')
text = manager.read_text(encoding='utf-8')
text = replace_once(
    text,
    "export async function translateProjectAllLocales({\n  project,\n  token,\n}: {\n  project: Project;\n  token: string;\n}): Promise<ProjectTranslationBundle> {",
    "export async function translateProjectAllLocales({\n  project,\n}: {\n  project: Project;\n}): Promise<ProjectTranslationBundle> {",
    'translateProject signature',
)
text = replace_once(
    text,
    "    headers: {\n      Authorization: `Bearer ${token}`,\n      'Content-Type': 'application/json',\n    },",
    "    credentials: 'include',\n    headers: {\n      'Content-Type': 'application/json',\n    },",
    'translateProject request auth',
)
text = replace_regex(
    text,
    r"export async function publishProjectTranslationCatalog\(\{.*?\n\}\n$",
    """export async function publishProjectTranslationCatalog({
  branch,
  catalog,
}: {
  branch: string;
  catalog: ProjectTranslationCatalog;
}) {
  const response = await fetch('/api/admin/publish-translations', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ branch, catalog }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { commitUrl?: string; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || `Translation publish failed (${response.status}).`);
  }

  return payload?.commitUrl;
}
""",
    'publishProjectTranslationCatalog function',
)
manager.write_text(text, encoding='utf-8')


# Worker: add server-side admin session, GitHub secret storage, and protected publishing.
worker = Path('scripts/prepare-site-build.mjs')
text = worker.read_text(encoding='utf-8')
insert_before = "function extractOutputText(response) {"
auth_helpers = r'''const ADMIN_SESSION_COOKIE = 'portfolio_admin_session';
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function cookieValue(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
}

function base64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/g, '');
}

async function signValue(secret, value) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return base64Url(new Uint8Array(signature));
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

async function createAdminSession(env) {
  const expires = String(Date.now() + ADMIN_SESSION_MAX_AGE * 1000);
  const secret = env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD is not configured on the Worker.');
  const signature = await signValue(secret, expires);
  return expires + '.' + signature;
}

async function hasAdminSession(request, env) {
  const token = cookieValue(request, ADMIN_SESSION_COOKIE);
  if (!token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) <= Date.now()) return false;
  const secret = env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD;
  if (!secret) return false;
  const expected = await signValue(secret, expires);
  return safeEqual(signature, expected);
}

function sessionCookie(request, value, maxAge) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return ADMIN_SESSION_COOKIE + '=' + value + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + maxAge + secure;
}

function jsonWithCookie(data, status, cookie) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'set-cookie': cookie,
    },
  });
}

function serverGitHubHeaders(env) {
  if (!env.GITHUB_PORTFOLIO_TOKEN) {
    throw new Error('GITHUB_PORTFOLIO_TOKEN is not configured on the Worker.');
  }
  return {
    Accept: 'application/vnd.github+json',
    Authorization: 'Bearer ' + env.GITHUB_PORTFOLIO_TOKEN,
    'User-Agent': 'lim-cheng-yang-portfolio-worker',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function portfolioAccess(env) {
  let headers;
  try {
    headers = serverGitHubHeaders(env);
  } catch (error) {
    return { ok: false, error: error.message };
  }

  const response = await fetch('https://api.github.com/repos/chengyang1017/portfolio', { headers });
  if (!response.ok) {
    return { ok: false, error: 'Worker GitHub credential was rejected (' + response.status + ').' };
  }

  const repository = await response.json();
  const writable = Boolean(
    repository?.permissions?.push ||
    repository?.permissions?.maintain ||
    repository?.permissions?.admin
  );
  if (!writable) {
    return { ok: false, error: 'Worker GitHub credential cannot write to chengyang1017/portfolio.' };
  }

  return {
    ok: true,
    repository: repository.full_name || 'chengyang1017/portfolio',
    defaultBranch: repository.default_branch || 'main',
  };
}

async function handleAdminLogin(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!env.ADMIN_PASSWORD) return json({ error: 'ADMIN_PASSWORD is not configured on the Worker.' }, 503);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON request.' }, 400);
  }

  const password = typeof payload?.password === 'string' ? payload.password : '';
  if (!password || !safeEqual(password, env.ADMIN_PASSWORD)) {
    return json({ error: 'Incorrect admin password.' }, 401);
  }

  const access = await portfolioAccess(env);
  if (!access.ok) return json({ error: access.error }, 503);

  const session = await createAdminSession(env);
  return jsonWithCookie(
    {
      authenticated: true,
      repository: access.repository,
      defaultBranch: access.defaultBranch,
    },
    200,
    sessionCookie(request, session, ADMIN_SESSION_MAX_AGE),
  );
}

async function handleAdminSession(request, env) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
  if (!(await hasAdminSession(request, env))) {
    return json({ authenticated: false }, 401);
  }
  const access = await portfolioAccess(env);
  if (!access.ok) return json({ error: access.error }, 503);
  return json({
    authenticated: true,
    repository: access.repository,
    defaultBranch: access.defaultBranch,
  });
}

async function handleAdminLogout(request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  return jsonWithCookie(
    { authenticated: false },
    200,
    sessionCookie(request, '', 0),
  );
}

function encodeBase64Utf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64Utf8(value) {
  const binary = atob(String(value || '').replace(/\\n/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function serverGetFile(env, path, branch) {
  const response = await fetch(
    'https://api.github.com/repos/chengyang1017/portfolio/contents/' + path + '?ref=' + encodeURIComponent(branch),
    { headers: serverGitHubHeaders(env) },
  );
  if (!response.ok) throw new Error('Unable to read ' + path + ' from GitHub (' + response.status + ').');
  return response.json();
}

async function serverUpdateFile(env, { path, branch, message, content }) {
  const current = await serverGetFile(env, path, branch);
  const response = await fetch(
    'https://api.github.com/repos/chengyang1017/portfolio/contents/' + path,
    {
      method: 'PUT',
      headers: {
        ...serverGitHubHeaders(env),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: encodeBase64Utf8(content),
        sha: current.sha,
        branch,
      }),
    },
  );
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || 'Unable to update ' + path + '.');
  }
  return response.json();
}

function replaceProjectsArrayServer(source, projects) {
  const pattern = /export const projects: Project\\[\\] = \\[\\s\\S]*?\\n\\];\\n\\nexport function getProject/;
  if (!pattern.test(source)) throw new Error('Could not locate the projects array in src/data/projects.ts.');
  return source.replace(
    pattern,
    'export const projects: Project[] = ' + JSON.stringify(projects, null, 2) + ';\\n\\nexport function getProject',
  );
}

function serializeTechnologyCatalogServer(catalog) {
  return "export type TechnologyGroupId = 'client' | 'backend' | 'platform';\\n\\nexport interface TechnologyItem {\\n  name: string;\\n  logo?: string;\\n  wideLogo?: boolean;\\n  color: string;\\n}\\n\\nexport type TechnologyCatalog = Record<TechnologyGroupId, TechnologyItem[]>;\\n\\nexport const technologyCatalog: TechnologyCatalog = " + JSON.stringify(catalog, null, 2) + ';\\n';
}

function serializeProjectTranslationsServer(catalog) {
  return "import type { Project } from './projects';\\n\\nexport const PROJECT_TRANSLATION_LOCALES = [\\n  'zh-CN',\\n  'zh-TW',\\n  'vi-Latn',\\n  'vi-Hani',\\n] as const;\\n\\nexport type ProjectTranslationLocale =\\n  (typeof PROJECT_TRANSLATION_LOCALES)[number];\\n\\nexport type ProjectTranslation = Pick<\\n  Project,\\n  | 'title'\\n  | 'shortTitle'\\n  | 'summary'\\n  | 'overview'\\n  | 'features'\\n  | 'challenges'\\n  | 'architecture'\\n  | 'gallery'\\n>;\\n\\nexport type ProjectTranslationCatalog = Record<\\n  string,\\n  Partial<Record<ProjectTranslationLocale, ProjectTranslation>>\\n>;\\n\\nexport const projectTranslationCatalog: ProjectTranslationCatalog = " + JSON.stringify(catalog, null, 2) + ';\\n';
}

async function handlePublishPortfolio(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!(await hasAdminSession(request, env))) return json({ error: 'Admin session required.' }, 401);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON request.' }, 400);
  }

  const branch = typeof payload?.branch === 'string' && payload.branch.trim() ? payload.branch.trim() : 'main';
  if (!Array.isArray(payload?.projects) || !payload?.technologyCatalog) {
    return json({ error: 'Projects and technology catalog are required.' }, 400);
  }

  try {
    const projectsFile = await serverGetFile(env, 'src/data/projects.ts', branch);
    const nextProjectsSource = replaceProjectsArrayServer(
      decodeBase64Utf8(projectsFile.content),
      payload.projects,
    );
    const projectUpdate = await serverUpdateFile(env, {
      path: 'src/data/projects.ts',
      branch,
      message: 'Update portfolio projects from admin',
      content: nextProjectsSource,
    });
    const technologyUpdate = await serverUpdateFile(env, {
      path: 'src/data/technologyCatalog.ts',
      branch,
      message: 'Update portfolio technology catalog from admin',
      content: serializeTechnologyCatalogServer(payload.technologyCatalog),
    });
    return json({
      projectCommitUrl: projectUpdate?.commit?.html_url,
      technologyCommitUrl: technologyUpdate?.commit?.html_url,
    });
  } catch (error) {
    return json({ error: error?.message || 'Portfolio publish failed.' }, 502);
  }
}

async function handlePublishTranslations(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!(await hasAdminSession(request, env))) return json({ error: 'Admin session required.' }, 401);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON request.' }, 400);
  }

  const branch = typeof payload?.branch === 'string' && payload.branch.trim() ? payload.branch.trim() : 'main';
  if (!payload?.catalog || typeof payload.catalog !== 'object') {
    return json({ error: 'Translation catalog is required.' }, 400);
  }

  try {
    const update = await serverUpdateFile(env, {
      path: 'src/data/projectTranslationCatalog.ts',
      branch,
      message: 'Update project translations from admin',
      content: serializeProjectTranslationsServer(payload.catalog),
    });
    return json({ commitUrl: update?.commit?.html_url });
  } catch (error) {
    return json({ error: error?.message || 'Translation publish failed.' }, 502);
  }
}

'''
text = replace_once(text, insert_before, auth_helpers + insert_before, 'worker auth helper insertion')
text = replace_regex(
    text,
    r"async function handlePortfolioAi\(request, env\) \{.*?\n\}\n\nexport default \{",
    r'''async function handlePortfolioAi(request, env) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  if (!(await hasAdminSession(request, env))) {
    return json({ error: 'Admin session required.' }, 401);
  }

  if (!env.OPENAI_API_KEY) {
    return json({ error: 'OPENAI_API_KEY is not configured on the Worker.' }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON request.' }, 400);
  }

  if (payload?.mode === 'translate-project') {
    return translateProject(payload, env);
  }

  return analyzeRepository(payload, env);
}

export default {''',
    'worker portfolio AI auth',
)
text = replace_once(
    text,
    "    if (url.pathname === '/api/portfolio-ai') {\n      return handlePortfolioAi(request, env);\n    }",
    "    if (url.pathname === '/api/admin/login') return handleAdminLogin(request, env);\n    if (url.pathname === '/api/admin/logout') return handleAdminLogout(request);\n    if (url.pathname === '/api/admin/session') return handleAdminSession(request, env);\n    if (url.pathname === '/api/admin/publish-portfolio') return handlePublishPortfolio(request, env);\n    if (url.pathname === '/api/admin/publish-translations') return handlePublishTranslations(request, env);\n\n    if (url.pathname === '/api/portfolio-ai') {\n      return handlePortfolioAi(request, env);\n    }",
    'worker admin routes',
)
worker.write_text(text, encoding='utf-8')
