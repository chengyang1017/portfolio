import type { Project } from '../data/projects';
import type {
  TechnologyCatalog,
  TechnologyGroupId,
  TechnologyItem,
} from '../data/technologyCatalog';

export type RepositoryAnalysis = {
  owner: string;
  repo: string;
  title: string;
  github: string;
  summary: string;
  overview: string;
  technologies: string[];
  features: string[];
  source: 'ai' | 'repository';
};

export type PortfolioAccess = {
  repository: string;
  defaultBranch: string;
};

type GitHubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  permissions?: {
    admin?: boolean;
    maintain?: boolean;
    push?: boolean;
    pull?: boolean;
  };
};

type GitHubContentItem = {
  name: string;
  path?: string;
  type: 'file' | 'dir';
  url?: string;
  download_url?: string | null;
};

type TechnologyDefault = {
  group: TechnologyGroupId;
  color: string;
  logo?: string;
};

const SIMPLE_ICONS = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons';

const LANGUAGE_TECH: Record<string, string[]> = {
  Dart: ['Dart'],
  TypeScript: ['TypeScript'],
  JavaScript: ['JavaScript'],
  Python: ['Python'],
  Kotlin: ['Kotlin'],
  Java: ['Java'],
  'C#': ['C#'],
  Rust: ['Rust'],
  HTML: ['HTML'],
  CSS: ['CSS'],
};

const TECHNOLOGY_DEFAULTS: Record<string, TechnologyDefault> = {
  Flutter: { group: 'client', color: '#02569B', logo: `${SIMPLE_ICONS}/flutter.svg` },
  Dart: { group: 'client', color: '#0175C2', logo: `${SIMPLE_ICONS}/dart.svg` },
  Android: { group: 'client', color: '#3DDC84', logo: `${SIMPLE_ICONS}/android.svg` },
  Kotlin: { group: 'client', color: '#7F52FF', logo: `${SIMPLE_ICONS}/kotlin.svg` },
  React: { group: 'client', color: '#61DAFB', logo: `${SIMPLE_ICONS}/react.svg` },
  TypeScript: { group: 'client', color: '#3178C6', logo: `${SIMPLE_ICONS}/typescript.svg` },
  JavaScript: { group: 'client', color: '#F7DF1E', logo: `${SIMPLE_ICONS}/javascript.svg` },
  Vite: { group: 'client', color: '#646CFF', logo: `${SIMPLE_ICONS}/vite.svg` },
  Electron: { group: 'client', color: '#47848F', logo: `${SIMPLE_ICONS}/electron.svg` },
  HTML: { group: 'client', color: '#E34F26', logo: `${SIMPLE_ICONS}/html5.svg` },
  CSS: { group: 'client', color: '#663399', logo: `${SIMPLE_ICONS}/css.svg` },
  Vue: { group: 'client', color: '#42B883', logo: `${SIMPLE_ICONS}/vuedotjs.svg` },
  'Node.js': { group: 'backend', color: '#5FA04E', logo: `${SIMPLE_ICONS}/nodedotjs.svg` },
  Express: { group: 'backend', color: '#B8C0BD', logo: `${SIMPLE_ICONS}/express.svg` },
  Prisma: { group: 'backend', color: '#2D3748', logo: `${SIMPLE_ICONS}/prisma.svg` },
  PostgreSQL: { group: 'backend', color: '#4169E1', logo: `${SIMPLE_ICONS}/postgresql.svg` },
  Python: { group: 'backend', color: '#3776AB', logo: `${SIMPLE_ICONS}/python.svg` },
  Flask: { group: 'backend', color: '#D7DDDA', logo: `${SIMPLE_ICONS}/flask.svg` },
  SQLite: { group: 'backend', color: '#003B57', logo: `${SIMPLE_ICONS}/sqlite.svg` },
  'C#': { group: 'backend', color: '#512BD4', logo: `${SIMPLE_ICONS}/dotnet.svg` },
  Rust: { group: 'backend', color: '#DEA584', logo: `${SIMPLE_ICONS}/rust.svg` },
  Java: { group: 'backend', color: '#ED8B00' },
  Firebase: { group: 'platform', color: '#FFCA28', logo: `${SIMPLE_ICONS}/firebase.svg` },
  Stripe: { group: 'platform', color: '#635BFF', logo: `${SIMPLE_ICONS}/stripe.svg` },
  Supabase: { group: 'platform', color: '#3FCF8E', logo: `${SIMPLE_ICONS}/supabase.svg` },
};

const EVIDENCE_FILES = new Set([
  'readme.md',
  'readme',
  'package.json',
  'pubspec.yaml',
  'pyproject.toml',
  'requirements.txt',
  'cargo.toml',
  'composer.json',
  'firebase.json',
  'pom.xml',
  'build.gradle',
  'build.gradle.kts',
  'settings.gradle',
  'settings.gradle.kts',
]);

function parseRepositoryUrl(value: string) {
  const match = value
    .trim()
    .match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/?#].*)?$/i);

  if (!match) {
    throw new Error('Use a GitHub repository URL such as https://github.com/owner/repository');
  }

  return {
    owner: match[1],
    repo: match[2],
  };
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function githubHeaders(token?: string) {
  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function inferFromFiles(items: GitHubContentItem[]) {
  const names = new Set(items.map((item) => item.name.toLowerCase()));
  const technologies: string[] = [];

  if (names.has('pubspec.yaml')) technologies.push('Flutter', 'Dart');
  if (names.has('package.json')) technologies.push('Node.js');

  if (
    names.has('vite.config.ts') ||
    names.has('vite.config.js') ||
    names.has('vite.config.mjs')
  ) {
    technologies.push('Vite');
  }

  if (names.has('firebase.json')) technologies.push('Firebase');
  if (names.has('prisma') || names.has('schema.prisma')) technologies.push('Prisma');
  if (names.has('requirements.txt') || names.has('pyproject.toml')) technologies.push('Python');
  if (names.has('cargo.toml')) technologies.push('Rust');

  if (
    Array.from(names).some((name) => name.endsWith('.csproj')) ||
    Array.from(names).some((name) => name.endsWith('.sln'))
  ) {
    technologies.push('C#');
  }

  return technologies;
}

async function readGitHubTextFile(
  item: GitHubContentItem,
  token?: string,
  maxChars = 7000,
) {
  try {
    const response = item.url
      ? await fetch(item.url, {
          headers: {
            ...githubHeaders(token),
            Accept: 'application/vnd.github.raw+json',
          },
        })
      : item.download_url
        ? await fetch(item.download_url)
        : null;

    if (!response?.ok) return '';
    return (await response.text()).slice(0, maxChars);
  } catch {
    return '';
  }
}

async function maybeReadPackageJson(items: GitHubContentItem[], token?: string) {
  const packageFile = items.find((item) => item.name.toLowerCase() === 'package.json');
  if (!packageFile) return [] as string[];

  const source = await readGitHubTextFile(packageFile, token, 20000);
  if (!source) return [] as string[];

  try {
    const packageJson = JSON.parse(source) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const detected: string[] = [];

    if (dependencies.react) detected.push('React');
    if (dependencies.vue) detected.push('Vue');
    if (dependencies.express) detected.push('Express');
    if (dependencies.prisma || dependencies['@prisma/client']) detected.push('Prisma');
    if (dependencies.firebase) detected.push('Firebase');
    if (dependencies['@supabase/supabase-js']) detected.push('Supabase');
    if (dependencies.electron) detected.push('Electron');
    if (dependencies.vite) detected.push('Vite');
    if (dependencies.stripe || dependencies['@stripe/stripe-js']) detected.push('Stripe');
    if (dependencies.typescript) detected.push('TypeScript');

    return detected;
  } catch {
    return [] as string[];
  }
}

async function collectRepositoryEvidence(items: GitHubContentItem[], token?: string) {
  const evidenceFiles = items.filter(
    (item) => item.type === 'file' && EVIDENCE_FILES.has(item.name.toLowerCase()),
  );

  const parts: string[] = [];
  let total = 0;

  for (const item of evidenceFiles) {
    if (total >= 28000) break;

    const remaining = 28000 - total;
    const text = await readGitHubTextFile(item, token, Math.min(7000, remaining));
    if (!text.trim()) continue;

    const section = `\n--- ${item.path ?? item.name} ---\n${text.trim()}\n`;
    parts.push(section);
    total += section.length;
  }

  return parts.join('').slice(0, 28000);
}

export async function analyzeRepository(
  repositoryUrl: string,
): Promise<RepositoryAnalysis> {
  const { owner, repo } = parseRepositoryUrl(repositoryUrl);
  const headers = githubHeaders();

  const [repoResponse, languagesResponse, contentsResponse] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers }),
  ]);

  if (!repoResponse.ok) {
    throw new Error(`GitHub could not read ${owner}/${repo}.`);
  }

  const repository = (await repoResponse.json()) as GitHubRepo;
  const languages = languagesResponse.ok
    ? ((await languagesResponse.json()) as Record<string, number>)
    : {};
  const rootItems = contentsResponse.ok
    ? ((await contentsResponse.json()) as GitHubContentItem[])
    : [];

  const [packageTechnologies, evidence] = await Promise.all([
    maybeReadPackageJson(rootItems),
    collectRepositoryEvidence(rootItems),
  ]);

  const languageTechnologies = Object.keys(languages).flatMap(
    (language) => LANGUAGE_TECH[language] ?? [language],
  );

  const technologies = unique([
    ...languageTechnologies,
    ...inferFromFiles(rootItems),
    ...packageTechnologies,
  ]);

  const fallback: RepositoryAnalysis = {
    owner,
    repo,
    title: repository.name,
    github: repository.html_url,
    summary:
      repository.description ??
      `A software project maintained in ${repository.full_name}.`,
    overview:
      repository.description ??
      `Repository analysis for ${repository.full_name}. Review and refine this text before publishing.`,
    technologies,
    features: [],
    source: 'repository',
  };

  const aiEndpoint =
    (import.meta.env.VITE_PORTFOLIO_AI_ENDPOINT as string | undefined) ||
    '/api/portfolio-ai';

  try {
    const aiResponse = await fetch(aiEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repository,
        languages,
        rootFiles: rootItems.map((item) => item.path ?? item.name),
        detectedTechnologies: technologies,
        evidence,
      }),
    });

    if (!aiResponse.ok) {
      return fallback;
    }

    const ai = (await aiResponse.json()) as Partial<RepositoryAnalysis>;

    return {
      ...fallback,
      ...ai,
      owner,
      repo,
      github: repository.html_url,
      technologies: unique(ai.technologies ?? technologies),
      features: Array.isArray(ai.features) ? ai.features : [],
      source: 'ai',
    };
  } catch {
    return fallback;
  }
}

export async function publishPortfolioContent({
  branch,
  projects,
  technologyCatalog,
}: {
  branch: string;
  projects: Project[];
  technologyCatalog: TechnologyCatalog;
}) {
  const response = await fetch('/api/admin/publish-portfolio', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ branch, projects, technologyCatalog }),
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        projectCommitUrl?: string;
        technologyCommitUrl?: string;
        error?: string;
      }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || `Portfolio publish failed (${response.status}).`);
  }

  return {
    projectCommitUrl: payload?.projectCommitUrl,
    technologyCommitUrl: payload?.technologyCommitUrl,
  };
}

export function createProjectFromAnalysis(
  analysis: RepositoryAnalysis,
  index: number,
): Project {
  const slug = analysis.repo
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return {
    slug,
    title: analysis.title,
    shortTitle: analysis.title,
    category: 'Product',
    status: 'Public repository',
    number: String(index + 1).padStart(2, '0'),
    summary: analysis.summary,
    overview: analysis.overview,
    technologies: analysis.technologies,
    features: analysis.features,
    challenges: [],
    architecture: [],
    gallery: [],
    github: analysis.github,
    tone: 'blue',
    mockup: 'language',
  };
}

function createTechnologyItem(name: string): {
  group: TechnologyGroupId;
  item: TechnologyItem;
} {
  const defaults = TECHNOLOGY_DEFAULTS[name];

  return {
    group: defaults?.group ?? 'platform',
    item: {
      name,
      color: defaults?.color ?? '#C7FF4A',
      ...(defaults?.logo ? { logo: defaults.logo } : {}),
    },
  };
}

export function mergeTechnologyNames(catalog: TechnologyCatalog, names: string[]) {
  const existing = new Set(
    Object.values(catalog)
      .flat()
      .map((item) => item.name.toLowerCase()),
  );

  const next: TechnologyCatalog = {
    client: [...catalog.client],
    backend: [...catalog.backend],
    platform: [...catalog.platform],
  };

  names
    .filter((name) => !existing.has(name.toLowerCase()))
    .forEach((name) => {
      const technology = createTechnologyItem(name);
      next[technology.group].push(technology.item);
      existing.add(name.toLowerCase());
    });

  return next;
}
