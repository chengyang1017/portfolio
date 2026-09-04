from pathlib import Path

prepare = Path('scripts/prepare-site-build.mjs')
text = prepare.read_text(encoding='utf-8')

old_import = "import { mkdir, writeFile } from 'node:fs/promises';\n\nconst workerSource = `function json(data, status = 200) {"
new_import = "import { mkdir, readFile, writeFile } from 'node:fs/promises';\n\nconst portfolioSeed = JSON.parse(\n  await readFile(new URL('../src/data/portfolioSeed.json', import.meta.url), 'utf8'),\n);\nconst portfolioContentVersion = portfolioSeed.version;\nconst portfolioProjectsJson = JSON.stringify(portfolioSeed.projects)\n  .replace(/`/g, '\\\\`')\n  .replace(/\\$\\{/g, '\\\\${');\n\nconst workerSource = `const PORTFOLIO_CONTENT_VERSION = ${JSON.stringify(portfolioContentVersion)};\nconst PORTFOLIO_PROJECT_SEED = ${portfolioProjectsJson};\n\nfunction json(data, status = 200) {"
if old_import not in text:
    raise SystemExit('prepare-site-build import/worker marker not found')
text = text.replace(old_import, new_import, 1)

old_get = "    if (request.method === 'GET') {\n      return json((await this.ctx.storage.get('portfolio')) || {});\n    }"
new_get = "    if (request.method === 'GET') {\n      return json(await ensurePortfolioSeed(this.ctx));\n    }"
if old_get not in text:
    raise SystemExit('PortfolioStore GET marker not found')
text = text.replace(old_get, new_get, 1)

old_patch = "      const current = (await this.ctx.storage.get('portfolio')) || {};\n      const next = { ...current, ...patch, updatedAt: new Date().toISOString() };"
new_patch = "      const current = await ensurePortfolioSeed(this.ctx);\n      const next = { ...current, ...patch, updatedAt: new Date().toISOString() };"
if old_patch not in text:
    raise SystemExit('PortfolioStore PATCH marker not found')
text = text.replace(old_patch, new_patch, 1)

class_marker = "export class PortfolioStore {"
helper = r'''function mergeSeedGallery(seedGallery, existingGallery) {
  const source = Array.isArray(seedGallery) ? seedGallery : [];
  const existing = Array.isArray(existingGallery) ? existingGallery : [];
  const next = source.map((item, index) => {
    const image = typeof existing[index]?.image === 'string' ? existing[index].image : '';
    return image ? { ...item, image } : item;
  });

  for (let index = source.length; index < existing.length; index += 1) {
    const item = existing[index];
    if (item && typeof item.image === 'string' && item.image) next.push(item);
  }

  return next;
}

async function ensurePortfolioSeed(ctx) {
  const current = (await ctx.storage.get('portfolio')) || {};
  if (current.contentVersion === PORTFOLIO_CONTENT_VERSION) return current;

  const existingProjects = Array.isArray(current.projects) ? current.projects : [];
  const existingBySlug = new Map(
    existingProjects
      .filter((project) => project && typeof project.slug === 'string')
      .map((project) => [project.slug, project]),
  );

  const seededProjects = PORTFOLIO_PROJECT_SEED.map((project) => {
    const existing = existingBySlug.get(project.slug);
    if (!existing) return project;
    return {
      ...project,
      gallery: mergeSeedGallery(project.gallery, existing.gallery),
    };
  });

  const seedSlugs = new Set(PORTFOLIO_PROJECT_SEED.map((project) => project.slug));
  const customProjects = existingProjects.filter(
    (project) => project && typeof project.slug === 'string' && !seedSlugs.has(project.slug),
  );

  const next = {
    ...current,
    projects: [...seededProjects, ...customProjects],
    contentVersion: PORTFOLIO_CONTENT_VERSION,
    updatedAt: new Date().toISOString(),
  };

  await ctx.storage.put('portfolio', next);
  return next;
}

'''
if class_marker not in text:
    raise SystemExit('PortfolioStore class marker not found')
text = text.replace(class_marker, helper + class_marker, 1)
prepare.write_text(text, encoding='utf-8')

admin = Path('src/pages/AdminPage.tsx')
admin_text = admin.read_text(encoding='utf-8')
old_admin_import = "import { projects as initialProjects } from '../data/projects';"
new_admin_import = "import { portfolioContentVersion, projects as initialProjects } from '../data/projects';"
if old_admin_import in admin_text:
    admin_text = admin_text.replace(old_admin_import, new_admin_import, 1)
elif new_admin_import not in admin_text:
    raise SystemExit('Admin project import marker not found')

old_key = "const ADMIN_DRAFT_STORAGE_KEY = 'portfolio-admin-draft-v1';"
new_key = "const ADMIN_DRAFT_STORAGE_KEY = `portfolio-admin-draft-${portfolioContentVersion}`;"
if old_key in admin_text:
    admin_text = admin_text.replace(old_key, new_key, 1)
elif new_key not in admin_text:
    raise SystemExit('Admin draft key marker not found')

admin.write_text(admin_text, encoding='utf-8')
