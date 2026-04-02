import { notFound } from 'next/navigation';
import { StatePanel } from '@/src/components/state-panel';
import { TarotCardVisual } from '@/src/components/tarot-card-visual';
import { ApiError, getCard } from '@/src/lib/tarot-api';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';

export const dynamic = 'force-dynamic';

type CardDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getSuitLabel(
  suit: string | null,
  locale: 'en' | 'zh',
) {
  if (!suit) {
    return '';
  }

  const labels = {
    en: {
      cups: 'Cups',
      swords: 'Swords',
      wands: 'Wands',
      pentacles: 'Pentacles',
    },
    zh: {
      cups: '圣杯',
      swords: '宝剑',
      wands: '权杖',
      pentacles: '星币',
    },
  } as const;

  return labels[locale][suit as keyof (typeof labels)[typeof locale]] ?? suit;
}

export async function generateMetadata({ params }: CardDetailPageProps) {
  const { slug } = await params;

  return {
    title: slug.replace(/-/g, ' '),
  };
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const { slug } = await params;
  const result = await getCard(slug, locale)
    .then((card) => ({ card, error: null as null | unknown }))
    .catch((error: unknown) => ({ card: null, error }));

  if (result.error) {
    if (result.error instanceof ApiError && result.error.status === 404) {
      notFound();
    }

    return (
      <StatePanel
        tone="error"
        eyebrow={messages.cards.cardErrorEyebrow}
        title={messages.cards.cardErrorTitle}
        description={messages.cards.cardErrorDescription}
      />
    );
  }

  if (!result.card) {
    return null;
  }

  const card = result.card;

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)] md:p-8 lg:grid-cols-[0.8fr_1.2fr]">
        <TarotCardVisual
          locale={locale}
          name={card.name}
          imageUrl={card.imageUrl}
          arcana={card.arcana}
          suit={card.suit}
          className="max-w-md"
        />

        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {card.arcana === 'major'
              ? messages.cards.majorArcana
              : `${getSuitLabel(card.suit, locale)} ${messages.cards.suitSuffix}`}
          </p>
          <h1 className="mt-4 font-display text-5xl text-[var(--color-foreground)]">
            {card.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            {card.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {card.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--color-muted)]"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.8rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.cards.upright}
          </p>
          <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
            {card.uprightMeaning}
          </p>
        </article>

        <article className="rounded-[1.8rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.cards.reversed}
          </p>
          <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
            {card.reversedMeaning}
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[1.8rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.cards.emotionalMeaning}
          </p>
          <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
            {card.emotionalMeaning}
          </p>
        </article>

        <article className="rounded-[1.8rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.cards.relationshipMeaning}
          </p>
          <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
            {card.relationshipMeaning}
          </p>
        </article>

        <article className="rounded-[1.8rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.cards.careerMeaning}
          </p>
          <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
            {card.careerMeaning}
          </p>
        </article>
      </section>
    </div>
  );
}
