from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'Missing patch target: {label}')
    return text.replace(old, new, 1)


admin = Path('src/pages/AdminPage.tsx')
text = admin.read_text(encoding='utf-8')
if 'readSavedAdminToken' not in text:
    text = replace_once(
        text,
        "import { useMemo, useState } from 'react';",
        "import { useEffect, useMemo, useState } from 'react';",
        'AdminPage React import',
    )
    text = replace_once(
        text,
        "} from '../admin/githubPortfolio';\n",
        "} from '../admin/githubPortfolio';\nimport {\n  forgetAdminToken,\n  readSavedAdminToken,\n  saveAdminToken,\n} from '../admin/adminCredentialStore';\n",
        'AdminPage credential import',
    )
    text = replace_once(
        text,
        "  const [token, setToken] = useState('');",
        "  const [token, setToken] = useState(readSavedAdminToken);",
        'AdminPage token state',
    )
    old_unlock = """  async function handleUnlock() {
    setAccessState('checking');
    setAccessMessage('Checking write access to chengyang1017/portfolio…');

    try {
      const result = await verifyPortfolioAccess(token);
      setAccessInfo(result);
      setBranch(result.defaultBranch || 'main');
      setAccessState('granted');
      setAccessMessage('');
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : 'Unable to verify GitHub access.');
    }
  }
"""
    new_unlock = """  async function unlockWithToken(candidateToken: string, persist = true) {
    const cleanToken = candidateToken.trim();
    if (!cleanToken) return;

    setAccessState('checking');
    setAccessMessage('Checking write access to chengyang1017/portfolio…');

    try {
      const result = await verifyPortfolioAccess(cleanToken);
      setToken(cleanToken);
      if (persist) saveAdminToken(cleanToken);
      setAccessInfo(result);
      setBranch(result.defaultBranch || 'main');
      setAccessState('granted');
      setAccessMessage('');
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : 'Unable to verify GitHub access.');
    }
  }

  async function handleUnlock() {
    await unlockWithToken(token);
  }

  useEffect(() => {
    const savedToken = readSavedAdminToken();
    if (!savedToken) return;
    void unlockWithToken(savedToken, false);
  }, []);
"""
    text = replace_once(text, old_unlock, new_unlock, 'AdminPage unlock function')
    text = replace_once(
        text,
        "  function lockAdmin() {\n    setToken('');",
        "  function lockAdmin() {\n    forgetAdminToken();\n    setToken('');",
        'AdminPage lock function',
    )
    text = replace_once(
        text,
        "              Unlock this dashboard with a fine-grained GitHub token that can write to\n              chengyang1017/portfolio. The token stays in memory only and is cleared when you lock\n              the dashboard or reload the page.",
        "              Unlock this dashboard with a fine-grained GitHub token that can write to\n              chengyang1017/portfolio. After successful verification, the token is remembered only\n              in this browser so reloads and future visits can unlock automatically. Use Lock admin\n              to sign out and forget the saved token.",
        'AdminPage access copy',
    )
    admin.write_text(text, encoding='utf-8')

translations = Path('src/pages/AdminTranslationsPage.tsx')
text = translations.read_text(encoding='utf-8')
if 'readSavedAdminToken' not in text:
    text = replace_once(
        text,
        "import { useMemo, useState } from 'react';",
        "import { useEffect, useMemo, useState } from 'react';",
        'AdminTranslations React import',
    )
    text = replace_once(
        text,
        "import { verifyPortfolioAccess } from '../admin/githubPortfolio';\n",
        "import { verifyPortfolioAccess } from '../admin/githubPortfolio';\nimport {\n  forgetAdminToken,\n  readSavedAdminToken,\n  saveAdminToken,\n} from '../admin/adminCredentialStore';\n",
        'AdminTranslations credential import',
    )
    text = replace_once(
        text,
        "  const [tokenInput, setTokenInput] = useState('');",
        "  const [tokenInput, setTokenInput] = useState(readSavedAdminToken);",
        'AdminTranslations token input state',
    )
    old_unlock = """  async function unlock() {
    setAccessState('checking');
    setAccessMessage('Checking GitHub write access…');

    try {
      const access = await verifyPortfolioAccess(tokenInput.trim());
      setToken(tokenInput.trim());
      setBranch(access.defaultBranch || 'main');
      setTokenInput('');
      setAccessState('ready');
      setAccessMessage(`Verified ${access.repository} · ${access.defaultBranch}`);
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : 'Unable to verify GitHub access.');
    }
  }
"""
    new_unlock = """  async function unlockWithToken(candidateToken: string, persist = true) {
    const cleanToken = candidateToken.trim();
    if (!cleanToken) return;

    setAccessState('checking');
    setAccessMessage('Checking GitHub write access…');

    try {
      const access = await verifyPortfolioAccess(cleanToken);
      setToken(cleanToken);
      if (persist) saveAdminToken(cleanToken);
      setBranch(access.defaultBranch || 'main');
      setTokenInput('');
      setAccessState('ready');
      setAccessMessage(`Verified ${access.repository} · ${access.defaultBranch}`);
    } catch (error) {
      setAccessState('error');
      setAccessMessage(error instanceof Error ? error.message : 'Unable to verify GitHub access.');
    }
  }

  async function unlock() {
    await unlockWithToken(tokenInput);
  }

  useEffect(() => {
    const savedToken = readSavedAdminToken();
    if (!savedToken) return;
    void unlockWithToken(savedToken, false);
  }, []);
"""
    text = replace_once(text, old_unlock, new_unlock, 'AdminTranslations unlock function')
    text = replace_once(
        text,
        "  function lock() {\n    setToken('');",
        "  function lock() {\n    forgetAdminToken();\n    setToken('');",
        'AdminTranslations lock function',
    )
    text = replace_once(
        text,
        '            Use the same fine-grained GitHub token as the main admin. The token stays in memory only.',
        '            Use the same fine-grained GitHub token as the main admin. Once verified, it is remembered in this browser and reused automatically until you sign out.',
        'AdminTranslations access copy',
    )
    translations.write_text(text, encoding='utf-8')
