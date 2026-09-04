from pathlib import Path

path = Path('scripts/prepare-site-build.mjs')
text = path.read_text(encoding='utf-8')

# Remove legacy bearer-token verification helpers that belonged to browser PAT auth.
start = text.index('function bearerToken(request) {')
end = text.index("const ADMIN_SESSION_COOKIE = 'portfolio_admin_session';")
text = text[:start] + text[end:]

# Remove the server-side PAT access helper; Cloudflare is now the content store.
start = text.index('function serverGitHubHeaders(env) {')
end = text.index('function encodeBase64Utf8(value) {')
text = text[:start] + text[end:]

# Remove old GitHub file serialization/update helpers. The new publish handler begins here.
start = text.index('function encodeBase64Utf8(value) {')
end = text.index('async function handlePublishPortfolio(request, env) {')
text = text[:start] + text[end:]

if 'GITHUB_PORTFOLIO_TOKEN' in text:
    raise SystemExit('GITHUB_PORTFOLIO_TOKEN still appears in generated Worker source')

path.write_text(text, encoding='utf-8')
