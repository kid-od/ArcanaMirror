'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCoarsePointer } from '@/src/hooks/use-coarse-pointer';
import { getMessages } from '@/src/i18n/messages';
import { AppLocale } from '@/src/i18n/shared';
import { ReadingResponse } from '@/src/lib/tarot-api';
import { TarotCardVisual } from '@/src/components/tarot-card-visual';

type RevealSequenceProps = {
  locale: AppLocale;
  spreadType: 'single' | 'three';
  reading: ReadingResponse | null;
  isNavigating: boolean;
  onOpenReading: () => void;
};

function getOrientationLabel(
  orientation: 'upright' | 'reversed',
  locale: AppLocale,
) {
  if (locale === 'zh') {
    return orientation === 'upright' ? '正位' : '逆位';
  }

  return orientation === 'upright' ? 'Upright' : 'Reversed';
}

export function RevealSequence({
  locale,
  spreadType,
  reading,
  isNavigating,
  onOpenReading,
}: RevealSequenceProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const messages = getMessages(locale);
  const reducedMotion = Boolean(prefersReducedMotion || isCoarsePointer);
  const revealTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.56, ease: [0.22, 1, 0.36, 1] as const };

  if (!reading) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
          {messages.reveal.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-5xl text-[var(--color-foreground)]">
          {messages.reveal.emptyTitle}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
          {messages.reveal.emptyDescription}
        </p>
      </section>
    );
  }

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={revealTransition}
      className="space-y-8 rounded-[2rem] border border-white/10 bg-[var(--color-panel)] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.26)] md:p-8"
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.reveal.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-5xl text-[var(--color-foreground)]">
            {spreadType === 'single'
              ? messages.reveal.singleTitle
              : messages.reveal.threeTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            {reading.interpretation.firstImpression}
          </p>
        </div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...revealTransition,
            delay: reducedMotion ? 0 : 0.08,
          }}
          className="rounded-[1.6rem] border border-white/10 bg-black/15 p-5"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.reveal.reflectionPrompt}
          </p>
          <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
            {reading.interpretation.reflectionPrompt}
          </p>
        </motion.div>
      </div>

      <div
        className={`grid gap-6 ${
          spreadType === 'single' ? 'justify-center' : 'md:grid-cols-3'
        }`}
      >
        <AnimatePresence initial={false}>
          {reading.cards.map((card, index) => (
            <motion.article
              key={`${card.slug}-${card.position}`}
              initial={reducedMotion ? false : { opacity: 0, y: 26, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                ...revealTransition,
                delay: reducedMotion ? 0 : index * 0.14,
              }}
              className={spreadType === 'single' ? 'mx-auto max-w-sm' : ''}
            >
              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...revealTransition,
                  delay: reducedMotion ? 0 : index * 0.14 + 0.04,
                }}
                className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]"
              >
                {card.positionLabel}
              </motion.p>

              <div className="[perspective:1200px]">
                <motion.div
                  initial={
                    reducedMotion
                      ? false
                      : { opacity: 0, rotateY: -14, transformOrigin: 'center center' }
                  }
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{
                    ...revealTransition,
                    delay: reducedMotion ? 0 : index * 0.14 + 0.1,
                  }}
                >
                  <TarotCardVisual
                    locale={locale}
                    mode="reveal"
                    name={card.name}
                    imageUrl={card.imageUrl}
                    arcana={card.arcana}
                    suit={card.suit}
                    orientation={card.orientation}
                    className="h-full"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...revealTransition,
                  delay: reducedMotion ? 0 : index * 0.14 + 0.18,
                }}
                className="mt-4 rounded-[1.35rem] border border-white/10 bg-black/15 p-4"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[var(--color-accent)]/22 bg-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[var(--color-accent-soft)]">
                    {getOrientationLabel(card.orientation, locale)}
                  </span>
                  {card.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)]"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {card.context}
                </p>
              </motion.div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.article
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...revealTransition,
            delay: reducedMotion ? 0 : 0.18,
          }}
          className="rounded-[1.6rem] border border-white/10 bg-black/15 p-5"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
            {messages.reveal.emergingEyebrow}
          </p>
          <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
            {reading.interpretation.whatIsEmerging}
          </p>
        </motion.article>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...revealTransition,
            delay: reducedMotion ? 0 : 0.24,
          }}
          className="flex flex-col justify-between gap-4 rounded-[1.6rem] border border-white/10 bg-black/15 p-5"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
              {messages.reveal.fullReading}
            </p>
            <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
              {messages.reveal.fullReadingDescription}
            </p>
          </div>
          <motion.button
            type="button"
            onClick={onOpenReading}
            disabled={isNavigating}
            whileHover={reducedMotion ? undefined : { y: -2 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            className="inline-flex w-fit rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-[#1a1524] transition-transform disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isNavigating
              ? messages.reveal.opening
              : messages.reveal.openFullReading}
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
