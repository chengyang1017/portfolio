from pathlib import Path

path = Path('scripts/prepare-site-build.mjs')
text = path.read_text(encoding='utf-8')
anchor = '''function jsonWithCookie(data, status, cookie) {\n  return new Response(JSON.stringify(data), {\n    status,\n    headers: {\n      'content-type': 'application/json; charset=utf-8',\n      'cache-control': 'no-store',\n      'set-cookie': cookie,\n    },\n  });\n}\n\n'''
if anchor not in text:
    raise SystemExit('jsonWithCookie anchor missing')
handlers = r'''async function handleAdminLogin(request, env) {
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

'''
if 'async function handleAdminLogin(request, env)' not in text:
    text = text.replace(anchor, anchor + handlers, 1)
path.write_text(text, encoding='utf-8')
