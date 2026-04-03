'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TarotCardVisual } from '@/src/components/tarot-card-visual';
import { getMessages } from '@/src/i18n/messages';
import { AppLocale } from '@/src/i18n/shared';
import { CardSummary, ReadingResponse } from '@/src/lib/tarot-api';
import {
  GestureWorkerHand,
  GestureWorkerOutgoingMessage,
} from './gesture-worker-protocol';
import {
  createRitualDeck,
  getRibbonWindow,
  RitualDeckCard,
  wrapIndex,
} from './ritual-deck';

const HAND_WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm';
const HAND_MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const PINCH_START_THRESHOLD = 0.36;
const PINCH_END_THRESHOLD = 0.6;
const PINCH_MOVEMENT_LOCK_THRESHOLD = 0.46;
const PINCH_COOLDOWN_MS = 780;
const RIBBON_STEP_THRESHOLD = 0.048;
const RIBBON_MOVE_DEADZONE = 0.01;
const RIBBON_DELTA_CLAMP = 0.042;
const TRACKING_TIMEOUT_MS = 8000;

type RitualGestureModalProps = {
  locale: AppLocale;
  spreadType: 'single' | 'three';
  question: string;
  cards: CardSummary[];
  deckSeed: string;
  onClose: () => void;
  onFallback: (
    reason:
      | 'unsupported'
      | 'permission-denied'
      | 'tracking-lost'
      | 'manual'
      | 'initialization-failed',
  ) => void;
  onCreateReading: (selectedCardIds: string[]) => Promise<ReadingResponse>;
  onOpenReading: (readingId: string) => void;
};

type GestureCursor = {
  surfaceX: number;
  surfaceY: number;
  viewportX: number;
  viewportY: number;
};

type GestureModalStage =
  | 'booting'
  | 'selecting'
  | 'submitting'
  | 'revealing'
  | 'ready';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function supportsGestureMode() {
  return (
    typeof window !== 'undefined' &&
    typeof Worker !== 'undefined' &&
    typeof window.createImageBitmap === 'function' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    (window.isSecureContext ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  );
}

function getPinchRatio(hand: GestureWorkerHand) {
  const thumbTip = hand.landmarks[4];
  const indexTip = hand.landmarks[8];
  const indexBase = hand.landmarks[5];
  const pinkyBase = hand.landmarks[17];

  if (!thumbTip || !indexTip || !indexBase || !pinkyBase) {
    return 1;
  }

  const thumbToIndex = Math.hypot(
    thumbTip.x - indexTip.x,
    thumbTip.y - indexTip.y,
  );
  const palmWidth = Math.max(
    Math.hypot(indexBase.x - pinkyBase.x, indexBase.y - pinkyBase.y),
    0.001,
  );

  return thumbToIndex / palmWidth;
}

function GestureDeckCardButton({
  locale,
  card,
  offset,
  selected,
  highlighted,
  disabled,
  onSelect,
}: {
  locale: AppLocale;
  card: RitualDeckCard;
  offset: number;
  selected: boolean;
  highlighted: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const distance = Math.abs(offset);
  const scale = distance === 0 ? 1 : distance === 1 ? 0.94 : distance === 2 ? 0.84 : 0.72;
  const opacity =
    selected ? 0.2 : distance === 0 ? 1 : distance === 1 ? 0.8 : distance === 2 ? 0.46 : 0.24;
  const accentClass =
    card.accent === 'gold'
      ? 'from-[rgba(200,169,94,0.3)]'
      : card.accent === 'violet'
        ? 'from-[rgba(143,120,214,0.28)]'
        : 'from-[rgba(118,152,195,0.2)]';

  return (
    <motion.button
      type="button"
      data-gesture-action="select-card"
      data-card-id={card.id}
      onClick={onSelect}
      disabled={disabled || selected}
      animate={{
        x: offset * 60,
        y: selected ? -46 : Math.abs(offset) * 8 + card.lift,
        rotate: selected ? card.tilt * 0.4 : card.tilt,
        scale: highlighted ? Math.min(scale + 0.06, 1.08) : scale,
        opacity,
      }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ zIndex: selected ? 1 : Math.max(2, 12 - distance) }}
      className="absolute left-1/2 top-1/2 block aspect-[3/5] w-[4.8rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.05rem] bg-transparent p-0 text-left sm:w-[5.4rem] lg:w-[6rem]"
    >
      <div
        className={`relative h-full overflow-hidden rounded-[1.05rem] border ${
          highlighted
            ? 'border-[var(--color-accent)]/55'
            : 'border-white/10'
        } bg-[linear-gradient(180deg,_rgba(10,14,26,0.98),_rgba(23,30,51,0.98))] shadow-[0_16px_34px_rgba(0,0,0,0.24)]`}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${accentClass} to-transparent`} />
        <div className="absolute inset-[0.42rem] rounded-[0.78rem] border border-dashed border-[var(--color-accent)]/16" />
        <div className="absolute inset-x-0 top-[18%] flex justify-center">
          <div className="h-10 w-10 rounded-full border border-[var(--color-accent)]/18 bg-[radial-gradient(circle,_rgba(200,169,94,0.18),_transparent_74%)]" />
        </div>
        <div className="absolute inset-x-0 top-[30%] flex justify-center">
          <div className="h-[4rem] w-[4rem] rounded-full border border-white/6" />
        </div>
        <div className="absolute inset-x-0 top-[44%] flex justify-center">
          <div className="h-3.5 w-3.5 rotate-45 border border-[var(--color-accent)]/16" />
        </div>
        <div className="absolute inset-x-0 bottom-3 px-2 text-center">
          <p className="text-[8px] uppercase tracking-[0.3em] text-[var(--color-accent-soft)]">
            Arcana Mirror
          </p>
          <p className="mt-1 font-display text-[0.95rem] text-[var(--color-foreground)]">
            {selected
              ? locale === 'zh'
                ? '已选中'
                : 'Chosen'
              : distance === 0
                ? locale === 'zh'
                  ? '中心'
                  : 'Center'
                : locale === 'zh'
                  ? '未揭示'
                  : 'Veiled'}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function RevealCard({
  locale,
  card,
  backLabel,
  revealed,
  interactive,
  highlighted,
  onActivate,
}: {
  locale: AppLocale;
  card: ReadingResponse['cards'][number];
  backLabel: string;
  revealed: boolean;
  interactive: boolean;
  highlighted: boolean;
  onActivate: () => void;
}) {
  return (
    <motion.button
      type="button"
      data-gesture-action={interactive ? 'open-reading' : undefined}
      data-reading-action={interactive ? 'open-reading' : undefined}
      onClick={interactive ? onActivate : undefined}
      disabled={!interactive}
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      className="w-full rounded-[1.7rem] bg-transparent p-0 text-left"
    >
      <div className="[perspective:1400px]">
        <motion.div
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
          className="relative [transform-style:preserve-3d]"
        >
          <div className="[backface-visibility:hidden]">
            <TarotCardVisual
              locale={locale}
              mode="back"
              name={backLabel}
              label={backLabel}
              caption={locale === 'zh' ? '捏合即可翻开。' : 'Pinch to turn the card.'}
              className={`w-full ${highlighted ? 'ring-1 ring-[var(--color-accent)]/40' : ''}`}
            />
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <TarotCardVisual
              locale={locale}
              mode="reveal"
              name={card.name}
              imageUrl={card.imageUrl}
              arcana={card.arcana}
              suit={card.suit}
              orientation={card.orientation}
              className={`w-full ${highlighted ? 'ring-1 ring-[var(--color-accent)]/40' : ''}`}
            />
          </div>
        </motion.div>
      </div>
    </motion.button>
  );
}

export function RitualGestureModal({
  locale,
  spreadType,
  question,
  cards,
  deckSeed,
  onClose,
  onFallback,
  onCreateReading,
  onOpenReading,
}: RitualGestureModalProps) {
  const messages = getMessages(locale);
  const prefersReducedMotion = useReducedMotion();
  const requiredSelections = spreadType === 'single' ? 1 : 3;
  const deck = useMemo(() => createRitualDeck(cards, deckSeed), [cards, deckSeed]);
  const [stage, setStage] = useState<GestureModalStage>('booting');
  const [cursor, setCursor] = useState<GestureCursor | null>(null);
  const [selectedCards, setSelectedCards] = useState<RitualDeckCard[]>([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const [reading, setReading] = useState<ReadingResponse | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [statusText, setStatusText] = useState<string>(
    messages.drawFlow.gesture.statusBooting,
  );
  const [errorText, setErrorText] = useState('');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRequestRef = useRef<number | null>(null);
  const revealTimeoutsRef = useRef<number[]>([]);
  const workerReadyRef = useRef(false);
  const workerBusyRef = useRef(false);
  const prevXRef = useRef<number | null>(null);
  const motionAccumulatorRef = useRef(0);
  const pinchActiveRef = useRef(false);
  const lastPinchAtRef = useRef(0);
  const lastHandSeenAtRef = useRef<number>(0);
  const fallbackTriggeredRef = useRef(false);
  const handleSelectCardRef = useRef<(cardId: string) => void>(() => undefined);
  const stageRef = useRef<GestureModalStage>('booting');
  const selectedCountRef = useRef(0);
  const readingRef = useRef<ReadingResponse | null>(null);
  const centerIndexRef = useRef(0);
  const deckRef = useRef(deck);

  const visibleCards =
    deck.length === 0 ? [] : getRibbonWindow(deck, centerIndex, 4);
  const selectedIds = selectedCards.map((card) => card.id);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    selectedCountRef.current = selectedCards.length;
  }, [selectedCards.length]);

  useEffect(() => {
    readingRef.current = reading;
  }, [reading]);

  useEffect(() => {
    centerIndexRef.current = centerIndex;
  }, [centerIndex]);

  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);

  useEffect(() => {
    return () => {
      for (const timeoutId of revealTimeoutsRef.current) {
        window.clearTimeout(timeoutId);
      }

      if (frameRequestRef.current !== null) {
        window.cancelAnimationFrame(frameRequestRef.current);
      }

      workerRef.current?.postMessage({ type: 'dispose' });
      workerRef.current?.terminate();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!supportsGestureMode()) {
      fallbackTriggeredRef.current = true;
      onFallback('unsupported');
      return;
    }

    let cancelled = false;

    async function bootstrapGestureMode() {
      try {
        setStatusText(messages.drawFlow.gesture.statusPermission);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }

        const worker = new Worker(
          new URL('./hand-gesture.worker.ts', import.meta.url),
          { type: 'module' },
        );

        workerRef.current = worker;
        worker.onmessage = (
          event: MessageEvent<GestureWorkerOutgoingMessage>,
        ) => {
          const message = event.data;

          if (message.type === 'ready') {
            workerReadyRef.current = true;
            setCameraReady(true);
            setStage((currentStage) =>
              currentStage === 'booting' ? 'selecting' : currentStage,
            );
            setStatusText(messages.drawFlow.gesture.statusReady);
            return;
          }

          if (message.type === 'error') {
            workerBusyRef.current = false;

            if (message.fatal && !fallbackTriggeredRef.current) {
              fallbackTriggeredRef.current = true;
              onFallback('initialization-failed');
              return;
            }

            setStatusText(messages.drawFlow.gesture.statusSearching);
            return;
          }

          workerBusyRef.current = false;
          processHandResult(message.hand);
        };

        worker.postMessage({
          type: 'init',
          wasmPath: HAND_WASM_PATH,
          modelPath: HAND_MODEL_PATH,
        });
      } catch (error) {
        if (cancelled || fallbackTriggeredRef.current) {
          return;
        }

        fallbackTriggeredRef.current = true;

        if (
          error instanceof DOMException &&
          (error.name === 'NotAllowedError' || error.name === 'SecurityError')
        ) {
          onFallback('permission-denied');
          return;
        }

        onFallback('initialization-failed');
      }
    }

    function processHandResult(hand: GestureWorkerHand | null) {
      if (!surfaceRef.current) {
        return;
      }

      if (!hand) {
        prevXRef.current = null;
        motionAccumulatorRef.current = 0;
        setHoveredCardId(null);
        setHoveredAction(null);
        setStatusText(messages.drawFlow.gesture.statusSearching);
        return;
      }

      const indexTip = hand.landmarks[8];

      if (!indexTip) {
        prevXRef.current = null;
        motionAccumulatorRef.current = 0;
        return;
      }

      const rect = surfaceRef.current.getBoundingClientRect();
      const normalizedX = clamp(1 - indexTip.x, 0.04, 0.96);
      const normalizedY = clamp(indexTip.y, 0.06, 0.94);
      const surfaceX = normalizedX * rect.width;
      const surfaceY = normalizedY * rect.height;
      const viewportX = rect.left + surfaceX;
      const viewportY = rect.top + surfaceY;

      lastHandSeenAtRef.current = Date.now();
      setCursor({ surfaceX, surfaceY, viewportX, viewportY });
      setStatusText(messages.drawFlow.gesture.statusTracking);

      const pinchRatio = getPinchRatio(hand);
      const currentX = normalizedX;
      const previousX = prevXRef.current;
      const pinchIntent = pinchRatio <= PINCH_MOVEMENT_LOCK_THRESHOLD;

      if (
        previousX !== null &&
        stageRef.current === 'selecting' &&
        selectedCountRef.current < requiredSelections &&
        !pinchIntent
      ) {
        const deltaX = clamp(
          currentX - previousX,
          -RIBBON_DELTA_CLAMP,
          RIBBON_DELTA_CLAMP,
        );
        const adjustedDelta =
          Math.abs(deltaX) < RIBBON_MOVE_DEADZONE ? 0 : deltaX;

        motionAccumulatorRef.current = clamp(
          motionAccumulatorRef.current + adjustedDelta,
          -0.2,
          0.2,
        );

        if (motionAccumulatorRef.current >= RIBBON_STEP_THRESHOLD) {
          setCenterIndex((current) =>
            wrapIndex(current + 1, Math.max(deck.length, 1)),
          );
          motionAccumulatorRef.current = 0;
        } else if (motionAccumulatorRef.current <= -RIBBON_STEP_THRESHOLD) {
          setCenterIndex((current) =>
            wrapIndex(current - 1, Math.max(deck.length, 1)),
          );
          motionAccumulatorRef.current = 0;
        }
      } else if (pinchIntent) {
        motionAccumulatorRef.current = 0;
      }

      prevXRef.current = currentX;

      const pointElement = document.elementFromPoint(viewportX, viewportY);
      const actionElement =
        pointElement?.closest<HTMLElement>('[data-gesture-action]') ?? null;
      const zoneElement =
        pointElement?.closest<HTMLElement>('[data-gesture-zone]') ?? null;
      const cardId = actionElement?.dataset.cardId ?? null;
      const action = actionElement?.dataset.gestureAction ?? null;

      setHoveredCardId(cardId);
      setHoveredAction(action);
      const now = Date.now();

      if (
        !pinchActiveRef.current &&
        pinchRatio <= PINCH_START_THRESHOLD &&
        now - lastPinchAtRef.current > PINCH_COOLDOWN_MS
      ) {
        pinchActiveRef.current = true;
        lastPinchAtRef.current = now;
        triggerGestureAction(actionElement, zoneElement);
      } else if (pinchActiveRef.current && pinchRatio >= PINCH_END_THRESHOLD) {
        pinchActiveRef.current = false;
      }
    }

    function triggerGestureAction(
      actionElement?: HTMLElement | null,
      zoneElement?: HTMLElement | null,
    ) {
      const action = actionElement?.dataset.gestureAction;

      if (action === 'select-card') {
        const cardId = actionElement?.dataset.cardId;

        if (cardId) {
          handleSelectCardRef.current(cardId);
          return;
        }
      }

      if (
        stageRef.current === 'selecting' &&
        zoneElement?.dataset.gestureZone === 'deck-ribbon'
      ) {
        const centeredCard = deckRef.current[centerIndexRef.current];

        if (centeredCard) {
          handleSelectCardRef.current(centeredCard.id);
          return;
        }
      }

      if (
        action === 'open-reading' &&
        stageRef.current === 'ready' &&
        readingRef.current
      ) {
        onOpenReading(readingRef.current.id);
      }
    }

    bootstrapGestureMode();

    const frameLoop = async () => {
      const video = videoRef.current;
      const worker = workerRef.current;

      if (
        !cancelled &&
        video &&
        worker &&
        workerReadyRef.current &&
        !workerBusyRef.current &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        try {
          workerBusyRef.current = true;
          const bitmap = await createImageBitmap(video);

          worker.postMessage(
            {
              type: 'frame',
              bitmap,
              timestamp: performance.now(),
            },
            [bitmap],
          );
        } catch {
          workerBusyRef.current = false;
        }
      }

      frameRequestRef.current = window.requestAnimationFrame(frameLoop);
    };

    frameRequestRef.current = window.requestAnimationFrame(frameLoop);

    return () => {
      cancelled = true;
    };
  }, [
    deck.length,
    messages.drawFlow.gesture.statusPermission,
    messages.drawFlow.gesture.statusReady,
    messages.drawFlow.gesture.statusSearching,
    messages.drawFlow.gesture.statusTracking,
    onFallback,
    onOpenReading,
    requiredSelections,
  ]);

  useEffect(() => {
    if (!cameraReady || stage === 'ready' || fallbackTriggeredRef.current) {
      return;
    }

    const interval = window.setInterval(() => {
      if (
        lastHandSeenAtRef.current > 0 &&
        Date.now() - lastHandSeenAtRef.current > TRACKING_TIMEOUT_MS &&
        !fallbackTriggeredRef.current
      ) {
        fallbackTriggeredRef.current = true;
        onFallback('tracking-lost');
      }
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [cameraReady, onFallback, stage]);

  const scheduleRevealSequence = useCallback((nextReading: ReadingResponse) => {
    revealTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    revealTimeoutsRef.current = [];

    const steps = spreadType === 'single' ? 1 : nextReading.cards.length;

    for (let index = 0; index < steps; index += 1) {
      const timeoutId = window.setTimeout(
        () => {
          setRevealedCount(index + 1);

          if (index + 1 === steps) {
            pinchActiveRef.current = true;
            lastPinchAtRef.current = Date.now();
            setStage('ready');
            setStatusText(messages.drawFlow.gesture.statusRevealReady);
          }
        },
        prefersReducedMotion ? 0 : 220 + index * 520,
      );

      revealTimeoutsRef.current.push(timeoutId);
    }
  }, [
    messages.drawFlow.gesture.statusRevealReady,
    prefersReducedMotion,
    spreadType,
  ]);

  const submitReading = useCallback(async (nextSelectedCards: RitualDeckCard[]) => {
    try {
      setStage('submitting');
      setErrorText('');
      setRevealedCount(0);
      setStatusText(messages.drawFlow.gesture.statusTurning);

      const nextReading = await onCreateReading(
        nextSelectedCards.map((card) => card.id),
      );

      setReading(nextReading);
      setStage('revealing');
      scheduleRevealSequence(nextReading);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : messages.drawFlow.errors.readingUnavailable;

      setErrorText(message);
      setStage('selecting');
      setStatusText(messages.drawFlow.gesture.statusReady);
    }
  }, [
    messages.drawFlow.errors.readingUnavailable,
    messages.drawFlow.gesture.statusReady,
    messages.drawFlow.gesture.statusTurning,
    onCreateReading,
    scheduleRevealSequence,
  ]);

  const handleSelectCard = useCallback((cardId: string) => {
    if (stage !== 'selecting') {
      return;
    }

    const selectedCard = deck.find((card) => card.id === cardId);
    const selectedIndex = deck.findIndex((card) => card.id === cardId);

    if (!selectedCard || selectedIds.includes(cardId)) {
      return;
    }

    if (selectedIndex >= 0) {
      setCenterIndex(selectedIndex);
    }

    const nextSelection = [...selectedCards, selectedCard].slice(
      0,
      requiredSelections,
    );

    setSelectedCards(nextSelection);

    if (spreadType === 'single' || nextSelection.length === requiredSelections) {
      void submitReading(nextSelection);
    }
  }, [
    deck,
    requiredSelections,
    selectedCards,
    selectedIds,
    spreadType,
    stage,
    submitReading,
  ]);

  useEffect(() => {
    handleSelectCardRef.current = handleSelectCard;
  }, [handleSelectCard]);

  const revealCards = reading?.cards ?? [];
  const singleRevealCard = revealCards[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[rgba(5,8,15,0.82)] px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-6"
      >
        <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(9,13,24,0.96),_rgba(14,19,36,0.96))] shadow-[0_35px_120px_rgba(0,0,0,0.42)]">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                {messages.drawFlow.gesture.modalEyebrow}
              </p>
              <h2 className="mt-2 font-display text-[2rem] leading-none text-[var(--color-foreground)] sm:text-[2.4rem]">
                {spreadType === 'single'
                  ? messages.drawFlow.gesture.singleTitle
                  : messages.drawFlow.gesture.threeTitle}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onFallback('manual')}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
              >
                {messages.drawFlow.gesture.useFallback}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
              >
                {messages.drawFlow.gesture.close}
              </button>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-4 sm:p-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
            <aside className="space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(8,12,24,0.6)] p-4">
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-soft)]">
                  {messages.ritualStage.yourQuestion}
                </p>
                <p className="mt-3 font-display text-[1.45rem] leading-tight text-[var(--color-foreground)]">
                  {question.trim()}
                </p>
              </div>

              <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[rgba(6,9,18,0.34)]">
                <div className="relative aspect-[4/5] bg-[radial-gradient(circle_at_top,_rgba(143,120,214,0.18),_transparent_34%),linear-gradient(180deg,_rgba(10,15,28,0.96),_rgba(6,9,18,0.98))]">
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    autoPlay
                    className="h-full w-full scale-x-[-1] object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,_transparent,_rgba(6,9,18,0.92))] p-4">
                    <div className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
                      {statusText}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(6,9,18,0.34)] p-4">
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-accent-soft)]">
                  {messages.drawFlow.gesture.instructionsEyebrow}
                </p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
                  <p>{messages.drawFlow.gesture.instructionsMove}</p>
                  <p>{messages.drawFlow.gesture.instructionsPinch}</p>
                  <p>{messages.drawFlow.gesture.instructionsOpen}</p>
                </div>
              </div>

              {errorText ? (
                <div className="rounded-[1.5rem] border border-rose-300/20 bg-rose-950/20 p-4 text-sm leading-7 text-rose-100">
                  {errorText}
                </div>
              ) : null}
            </aside>

            <section className="min-w-0 space-y-4">
              <div
                ref={surfaceRef}
                className="relative min-h-[26rem] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(143,120,214,0.12),_transparent_30%),radial-gradient(circle_at_20%_80%,_rgba(200,169,94,0.14),_transparent_28%),linear-gradient(180deg,_rgba(8,11,21,0.58),_rgba(9,13,24,0.94))] p-4 sm:min-h-[32rem] sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-soft)]">
                      {messages.drawFlow.gesture.surfaceEyebrow}
                    </p>
                    <h3 className="mt-3 font-display text-[2rem] leading-none text-[var(--color-foreground)] sm:text-[2.5rem]">
                      {stage === 'ready'
                        ? messages.drawFlow.gesture.revealReadyTitle
                        : stage === 'revealing'
                          ? messages.drawFlow.gesture.revealingTitle
                          : stage === 'submitting'
                            ? messages.drawFlow.gesture.turningTitle
                            : spreadType === 'single'
                              ? messages.drawFlow.gesture.selectSingleTitle
                              : messages.drawFlow.gesture.selectThreeTitle}
                    </h3>
                  </div>

                  <div className="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent-soft)]">
                    {messages.ritualStage.drawn} {selectedCards.length} / {requiredSelections}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {reading && (stage === 'revealing' || stage === 'ready') ? (
                    <motion.div
                      key="reveal"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="mt-6"
                    >
                      {spreadType === 'single' && singleRevealCard ? (
                        <div className="mx-auto w-full max-w-[20rem] sm:max-w-[21rem] md:max-w-[22rem]">
                          <RevealCard
                            locale={locale}
                            card={singleRevealCard}
                            backLabel={messages.ritualStage.positions.single}
                            revealed={revealedCount >= 1}
                            interactive={stage === 'ready' && revealedCount >= 1}
                            highlighted={
                              stage === 'ready' && hoveredAction === 'open-reading'
                            }
                            onActivate={() => onOpenReading(reading.id)}
                          />
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-3">
                          {revealCards.map((card, index) => (
                            <div key={`${card.cardId}-${card.position}`}>
                              <p className="mb-3 text-xs uppercase tracking-[0.32em] text-[var(--color-accent-soft)]">
                                {card.positionLabel}
                              </p>
                              <RevealCard
                                locale={locale}
                                card={card}
                                backLabel={card.positionLabel}
                                revealed={revealedCount > index}
                                interactive={
                                  stage === 'ready' &&
                                  revealedCount === revealCards.length
                                }
                                highlighted={
                                  stage === 'ready' && hoveredAction === 'open-reading'
                                }
                                onActivate={() => onOpenReading(reading.id)}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-black/15 p-4 text-sm leading-7 text-[var(--color-muted)]">
                        {stage === 'ready'
                          ? messages.drawFlow.gesture.readyToOpen
                          : messages.drawFlow.gesture.revealingHint}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="selection"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="mt-6"
                    >
                      <div
                        data-gesture-zone="deck-ribbon"
                        className="relative h-[17rem] overflow-hidden rounded-[1.55rem] border border-white/10 bg-[rgba(6,9,18,0.34)] px-4 py-5 sm:h-[20rem]"
                      >
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,_rgba(7,10,20,0.88),_transparent)]" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[linear-gradient(270deg,_rgba(7,10,20,0.88),_transparent)]" />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[12rem] w-[8.6rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.45rem] border border-[var(--color-accent)]/16 bg-[radial-gradient(circle,_rgba(200,169,94,0.12),_transparent_72%)] shadow-[0_0_70px_rgba(200,169,94,0.08)]" />

                        {visibleCards.map(({ card, offset }) => (
                          <GestureDeckCardButton
                            locale={locale}
                            key={card.deckId}
                            card={card}
                            offset={offset}
                            selected={selectedIds.includes(card.id)}
                            highlighted={hoveredCardId === card.id}
                            disabled={
                              stage === 'submitting' ||
                              stage === 'revealing' ||
                              stage === 'ready'
                            }
                            onSelect={() => handleSelectCard(card.id)}
                          />
                        ))}
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
                        <div
                          className={`grid gap-3 ${
                            spreadType === 'single'
                              ? 'max-w-[9rem] grid-cols-1'
                              : 'grid-cols-3'
                          }`}
                        >
                          {(spreadType === 'single'
                            ? [messages.ritualStage.positions.single]
                            : [
                                messages.ritualStage.positions.past,
                                messages.ritualStage.positions.present,
                                messages.ritualStage.positions.future,
                              ]
                          ).map((label, index) => {
                            const filled = Boolean(selectedCards[index]);

                            return (
                              <div
                                key={label}
                                className="rounded-[1rem] border border-white/10 bg-[rgba(8,12,24,0.56)] p-3"
                              >
                                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-soft)]">
                                  {label}
                                </p>
                                <div className="mt-3">
                                  <TarotCardVisual
                                    locale={locale}
                                    mode="back"
                                    name={filled ? label : messages.ritualStage.trayWaiting}
                                    label={label}
                                    caption={
                                      filled
                                        ? messages.ritualStage.traySelected
                                        : messages.ritualStage.trayWaiting
                                    }
                                    details="compact"
                                    className={filled ? 'opacity-100' : 'opacity-70'}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-2 md:flex-col">
                          <button
                            type="button"
                            onClick={() =>
                              setCenterIndex((current) =>
                                wrapIndex(current - 1, Math.max(deck.length, 1)),
                              )
                            }
                            className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
                          >
                            {messages.ritualStage.back}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCenterIndex((current) =>
                                wrapIndex(current + 1, Math.max(deck.length, 1)),
                              )
                            }
                            className="rounded-full border border-white/10 px-4 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-white/6"
                          >
                            {messages.ritualStage.next}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {cursor ? (
                  <motion.div
                    animate={{
                      x: cursor.surfaceX - 16,
                      y: cursor.surfaceY - 16,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.12,
                      ease: 'linear',
                    }}
                    className="pointer-events-none absolute left-0 top-0 z-30 h-8 w-8 rounded-full border border-[var(--color-accent)]/60 bg-[radial-gradient(circle,_rgba(200,169,94,0.36),_rgba(143,120,214,0.16))] shadow-[0_0_24px_rgba(200,169,94,0.24)]"
                  />
                ) : null}
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(7,10,20,0.82)] p-4 text-sm leading-7 text-[var(--color-muted)]">
                {stage === 'submitting'
                  ? messages.drawFlow.gesture.turningHint
                  : stage === 'ready'
                    ? messages.drawFlow.gesture.readyHint
                    : spreadType === 'single'
                      ? messages.drawFlow.gesture.singleHint
                      : messages.drawFlow.gesture.threeHint}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
