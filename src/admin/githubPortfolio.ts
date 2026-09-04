import type { Project } from '../data/projects';
import type { TechnologyCatalog, TechnologyItem } from '../data/technologyCatalog';

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

type GitHubRepo = {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
};

type GitHubContentItem = {
  name: string;
  type: 'file' | 'dir';
  download_url?: string | null;
};

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

function parseRepositoryUrl(value: string) {
  const match = value.trim().match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/?#].*)?$/i);

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

function inferFromFiles(items: GitHubContentItem[]) {
  const names = new Set(items.map((item) => item.name.toLowerCase()));
  const technologies: string[] = [];

  if (names.has('pubspec.yaml')) {
    technologies.push('Flutter', 'Dart');
  }

  if (names.has('package.json')) {
    technologies.push('Node.js');
  }

  if (
    names.has('vite.config.ts') ||
    names.has('vite.config.js') ||
    names.has('vite.config.mjs')
  ) {
    technologies.push('Vite');
  }

  if (names.has('firebase.json')) {
    technologies.push('Firebase');
  }

  if (names.has('prisma') || names.has('schema.prisma')) {
    technologies.push('Prisma');
  }

  if (names.has('requirements.txt') || names.has('pyproject.toml')) {
    technologies.push('Python');
  }

  return technologies;
}

async function maybeReadPackageJson(items: GitHubContentItem[]) {
  const packageFile = items.find((item) => item.name.toLowerCase() === 'package.json');

  if (!packageFile?.download_url) {
    return [] as string[];
  }

  try {
    const response = await fetch(packageFile.download_url);
    if (!response.ok) return [];
    const packageJson = (await response.json()) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    const detected: string[] = [];

    if (dependencies.react) detected.push('React');
    if (dependencies.express) detected.push('Express');
    if (dependencies.prisma || dependencies['@prisma/client']) detected.push('Prisma');
    if (dependencies.firebase) detected.push('Firebase');
    if (dependencies.electron) detected.push('Electron');
    if (dependencies.vite) detected.push('Vite');
    if (dependencies.stripe) detected.push('Stripe');
    if (dependencies.typescript) detected.push('TypeScript');

    return detected;
  } catch {
    return [];
  }
}

export async function analyzeRepository(repositoryUrl: string): Promise<RepositoryAnalysis> {
  const { owner, repo } = parseRepositoryUrl(repositoryUrl);
  const headers = {
    Accept: 'application/vnd.github+json',
  };

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

  const packageTechnologies = await maybeReadPackageJson(rootItems);
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

  const aiEndpoint = import.meta.env.VITE_PORTFOLIO_AI_ENDPOINT as string | undefined;

  if (!aiEndpoint) {
    return fallback;
  }

  try {
    const aiResponse = await fetch(aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repository,
        languages,
        rootFiles: rootItems.map((item) => item.name),
        detectedTechnologies: technologies,
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
      features: ai.features ?? [],
      source: 'ai',
    };
  } catch {
    return fallback;
  }
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

async function getGitHubFile(
  token: string,
  path: string,
  branch: string,
) {
  const response = await fetch(
    `https://api.github.com/repos/chengyang1017/portfolio/contents/${path}?ref=${encodeURIComponent(branch)}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to read ${path} from GitHub (${response.status}).`);
  }

  return (await response.json()) as {
    sha: string;
    content: string;
    encoding: string;
  };
}

function decodeGitHubContent(content: string) {
  const normalized = content.replace(/\n/g, '');
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function updateGitHubFile({
  token,
  path,
  branch,
  message,
  content,
}: {
  token: string;
  path: string;
  branch: string;
  message: string;
  content: string;
}) {
  const current = await getGitHubFile(token, path, branch);
  const response = await fetch(
    `https://api.github.com/repos/chengyang1017/portfolio/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message,
        content: encodeBase64(content),
        sha: current.sha,
        branch,
      }),
    },
  );

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? `Unable to update ${path}.`);
  }

  return response.json() as Promise<{
    commit?: { html_url?: string };
  }>;
}

function replaceProjectsArray(source: string, projects: Project[]) {
  const pattern = /export const projects: Project\[\] = \[[\s\S]*?\n\];\n\nexport function getProject/;

  if (!pattern.test(source)) {
    throw new Error('Could not locate the projects array in src/data/projects.ts.');
  }

  return source.replace(
    pattern,
    `export const projects: Project[] = ${JSON.stringify(projects, null, 2)};\n\nexport function getProject`,
  );
}

export function serializeTechnologyCatalog(catalog: TechnologyCatalog) {
  return `export type TechnologyGroupId = 'client' | 'backend' | 'platform';\n\nexport interface TechnologyItem {\n  name: string;\n  logo?: string;\n  wideLogo?: boolean;\n  color: string;\n}\n\nexport type TechnologyCatalog = Record<TechnologyGroupId, TechnologyItem[]>;\n\nexport const technologyCatalog: TechnologyCatalog = ${JSON.stringify(catalog, null, 2)};\n`;
}

export async function publishPortfolioContent({
  token,
  branch,
  projects,
  technologyCatalog,
}: {
  token: string;
  branch: string;
  projects: Project[];
  technologyCatalog: TechnologyCatalog;
}) {
  const projectsFile = await getGitHubFile(token, 'src/data/projects.ts', branch);
  const nextProjectsSource = replaceProjectsArray(
    decodeGitHubContent(projectsFile.content),
    projects,
  );

  const projectUpdate = await updateGitHubFile({
    token,
    path: 'src/data/projects.ts',
    branch,
    message: 'Update portfolio projects from admin',
    content: nextProjectsSource,
  });

  const technologyUpdate = await updateGitHubFile({
    token,
    path: 'src/data/technologyCatalog.ts',
    branch,
    message: 'Update portfolio technology catalog from admin',
    content: serializeTechnologyCatalog(technologyCatalog),
  });

  return {
    projectCommitUrl: projectUpdate.commit?.html_url,
    technologyCommitUrl: technologyUpdate.commit?.html_url,
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

export function mergeTechnologyNames(
  catalog: TechnologyCatalog,
  names: string[],
) {
  const existing = new Set(
    Object.values(catalog)
      .flat()
      .map((item) => item.name.toLowerCase()),
  );
  const additions: TechnologyItem[] = names
    .filter((name) => !existing.has(name.toLowerCase()))
    .map((name) => ({
      name,
      color: '#C7FF4A',
    }));

  return {
    ...catalog,
    platform: [...catalog.platform, ...additions],
  };
}
