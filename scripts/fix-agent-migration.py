from pathlib import Path

path = Path('scripts/add-portfolio-agent.py')
text = path.read_text(encoding='utf-8')

old_parser = """function parseAgentRepositoryUrl(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^https?:\\/\\/github\\.com\\/([^/]+)\\/([^/#?]+?)(?:\\.git)?(?:[/?#].*)?$/i);
  return match ? { owner: match[1], repo: match[2] } : null;
}
"""
new_parser = """function parseAgentRepositoryUrl(value) {
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
if old_parser not in text:
    raise SystemExit('GitHub URL parser anchor not found')
text = text.replace(old_parser, new_parser, 1)

old_evidence = "        evidence += '\\n--- ' + (item.path || item.name) + ' ---\\n' + text + '\\n';"
new_evidence = "        evidence += String.fromCharCode(10) + '--- ' + (item.path || item.name) + ' ---' + String.fromCharCode(10) + text + String.fromCharCode(10);"
if old_evidence not in text:
    raise SystemExit('Repository evidence string anchor not found')
text = text.replace(old_evidence, new_evidence, 1)

path.write_text(text, encoding='utf-8')
