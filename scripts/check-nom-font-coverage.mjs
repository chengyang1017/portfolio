import { readFile } from 'node:fs/promises';

const FONT_URL = 'https://cdn.jsdelivr.net/gh/TKYKmori/Gothic-Nguyen@ece1ab0df64ffd5f3001214b274c30e69140436a/Gothic%20Nguyen%20Regular.ttf';

const SOURCE_REGIONS = [
  {
    path: 'src/i18n/translations.ts',
    regions: [['const vietnameseNom', 'export const translations']],
  },
  {
    path: 'src/i18n/projectDetailTranslations.ts',
    regions: [
      ['const glyphoraNom', 'export function glyphoraEcosystemCopy'],
      ["if (language === 'vi-Hani') {", "if (language === 'vi-Latn')"],
      ['const vietnameseNomUi', 'export function projectDetailUi'],
    ],
  },
  {
    path: 'src/components/FeatureShowcase.tsx',
    regions: [['const nomCopy', 'const copy']],
  },
];

function sliceRegion(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error(`Missing start marker: ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (end === -1) throw new Error(`Missing end marker: ${endMarker}`);
  return source.slice(start, end);
}

function extractStringLiterals(source) {
  const values = [];
  const pattern = /(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  let match;
  while ((match = pattern.exec(source))) {
    values.push(match[2].replace(/\\(['"`\\])/g, '$1'));
  }
  return values;
}

function collectHanCharacters(strings) {
  const contexts = new Map();
  for (const value of strings) {
    for (const character of value) {
      if (!/\p{Script=Han}/u.test(character)) continue;
      const codePoint = character.codePointAt(0);
      if (!contexts.has(codePoint)) contexts.set(codePoint, new Set());
      contexts.get(codePoint).add(value);
    }
  }
  return contexts;
}

function readTag(buffer, offset) {
  return buffer.toString('ascii', offset, offset + 4);
}

function tableDirectory(buffer) {
  const numTables = buffer.readUInt16BE(4);
  const tables = new Map();
  for (let i = 0; i < numTables; i += 1) {
    const record = 12 + i * 16;
    const tag = readTag(buffer, record);
    tables.set(tag, {
      offset: buffer.readUInt32BE(record + 8),
      length: buffer.readUInt32BE(record + 12),
    });
  }
  return tables;
}

function addFormat4Coverage(buffer, offset, coverage) {
  const segCount = buffer.readUInt16BE(offset + 6) / 2;
  const endCodeOffset = offset + 14;
  const startCodeOffset = endCodeOffset + segCount * 2 + 2;
  const idDeltaOffset = startCodeOffset + segCount * 2;
  const idRangeOffsetOffset = idDeltaOffset + segCount * 2;

  for (let i = 0; i < segCount; i += 1) {
    const end = buffer.readUInt16BE(endCodeOffset + i * 2);
    const start = buffer.readUInt16BE(startCodeOffset + i * 2);
    const delta = buffer.readInt16BE(idDeltaOffset + i * 2);
    const rangeOffset = buffer.readUInt16BE(idRangeOffsetOffset + i * 2);
    if (start === 0xffff && end === 0xffff) continue;

    for (let codePoint = start; codePoint <= end; codePoint += 1) {
      let glyphId = 0;
      if (rangeOffset === 0) {
        glyphId = (codePoint + delta) & 0xffff;
      } else {
        const rangePosition = idRangeOffsetOffset + i * 2;
        const glyphOffset = rangePosition + rangeOffset + (codePoint - start) * 2;
        if (glyphOffset + 2 <= buffer.length) {
          glyphId = buffer.readUInt16BE(glyphOffset);
          if (glyphId !== 0) glyphId = (glyphId + delta) & 0xffff;
        }
      }
      if (glyphId !== 0) coverage.add(codePoint);
    }
  }
}

function addFormat12Coverage(buffer, offset, coverage) {
  const groups = buffer.readUInt32BE(offset + 12);
  let position = offset + 16;
  for (let i = 0; i < groups; i += 1) {
    const start = buffer.readUInt32BE(position);
    const end = buffer.readUInt32BE(position + 4);
    const startGlyph = buffer.readUInt32BE(position + 8);
    for (let codePoint = start; codePoint <= end; codePoint += 1) {
      if (startGlyph + (codePoint - start) !== 0) coverage.add(codePoint);
    }
    position += 12;
  }
}

function parseCmapCoverage(buffer) {
  const tables = tableDirectory(buffer);
  const cmap = tables.get('cmap');
  if (!cmap) throw new Error('Font has no cmap table');

  const coverage = new Set();
  const base = cmap.offset;
  const subtableCount = buffer.readUInt16BE(base + 2);
  const seenOffsets = new Set();

  for (let i = 0; i < subtableCount; i += 1) {
    const record = base + 4 + i * 8;
    const relativeOffset = buffer.readUInt32BE(record + 4);
    if (seenOffsets.has(relativeOffset)) continue;
    seenOffsets.add(relativeOffset);

    const offset = base + relativeOffset;
    const format = buffer.readUInt16BE(offset);
    if (format === 4) addFormat4Coverage(buffer, offset, coverage);
    if (format === 12) addFormat12Coverage(buffer, offset, coverage);
  }

  return coverage;
}

function codePointLabel(codePoint) {
  return `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
}

async function main() {
  const strings = [];
  for (const source of SOURCE_REGIONS) {
    const text = await readFile(source.path, 'utf8');
    for (const [start, end] of source.regions) {
      strings.push(...extractStringLiterals(sliceRegion(text, start, end)));
    }
  }

  const contexts = collectHanCharacters(strings);
  const response = await fetch(FONT_URL);
  if (!response.ok) throw new Error(`Font download failed: ${response.status} ${response.statusText}`);
  const fontBuffer = Buffer.from(await response.arrayBuffer());
  const coverage = parseCmapCoverage(fontBuffer);

  const used = [...contexts.keys()].sort((a, b) => a - b);
  const missing = used.filter((codePoint) => !coverage.has(codePoint));

  console.log(`Gothic Nguyen font: ${FONT_URL}`);
  console.log(`Unique Han characters used in vi-Hani copy: ${used.length}`);
  console.log(`Covered by Gothic Nguyen: ${used.length - missing.length}`);
  console.log(`Missing / fallback characters: ${missing.length}`);

  if (missing.length === 0) {
    console.log('No missing Han characters detected.');
    return;
  }

  console.log('\nMissing characters:');
  for (const codePoint of missing) {
    const character = String.fromCodePoint(codePoint);
    const examples = [...contexts.get(codePoint)].slice(0, 3);
    console.log(`- ${character} ${codePointLabel(codePoint)}`);
    for (const example of examples) console.log(`  ${example}`);
  }

  console.log('\nThese characters will fall back to another installed font in the browser unless the webfont stack supplies a matching glyph.');
}

await main();
