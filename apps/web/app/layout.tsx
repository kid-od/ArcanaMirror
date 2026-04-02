import type { Metadata } from 'next';
import './globals.css';
import { SiteFrame } from '@/src/components/site-frame';
import { LocaleProvider } from '@/src/i18n/locale-provider';
import { getRequestLocale } from '@/src/i18n/locale';
import { toDocumentLang } from '@/src/i18n/shared';

export const metadata: Metadata = {
  title: {
    default: 'Arcana Mirror',
    template: '%s | Arcana Mirror',
  },
  description:
    'Arcana Mirror is a reflective tarot experience with a ritual-like flow, calm symbolism, and emotionally supportive interpretation. Arcana Mirror 是一款带有仪式感流程与温和解读的反思式塔罗体验。',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={toDocumentLang(locale)} className="h-full antialiased">
      <body className="min-h-full">
        <LocaleProvider key={locale} initialLocale={locale}>
          <SiteFrame>{children}</SiteFrame>
        </LocaleProvider>
      </body>
    </html>
  );
}
