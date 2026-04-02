'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useCoarsePointer } from '@/src/hooks/use-coarse-pointer';
import { getMessages } from '@/src/i18n/messages';
import { AppLocale } from '@/src/i18n/shared';

export type RitualChapter =
  | 'question'
  | 'descent'
  | 'shuffle'
  | 'seal'
  | 'reveal';

type RitualStage = Exclude<RitualChapter, 'question' | 'reveal'>;

type RitualScrollStageProps = {
  locale: AppLocale;
  spreadType: 'single' | 'three';
  question: string;
  questionReady: boolean;
  ritualStarted: boolean;
  deckSeed: string;
  canConfirm: boolean;
  readingReady: boolean;
  isSubmitting: boolean;
  error: string;
  onSealDraw: () => void;
  onChapterChange: (chapter: RitualStage) => void;
};

type DeckRibbonCard = {
  id: string;
  name: string;
  tilt: number;
  lift: number;
  accent: 'gold' | 'violet' | 'mist';
};

const majorArcana = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
] as const;

const minorRanks = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Page',
  'Knight',
  'Queen',
  'King',
] as const;

const minorSuits = ['Wands', 'Cups', 'Swords', 'Pentacles'] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function hashString(value: string) {
  let hash = 1779033703 ^ value.length;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return (hash >>> 0) || 1;
}

function createSeededRandom(seed: string) {
  let state = hashString(seed);

  return () => {
    state += 0x6d2b79f5;

    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);

    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleCards<T>(items: T[], random: () => number) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function createDeckRibbon(seed: string): DeckRibbonCard[] {
  const random = createSeededRandom(seed);
  const names = [
    ...majorArcana,
    ...minorSuits.flatMap((suit) => minorRanks.map((rank) => `${rank} of ${suit}`)),
  ];

  return shuffleCards(names, random).map((name, index) => ({
    id: `${slugify(name)}-${index}`,
    name,
    tilt: Math.round((random() * 16 - 8) * 10) / 10,
    lift: Math.round((random() * 12 - 6) * 10) / 10,
    accent: index % 3 === 0 ? 'gold' : index % 3 === 1 ? 'violet' : 'mist',
  }));
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getRibbonWindow(deck: DeckRibbonCard[], centerIndex: number, span: number) {
  return Array.from({ length: span * 2 + 1 }, (_, index) => {
    const offset = index - span;
    const deckIndex = wrapIndex(centerIndex + offset, deck.length);

    return {
      card: deck[deckIndex],
      deckIndex,
      offset,
    };
  });
}

function getQuestionExcerpt(
  question: string,
  questionReady: boolean,
  fallback: string,
) {
  if (!questionReady) {
    return fallback;
  }

  const trimmed = question.trim();

  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
}

function getStageCopy(
  locale: AppLocale,
  spreadType: 'single' | 'three',
  stage: RitualStage,
  selectedCount: number,
  requiredSelections: number,
) {
  const messages = getMessages(locale);
  const copy = messages.ritualStage.stageCopy;

  if (stage === 'descent') {
    return copy.descent;
  }

  if (stage === 'shuffle') {
    return {
      eyebrow:
        spreadType === 'single'
          ? copy.shuffleSingle.eyebrow
          : copy.shuffleThree.eyebrow,
      title:
        spreadType === 'single'
          ? copy.shuffleSingle.title
          : copy.shuffleThree.title,
      body:
        spreadType === 'single'
          ? copy.shuffleSingle.body
          : `${copy.shuffleThree.bodyPrefix}${requiredSelections}${copy.shuffleThree.bodyMiddle}${selectedCount} ${
              selectedCount === 1
                ? copy.shuffleThree.bodySingular
                : copy.shuffleThree.bodyPlural
            }${copy.shuffleThree.bodySuffix}`,
      cue:
        spreadType === 'single'
          ? copy.shuffleSingle.cue
          : copy.shuffleThree.cue,
    };
  }

  return {
    eyebrow:
      spreadType === 'single' ? copy.sealSingle.eyebrow : copy.sealThree.eyebrow,
    title:
      spreadType === 'single'
        ? copy.sealSingle.title
        : copy.sealThree.title,
    body:
      spreadType === 'single'
        ? copy.sealSingle.body
        : copy.sealThree.body,
    cue: spreadType === 'single' ? copy.sealSingle.cue : copy.sealThree.cue,
  };
}

function getProgressWidth(stage: RitualStage, selectedCount: number, requiredSelections: number) {
  if (stage === 'descent') {
    return '16%';
  }

  if (stage === 'shuffle') {
    const ratio = selectedCount / Math.max(requiredSelections, 1);
    return `${40 + ratio * 32}%`;
  }

  return '100%';
}

function DeckBack({
  locale,
  card,
  distance,
  selected,
  disabled,
  simplifiedMotion,
  onSelect,
}: {
  locale: AppLocale;
  card: DeckRibbonCard;
  distance: number;
  selected: boolean;
  disabled: boolean;
  simplifiedMotion: boolean;
  onSelect: () => void;
}) {
  const messages = getMessages(locale);
  const focusScale = distance === 0 ? 1 : distance === 1 ? 0.94 : distance === 2 ? 0.84 : 0.74;
  const focusOpacity = distance === 0 ? 1 : distance === 1 ? 0.78 : distance === 2 ? 0.48 : 0.22;
  const focusBlur = simplifiedMotion
    ? 'blur(0px)'
    : distance === 0
      ? 'blur(0px)'
      : distance === 1
        ? 'blur(0.9px)'
        : distance === 2
          ? 'blur(2px)'
          : 'blur(4px)';
  const accentClass =
    card.accent === 'gold'
      ? 'from-[rgba(200,169,94,0.28)]'
      : card.accent === 'violet'
        ? 'from-[rgba(143,120,214,0.24)]'
        : 'from-[rgba(118,152,195,0.18)]';

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled || selected}
      aria-label={
        selected
          ? `${card.name} ${messages.ritualStage.deck.alreadyDrawn}`
          : `${messages.ritualStage.deck.draw} ${card.name}`
      }
      animate={{
        rotate: selected ? card.tilt * 0.35 : card.tilt,
        y: selected ? -42 : card.lift,
        opacity: selected ? 0.16 : focusOpacity,
        scale: selected ? 0.86 : focusScale,
        filter: simplifiedMotion ? 'none' : selected ? 'blur(2px)' : focusBlur,
      }}
      transition={{
        duration: simplifiedMotion ? 0 : 0.34,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        !disabled && !selected && !simplifiedMotion && distance <= 1
          ? { y: card.lift - 6, scale: Math.min(focusScale + 0.04, 1.04) }
          : undefined
      }
      whileTap={
        !disabled && !selected && !simplifiedMotion
          ? { scale: focusScale * 0.97 }
          : undefined
      }
      style={{ zIndex: selected ? 1 : Math.max(3, 10 - distance) }}
      className="group relative block aspect-[3/5] w-[4.6rem] rounded-[1rem] bg-transparent p-0 text-left disabled:cursor-default sm:w-[5rem] lg:w-[5.4rem]"
    >
      <span className="sr-only">{card.name}</span>
      <div className="relative h-full overflow-hidden rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(10,14,26,0.98),_rgba(23,30,51,0.98))] shadow-[0_16px_34px_rgba(0,0,0,0.24)]">
        <div className={`absolute inset-0 bg-gradient-to-b ${accentClass} to-transparent opacity-80`} />
        <div className="absolute inset-[0.42rem] rounded-[0.8rem] border border-dashed border-[var(--color-accent)]/16" />
        <div className="absolute inset-x-0 top-[11%] flex justify-center gap-4 text-[7px] text-[var(--color-accent-soft)]/70">
          <span>+</span>
          <span>+</span>
          <span>+</span>
        </div>
        <div className="absolute inset-x-0 top-[18%] flex justify-center">
          <div className="h-10 w-10 rounded-full border border-[var(--color-accent)]/18 bg-[radial-gradient(circle,_rgba(200,169,94,0.18),_transparent_74%)]" />
        </div>
        <div className="absolute inset-x-0 top-[28%] flex justify-center">
          <div className="h-[4.5rem] w-[4.5rem] rounded-full border border-white/6" />
        </div>
        <div className="absolute inset-x-0 top-[39%] flex justify-center">
          <div className="h-4 w-4 rotate-45 border border-[var(--color-accent)]/16" />
        </div>
        <div className="absolute inset-x-[1rem] top-[56%] h-px bg-[linear-gradient(90deg,_transparent,_rgba(217,200,161,0.32),_transparent)]" />
        <div className="absolute inset-x-0 bottom-3 px-2 text-center">
          <p className="text-[7px] uppercase tracking-[0.32em] text-[var(--color-accent-soft)]">
            {messages.ritualStage.deck.brand}
          </p>
          <p className="mt-1.5 font-display text-[1rem] leading-tight text-[var(--color-foreground)]">
            {selected
              ? messages.ritualStage.trayDrawn
              : distance === 0
                ? messages.ritualStage.deck.choose
                : messages.ritualStage.deck.veiled}
          </p>
          <p className="mt-1 text-[8px] leading-4 text-[var(--color-muted)]">
            {selected
              ? messages.ritualStage.deck.resting
              : distance === 0
                ? messages.ritualStage.deck.clickCard
                : messages.ritualStage.deck.stayWithRibbon}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function SelectedTrayCard({
  locale,
  label,
  filled,
}: {
  locale: AppLocale;
  label: string;
  filled: boolean;
}) {
  const messages = getMessages(locale);

  return (
    <div className="rounded-[1rem] border border-white/10 bg-[rgba(8,12,24,0.56)] p-3">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-soft)]">
        {label}
      </p>
      <div className="mt-3 flex min-h-[5.9rem] items-center justify-center">
        {filled ? (
          <div className="relative aspect-[3/5] w-[4.3rem] overflow-hidden rounded-[0.9rem] border border-[var(--color-accent)]/20 bg-[linear-gradient(180deg,_rgba(12,18,36,0.96),_rgba(27,34,57,0.96))] shadow-[0_14px_30px_rgba(0,0,0,0.22)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(143,120,214,0.16),_transparent_44%),radial-gradient(circle_at_bottom,_rgba(200,169,94,0.14),_transparent_52%)]" />
            <div className="absolute inset-[0.4rem] rounded-[0.7rem] border border-dashed border-[var(--color-accent)]/16" />
            <div className="absolute inset-x-0 top-[31%] flex justify-center">
              <div className="h-8 w-8 rounded-full border border-[var(--color-accent)]/16 bg-[radial-gradient(circle,_rgba(200,169,94,0.16),_transparent_72%)]" />
            </div>
            <div className="absolute inset-x-0 top-[43%] flex justify-center">
              <div className="h-4 w-4 rotate-45 border border-[var(--color-accent)]/16" />
            </div>
            <div className="absolute inset-x-0 bottom-2.5 text-center">
              <p className="text-[7px] uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
                {messages.ritualStage.traySelected}
              </p>
              <p className="mt-1 font-display text-[0.86rem] text-[var(--color-foreground)]">
                {messages.ritualStage.trayDrawn}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[5.9rem] w-full items-center justify-center rounded-[0.9rem] border border-dashed border-white/10 bg-black/10 text-center text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
            {messages.ritualStage.trayWaiting}
          </div>
        )}
      </div>
    </div>
  );
}

export function RitualCarouselStage({
  locale,
  spreadType,
  question,
  questionReady,
  ritualStarted,
  deckSeed,
  canConfirm,
  readingReady,
  isSubmitting,
  error,
  onSealDraw,
  onChapterChange,
}: RitualScrollStageProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const messages = getMessages(locale);
  const simplifiedMotion = Boolean(prefersReducedMotion || isCoarsePointer);
  const requiredSelections = spreadType === 'single' ? 1 : 3;
  const deck = useMemo(() => createDeckRibbon(deckSeed), [deckSeed]);
  const slotLabels =
    spreadType === 'single'
      ? [messages.ritualStage.positions.single]
      : [
          messages.ritualStage.positions.past,
          messages.ritualStage.positions.present,
          messages.ritualStage.positions.future,
        ];
  const [selectedCards, setSelectedCards] = useState<DeckRibbonCard[]>([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const selectionCount = selectedCards.length;
  const stage: RitualStage =
    selectionCount >= requiredSelections ? 'seal' : hasInteracted ? 'shuffle' : 'descent';
  const stageCopy = getStageCopy(
    locale,
    spreadType,
    stage,
    selectionCount,
    requiredSelections,
  );
  const progressWidth = getProgressWidth(stage, selectionCount, requiredSelections);
  const visibleCards = getRibbonWindow(deck, centerIndex, 4);

  useEffect(() => {
    onChapterChange(stage);
  }, [onChapterChange, stage]);

  function stepRibbon(direction: 'prev' | 'next') {
    setHasInteracted(true);
    setCenterIndex((current) =>
      wrapIndex(current + (direction === 'next' ? 1 : -1), deck.length),
    );
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!questionReady || readingReady) {
      return;
    }

    const dominantDelta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    if (Math.abs(dominantDelta) < 8) {
      return;
    }

    stepRibbon(dominantDelta > 0 ? 'next' : 'prev');
  }

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } },
  ) {
    if (!questionReady || readingReady) {
      return;
    }

    const swipe = info.offset.x + info.velocity.x * 0.08;

    if (swipe <= -32) {
      stepRibbon('next');
    } else if (swipe >= 32) {
      stepRibbon('prev');
    }
  }

  function handleStageKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      stepRibbon('next');
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      stepRibbon('prev');
    }
  }

  function handleCardSelect(deckIndex: number) {
    if (!questionReady || readingReady || isSubmitting) {
      return;
    }

    setHasInteracted(true);

    const card = deck[deckIndex];

    setCenterIndex(deckIndex);
    setSelectedCards((current) => {
      if (current.find((item) => item.id === card.id) || current.length >= requiredSelections) {
        return current;
      }

      return [...current, card];
    });
  }

  return (
    <section className="ritual-stage-shell rounded-[2rem] border border-white/10 bg-[rgba(12,17,31,0.74)] p-4 shadow-[0_28px_110px_rgba(0,0,0,0.32)] sm:p-5 lg:p-6">
      <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <aside className="min-w-0 space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(8,12,24,0.56)] p-4">
            <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-accent-soft)]">
              {spreadType === 'single'
                ? messages.ritualStage.spreadSingle
                : messages.ritualStage.spreadThree}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-soft)]">
                  {messages.ritualStage.drawn}
                </p>
                <p className="mt-1 text-lg text-[var(--color-foreground)]">
                  {selectionCount} / {requiredSelections}
                </p>
              </div>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,_rgba(200,169,94,0.9),_rgba(143,120,214,0.9))]"
                  animate={{ width: progressWidth }}
                  transition={{
                    duration: simplifiedMotion ? 0 : 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(6,9,18,0.34)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-soft)]">
              {stageCopy.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[1.95rem] leading-[0.96] text-[var(--color-foreground)]">
              {stageCopy.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {stageCopy.body}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
              {stageCopy.cue}
            </p>
          </div>

          <div className="rounded-[1.45rem] border border-white/10 bg-[rgba(6,9,18,0.28)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
              {messages.ritualStage.yourQuestion}
            </p>
            <p className="mt-3 font-display text-[1.5rem] leading-tight text-[var(--color-foreground)]">
              {getQuestionExcerpt(
                question,
                questionReady,
                messages.drawFlow.questionNotReady,
              )}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {!questionReady
                ? messages.ritualStage.questionPending
                : stage === 'descent'
                  ? messages.ritualStage.questionDescent
                  : stage === 'shuffle'
                    ? locale === 'zh'
                      ? `继续转动牌带，再抽出 ${requiredSelections - selectionCount} 张牌。`
                      : `Keep turning and draw ${
                          requiredSelections - selectionCount
                        } more ${requiredSelections - selectionCount === 1 ? 'card' : 'cards'}.`
                    : spreadType === 'single'
                      ? messages.ritualStage.questionSealSingle
                      : messages.ritualStage.questionSealThree}
            </p>
            {!ritualStarted && questionReady ? (
              <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
                {messages.ritualStage.chamberAwake}
              </p>
            ) : null}
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(143,120,214,0.16),_transparent_34%),radial-gradient(circle_at_20%_80%,_rgba(200,169,94,0.14),_transparent_28%),linear-gradient(180deg,_rgba(8,11,21,0.58),_rgba(9,13,24,0.92))] p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                  {messages.ritualStage.shufflingReel}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                  {messages.ritualStage.shufflingDescription}
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
                {messages.ritualStage.focus} {centerIndex + 1}
              </div>
            </div>

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={simplifiedMotion ? 0.02 : 0.08}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              onWheel={handleWheel}
              onKeyDown={handleStageKeyDown}
              tabIndex={0}
              style={{ touchAction: questionReady ? 'pan-y pinch-zoom' : 'auto' }}
              className="relative mt-5 rounded-[1.45rem] border border-white/10 bg-[rgba(6,9,18,0.34)] px-4 py-6 outline-none"
            >
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 -translate-y-1/3 bg-[radial-gradient(circle,_rgba(200,169,94,0.14),_transparent_72%)] ${simplifiedMotion ? '' : 'blur-2xl'}`} />
              <div className="relative flex h-[15rem] items-center justify-center overflow-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,_rgba(7,10,20,0.88),_transparent)]" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[linear-gradient(270deg,_rgba(7,10,20,0.88),_transparent)]" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[12rem] w-[8.5rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem] border border-[var(--color-accent)]/16 bg-[radial-gradient(circle,_rgba(200,169,94,0.12),_transparent_72%)] shadow-[0_0_70px_rgba(200,169,94,0.08)]" />

                {visibleCards.map(({ card, deckIndex, offset }) => (
                  <motion.div
                    key={`${card.id}-${deckIndex}`}
                    className="absolute left-1/2 top-1/2"
                    animate={{
                      x: offset * 58,
                      y: Math.abs(offset) * 5,
                    }}
                    transition={{
                      duration: simplifiedMotion ? 0 : 0.32,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ translateX: '-50%', translateY: '-50%' }}
                  >
                    <DeckBack
                      locale={locale}
                      card={card}
                      distance={Math.abs(offset)}
                      selected={selectedCards.some((item) => item.id === card.id)}
                      disabled={!questionReady || readingReady || isSubmitting}
                      simplifiedMotion={simplifiedMotion}
                      onSelect={() => handleCardSelect(deckIndex)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
              <div
                className={`grid gap-3 ${
                  spreadType === 'single' ? 'max-w-[8rem] grid-cols-1' : 'grid-cols-3'
                }`}
              >
                {slotLabels.map((label, index) => (
                  <SelectedTrayCard
                    key={label}
                    locale={locale}
                    label={label}
                    filled={Boolean(selectedCards[index])}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 md:flex-col">
                <button
                  type="button"
                  onClick={() => stepRibbon('prev')}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
                >
                  {messages.ritualStage.back}
                </button>
                <button
                  type="button"
                  onClick={() => stepRibbon('next')}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
                >
                  {messages.ritualStage.next}
                </button>
              </div>
            </div>
          </div>

          <div className="ritual-action-shell rounded-[1.5rem] border border-white/10 bg-[rgba(7,10,20,0.82)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                  {stageCopy.eyebrow}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {!questionReady
                    ? messages.ritualStage.questionPending
                    : readingReady
                      ? locale === 'zh'
                        ? '卡牌已经翻开，揭示区正在下方等你。'
                        : 'The cards have turned. The reveal is already waiting below.'
                      : canConfirm
                        ? spreadType === 'single'
                          ? messages.ritualStage.questionSealSingle
                          : messages.ritualStage.questionSealThree
                        : locale === 'zh'
                          ? `继续转动牌带，再抽出 ${requiredSelections - selectionCount} 张牌。`
                          : `Keep turning the ribbon and draw ${
                              requiredSelections - selectionCount
                            } more ${requiredSelections - selectionCount === 1 ? 'card' : 'cards'}.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/cards"
                  className="inline-flex rounded-full border border-white/10 px-4 py-3 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
                >
                  {messages.drawFlow.exploreCardsFirst}
                </Link>
                <button
                  type="button"
                  onClick={onSealDraw}
                  disabled={!questionReady || !canConfirm || isSubmitting || readingReady}
                  className="inline-flex justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-[#1a1524] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {readingReady
                    ? locale === 'zh'
                      ? '卡牌已翻开'
                      : 'Cards turned'
                    : isSubmitting
                      ? locale === 'zh'
                        ? '正在翻牌...'
                        : 'Turning the cards...'
                      : spreadType === 'single'
                        ? locale === 'zh'
                          ? '翻开这张牌'
                          : 'Turn the chosen card'
                        : locale === 'zh'
                          ? '翻开这组三张牌'
                          : 'Turn the chosen cards'}
                </button>
              </div>
            </div>

            {error ? (
              <p className="mt-4 text-sm leading-7 text-rose-200">{error}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
