const missingApiBaseUrlMessage =
  'NEXT_PUBLIC_API_BASE_URL is not configured for the web app.';

function getApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!value) {
    throw new Error(missingApiBaseUrlMessage);
  }

  return value;
}

async function parseError(res: Response) {
  try {
    const data = await res.json();
    return data?.message || `Request failed: ${res.status}`;
  } catch {
    return `Request failed: ${res.status}`;
  }
}

export async function register(data: {
  email: string;
  password: string;
  name?: string;
}) {
  const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json();
}

export async function login(data: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json();
}

export async function me(token: string) {
  const res = await fetch(`${getApiBaseUrl()}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json();
}
