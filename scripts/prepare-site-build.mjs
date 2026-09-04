import { mkdir, writeFile } from 'node:fs/promises';

const workerSource = String.raw`function json(data, status = 200) {
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
      Authorization: \`Bearer \${token}\`,
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
  const cleaned = text
    .replace(/^\\s*\\`\\`\\`(?:json)?/i, '')
    .replace(/\\`\\`\\`\\s*$/, '')
    .trim();

  return JSON.parse(cleaned);
}

function stringArray(value, limit = 16) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function cleanResult(value, fallback) {
  return {
    title:
      typeof value?.title === 'string' && value.title.trim()
        ? value.title.trim().slice(0, 120)
        : fallback.title,
    summary:
      typeof value?.summary === 'string' && value.summary.trim()
        ? value.summary.trim().slice(0, 700)
        : fallback.summary,
    overview:
      typeof value?.overview === 'string' && value.overview.trim()
        ? value.overview.trim().slice(0, 2600)
        : fallback.overview,
    technologies: stringArray(value?.technologies, 20),
    features: stringArray(value?.features, 14),
  };
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

  const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || 'gpt-5.6-luna',
      reasoning: { effort: 'low' },
      instructions: [
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
      input: JSON.stringify(prompt),
      max_output_tokens: 2200,
    }),
  });

  if (!openaiResponse.ok) {
    const detail = await openaiResponse.text();
    return json(
      {
        error: 'OpenAI request failed.',
        status: openaiResponse.status,
        detail: detail.slice(0, 1000),
      },
      502,
    );
  }

  const responseData = await openaiResponse.json();
  const outputText = extractOutputText(responseData);

  if (!outputText) {
    return json({ error: 'OpenAI returned no text output.' }, 502);
  }

  try {
    const parsed = parseJsonText(outputText);
    return json(cleanResult(parsed, fallback));
  } catch {
    return json({ error: 'OpenAI returned invalid JSON.' }, 502);
  }
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
