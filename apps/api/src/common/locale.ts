export type AppLocale = 'en' | 'zh';

export const DEFAULT_LOCALE: AppLocale = 'zh';

export function normalizeLocale(value?: string | null): AppLocale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  const normalized = value.toLowerCase();

  if (normalized === 'en' || normalized.startsWith('en-')) {
    return 'en';
  }

  if (normalized === 'zh' || normalized.startsWith('zh-')) {
    return 'zh';
  }

  return DEFAULT_LOCALE;
}
