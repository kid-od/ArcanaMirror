'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { useCallback, useRef, useState, useTransition } from 'react';
import { useCoarsePointer } from '@/src/hooks/use-coarse-pointer';
import { useLocale } from '@/src/i18n/locale-provider';
import {
  createSingleReading,
  createThreeReading,
  ReadingResponse,
} from '@/src/lib/tarot-api';
import { RevealSequence } from './reveal-sequence';
import { RitualCarouselStage, RitualChapter } from './ritual-scroll-stage';

type DrawFlowProps = {
  spreadType: 'single' | 'three';
  title: string;
  description: string;
  prompts: readonly string[];
};

const chapters: RitualChapter[] = [
  'question',
  'descent',
  'shuffle',
  'seal',
  'reveal',
];

export function DrawFlow({
  spreadType,
  title,
  description,
  prompts,
}: DrawFlowProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const { locale, messages } = useLocale();
  const questionSectionRef = useRef<HTMLElement>(null);
  const ritualSectionRef = useRef<HTMLElement>(null);
  const revealSectionRef = useRef<HTMLElement>(null);
  const [question, setQuestion] = useState('');
  const [activeChapter, setActiveChapter] = useState<RitualChapter>('question');
  const [ritualStarted, setRitualStarted] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reading, setReading] = useState<ReadingResponse | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [isNavigating, startNavigation] = useTransition();
  const questionReady = question.trim().length >= 3;
  const readingReady = reading !== null;
  const reducedMotion = Boolean(prefersReducedMotion || isCoarsePointer);
  const chapterLabels: Record<RitualChapter, string> = messages.drawFlow.chapters;

  const resetRitualState = useCallback(
    (scrollToQuestion: boolean) => {
      setActiveChapter('question');
      setRitualStarted(false);
      setCanConfirm(false);
      setReading(null);
      setError('');
      setResetKey((current) => current + 1);

      if (scrollToQuestion) {
        questionSectionRef.current?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    },
    [reducedMotion],
  );

  const handleStageChange = useCallback(
    (chapter: Exclude<RitualChapter, 'question' | 'reveal'>) => {
      if (readingReady) {
        return;
      }

      setRitualStarted(true);
      setActiveChapter(chapter);
      setCanConfirm(chapter === 'seal');
      setError('');
    },
    [readingReady],
  );

  async function handleSealDraw() {
    if (!questionReady) {
      setError(messages.drawFlow.errors.questionRequired);
      return;
    }

    if (!canConfirm || isSubmitting || readingReady) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response =
        spreadType === 'single'
          ? await createSingleReading(question.trim(), locale)
          : await createThreeReading(question.trim(), locale);

      setReading(response);
      setActiveChapter('reveal');
      setCanConfirm(true);
      window.requestAnimationFrame(() => {
        revealSectionRef.current?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : messages.drawFlow.errors.readingUnavailable;

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleQuestionChange(nextQuestion: string) {
    if (
      nextQuestion !== question &&
      (ritualStarted || readingReady || error || canConfirm || activeChapter !== 'question')
    ) {
      resetRitualState(false);
    } else {
      setError('');
      setReading(null);
    }

    setQuestion(nextQuestion);
  }

  function handlePromptSelect(prompt: string) {
    setQuestion(prompt);
    resetRitualState(true);
  }

  function handleBeginRitual() {
    if (!questionReady) {
      setError(messages.drawFlow.errors.questionRequired);
      return;
    }

    setRitualStarted(true);
    setActiveChapter('descent');
    setError('');
    ritualSectionRef.current?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  return (
    <div className="space-y-8">
      <section
        ref={questionSectionRef}
        data-ritual-stage="question"
        style={{ scrollMarginTop: 'calc(var(--site-header-height) + 1rem)' }}
        className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(15,19,37,0.95),_rgba(28,33,56,0.9))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] md:p-6"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <div className="flex h-full flex-col">
            <p className="text-xs uppercase tracking-[0.38em] text-[var(--color-accent-soft)]">
              {messages.drawFlow.ritualFlow}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] text-[var(--color-foreground)] md:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              {chapters.map((chapter, index) => {
                const active = chapters.indexOf(activeChapter) >= index;

                return (
                  <div
                    key={chapter}
                    className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                      active
                        ? 'bg-[var(--color-panel-strong)] text-[var(--color-foreground)]'
                        : 'text-[var(--color-muted)]'
                    }`}
                  >
                    {chapterLabels[chapter]}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-[rgba(8,12,24,0.32)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                {messages.drawFlow.supportEyebrow}
              </p>
              <h2 className="mt-3 font-display text-[2rem] leading-[1.02] text-[var(--color-foreground)]">
                {messages.drawFlow.supportTitle}
              </h2>

              <div className="mt-5 space-y-3">
                {messages.drawFlow.supportItems.map((item, index) => (
                  <article
                    key={item.title}
                    className="rounded-[1.2rem] border border-white/10 bg-black/10 px-4 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-panel-strong)] text-xs tracking-[0.25em] text-[var(--color-accent-soft)]">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-medium text-[var(--color-foreground)]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-white/10 bg-[rgba(8,12,24,0.5)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
              {messages.drawFlow.stepOne}
            </p>
            <h2 className="mt-3 font-display text-[2.2rem] text-[var(--color-foreground)]">
              {messages.drawFlow.stepTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {messages.drawFlow.stepDescription}
            </p>

            <label className="mt-5 block">
              <span className="sr-only">{messages.drawFlow.questionLabel}</span>
              <textarea
                value={question}
                onChange={(event) => handleQuestionChange(event.target.value)}
                rows={5}
                placeholder={messages.drawFlow.questionPlaceholder}
                className="w-full rounded-[1.45rem] border border-white/10 bg-[#0c1224] px-5 py-4 text-base text-[var(--color-foreground)] outline-none transition-colors placeholder:text-[rgba(224,214,198,0.45)] focus:border-[var(--color-accent)]/35"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptSelect(prompt)}
                  className="rounded-full border border-white/10 px-4 py-2 text-left text-sm text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-foreground)]"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleBeginRitual}
                disabled={!questionReady}
                className="inline-flex rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[#1a1524] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {messages.drawFlow.beginRitual}
              </button>
              <Link
                href="/cards"
                className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
              >
                {messages.drawFlow.exploreCardsFirst}
              </Link>
            </div>

            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {questionReady
                ? messages.drawFlow.questionReady
                : messages.drawFlow.questionNotReady}
            </p>
          </div>
        </div>
      </section>

      <section
        ref={ritualSectionRef}
        style={{ scrollMarginTop: 'calc(var(--site-header-height) + 1rem)' }}
      >
        <RitualCarouselStage
          key={resetKey}
          locale={locale}
          spreadType={spreadType}
          question={question}
          questionReady={questionReady}
          ritualStarted={ritualStarted}
          deckSeed={`${spreadType}:${resetKey}:${question.trim() || 'blank'}`}
          canConfirm={canConfirm}
          readingReady={readingReady}
          isSubmitting={isSubmitting}
          error={error}
          onSealDraw={handleSealDraw}
          onChapterChange={handleStageChange}
        />
      </section>

      <section
        ref={revealSectionRef}
        data-ritual-stage="reveal"
        style={{ scrollMarginTop: 'calc(var(--site-header-height) + 1rem)' }}
      >
        <RevealSequence
          locale={locale}
          spreadType={spreadType}
          reading={reading}
          isNavigating={isNavigating}
          onOpenReading={() => {
            if (!reading) {
              return;
            }

            startNavigation(() => {
              router.push(`/reading/${reading.id}`);
            });
          }}
        />
      </section>
    </div>
  );
}
