from pathlib import Path
import re

# Remove obsolete browser/server GitHub write helpers from the client modules.
github = Path('src/admin/githubPortfolio.ts')
text = github.read_text(encoding='utf-8')
text, count = re.subn(
    r"\nexport async function verifyPortfolioAccess\(token: string\): Promise<PortfolioAccess> \{.*?\n\}\n\nexport async function analyzeRepository",
    "\nexport async function analyzeRepository",
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit('verifyPortfolioAccess removal failed')
text, count = re.subn(
    r"\nfunction encodeBase64\(value: string\) \{.*?\nexport async function publishPortfolioContent",
    "\nexport async function publishPortfolioContent",
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit('legacy GitHub file writer removal failed')
github.write_text(text, encoding='utf-8')

translations = Path('src/admin/projectTranslationManager.ts')
text = translations.read_text(encoding='utf-8')
text, count = re.subn(
    r"\nfunction encodeBase64\(value: string\) \{.*?\n\}\n\nfunction projectSource",
    "\nfunction projectSource",
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit('translation base64 helper removal failed')
text, count = re.subn(
    r"\nexport function serializeProjectTranslationCatalog\(.*?\nexport async function publishProjectTranslationCatalog",
    "\nexport async function publishProjectTranslationCatalog",
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit('translation GitHub writer removal failed')
translations.write_text(text, encoding='utf-8')

for filename in ['src/pages/AdminPage.tsx', 'src/pages/AdminTranslationsPage.tsx']:
    path = Path(filename)
    text = path.read_text(encoding='utf-8')
    text = text.replace('  verifyPortfolioAccess,\n', '')
    text = text.replace("import { verifyPortfolioAccess } from '../admin/githubPortfolio';\n", '')
    path.write_text(text, encoding='utf-8')

session = Path('src/admin/adminSession.ts')
text = session.read_text(encoding='utf-8')
text, count = re.subn(
    r"\n\n  if \(typeof window !== 'undefined'\) \{.*?\n  \}",
    '',
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit('legacy localStorage token cleanup removal failed')
session.write_text(text, encoding='utf-8')
