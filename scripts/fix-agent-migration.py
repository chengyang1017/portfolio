from pathlib import Path

path = Path('scripts/add-portfolio-agent.py')
text = path.read_text(encoding='utf-8')
old = """function parseAgentRepositoryUrl(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^https?:\\/\\/github\\.com\\/([^/]+)\\/([^/#?]+?)(?:\\.git)?(?:[/?#].*)?$/i);
  return match ? { owner: match[1], repo: match[2] } : null;
}
"""
new = """function parseAgentRepositoryUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'github.com') return null;
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    let repo = parts[1];
    if (repo.toLowerCase().endsWith('.git')) repo = repo.slice(0, -4);
    return repo ? { owner: parts[0], repo } : null;
  } catch {
    return null;
  }
}
"""
if old not in text:
    raise SystemExit('GitHub URL parser anchor not found')
path.write_text(text.replace(old, new, 1), encoding='utf-8')
