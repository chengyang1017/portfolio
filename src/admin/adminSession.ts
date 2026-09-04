export type AdminSessionInfo = {
  repository: string;
  defaultBranch: string;
};

async function readJson(response: Response) {
  return (await response.json().catch(() => null)) as
    | {
        authenticated?: boolean;
        repository?: string;
        defaultBranch?: string;
        error?: string;
      }
    | null;
}

export async function getAdminSession(): Promise<AdminSessionInfo | null> {
  const response = await fetch('/api/admin/session', {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 401) return null;

  const payload = await readJson(response);
  if (!response.ok) {
    throw new Error(payload?.error || `Unable to restore admin session (${response.status}).`);
  }

  if (!payload?.authenticated || !payload.repository || !payload.defaultBranch) {
    return null;
  }

  return {
    repository: payload.repository,
    defaultBranch: payload.defaultBranch,
  };
}

export function startGitHubAdminLogin() {
  window.location.assign('/api/admin/github/start');
}

export async function logoutAdmin() {
  await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch(() => undefined);
}
