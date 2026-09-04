from pathlib import Path

prepare = Path('scripts/prepare-site-build.mjs')
text = prepare.read_text(encoding='utf-8')
old = """const portfolioSeed = JSON.parse(\n  await readFile(new URL('../src/data/portfolioSeed.json', import.meta.url), 'utf8'),\n);\nconst portfolioContentVersion = portfolioSeed.version;\nconst portfolioProjectsJson = JSON.stringify(portfolioSeed.projects)\n"""
new = """const portfolioSeed = JSON.parse(\n  await readFile(new URL('../src/data/portfolioSeed.json', import.meta.url), 'utf8'),\n);\nconst portfolioSeedExtra = JSON.parse(\n  await readFile(new URL('../src/data/portfolioSeedExtra.json', import.meta.url), 'utf8'),\n);\nconst portfolioContentVersion = `${portfolioSeed.version}-${portfolioSeedExtra.version}`;\nconst portfolioProjectsJson = JSON.stringify([\n  ...portfolioSeed.projects,\n  ...portfolioSeedExtra.projects,\n])\n"""
if old not in text:
    if 'portfolioSeedExtra.json' not in text:
        raise SystemExit('prepare-site-build seed marker not found')
else:
    text = text.replace(old, new, 1)
prepare.write_text(text, encoding='utf-8')

home = Path('src/pages/HomePage.tsx')
home_text = home.read_text(encoding='utf-8')
old_home = "  const selectedProjects = projects.slice(-4).reverse();"
new_home = """  const featuredProjectSlugs = ['glyphora', 'shopping-app', 'ai-code-tutor', 'flutter-ui-playground'];\n  const selectedProjects = featuredProjectSlugs\n    .map((slug) => projects.find((project) => project.slug === slug))\n    .filter((project): project is Project => Boolean(project));"""
if old_home in home_text:
    home_text = home_text.replace(old_home, new_home, 1)
elif 'featuredProjectSlugs' not in home_text:
    raise SystemExit('HomePage selectedProjects marker not found')
home.write_text(home_text, encoding='utf-8')
