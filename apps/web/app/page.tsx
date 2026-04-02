import Link from 'next/link';
import { SectionHeading } from '@/src/components/section-heading';
import { StatePanel } from '@/src/components/state-panel';
import { TarotCardVisual } from '@/src/components/tarot-card-visual';
import { getCards } from '@/src/lib/tarot-api';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';

export const dynamic = 'force-dynamic';

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();

  return Math.floor(diff / 86_400_000);
}

export default async function HomePage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const cardsResponse = await getCards(locale).catch(() => null);
  const dailyCard =
    cardsResponse && cardsResponse.items.length > 0
      ? cardsResponse.items[getDayOfYear(new Date()) % cardsResponse.items.length]
      : null;

  return (
    <div className="space-y-16">
      <section className="grid gap-8 rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(15,19,37,0.94),_rgba(26,31,54,0.88))] px-6 py-8 shadow-[0_30px_120px_rgba(0,0,0,0.28)] md:px-10 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.home.heroEyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-6xl leading-[0.92] text-[var(--color-foreground)] md:text-7xl">
            {messages.home.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
            {messages.home.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/draw/single"
              className="inline-flex rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[#1a1524] transition-transform hover:-translate-y-0.5"
            >
              {messages.home.startReading}
            </Link>
            <Link
              href="/cards"
              className="inline-flex rounded-full border border-white/10 px-6 py-3 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
            >
              {messages.home.exploreCards}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
              {messages.home.singleEyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl text-[var(--color-foreground)]">
              {messages.home.singleTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {messages.home.singleDescription}
            </p>
          </article>

          <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
              {messages.home.threeEyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl text-[var(--color-foreground)]">
              {messages.home.threeTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {messages.home.threeDescription}
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow={messages.home.chooseEyebrow}
          title={messages.home.chooseTitle}
          description={messages.home.chooseDescription}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
              {messages.home.fastEyebrow}
            </p>
            <h3 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
              {messages.home.fastTitle}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {messages.home.fastDescription}
            </p>
            <Link
              href="/draw/single"
              className="mt-8 inline-flex rounded-full border border-[var(--color-accent)]/35 px-5 py-3 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
            >
              {messages.home.drawOne}
            </Link>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
              {messages.home.arcEyebrow}
            </p>
            <h3 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
              {messages.home.arcTitle}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              {messages.home.arcDescription}
            </p>
            <Link
              href="/draw/three"
              className="mt-8 inline-flex rounded-full border border-[var(--color-accent)]/35 px-5 py-3 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
            >
              {messages.home.drawThree}
            </Link>
          </article>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.home.dailyEyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
            {messages.home.dailyTitle}
          </h2>

          {dailyCard ? (
            <div className="mt-6 space-y-5">
              <TarotCardVisual
                locale={locale}
                name={dailyCard.name}
                imageUrl={dailyCard.imageUrl}
                arcana={dailyCard.arcana}
                suit={dailyCard.suit}
                className="max-w-sm"
              />
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                {dailyCard.description}
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <StatePanel
                eyebrow={messages.home.dailyUnavailableEyebrow}
                title={messages.home.dailyUnavailableTitle}
                description={messages.home.dailyUnavailableDescription}
              />
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.home.philosophyEyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
            {messages.home.philosophyTitle}
          </h2>
          <div className="mt-6 space-y-5 text-sm leading-7 text-[var(--color-muted)]">
            {messages.home.philosophyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link
            href="/about"
            className="mt-8 inline-flex rounded-full border border-[var(--color-accent)]/35 px-5 py-3 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
          >
            {messages.home.readGuidance}
          </Link>
        </div>
      </section>
    </div>
  );
}
