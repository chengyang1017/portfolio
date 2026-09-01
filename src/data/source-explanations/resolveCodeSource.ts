import type {
  GitHubCodeSource,
  SourceCodeBlock,
} from './types';

export interface ResolvedCode {
  code: string;
  sourceUrl?: string;
  commitSha?: string;
}

const sourceFileCache = new Map<
  string,
  Promise<string>
>();

const commitShaCache = new Map<
  string,
  Promise<string>
>();

async function resolveCommitSha(
  repository: string,
  ref: string,
): Promise<string> {
  const cacheKey = `${repository}@${ref}`;

  const cached =
    commitShaCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const request = fetch(
    `https://api.github.com/repos/${repository}/commits/${ref}`,
    {
      headers: {
        Accept:
          'application/vnd.github+json',
      },
    },
  )
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Unable to resolve GitHub commit (${response.status})`,
        );
      }

      const data = (await response.json()) as {
        sha?: string;
      };

      if (!data.sha) {
        throw new Error(
          'GitHub commit SHA is missing',
        );
      }

      return data.sha;
    })
    .catch((error) => {
      commitShaCache.delete(cacheKey);
      throw error;
    });

  commitShaCache.set(
    cacheKey,
    request,
  );

  return request;
}

/**
 * 根据 SourceCodeBlock 的来源取得最终代码。
 *
 * inline:
 *   直接返回 portfolio 内保存的代码。
 *
 * github:
 *   从真实 GitHub 仓库读取文件，
 *   再通过 symbol / anchor 找到目标代码。
 */
export async function resolveCodeBlock(
  block: SourceCodeBlock,
): Promise<ResolvedCode> {
  if (block.source.type === 'inline') {
    return {
      code: block.source.code,
    };
  }

  return resolveGitHubSource(block.source);
}

async function resolveGitHubSource(
  source: GitHubCodeSource,
): Promise<ResolvedCode> {
  const ref = source.ref ?? 'main';

  const commitSha =
    await resolveCommitSha(
        source.repository,
        ref,
    );

  const rawUrl =
    `https://raw.githubusercontent.com/` +
    `${source.repository}/${ref}/${source.path}`;

  const sourceUrl =
    `https://github.com/` +
    `${source.repository}/blob/${commitSha}/${source.path}`;

  try {
    const sourceText =
      await loadGitHubSourceFile(rawUrl);

    let code = sourceText;

    if (source.symbol) {
      code = extractSymbol(
        code,
        source.symbol,
      );
    }

    if (
      source.startAnchor ||
      source.endAnchor
    ) {
      code = extractByAnchors(
        code,
        source.startAnchor,
        source.endAnchor,
      );
    }

    return {
      code,
      sourceUrl,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown source resolution error';

    const target = source.symbol
      ? `${source.path}#${source.symbol}`
      : source.path;

    throw new Error(
      `Unable to resolve ${target}: ${message}`,
    );
  }
}

/**
 * 根据 symbol 找函数 / 方法。
 *
 * 不依赖行号，所以前面增加空行、
 * import、注释，都不会影响定位。
 */
function extractSymbol(
  code: string,
  symbol: string,
): string {
  const symbolIndex =
    findSymbolDeclaration(code, symbol);

  if (symbolIndex === -1) {
    throw new Error(
      `Symbol "${symbol}" was not found.`,
    );
  }

  const openingBrace =
    findOpeningBrace(code, symbolIndex);

  if (openingBrace === -1) {
    throw new Error(
      `Unable to find opening brace for "${symbol}".`,
    );
  }

  const closingBrace =
    findMatchingBrace(code, openingBrace);

  if (closingBrace === -1) {
    throw new Error(
      `Unable to find closing brace for "${symbol}".`,
    );
  }

  /*
   * 从 symbol 所在行开头开始取，
   * 这样会把：
   *
   * Future<void> _publishPost() async {
   *
   * 整个函数声明一起显示出来。
   */
  const declarationStart =
    code.lastIndexOf('\n', symbolIndex) + 1;

  return code.slice(
    declarationStart,
    closingBrace + 1,
  );
}

/**
 * 找最可能是“声明”的 symbol，
 * 而不是普通函数调用。
 */
function findSymbolDeclaration(
  code: string,
  symbol: string,
): number {
  let searchFrom = 0;

  while (searchFrom < code.length) {
    const index = code.indexOf(
      symbol,
      searchFrom,
    );

    if (index === -1) {
      return -1;
    }

    const afterSymbol =
      code.slice(
        index + symbol.length,
        index + symbol.length + 1000,
      );

    const firstParen =
      afterSymbol.indexOf('(');

    if (firstParen !== -1) {
      const absoluteParen =
        index +
        symbol.length +
        firstParen;

      const closingParen =
        findMatchingParenthesis(
          code,
          absoluteParen,
        );

      if (closingParen !== -1) {
        const tail =
          code.slice(
            closingParen + 1,
            closingParen + 200,
          );

        /*
         * 声明后常见：
         *
         * {
         * async {
         * async* {
         * => ...
         *
         * 普通调用通常很快遇到 ;
         */
        const braceIndex =
          tail.indexOf('{');

        const semicolonIndex =
          tail.indexOf(';');

        if (
          braceIndex !== -1 &&
          (
            semicolonIndex === -1 ||
            braceIndex < semicolonIndex
          )
        ) {
          return index;
        }
      }
    }

    searchFrom =
      index + symbol.length;
  }

  return -1;
}

function findOpeningBrace(
  code: string,
  from: number,
): number {
  let quote:
    | "'"
    | '"'
    | '`'
    | null = null;

  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (
    let i = from;
    i < code.length;
    i++
  ) {
    const char = code[i];
    const next = code[i + 1];

    if (lineComment) {
      if (char === '\n') {
        lineComment = false;
      }

      continue;
    }

    if (blockComment) {
      if (
        char === '*' &&
        next === '/'
      ) {
        blockComment = false;
        i++;
      }

      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (
      char === '/' &&
      next === '/'
    ) {
      lineComment = true;
      i++;
      continue;
    }

    if (
      char === '/' &&
      next === '*'
    ) {
      blockComment = true;
      i++;
      continue;
    }

    if (
      char === "'" ||
      char === '"' ||
      char === '`'
    ) {
      quote = char;
      continue;
    }

    if (char === '{') {
      return i;
    }
  }

  return -1;
}

function findMatchingBrace(
  code: string,
  openingBrace: number,
): number {
  let depth = 0;

  let quote:
    | "'"
    | '"'
    | '`'
    | null = null;

  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (
    let i = openingBrace;
    i < code.length;
    i++
  ) {
    const char = code[i];
    const next = code[i + 1];

    if (lineComment) {
      if (char === '\n') {
        lineComment = false;
      }

      continue;
    }

    if (blockComment) {
      if (
        char === '*' &&
        next === '/'
      ) {
        blockComment = false;
        i++;
      }

      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (
      char === '/' &&
      next === '/'
    ) {
      lineComment = true;
      i++;
      continue;
    }

    if (
      char === '/' &&
      next === '*'
    ) {
      blockComment = true;
      i++;
      continue;
    }

    if (
      char === "'" ||
      char === '"' ||
      char === '`'
    ) {
      quote = char;
      continue;
    }

    if (char === '{') {
      depth++;
    }

    if (char === '}') {
      depth--;

      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

function findMatchingParenthesis(
  code: string,
  openingParen: number,
): number {
  let depth = 0;

  let quote:
    | "'"
    | '"'
    | '`'
    | null = null;

  let escaped = false;

  for (
    let i = openingParen;
    i < code.length;
    i++
  ) {
    const char = code[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (
      char === "'" ||
      char === '"' ||
      char === '`'
    ) {
      quote = char;
      continue;
    }

    if (char === '(') {
      depth++;
    }

    if (char === ')') {
      depth--;

      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * 在已经定位好的代码范围中，
 * 根据 anchor 进一步裁剪。
 *
 * anchor 使用“忽略多余空格”的行匹配，
 * 因此 formatter 改变缩进通常不会导致失效。
 */
function extractByAnchors(
  code: string,
  startAnchor?: string,
  endAnchor?: string,
): string {
  const lines = code.split('\n');

  let startIndex = 0;
  let endIndex = lines.length;

  if (startAnchor) {
    const normalized =
      normalizeWhitespace(startAnchor);

    const found =
      lines.findIndex((line) =>
        normalizeWhitespace(line)
          .includes(normalized),
      );

    if (found === -1) {
      throw new Error(
        `Start anchor "${startAnchor}" was not found.`,
      );
    }

    startIndex = found;
  }

  if (endAnchor) {
    const normalized =
      normalizeWhitespace(endAnchor);

    const found =
      lines.findIndex(
        (line, index) =>
          index >= startIndex &&
          normalizeWhitespace(line)
            .includes(normalized),
      );

    if (found === -1) {
      throw new Error(
        `End anchor "${endAnchor}" was not found.`,
      );
    }

    endIndex = found;
  }

  return lines
    .slice(startIndex, endIndex)
    .join('\n');
}

function normalizeWhitespace(
  value: string,
): string {
  return value
    .replace(/\s+/g, ' ')
    .trim();
}

async function loadGitHubSourceFile(
  rawUrl: string,
): Promise<string> {
  const cached = sourceFileCache.get(rawUrl);

  if (cached) {
    return cached;
  }

  const controller = new AbortController();

  const timeout = window.setTimeout(() => {
    controller.abort();
  }, 10000);

  const request = fetch(rawUrl, {
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `GitHub source request failed (${response.status})`,
        );
      }

      return response.text();
    })
    .catch((error) => {
      sourceFileCache.delete(rawUrl);

      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        throw new Error(
          'GitHub source request timed out',
        );
      }

      throw error;
    })
    .finally(() => {
      window.clearTimeout(timeout);
    });

  sourceFileCache.set(
    rawUrl,
    request,
  );

  return request;
}