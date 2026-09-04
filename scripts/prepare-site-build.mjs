import { mkdir, writeFile } from 'node:fs/promises';

const workerSource = `function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function bearerToken(request) {
  const header = request.headers.get('authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
}

async function verifyPortfolioWriteAccess(token) {
  if (!token) return false;

  const response = await fetch('https://api.github.com/repos/chengyang1017/portfolio', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + token,
      'User-Agent': 'lim-cheng-yang-portfolio-worker',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) return false;

  const repository = await response.json();
  return Boolean(
    repository?.permissions?.push ||
    repository?.permissions?.maintain ||
    repository?.permissions?.admin
  );
}

function extractOutputText(response) {
  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  for (const item of response?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') {
        return content.text.trim();
      }
    }
  }

  return '';
}

function parseJsonText(text) {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace < firstBrace) {
    throw new Error('No JSON object found.');
  }

  return JSON.parse(text.slice(firstBrace, lastBrace + 1));
}

function stringArray(value, limit = 16) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function cleanString(value, fallback, limit) {
  return typeof value === 'string' && value.trim()
    ? value.trim().slice(0, limit)
    : fallback;
}

function cleanRepositoryResult(value, fallback) {
  return {
    title: cleanString(value?.title, fallback.title, 120),
    summary: cleanString(value?.summary, fallback.summary, 700),
    overview: cleanString(value?.overview, fallback.overview, 2600),
    technologies: stringArray(value?.technologies, 20),
    features: stringArray(value?.features, 14),
  };
}

function cleanProjectTranslation(value, source) {
  const sourceFeatures = Array.isArray(source?.features) ? source.features : [];
  const sourceChallenges = Array.isArray(source?.challenges) ? source.challenges : [];
  const sourceArchitecture = Array.isArray(source?.architecture) ? source.architecture : [];
  const sourceGallery = Array.isArray(source?.gallery) ? source.gallery : [];

  return {
    title: cleanString(value?.title, source?.title || '', 180),
    shortTitle: cleanString(value?.shortTitle, source?.shortTitle || source?.title || '', 120),
    summary: cleanString(value?.summary, source?.summary || '', 1200),
    overview: cleanString(value?.overview, source?.overview || '', 5000),
    features: sourceFeatures.map((fallback, index) =>
      cleanString(value?.features?.[index], fallback, 900)
    ),
    challenges: sourceChallenges.map((fallback, index) => ({
      title: cleanString(value?.challenges?.[index]?.title, fallback?.title || '', 500),
      description: cleanString(
        value?.challenges?.[index]?.description,
        fallback?.description || '',
        1800
      ),
    })),
    architecture: sourceArchitecture.map((fallback, index) => ({
      label: cleanString(value?.architecture?.[index]?.label, fallback?.label || '', 300),
      detail: cleanString(value?.architecture?.[index]?.detail, fallback?.detail || '', 900),
    })),
    gallery: sourceGallery.map((fallback, index) => ({
      title: cleanString(value?.gallery?.[index]?.title, fallback?.title || '', 500),
      caption: cleanString(value?.gallery?.[index]?.caption, fallback?.caption || '', 1400),
    })),
  };
}

async function runOpenAI(env, instructions, input, maxOutputTokens) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.OPENAI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || 'gpt-5.6-luna',
      reasoning: { effort: 'low' },
      instructions,
      input: JSON.stringify(input),
      max_output_tokens: maxOutputTokens,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    const error = new Error('OpenAI request failed.');
    error.status = response.status;
    error.detail = detail.slice(0, 1400);
    throw error;
  }

  const data = await response.json();
  const outputText = extractOutputText(data);

  if (!outputText) {
    throw new Error('OpenAI returned no text output.');
  }

  return parseJsonText(outputText);
}

async function translateProject(payload, env) {
  const source = payload?.project;

  if (!source || typeof source !== 'object') {
    return json({ error: 'Project source is required.' }, 400);
  }

  const targetLocales = ['zh-CN', 'zh-TW', 'vi-Latn', 'vi-Hani'];

  const instructions = [
    'You translate complete developer-portfolio project content from English.',
    'Return JSON only. The top-level object must have exactly four keys: zh-CN, zh-TW, vi-Latn, vi-Hani.',
    'Every locale value must contain exactly: title, shortTitle, summary, overview, features, challenges, architecture, gallery.',
    'Preserve the exact array lengths, order, and nested object structure from the source project.',
    'Translate every human-readable sentence and label. Do not omit, summarize, expand, or invent information.',
    'Do not translate URLs, repository slugs, code identifiers, technology names, framework names, database names, or API names.',
    'Preserve product and project brand names unless the source itself provides a localized brand name.',
    'zh-CN must be natural Simplified Chinese. zh-TW must be natural Traditional Chinese.',
    'vi-Latn must be natural Vietnamese written in modern Latin orthography.',
    'vi-Hani must represent the same Vietnamese content in Chữ Nôm / Hán-Nôm writing, not merely translate it into Chinese. Preserve Latin technical and brand terms when a reliable Nôm form is uncertain.',
    'Keep technical meaning precise and keep all four translations semantically aligned with the English source.',
  ].join(' ');

  try {
    const parsed = await runOpenAI(
      env,
      instructions,
      { sourceProject: source, targetLocales },
      16000,
    );

    const result = {};
    for (const locale of targetLocales) {
      result[locale] = cleanProjectTranslation(parsed?.[locale], source);
    }

    return json(result);
  } catch (error) {
    return json(
      {
        error: error?.message || 'AI translation failed.',
        status: error?.status,
        detail: error?.detail,
      },
      502,
    );
  }
}

async function analyzeRepository(payload, env) {
  const repository = payload?.repository ?? {};
  const detectedTechnologies = stringArray(payload?.detectedTechnologies, 30);
  const rootFiles = stringArray(payload?.rootFiles, 80);
  const evidence = typeof payload?.evidence === 'string'
    ? payload.evidence.slice(0, 30000)
    : '';

  const fallback = {
    title: typeof repository?.name === 'string' ? repository.name : 'Repository',
    summary:
      typeof repository?.description === 'string' && repository.description.trim()
        ? repository.description.trim()
        : 'Software repository.',
    overview:
      typeof repository?.description === 'string' && repository.description.trim()
        ? repository.description.trim()
        : 'Software repository.',
  };

  const prompt = {
    repository: {
      name: repository?.name,
      full_name: repository?.full_name,
      description: repository?.description,
      default_branch: repository?.default_branch,
      html_url: repository?.html_url,
    },
    languages: payload?.languages ?? {},
    rootFiles,
    detectedTechnologies,
    evidence,
  };

  try {
    const parsed = await runOpenAI(
      env,
      [
        'You analyze software repositories for a developer portfolio.',
        'Use only the repository evidence provided by the caller.',
        'Do not invent features, technologies, architecture, deployment state, users, or metrics.',
        'Return JSON only, with exactly these keys: title, summary, overview, technologies, features.',
        'summary should be one concise portfolio sentence.',
        'overview should be a factual paragraph explaining what the project is and how the verified parts fit together.',
        'technologies must be an array of concrete technologies supported by the evidence.',
        'features must be an array of concrete user-visible or developer-facing capabilities supported by the evidence.',
        'If evidence is insufficient for a feature, omit it.',
      ].join(' '),
      prompt,
      2200,
    );

    return json(cleanRepositoryResult(parsed, fallback));
  } catch (error) {
    return json(
      {
        error: error?.message || 'Repository AI analysis failed.',
        status: error?.status,
        detail: error?.detail,
      },
      502,
    );
  }
}

async function handlePortfolioAi(request, env) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const githubToken = bearerToken(request);
  const allowed = await verifyPortfolioWriteAccess(githubToken);

  if (!allowed) {
    return json({ error: 'Verified portfolio write access is required.' }, 401);
  }

  if (!env.OPENAI_API_KEY) {
    return json({ error: 'OPENAI_API_KEY is not configured on the Worker.' }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON request.' }, 400);
  }

  if (payload?.mode === 'translate-project') {
    return translateProject(payload, env);
  }

  return analyzeRepository(payload, env);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/portfolio-ai') {
      return handlePortfolioAi(request, env);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  },
};
`;

await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', workerSource);
await writeFile(
  'dist/server/wrangler.json',
  JSON.stringify(
    {
      name: 'lim-cheng-yang-portfolio',
      main: 'index.js',
      compatibility_date: '2026-08-01',
      assets: {
        directory: '../',
        binding: 'ASSETS',
        not_found_handling: 'single-page-application',
      },
    },
    null,
    2,
  ),
);