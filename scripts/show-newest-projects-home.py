from pathlib import Path

path = Path('src/pages/HomePage.tsx')
text = path.read_text(encoding='utf-8')
old = "  const selectedProjects = projects.slice(0, 4);"
new = "  const selectedProjects = projects.slice(-4).reverse();"
if old not in text:
    raise SystemExit('HomePage selectedProjects line not found')
path.write_text(text.replace(old, new, 1), encoding='utf-8')
