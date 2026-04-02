import Link from 'next/link';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';

export async function SiteFooter() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const footerLinks = [
    { href: '/about', label: messages.footer.links.about },
    { href: '/about#privacy', label: messages.footer.links.privacy },
    { href: '/about#disclaimer', label: messages.footer.links.disclaimer },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#090d18]/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-10 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl text-[var(--color-foreground)]">
              Arcana Mirror
            </p>
            <p className="max-w-xl text-sm leading-6 text-[var(--color-muted)]">
              {messages.footer.description}
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[var(--color-foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="text-xs leading-5 text-[var(--color-muted)]">
          {messages.footer.note}
        </p>
      </div>
    </footer>
  );
}
