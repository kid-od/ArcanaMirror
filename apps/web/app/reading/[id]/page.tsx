import { StatePanel } from '@/src/components/state-panel';
import { TarotCardVisual } from '@/src/components/tarot-card-visual';
import { ApiError, getReading, ThreeCardInterpretation } from '@/src/lib/tarot-api';
import { getRequestLocale } from '@/src/i18n/locale';
import { getMessages } from '@/src/i18n/messages';
import { AppLocale } from '@/src/i18n/shared';

export const dynamic = 'force-dynamic';

type ReadingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatReadingTime(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function hasPositionInsights(
  interpretation: unknown,
): interpretation is ThreeCardInterpretation {
  return (
    typeof interpretation === 'object' &&
    interpretation !== null &&
    'positionInsights' in interpretation
  );
}

function getOrientationLabel(
  orientation: 'upright' | 'reversed',
  locale: AppLocale,
) {
  if (locale === 'zh') {
    return orientation === 'upright' ? '正位' : '逆位';
  }

  return orientation === 'upright' ? 'Upright' : 'Reversed';
}

export async function generateMetadata({ params }: ReadingPageProps) {
  const { id } = await params;

  return {
    title: `Reading ${id.slice(0, 8)}`,
  };
}

export default async function ReadingPage({ params }: ReadingPageProps) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const { id } = await params;
  const result = await getReading(id, locale)
    .then((reading) => ({ reading, error: null as null | unknown }))
    .catch((error: unknown) => ({ reading: null, error }));

  if (result.error) {
    const description =
      result.error instanceof ApiError && result.error.status === 404
        ? messages.reading.errorDescriptionNotFound
        : messages.reading.errorDescriptionApi;

    return (
      <StatePanel
        tone="error"
        eyebrow={messages.reading.errorEyebrow}
        title={messages.reading.errorTitle}
        description={description}
      />
    );
  }

  if (!result.reading) {
    return null;
  }

  const reading = result.reading;
  const threeCardInterpretation = hasPositionInsights(reading.interpretation)
    ? reading.interpretation
    : null;
  const singleCardInterpretation = threeCardInterpretation
    ? null
    : reading.interpretation;

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)] md:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
          {messages.reading.resultEyebrow}
        </p>
        <h1 className="mt-4 font-display text-5xl text-[var(--color-foreground)]">
          {reading.spreadType === 'single'
            ? messages.reading.singleTitle
            : messages.reading.threeTitle}
        </h1>
        <div className="mt-6 grid gap-4 text-sm text-[var(--color-muted)] md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
              {messages.reading.question}
            </p>
            <p className="mt-2 leading-7">{reading.question}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
              {messages.reading.spread}
            </p>
            <p className="mt-2 leading-7">
              {reading.spreadType === 'single'
                ? messages.reading.spreadSingle
                : messages.reading.spreadThree}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
              {messages.reading.timestamp}
            </p>
            <p className="mt-2 leading-7">
              {formatReadingTime(reading.createdAt, locale)}
            </p>
          </div>
        </div>
      </section>

      {singleCardInterpretation ? (
        <>
          <section className="rounded-[1.8rem] border border-white/10 bg-[var(--color-panel)] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] lg:p-6">
            <div className="grid gap-8 lg:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)] lg:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                  {messages.reading.singleCardEyebrow}
                </p>
                <div className="mt-4 rounded-[1.6rem] border border-white/10 bg-black/10 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
                    {reading.cards[0].positionLabel}
                  </p>
                  <TarotCardVisual
                    locale={locale}
                    name={reading.cards[0].name}
                    imageUrl={reading.cards[0].imageUrl}
                    arcana={reading.cards[0].arcana}
                    suit={reading.cards[0].suit}
                    orientation={reading.cards[0].orientation}
                    className="mt-4 mx-auto w-full max-w-md"
                  />
                  <div className="mt-5">
                    <h2 className="font-display text-4xl text-[var(--color-foreground)]">
                      {reading.cards[0].name}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {getOrientationLabel(reading.cards[0].orientation, locale)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  {reading.cards[0].keywords.slice(0, 5).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <article className="rounded-[1.4rem] border border-white/10 bg-black/15 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
                    {messages.reading.contextEyebrow}
                  </p>
                  <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
                    {reading.cards[0].context}
                  </p>
                </article>

                <article className="rounded-[1.4rem] border border-white/10 bg-black/15 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
                    {messages.reading.meaningEyebrow}
                  </p>
                  <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
                    {reading.cards[0].meaning}
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                {messages.reading.combinedEyebrow}
              </p>
              <h2 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
                {messages.reading.combinedTitle}
              </h2>
              <div className="mt-6 space-y-5 text-sm leading-8 text-[var(--color-muted)]">
                <p>{singleCardInterpretation.deeperReading}</p>
                <p>{singleCardInterpretation.guidance}</p>
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                {messages.reading.reflectionEyebrow}
              </p>
              <h2 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
                {messages.reading.reflectionTitle}
              </h2>
              <p className="mt-6 text-sm leading-8 text-[var(--color-muted)]">
                {singleCardInterpretation.reflectionPrompt}
              </p>
            </article>
          </section>
        </>
      ) : null}

      {threeCardInterpretation ? (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            {reading.cards.map((card) => (
              <article
                key={`${card.slug}-${card.position}`}
                className="rounded-[1.8rem] border border-white/10 bg-[var(--color-panel)] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                    {card.positionLabel}
                  </p>
                  <TarotCardVisual
                    locale={locale}
                    name={card.name}
                    imageUrl={card.imageUrl}
                    arcana={card.arcana}
                    suit={card.suit}
                    orientation={card.orientation}
                    className="mt-4 mx-auto w-full max-w-md"
                  />
                </div>

                <div className="mt-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--color-accent)]/22 bg-black/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--color-accent-soft)]">
                      {getOrientationLabel(card.orientation, locale)}
                    </span>
                    {card.keywords.slice(0, 4).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
                    <p>{card.context}</p>
                    <p>{card.meaning}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                {messages.reading.combinedEyebrow}
              </p>
              <h2 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
                {messages.reading.combinedTitle}
              </h2>
              <div className="mt-6 space-y-5 text-sm leading-8 text-[var(--color-muted)]">
                <p>{threeCardInterpretation.deeperReading}</p>
                <p>{threeCardInterpretation.tensionOrTransition}</p>
                <p>{threeCardInterpretation.guidance}</p>
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                {messages.reading.reflectionEyebrow}
              </p>
              <h2 className="mt-4 font-display text-4xl text-[var(--color-foreground)]">
                {messages.reading.reflectionTitle}
              </h2>
              <p className="mt-6 text-sm leading-8 text-[var(--color-muted)]">
                {threeCardInterpretation.reflectionPrompt}
              </p>
            </article>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
              {messages.reading.positionEyebrow}
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {threeCardInterpretation.positionInsights.map((insight) => (
                <article
                  key={insight.position}
                  className="rounded-[1.5rem] border border-white/10 bg-black/15 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
                    {insight.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {insight.summary}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
