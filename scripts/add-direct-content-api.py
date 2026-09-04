from pathlib import Path

path = Path('scripts/prepare-site-build.mjs')
text = path.read_text(encoding='utf-8')

if 'async function handleAgentContent(request, env)' not in text:
    anchor = "\nfunction extractOutputText(response) {"
    if anchor not in text:
        raise SystemExit('agent content insertion anchor not found')

    block = r'''

function bearerToken(request) {
  const authorization = request.headers.get('authorization') || '';
  const match = authorization.match(/^Bearer\\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

async function hasPortfolioAgentAccess(request, env) {
  if (await hasAdminSession(request, env)) return true;

  const token = bearerToken(request);
  const secret = env.PORTFOLIO_AGENT_TOKEN || env.ADMIN_PASSWORD;
  if (!token || !secret) return false;
  return safeEqual(token, secret);
}

function validateAgentContentPatch(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return 'patch must be an object.';
  }

  const allowed = new Set(['projects', 'technologyCatalog', 'projectTranslationCatalog']);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) return 'Unsupported portfolio field: ' + key;
  }

  if ('projects' in value && !Array.isArray(value.projects)) {
    return 'projects must be an array.';
  }
  if (
    'technologyCatalog' in value &&
    (!value.technologyCatalog || typeof value.technologyCatalog !== 'object' || Array.isArray(value.technologyCatalog))
  ) {
    return 'technologyCatalog must be an object.';
  }
  if (
    'projectTranslationCatalog' in value &&
    (!value.projectTranslationCatalog || typeof value.projectTranslationCatalog !== 'object' || Array.isArray(value.projectTranslationCatalog))
  ) {
    return 'projectTranslationCatalog must be an object.';
  }

  return '';
}

async function handleAgentContent(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-methods': 'GET, PATCH, OPTIONS',
        'access-control-allow-headers': 'authorization, content-type',
        'access-control-max-age': '86400',
      },
    });
  }

  if (!(await hasPortfolioAgentAccess(request, env))) {
    return json({ error: 'Portfolio agent authorization required.' }, 401);
  }

  if (request.method === 'GET') {
    try {
      const data = await readPortfolioStore(env);
      return json({
        data,
        updatedAt: typeof data?.updatedAt === 'string' ? data.updatedAt : null,
        storage: 'cloudflare-durable-object',
        writesRequireDeployment: false,
      });
    } catch (error) {
      return json({ error: error?.message || 'Unable to read portfolio content.' }, 502);
    }
  }

  if (request.method !== 'PATCH') return json({ error: 'Method not allowed' }, 405);

  const payload = await request.json().catch(() => null);
  const patch = payload?.patch;
  const validationError = validateAgentContentPatch(patch);
  if (validationError) return json({ error: validationError }, 400);

  try {
    const current = await readPortfolioStore(env);
    const currentUpdatedAt = typeof current?.updatedAt === 'string' ? current.updatedAt : null;

    if (
      Object.prototype.hasOwnProperty.call(payload || {}, 'expectedUpdatedAt') &&
      payload.expectedUpdatedAt !== currentUpdatedAt
    ) {
      return json(
        {
          error: 'Portfolio content changed since it was read.',
          code: 'CONTENT_VERSION_CONFLICT',
          updatedAt: currentUpdatedAt,
        },
        409,
      );
    }

    const data = await patchPortfolioStore(env, patch);
    return json({
      stored: true,
      data,
      updatedAt: typeof data?.updatedAt === 'string' ? data.updatedAt : null,
      deploymentTriggered: false,
    });
  } catch (error) {
    return json({ error: error?.message || 'Unable to update portfolio content.' }, 502);
  }
}
'''
    text = text.replace(anchor, block + anchor, 1)

route = "    if (url.pathname === '/api/admin/publish-translations') return handlePublishTranslations(request, env);\n"
if "url.pathname === '/api/agent/content'" not in text:
    if route not in text:
        raise SystemExit('agent content route anchor not found')
    text = text.replace(
        route,
        route + "    if (url.pathname === '/api/agent/content') return handleAgentContent(request, env);\n",
        1,
    )

path.write_text(text, encoding='utf-8')
