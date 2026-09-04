import { mkdir, writeFile } from 'node:fs/promises';

const workerSource = `function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function bearerToken(request) {
  const header = request.headers.get('authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
}

async function verifyPortfolioWriteAccess(token) {
  if (!token) return false;

  const response = await fetch('https://api.github.com/repos/chengyang1017/portfolio', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + token,
      'User-Agent': 'lim-cheng-yang-portfolio-worker',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) return false;

  const repository = await response.json();
  return Boolean(
    repository?.permissions?.push ||
    repository?.permissions?.maintain ||
    repository?.permissions?.admin
  );
}

const ADMIN_SESSION_COOKIE = 'portfolio_admin_session';
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

function extractOutputText(response) {
  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  for (const item of response?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') {
        return content.text.trim();
      }
    }
  }

  return '';
}

function parseJsonText(text) {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace < firstBrace) {
    throw new Error('No JSON object found.');
  }

  return JSON.parse(text.slice(firstBrace, lastBrace + 1));
}

function stringArray(value, limit = 16) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function cleanString(value, fallback, limit) {
  return typeof value === 'string' && value.trim()
    ? value.trim().slice(0, limit)
    : fallback;
}

function cleanRepositoryResult(value, fallback) {
  return {
    title: cleanString(value?.title, fallback.title, 120),
    summary: cleanString(value?.summary, fallback.summary, 700),
    overview: cleanString(value?.overview, fallback.overview, 2600),
    technologies: stringArray(value?.technologies, 20),
    features: stringArray(value?.features, 14),
  };
}

function cleanProjectTranslation(value, source) {
  const sourceFeatures = Array.isArray(source?.features) ? source.features : [];
  const sourceChallenges = Array.isArray(source?.challenges) ? source.challenges : [];
  const sourceArchitecture = Array.isArray(source?.architecture) ? source.architecture : [];
  const sourceGallery = Array.isArray(source?.gallery) ? source.gallery : [];

  return {
    title: cleanString(value?.title, source?.title || '', 180),
    shortTitle: cleanString(value?.shortTitle, source?.shortTitle || source?.title || '', 120),
    summary: cleanString(value?.summary, source?.summary || '', 1200),
    overview: cleanString(value?.overview, source?.overview || '', 5000),
    features: sourceFeatures.map((fallback, index) =>
      cleanString(value?.features?.[index], fallback, 900)
    ),
    challenges: sourceChallenges.map((fallback, index) => ({
      title: cleanString(value?.challenges?.[index]?.title, fallback?.title || '', 500),
      description: cleanString(
        value?.challenges?.[index]?.description,
        fallback?.description || '',
        1800
      ),
    })),
    architecture: sourceArchitecture.map((fallback, index) => ({
      label: cleanString(value?.architecture?.[index]?.label, fallback?.label || '', 300),
      detail: cleanString(value?.architecture?.[index]?.detail, fallback?.detail || '', 900),
    })),
    gallery: sourceGallery.map((fallback, index) => ({
      title: cleanString(value?.gallery?.[index]?.title, fallback?.title || '', 500),
      caption: cleanString(value?.gallery?.[index]?.caption, fallback?.caption || '', 1400),
    })),
  };
}

async function runOpenAI(env, instructions, input, maxOutputTokens) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.OPENAI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || 'gpt-5.6-luna',
      reasoning: { effort: 'low' },
      instructions,
      input: JSON.stringify(input),
      max_output_tokens: maxOutputTokens,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    const error = new Error('OpenAI request failed.');
    error.status = response.status;
    error.detail = detail.slice(0, 1400);
    throw error;
  }

  const data = await response.json();
  const outputText = extractOutputText(data);

  if (!outputText) {
    throw new Error('OpenAI returned no text output.');
  }

  return parseJsonText(outputText);
}

async function translateProject(payload, env) {
  const source = payload?.project;

  if (!source || typeof source !== 'object') {
    return json({ error: 'Project source is required.' }, 400);
  }

  const targetLocales = ['zh-CN', 'zh-TW', 'vi-Latn', 'vi-Hani'];

  const instructions = [
    'You translate complete developer-portfolio project content from English.',
    'Return JSON only. The top-level object must have exactly four keys: zh-CN, zh-TW, vi-Latn, vi-Hani.',
    'Every locale value must contain exactly: title, shortTitle, summary, overview, features, challenges, architecture, gallery.',
    'Preserve the exact array lengths, order, and nested object structure from the source project.',
    'Translate every human-readable sentence and label. Do not omit, summarize, expand, or invent information.',
    'Do not translate URLs, repository slugs, code identifiers, technology names, framework names, database names, or API names.',
    'Preserve product and project brand names unless the source itself provides a localized brand name.',
    'zh-CN must be natural Simplified Chinese. zh-TW must be natural Traditional Chinese.',
    'vi-Latn must be natural Vietnamese written in modern Latin orthography.',
    'vi-Hani must represent the same Vietnamese content in Chữ Nôm / Hán-Nôm writing, not merely translate it into Chinese. Preserve Latin technical and brand terms when a reliable Nôm form is uncertain.',
    'Keep technical meaning precise and keep all four translations semantically aligned with the English source.',
  ].join(' ');

  try {
    const parsed = await runOpenAI(
      env,
      instructions,
      { sourceProject: source, targetLocales },
      16000,
    );

    const result = {};
    for (const locale of targetLocales) {
      result[locale] = cleanProjectTranslation(parsed?.[locale], source);
    }

    return json(result);
  } catch (error) {
    return json(
      {
        error: error?.message || 'AI translation failed.',
        status: error?.status,
        detail: error?.detail,
      },
      502,
    );
  }
}

async function analyzeRepository(payload, env) {
  const repository = payload?.repository ?? {};
  const detectedTechnologies = stringArray(payload?.detectedTechnologies, 30);
  const rootFiles = stringArray(payload?.rootFiles, 80);
  const evidence = typeof payload?.evidence === 'string'
    ? payload.evidence.slice(0, 30000)
    : '';

  const fallback = {
    title: typeof repository?.name === 'string' ? repository.name : 'Repository',
    summary:
      typeof repository?.description === 'string' && repository.description.trim()
        ? repository.description.trim()
        : 'Software repository.',
    overview:
      typeof repository?.description === 'string' && repository.description.trim()
        ? repository.description.trim()
        : 'Software repository.',
  };

  const prompt = {
    repository: {
      name: repository?.name,
      full_name: repository?.full_name,
      description: repository?.description,
      default_branch: repository?.default_branch,
      html_url: repository?.html_url,
    },
    languages: payload?.languages ?? {},
    rootFiles,
    detectedTechnologies,
    evidence,
  };

  try {
    const parsed = await runOpenAI(
      env,
      [
        'You analyze software repositories for a developer portfolio.',
        'Use only the repository evidence provided by the caller.',
        'Do not invent features, technologies, architecture, deployment state, users, or metrics.',
        'Return JSON only, with exactly these keys: title, summary, overview, technologies, features.',
        'summary should be one concise portfolio sentence.',
        'overview should be a factual paragraph explaining what the project is and how the verified parts fit together.',
        'technologies must be an array of concrete technologies supported by the evidence.',
        'features must be an array of concrete user-visible or developer-facing capabilities supported by the evidence.',
        'If evidence is insufficient for a feature, omit it.',
      ].join(' '),
      prompt,
      2200,
    );

    return json(cleanRepositoryResult(parsed, fallback));
  } catch (error) {
    return json(
      {
        error: error?.message || 'Repository AI analysis failed.',
        status: error?.status,
        detail: error?.detail,
      },
      502,
    );
  }
}

async function handlePortfolioAi(request, env) {
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/admin/login') return handleAdminLogin(request, env);
    if (url.pathname === '/api/admin/logout') return handleAdminLogout(request);
    if (url.pathname === '/api/admin/session') return handleAdminSession(request, env);
    if (url.pathname === '/api/admin/publish-portfolio') return handlePublishPortfolio(request, env);
    if (url.pathname === '/api/admin/publish-translations') return handlePublishTranslations(request, env);

    if (url.pathname === '/api/portfolio-ai') {
      return handlePortfolioAi(request, env);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  },
};
`;

await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', workerSource);
await writeFile(
  'dist/server/wrangler.json',
  JSON.stringify(
    {
      name: 'lim-cheng-yang-portfolio',
      main: 'index.js',
      compatibility_date: '2026-08-01',
      assets: {
        directory: '../',
        binding: 'ASSETS',
        not_found_handling: 'single-page-application',
      },
    },
    null,
    2,
  ),
);