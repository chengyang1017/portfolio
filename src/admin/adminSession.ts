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
    headers: {
      Accept: 'application/json',
    },
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

export async function loginAdmin(password: string): Promise<AdminSessionInfo> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  const payload = await readJson(response);
  if (!response.ok || !payload?.repository || !payload.defaultBranch) {
    throw new Error(payload?.error || `Admin login failed (${response.status}).`);
  }

  return {
    repository: payload.repository,
    defaultBranch: payload.defaultBranch,
  };
}

export async function logoutAdmin() {
  await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch(() => undefined);

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem('portfolio-admin-github-token');
    } catch {
      // Ignore cleanup failures in hardened browser contexts.
    }
  }
}
