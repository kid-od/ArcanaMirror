'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/src/i18n/locale-provider';

export function SiteHeader() {
  const pathname = usePathname();
  const { locale, setLocale, isSwitching, messages } = useLocale();
  const links = [
    { href: '/', label: messages.header.links.home },
    { href: '/draw/single', label: messages.header.links.single },
    { href: '/draw/three', label: messages.header.links.three },
    { href: '/cards', label: messages.header.links.cards },
    { href: '/about', label: messages.header.links.about },
  ];

  return (
    <header className="site-header-glass sticky top-0 z-30 border-b border-white/10 bg-[#090d18]/88">
      <div className="mx-auto flex min-h-[5.25rem] w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-panel-strong)] text-sm tracking-[0.35em] text-[var(--color-accent)] transition-transform duration-500 group-hover:-translate-y-0.5">
            AM
          </span>
          <div>
            <p className="font-display text-2xl text-[var(--color-foreground)]">
              {messages.header.wordmark}
            </p>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
              {messages.header.tagline}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
            {links.map((link) => {
              const active =
                link.href === '/'
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-[var(--color-panel-strong)] text-[var(--color-foreground)]'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            disabled={isSwitching}
            aria-label={messages.header.localeLabel}
            className="inline-flex min-w-[4.5rem] justify-center rounded-full border border-[var(--color-accent)]/35 bg-white/5 px-4 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {messages.header.localeButton}
          </button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-5 pb-3 md:hidden lg:px-8">
        {links.map((link) => {
          const active =
            link.href === '/'
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? 'border-transparent bg-[var(--color-panel-strong)] text-[var(--color-foreground)]'
                  : 'border-white/10 text-[var(--color-muted)]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
