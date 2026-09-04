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

export class PortfolioStore {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async fetch(request) {
    if (request.method === 'GET') {
      return json((await this.ctx.storage.get('portfolio')) || {});
    }

    if (request.method === 'PATCH') {
      const patch = await request.json().catch(() => null);
      if (!patch || typeof patch !== 'object') return json({ error: 'Invalid portfolio data.' }, 400);
      const current = (await this.ctx.storage.get('portfolio')) || {};
      const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
      await this.ctx.storage.put('portfolio', next);
      return json(next);
    }

    return json({ error: 'Method not allowed' }, 405);
  }
}

function portfolioStore(env) {
  const id = env.PORTFOLIO_STORE.idFromName('primary');
  return env.PORTFOLIO_STORE.get(id);
}

async function readPortfolioStore(env) {
  const response = await portfolioStore(env).fetch('https://portfolio-store.internal/data');
  if (!response.ok) throw new Error('Unable to read the Cloudflare portfolio data store.');
  return response.json();
}

async function patchPortfolioStore(env, patch) {
  const response = await portfolioStore(env).fetch('https://portfolio-store.internal/data', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!response.ok) throw new Error('Unable to update the Cloudflare portfolio data store.');
  return response.json();
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

async function handleAdminLogin(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!env.ADMIN_PASSWORD) return json({ error: 'ADMIN_PASSWORD is not configured on the Worker.' }, 503);

  const payload = await request.json().catch(() => null);
  const password = typeof payload?.password === 'string' ? payload.password : '';
  if (!password || !safeEqual(password, env.ADMIN_PASSWORD)) {
    return json({ error: 'Incorrect admin password.' }, 401);
  }

  const session = await createAdminSession(env);
  return jsonWithCookie(
    {
      authenticated: true,
      repository: 'Cloudflare portfolio store',
      defaultBranch: 'live',
    },
    200,
    sessionCookie(request, session, ADMIN_SESSION_MAX_AGE),
  );
}

async function handleAdminSession(request, env) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
  if (!(await hasAdminSession(request, env))) return json({ authenticated: false }, 401);
  return json({
    authenticated: true,
    repository: 'Cloudflare portfolio store',
    defaultBranch: 'live',
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

async function handlePublishPortfolio(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!(await hasAdminSession(request, env))) return json({ error: 'Admin session required.' }, 401);

  const payload = await request.json().catch(() => null);
  if (!Array.isArray(payload?.projects) || !payload?.technologyCatalog) {
    return json({ error: 'Projects and technology catalog are required.' }, 400);
  }

  try {
    await patchPortfolioStore(env, {
      projects: payload.projects,
      technologyCatalog: payload.technologyCatalog,
    });
    return json({ stored: true });
  } catch (error) {
    return json({ error: error?.message || 'Portfolio publish failed.' }, 502);
  }
}

async function handlePublishTranslations(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!(await hasAdminSession(request, env))) return json({ error: 'Admin session required.' }, 401);

  const payload = await request.json().catch(() => null);
  if (!payload?.catalog || typeof payload.catalog !== 'object') {
    return json({ error: 'Translation catalog is required.' }, 400);
  }

  try {
    await patchPortfolioStore(env, { projectTranslationCatalog: payload.catalog });
    return json({ stored: true });
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
      model: env.OPENAI_MODEL || 'gpt-5-mini',
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


const AGENT_TRANSLATION_LOCALES = ['zh-CN', 'zh-TW', 'vi-Latn', 'vi-Hani'];
const AGENT_GROUPS = ['client', 'backend', 'platform'];

function agentString(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : undefined;
}

function agentStringArray(value, limit = 24, itemLimit = 900) {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item) => typeof item === 'string').map((item) => item.trim().slice(0, itemLimit)).filter(Boolean).slice(0, limit);
}

function agentObjectArray(value, left, right, limit = 20) {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item) => item && typeof item === 'object').map((item) => ({
    [left]: typeof item[left] === 'string' ? item[left].trim().slice(0, 500) : '',
    [right]: typeof item[right] === 'string' ? item[right].trim().slice(0, 1800) : '',
  })).filter((item) => item[left]).slice(0, limit);
}

function cleanAgentProjectPatch(value) {
  if (!value || typeof value !== 'object') return {};
  const patch = {};
  for (const [field, limit] of Object.entries({ title: 180, shortTitle: 120, status: 160, summary: 1200, overview: 5000, github: 500 })) {
    const cleaned = agentString(value[field], limit);
    if (cleaned !== undefined) patch[field] = cleaned;
  }
  const technologies = agentStringArray(value.technologies, 30, 120);
  const features = agentStringArray(value.features, 24, 900);
  const challenges = agentObjectArray(value.challenges, 'title', 'description');
  const architecture = agentObjectArray(value.architecture, 'label', 'detail');
  const gallery = agentObjectArray(value.gallery, 'title', 'caption');
  if (technologies !== undefined) patch.technologies = technologies;
  if (features !== undefined) patch.features = features;
  if (challenges !== undefined) patch.challenges = challenges;
  if (architecture !== undefined) patch.architecture = architecture;
  if (gallery !== undefined) patch.gallery = gallery;
  if (['Language', 'AI & Developer Tools', 'Product'].includes(value.category)) patch.category = value.category;
  if (['lime', 'blue', 'sand', 'lavender', 'slate', 'coral'].includes(value.tone)) patch.tone = value.tone;
  if (['morphology', 'commerce', 'language', 'keyboard', 'ide', 'inflection'].includes(value.mockup)) patch.mockup = value.mockup;
  return patch;
}

function cleanAgentTranslationPatch(value) {
  if (!value || typeof value !== 'object') return {};
  const patch = {};
  for (const [field, limit] of Object.entries({ title: 180, shortTitle: 120, summary: 1200, overview: 5000 })) {
    const cleaned = agentString(value[field], limit);
    if (cleaned !== undefined) patch[field] = cleaned;
  }
  const features = agentStringArray(value.features, 24, 900);
  const challenges = agentObjectArray(value.challenges, 'title', 'description');
  const architecture = agentObjectArray(value.architecture, 'label', 'detail');
  const gallery = agentObjectArray(value.gallery, 'title', 'caption');
  if (features !== undefined) patch.features = features;
  if (challenges !== undefined) patch.challenges = challenges;
  if (architecture !== undefined) patch.architecture = architecture;
  if (gallery !== undefined) patch.gallery = gallery;
  return patch;
}

function cleanAgentNewProject(value, index) {
  if (!value || typeof value !== 'object') return null;
  const slug = agentString(value.slug, 120)?.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  const title = agentString(value.title, 180);
  if (!slug || !title) return null;
  return {
    slug,
    title,
    shortTitle: agentString(value.shortTitle, 120) || title,
    category: ['Language', 'AI & Developer Tools', 'Product'].includes(value.category) ? value.category : 'Product',
    status: agentString(value.status, 160) || 'In Development',
    number: agentString(value.number, 20) || String(index + 1).padStart(2, '0'),
    summary: agentString(value.summary, 1200) || '',
    overview: agentString(value.overview, 5000) || '',
    technologies: agentStringArray(value.technologies, 30, 120) || [],
    features: agentStringArray(value.features, 24, 900) || [],
    challenges: agentObjectArray(value.challenges, 'title', 'description') || [],
    architecture: agentObjectArray(value.architecture, 'label', 'detail') || [],
    gallery: agentObjectArray(value.gallery, 'title', 'caption') || [],
    github: agentString(value.github, 500),
    tone: ['lime', 'blue', 'sand', 'lavender', 'slate', 'coral'].includes(value.tone) ? value.tone : 'blue',
    mockup: ['morphology', 'commerce', 'language', 'keyboard', 'ide', 'inflection'].includes(value.mockup) ? value.mockup : 'language',
  };
}

function cleanTechnologyOperation(value) {
  if (!value || typeof value !== 'object' || !AGENT_GROUPS.includes(value.group)) return null;
  if (value.action === 'add' && value.item && typeof value.item === 'object') {
    const name = agentString(value.item.name, 120);
    const color = agentString(value.item.color, 32);
    if (!name || !color) return null;
    return { action: 'add', group: value.group, item: { name, color, logo: agentString(value.item.logo, 500) } };
  }
  if ((value.action === 'update' || value.action === 'remove') && typeof value.name === 'string') {
    const name = value.name.trim().slice(0, 120);
    if (!name) return null;
    if (value.action === 'remove') return { action: 'remove', group: value.group, name };
    const patch = {};
    const nextName = agentString(value.patch?.name, 120);
    const color = agentString(value.patch?.color, 32);
    const logo = agentString(value.patch?.logo, 500);
    if (nextName !== undefined) patch.name = nextName;
    if (color !== undefined) patch.color = color;
    if (logo !== undefined) patch.logo = logo;
    return { action: 'update', group: value.group, name, patch };
  }
  return null;
}

function portfolioAgentChangedFields(projectPatches, translationPatches, newProjects, deleteProjectSlugs, technologyOperations) {
  const fields = [];
  for (const item of projectPatches) for (const field of Object.keys(item.patch)) fields.push(item.slug + '.en.' + field);
  for (const item of translationPatches) for (const field of Object.keys(item.patch)) fields.push(item.slug + '.' + item.locale + '.' + field);
  for (const item of newProjects) fields.push('new-project:' + item.slug);
  for (const slug of deleteProjectSlugs) fields.push('delete-project:' + slug);
  for (const item of technologyOperations) fields.push('technology:' + item.group + ':' + (item.name || item.item?.name || item.action));
  return fields.slice(0, 120);
}

async function runPortfolioAgent(payload, env) {
  const instruction = typeof payload?.instruction === 'string' ? payload.instruction.trim() : '';
  const projects = Array.isArray(payload?.projects) ? payload.projects.slice(0, 60) : [];
  if (!instruction || projects.length === 0) return json({ error: 'Portfolio projects and agent instruction are required.' }, 400);

  const translations = payload?.translations && typeof payload.translations === 'object' ? payload.translations : {};
  const technologyCatalog = payload?.technologyCatalog && typeof payload.technologyCatalog === 'object' ? payload.technologyCatalog : {};
  const history = Array.isArray(payload?.history)
    ? payload.history.filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string').slice(-12).map((item) => ({ role: item.role, content: item.content.slice(0, 2000) }))
    : [];

  const instructions = [
    'You are the global editing agent for an entire developer portfolio CMS.',
    'You can reason across every project, every supported translation, and the shared technology catalog.',
    'The currently selected project and active locale are context only, not a scope restriction unless the user asks for that scope.',
    'The user owns the draft. Propose edits only. Never publish or claim that changes are already applied.',
    'Return JSON only with exactly these keys: message, projectPatches, translationPatches, newProjects, deleteProjectSlugs, technologyOperations.',
    'projectPatches is an array of {slug, patch}. patch may contain title, shortTitle, category, status, summary, overview, technologies, features, challenges, architecture, gallery, github, tone, mockup. Never change slug or project number through projectPatches.',
    'translationPatches is an array of {slug, locale, patch}. locale must be zh-CN, zh-TW, vi-Latn, or vi-Hani. Translation patch fields are title, shortTitle, summary, overview, features, challenges, architecture, gallery.',
    'newProjects is an array of complete project drafts and should be used only when the user explicitly asks to create or add a project.',
    'deleteProjectSlugs is allowed only when the user explicitly asks to delete or remove a project.',
    'technologyOperations supports add, update, and remove for client, backend, and platform technology groups. Do not remove technology entries unless explicitly requested or clearly duplicated and the user asked for cleanup.',
    'When the user says all, entire portfolio, every project, or globally, work across the whole portfolio instead of the selected project.',
    'When asked to fill missing translations, fill only missing or clearly incomplete translated fields and preserve good existing translations.',
    'When asked to improve copy, keep it factual, concise, portfolio-appropriate, and consistent across projects.',
    'Do not invent project facts, users, metrics, deployment state, features, or technologies. Existing portfolio data is evidence but may be incomplete.',
    'For vi-Hani, write Vietnamese in Chữ Nôm / Hán-Nôm rather than translating into Chinese; keep Latin technical names when uncertain.',
    'Preserve URLs, repository slugs, code identifiers, framework names, database names, and project brands unless the user explicitly requests a rename.',
    'If the request is only a question, answer in message and return empty operation arrays.',
    'Keep message concise and describe the scope of the proposal.',
  ].join(' ');

  try {
    const parsed = await runOpenAI(env, instructions, {
      instruction,
      selectedSlug: payload?.selectedSlug || '',
      activeLocale: payload?.activeLocale || 'en',
      projects,
      translations,
      technologyCatalog,
      recentConversation: history,
    }, 16000);

    const projectSlugs = new Set(projects.map((project) => project?.slug).filter(Boolean));
    const projectPatches = Array.isArray(parsed?.projectPatches)
      ? parsed.projectPatches.map((item) => ({ slug: typeof item?.slug === 'string' ? item.slug : '', patch: cleanAgentProjectPatch(item?.patch) })).filter((item) => projectSlugs.has(item.slug) && Object.keys(item.patch).length > 0).slice(0, 80)
      : [];
    const translationPatches = Array.isArray(parsed?.translationPatches)
      ? parsed.translationPatches.map((item) => ({ slug: typeof item?.slug === 'string' ? item.slug : '', locale: item?.locale, patch: cleanAgentTranslationPatch(item?.patch) })).filter((item) => projectSlugs.has(item.slug) && AGENT_TRANSLATION_LOCALES.includes(item.locale) && Object.keys(item.patch).length > 0).slice(0, 180)
      : [];
    const newProjects = Array.isArray(parsed?.newProjects)
      ? parsed.newProjects.map((item, index) => cleanAgentNewProject(item, projects.length + index)).filter(Boolean).slice(0, 12)
      : [];
    const explicitDelete = /\b(delete|remove)\b|删除|刪除|移除|xóa/i.test(instruction);
    const deleteProjectSlugs = explicitDelete && Array.isArray(parsed?.deleteProjectSlugs)
      ? parsed.deleteProjectSlugs.filter((slug) => typeof slug === 'string' && projectSlugs.has(slug)).slice(0, 20)
      : [];
    const technologyOperations = Array.isArray(parsed?.technologyOperations)
      ? parsed.technologyOperations.map(cleanTechnologyOperation).filter(Boolean).slice(0, 60)
      : [];

    return json({
      message: cleanString(parsed?.message, 'Portfolio draft proposal prepared for review.', 1400),
      projectPatches,
      translationPatches,
      newProjects,
      deleteProjectSlugs,
      technologyOperations,
      changedFields: portfolioAgentChangedFields(projectPatches, translationPatches, newProjects, deleteProjectSlugs, technologyOperations),
    });
  } catch (error) {
    return json({ error: error?.message || 'Portfolio agent failed.', status: error?.status, detail: error?.detail }, 502);
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

  if (payload?.mode === 'portfolio-agent') {
    return runPortfolioAgent(payload, env);
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

    if (url.pathname === '/api/portfolio-data' && request.method === 'GET') {
      try {
        return json(await readPortfolioStore(env));
      } catch (error) {
        return json({ error: error?.message || 'Unable to load portfolio data.' }, 502);
      }
    }

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
      durable_objects: {
        bindings: [{ name: 'PORTFOLIO_STORE', class_name: 'PortfolioStore' }],
      },
      migrations: [{ tag: 'v1', new_sqlite_classes: ['PortfolioStore'] }],
    },
    null,
    2,
  ),
);