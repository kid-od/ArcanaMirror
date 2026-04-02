'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/src/i18n/locale-provider';
import { me } from '@/src/lib/auth-api';

export default function MePage() {
  const { locale } = useLocale();
  const [token] = useState(() =>
    typeof window === 'undefined'
      ? ''
      : localStorage.getItem('accessToken') ?? '',
  );
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState(() =>
    typeof window === 'undefined'
      ? ''
      : localStorage.getItem('accessToken')
        ? ''
        : locale === 'zh'
          ? '未登录'
          : 'Not signed in',
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    me(token)
      .then(setUser)
      .catch(() =>
        setError(locale === 'zh' ? '获取当前用户失败' : 'Failed to load current user'),
      );
  }, [locale, token]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {locale === 'zh' ? '我的账户' : 'My Account'}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </main>
  );
}
