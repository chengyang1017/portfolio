import { readFile, writeFile } from 'node:fs/promises';

const workerPath = 'dist/server/index.js';
let source = await readFile(workerPath, 'utf8');

function replaceOnce(search, replacement, label) {
  const first = source.indexOf(search);
  if (first === -1) {
    throw new Error(`Unable to enable Hán-Nôm knowledge: ${label} was not found.`);
  }
  if (source.indexOf(search, first + search.length) !== -1) {
    throw new Error(`Unable to enable Hán-Nôm knowledge: ${label} matched more than once.`);
  }
  source = source.replace(search, replacement);
}

replaceOnce(
  'async function runOpenAI(env, instructions, input, maxOutputTokens) {',
  'async function runOpenAI(env, instructions, input, maxOutputTokens, tools = []) {',
  'runOpenAI signature',
);

replaceOnce(
  "      instructions,\n      input: JSON.stringify(input),\n      max_output_tokens: maxOutputTokens,",
  "      instructions,\n      input: JSON.stringify(input),\n      ...(tools.length > 0 ? { tools } : {}),\n      max_output_tokens: maxOutputTokens,",
  'Responses API request body',
);

replaceOnce(
  'async function translateProject(payload, env) {',
  `function hanNomFileSearchTools(env) {
  const vectorStoreId =
    typeof env.HAN_NOM_VECTOR_STORE_ID === 'string'
      ? env.HAN_NOM_VECTOR_STORE_ID.trim()
      : '';

  if (!vectorStoreId) return [];

  return [
    {
      type: 'file_search',
      vector_store_ids: [vectorStoreId],
    },
  ];
}

async function translateProject(payload, env) {`,
  'translateProject insertion point',
);

replaceOnce(
  "    'vi-Hani must represent the same Vietnamese content in Chữ Nôm / Hán-Nôm writing, not merely translate it into Chinese. Preserve Latin technical and brand terms when a reliable Nôm form is uncertain.',\n    'Keep technical meaning precise and keep all four translations semantically aligned with the English source.',",
  "    'vi-Hani must represent the same Vietnamese content in Chữ Nôm / Hán-Nôm writing, not merely translate it into Chinese. Preserve Latin technical and brand terms when a reliable Nôm form is uncertain.',\n    'For vi-Hani, use the vi-Latn version as the semantic Vietnamese source and consult the Hán-Nôm file_search knowledge base before choosing characters whenever that tool is available.',\n    'For vi-Hani, prefer exact word and phrase evidence, examples, usage notes, and source rules over isolated syllable matching.',\n    'For vi-Hani, use the source distinction between uppercase standard Hán-Việt readings and lowercase Nôm or non-standard readings when it helps character selection.',\n    'For vi-Hani, follow the source rules for transliteration characters, reduplicative words, proper nouns, and punctuation when relevant.',\n    'For vi-Hani, never invent a character from sound alone. If the knowledge base does not provide reliable evidence, keep the uncertain Vietnamese word or technical term in Latin script.',\n    'Keep technical meaning precise and keep all four translations semantically aligned with the English source.',",
  'translate-project vi-Hani instructions',
);

replaceOnce(
  "      { sourceProject: source, targetLocales },\n      16000,\n    );",
  "      { sourceProject: source, targetLocales },\n      16000,\n      hanNomFileSearchTools(env),\n    );",
  'translate-project runOpenAI call',
);

replaceOnce(
  "    'For vi-Hani, write Vietnamese in Chữ Nôm / Hán-Nôm rather than translating into Chinese; keep Latin technical names when uncertain.',\n    'Preserve URLs, repository slugs, code identifiers, framework names, database names, and project brands unless the user explicitly requests a rename.',",
  "    'For vi-Hani, write Vietnamese in Chữ Nôm / Hán-Nôm rather than translating into Chinese; keep Latin technical names when uncertain.',\n    'Whenever you create, fill, improve, or review vi-Hani content and file_search is available, you must consult the Hán-Nôm knowledge base before choosing characters.',\n    'For vi-Hani, use the corresponding vi-Latn Vietnamese meaning as the semantic source, prefer word and phrase evidence over isolated syllables, and use source examples and notes to resolve ambiguous readings.',\n    'For vi-Hani, never invent a character from sound alone; preserve uncertain Vietnamese or technical terms in Latin script when the knowledge base does not provide reliable evidence.',\n    'Do not use the Hán-Nôm knowledge base to rewrite non-vi-Hani locales.',\n    'Preserve URLs, repository slugs, code identifiers, framework names, database names, and project brands unless the user explicitly requests a rename.',",
  'portfolio-agent vi-Hani instructions',
);

replaceOnce(
  "      recentConversation: history,\n    }, 16000);",
  "      recentConversation: history,\n    }, 16000, hanNomFileSearchTools(env));",
  'portfolio-agent runOpenAI call',
);

await writeFile(workerPath, source);
console.log('Enabled Hán-Nôm file_search knowledge for vi-Hani translation and portfolio-agent flows.');
