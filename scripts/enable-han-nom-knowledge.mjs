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
  "async function runOpenAI(env, instructions, input, maxOutputTokens, tools = [], modelOverride = '', reasoningEffort = 'low') {",
  'runOpenAI signature',
);

replaceOnce(
  "      model: env.OPENAI_MODEL || 'gpt-5-mini',\n      reasoning: { effort: 'low' },\n      instructions,\n      input: JSON.stringify(input),\n      max_output_tokens: maxOutputTokens,",
  "      model: modelOverride || env.OPENAI_MODEL || 'gpt-5-mini',\n      reasoning: { effort: reasoningEffort },\n      instructions,\n      input: JSON.stringify(input),\n      ...(tools.length > 0 ? { tools } : {}),\n      max_output_tokens: maxOutputTokens,",
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

function hanNomCollectText(value, output = []) {
  if (typeof value === 'string') {
    output.push(value);
    return output;
  }
  if (Array.isArray(value)) {
    for (const item of value) hanNomCollectText(item, output);
    return output;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) hanNomCollectText(item, output);
  }
  return output;
}

function hanNomScriptStats(value) {
  const text = hanNomCollectText(value).join(' ');
  let han = 0;
  let latin = 0;

  for (const character of text) {
    const codePoint = character.codePointAt(0);
    if (
      (codePoint >= 0x3400 && codePoint <= 0x4dbf) ||
      (codePoint >= 0x4e00 && codePoint <= 0x9fff) ||
      (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
      (codePoint >= 0x20000 && codePoint <= 0x323af)
    ) {
      han += 1;
    } else if (/[A-Za-zÀ-ỹĐđ]/.test(character)) {
      latin += 1;
    }
  }

  return { han, latin };
}

function hanNomNeedsRetry(value) {
  const { han, latin } = hanNomScriptStats(value);
  if (latin <= 80) return false;
  if (han < 40) return true;
  return latin > han * 0.8;
}

const HAN_NOM_TRANSLATION_FIELDS = [
  'title',
  'shortTitle',
  'summary',
  'overview',
  'features',
  'challenges',
  'architecture',
  'gallery',
];

function hanNomProjectInstructions(isRetry = false) {
  const rules = [
    'You are a dedicated Vietnamese Quốc Ngữ to Chữ Nôm / Hán-Nôm conversion agent.',
    'The input is already natural Vietnamese in modern Latin orthography. Preserve its Vietnamese grammar, wording, and meaning; change the writing system, not the language.',
    'Return JSON only with exactly these keys: title, shortTitle, summary, overview, features, challenges, architecture, gallery.',
    'Preserve the exact array lengths, order, and nested object structure of the input.',
    'You have a Hán-Nôm knowledge base through file_search. Consult it before choosing characters and use it as the primary authority for standard spellings, readings, examples, and usage rules.',
    'For ordinary Vietnamese lexical words, Latin Quốc Ngữ is NOT an acceptable fallback. Write ordinary Vietnamese vocabulary in Hán-Nôm.',
    'Latin script is allowed only for protected product or project brands, framework and library names, APIs, database names, code identifiers, URLs, repository slugs, and genuinely foreign names that do not have a reliable form in the knowledge base.',
    'Do not treat normal Vietnamese words as technical terms merely because they appear in a software portfolio.',
    'Prefer exact word and phrase evidence over isolated syllable matching. Use examples and semantic context to resolve readings that have multiple candidate characters.',
    'Use the source distinction between uppercase standard Hán-Việt readings and lowercase Nôm or non-standard Hán-Việt readings when relevant.',
    'Follow the source rules for transliteration characters, reduplicative words, proper nouns, and punctuation when relevant.',
    'Do not translate the text into Chinese. The result must remain Vietnamese written with Chữ Nôm / Hán-Nôm.',
    'Do not invent arbitrary characters from sound alone. Search the knowledge base for attested or standardized forms and use its examples to disambiguate.',
    'Keep protected Latin technical names exactly as written in the input.',
  ];

  if (isRetry) {
    rules.push(
      'The previous draft contained far too much Quốc Ngữ. Rewrite it more completely: every remaining Latin Vietnamese word that is not a protected brand, code, API, framework, database, URL, repository slug, or genuinely unsupported foreign name must be converted to Hán-Nôm.',
      'Do not return mixed Vietnamese prose where ordinary grammar words, verbs, nouns, adjectives, prepositions, or connectors remain in Latin script.',
    );
  }

  return rules.join(' ');
}

async function convertProjectToHanNom(env, viLatnProject) {
  const tools = hanNomFileSearchTools(env);
  if (tools.length === 0) {
    throw new Error('HAN_NOM_VECTOR_STORE_ID is not configured for vi-Hani conversion.');
  }

  const model =
    typeof env.HAN_NOM_MODEL === 'string' && env.HAN_NOM_MODEL.trim()
      ? env.HAN_NOM_MODEL.trim()
      : 'gpt-5.6-sol';

  const first = await runOpenAI(
    env,
    hanNomProjectInstructions(false),
    { viLatnProject },
    16000,
    tools,
    model,
    'medium',
  );
  const firstCleaned = cleanProjectTranslation(first, viLatnProject);

  if (!hanNomNeedsRetry(firstCleaned)) return firstCleaned;

  const second = await runOpenAI(
    env,
    hanNomProjectInstructions(true),
    { viLatnProject, previousDraft: firstCleaned },
    16000,
    tools,
    model,
    'medium',
  );

  return cleanProjectTranslation(second, viLatnProject);
}

function hanNomPatchFields(fullTranslation, requestedPatch) {
  const requested = HAN_NOM_TRANSLATION_FIELDS.filter((field) =>
    Object.prototype.hasOwnProperty.call(requestedPatch || {}, field)
  );
  const fields = requested.length > 0 ? requested : HAN_NOM_TRANSLATION_FIELDS;
  const patch = {};
  for (const field of fields) patch[field] = fullTranslation[field];
  return patch;
}

async function refineAgentHanNomPatches(env, patches, projects, translations) {
  if (!Array.isArray(patches) || patches.length === 0) return patches;
  if (hanNomFileSearchTools(env).length === 0) return patches;

  const viLatnPatchBySlug = new Map(
    patches
      .filter((item) => item?.locale === 'vi-Latn' && typeof item?.slug === 'string')
      .map((item) => [item.slug, item.patch || {}])
  );

  const result = patches.map((item) => ({ ...item }));
  const indexes = result
    .map((item, index) => (item?.locale === 'vi-Hani' ? index : -1))
    .filter((index) => index >= 0);

  for (let offset = 0; offset < indexes.length; offset += 3) {
    const batch = indexes.slice(offset, offset + 3);
    await Promise.all(
      batch.map(async (index) => {
        const item = result[index];
        const project = projects.find((candidate) => candidate?.slug === item.slug);
        if (!project) return;

        const existingLatin = translations?.[item.slug]?.['vi-Latn'];
        const baseLatin = cleanProjectTranslation(existingLatin || project, project);
        const proposedLatin = viLatnPatchBySlug.get(item.slug) || {};
        const viLatnProject = cleanProjectTranslation(
          { ...baseLatin, ...proposedLatin },
          baseLatin,
        );
        const fullHanNom = await convertProjectToHanNom(env, viLatnProject);
        result[index] = {
          ...item,
          patch: hanNomPatchFields(fullHanNom, item.patch),
        };
      }),
    );
  }

  return result;
}

async function translateProject(payload, env) {`,
  'translateProject insertion point',
);

replaceOnce(
  "  const targetLocales = ['zh-CN', 'zh-TW', 'vi-Latn', 'vi-Hani'];",
  "  const targetLocales = ['zh-CN', 'zh-TW', 'vi-Latn'];",
  'translate-project first-pass locales',
);

replaceOnce(
  "    'Return JSON only. The top-level object must have exactly four keys: zh-CN, zh-TW, vi-Latn, vi-Hani.',",
  "    'Return JSON only. The top-level object must have exactly three keys: zh-CN, zh-TW, vi-Latn.',",
  'translate-project JSON keys instruction',
);

replaceOnce(
  "    'vi-Latn must be natural Vietnamese written in modern Latin orthography.',\n    'vi-Hani must represent the same Vietnamese content in Chữ Nôm / Hán-Nôm writing, not merely translate it into Chinese. Preserve Latin technical and brand terms when a reliable Nôm form is uncertain.',\n    'Keep technical meaning precise and keep all four translations semantically aligned with the English source.',",
  "    'vi-Latn must be natural Vietnamese written in modern Latin orthography.',\n    'Keep technical meaning precise and keep all three translations semantically aligned with the English source.',",
  'translate-project first-pass locale instructions',
);

replaceOnce(
  `    const result = {};
    for (const locale of targetLocales) {
      result[locale] = cleanProjectTranslation(parsed?.[locale], source);
    }

    return json(result);`,
  `    const result = {};
    for (const locale of targetLocales) {
      result[locale] = cleanProjectTranslation(parsed?.[locale], source);
    }

    result['vi-Hani'] = await convertProjectToHanNom(env, result['vi-Latn']);

    return json(result);`,
  'translate-project dedicated vi-Hani pass',
);

replaceOnce(
  "    'For vi-Hani, write Vietnamese in Chữ Nôm / Hán-Nôm rather than translating into Chinese; keep Latin technical names when uncertain.',\n    'Preserve URLs, repository slugs, code identifiers, framework names, database names, and project brands unless the user explicitly requests a rename.',",
  "    'For vi-Hani, propose the same Vietnamese meaning in Chữ Nôm / Hán-Nôm rather than Chinese. A dedicated knowledge-grounded converter will validate and rewrite every vi-Hani patch after this planning step.',\n    'For ordinary Vietnamese words in vi-Hani, do not intentionally preserve Quốc Ngữ; only protected brands, technical identifiers, URLs, repository slugs, framework names, database names, APIs, and genuinely foreign names may remain Latin.',\n    'Preserve URLs, repository slugs, code identifiers, framework names, database names, and project brands unless the user explicitly requests a rename.',",
  'portfolio-agent vi-Hani planning instructions',
);

replaceOnce(
  `      recentConversation: history,
    }, 16000);

    const projectSlugs`,
  `      recentConversation: history,
    }, 16000);

    if (Array.isArray(parsed?.translationPatches)) {
      parsed.translationPatches = await refineAgentHanNomPatches(
        env,
        parsed.translationPatches,
        projects,
        translations,
      );
    }

    const projectSlugs`,
  'portfolio-agent dedicated vi-Hani refinement',
);

await writeFile(workerPath, source);
console.log('Enabled dedicated, knowledge-grounded Hán-Nôm conversion with Latin-coverage retry.');
