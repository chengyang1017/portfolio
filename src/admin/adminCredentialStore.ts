const ADMIN_GITHUB_TOKEN_KEY = 'portfolio-admin-github-token';

export function readSavedAdminToken() {
  if (typeof window === 'undefined') return '';

  try {
    return window.localStorage.getItem(ADMIN_GITHUB_TOKEN_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveAdminToken(token: string) {
  if (typeof window === 'undefined') return;

  const value = token.trim();
  if (!value) return;

  try {
    window.localStorage.setItem(ADMIN_GITHUB_TOKEN_KEY, value);
  } catch {
    // Storage can be unavailable in hardened/private browser contexts.
  }
}

export function forgetAdminToken() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(ADMIN_GITHUB_TOKEN_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}
