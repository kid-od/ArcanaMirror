'use client';

import { useState } from 'react';
import { useLocale } from '@/src/i18n/locale-provider';
import { login } from '@/src/lib/auth-api';

export default function LoginPage() {
  const { locale } = useLocale();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const data = await login(form);
      setResult(data.user);
      localStorage.setItem('accessToken', data.accessToken);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : locale === 'zh'
            ? '登录失败'
            : 'Login failed',
      );
    }
  }

  return (
    <main className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">
        {locale === 'zh' ? '登录' : 'Login'}
      </h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder={locale === 'zh' ? '邮箱' : 'email'}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder={locale === 'zh' ? '密码' : 'password'}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="border px-4 py-2" type="submit">
          {locale === 'zh' ? '登录' : 'Login'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && <pre className="mt-4">{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}
