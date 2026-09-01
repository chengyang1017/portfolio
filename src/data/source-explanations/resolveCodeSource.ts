import type {
  GitHubCodeSource,
  SourceCodeBlock,
} from './types';

export interface ResolvedCode {
  code: string;
  sourceUrl?: string;
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
  // 旧格式：
  // {
  //   code: `...`,
  //   filePath: '...',
  // }
  if (typeof block.code === 'string') {
    return {
        code: block.code,
    };
  }

  // 新格式中的 inline
  if (block.source.type === 'inline') {
    return {
      code: block.source.code,
    };
  }

  // 新格式中的 GitHub 动态代码
  return resolveGitHubSource(block.source);
}

async function resolveGitHubSource(
  source: GitHubCodeSource,
): Promise<ResolvedCode> {
  const ref = source.ref ?? 'main';

  const rawUrl =
    `https://raw.githubusercontent.com/` +
    `${source.repository}/${ref}/${source.path}`;

  const response = await fetch(rawUrl);

  if (!response.ok) {
    throw new Error(
      `Unable to load source file: ${response.status} ${response.statusText}`,
    );
  }

  const fileCode = await response.text();

  let selectedCode = fileCode;

  /*
   * 如果指定 symbol，
   * 先把范围缩小到这个函数 / 方法。
   */
  if (source.symbol) {
    selectedCode = extractSymbol(
      fileCode,
      source.symbol,
    );
  }

  /*
   * 如果还有 anchor，
   * 再在 symbol 范围内进一步截取。
   */
  if (
    source.startAnchor ||
    source.endAnchor
  ) {
    selectedCode = extractByAnchors(
      selectedCode,
      source.startAnchor,
      source.endAnchor,
    );
  }

  return {
    code: selectedCode.trim(),
    sourceUrl:
      `https://github.com/` +
      `${source.repository}/blob/${ref}/${source.path}`,
  };
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
  let endIndex = lines.length - 1;

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
    .slice(startIndex, endIndex + 1)
    .join('\n');
}

function normalizeWhitespace(
  value: string,
): string {
  return value
    .replace(/\s+/g, ' ')
    .trim();
}