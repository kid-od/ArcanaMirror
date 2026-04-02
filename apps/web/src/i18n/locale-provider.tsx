'use client';

import {
  createContext,
  ReactNode,
  startTransition,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  AppLocale,
  LOCALE_COOKIE_NAME,
  toDocumentLang,
} from './shared';
import { getMessages } from './messages';

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (nextLocale: AppLocale) => void;
  isSwitching: boolean;
  messages: ReturnType<typeof getMessages>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  initialLocale: AppLocale;
  children: ReactNode;
};

function persistLocale(nextLocale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.lang = toDocumentLang(nextLocale);
}

export function LocaleProvider({
  initialLocale,
  children,
}: LocaleProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);
  const [isSwitching, setIsSwitching] = useState(false);

  const value = useMemo<LocaleContextValue>(() => {
    return {
      locale,
      messages: getMessages(locale),
      isSwitching,
      setLocale: (nextLocale) => {
        if (nextLocale === locale) {
          return;
        }

        setLocaleState(nextLocale);
        persistLocale(nextLocale);
        setIsSwitching(true);

        startTransition(() => {
          router.refresh();
          setIsSwitching(false);
        });
      },
    };
  }, [isSwitching, locale, router]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }

  return context;
}
