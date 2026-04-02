'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { TarotCardVisual } from '@/src/components/tarot-card-visual';

type RitualVisualStage = 'descent' | 'shuffle' | 'seal';

type CardBackStackProps = {
  spreadType: 'single' | 'three';
  stage: RitualVisualStage;
  questionReady: boolean;
  canConfirm: boolean;
  readingReady: boolean;
  onCardSelect?: () => void;
  interactionState?: 'idle' | 'advance' | 'draw';
};

type CardLayout = {
  x: string;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

const singleBacks = [
  { id: 'left', name: 'Outer Current', label: 'Outer Current' },
  { id: 'center', name: 'Central Draw', label: 'Central Draw' },
  { id: 'right', name: 'Hidden Current', label: 'Hidden Current' },
] as const;

const threeBacks = [
  { id: 'past', name: 'Past Position', label: 'Past Position' },
  { id: 'present', name: 'Present Position', label: 'Present Position' },
  { id: 'future', name: 'Future Position', label: 'Future Position' },
] as const;

function getLayout(
  spreadType: 'single' | 'three',
  stage: RitualVisualStage,
  index: number,
): CardLayout {
  if (spreadType === 'single') {
    const layouts: Record<RitualVisualStage, CardLayout[]> = {
      descent: [
        { x: '-14%', y: 24, rotate: -8, scale: 0.94, opacity: 0.86, zIndex: 1 },
        { x: '0%', y: 34, rotate: 2, scale: 0.92, opacity: 0.88, zIndex: 2 },
        { x: '14%', y: 24, rotate: 8, scale: 0.94, opacity: 0.86, zIndex: 1 },
      ],
      shuffle: [
        { x: '-24%', y: 8, rotate: -14, scale: 0.97, opacity: 0.92, zIndex: 1 },
        { x: '0%', y: -8, rotate: 0, scale: 1.01, opacity: 1, zIndex: 3 },
        { x: '24%', y: 8, rotate: 14, scale: 0.97, opacity: 0.92, zIndex: 1 },
      ],
      seal: [
        { x: '-30%', y: 20, rotate: -16, scale: 0.94, opacity: 0.9, zIndex: 1 },
        { x: '0%', y: -38, rotate: 0, scale: 1.08, opacity: 1, zIndex: 4 },
        { x: '30%', y: 20, rotate: 16, scale: 0.94, opacity: 0.9, zIndex: 1 },
      ],
    };

    return layouts[stage][index];
  }

  const layouts: Record<RitualVisualStage, CardLayout[]> = {
    descent: [
      { x: '-10%', y: 26, rotate: -8, scale: 0.94, opacity: 0.84, zIndex: 1 },
      { x: '0%', y: 34, rotate: 1, scale: 0.93, opacity: 0.9, zIndex: 2 },
      { x: '10%', y: 26, rotate: 8, scale: 0.94, opacity: 0.84, zIndex: 1 },
    ],
    shuffle: [
      { x: '-20%', y: 6, rotate: -10, scale: 0.98, opacity: 0.94, zIndex: 1 },
      { x: '0%', y: -4, rotate: 0, scale: 1, opacity: 1, zIndex: 3 },
      { x: '20%', y: 6, rotate: 10, scale: 0.98, opacity: 0.94, zIndex: 1 },
    ],
    seal: [
      { x: '-29%', y: -10, rotate: -10, scale: 0.99, opacity: 1, zIndex: 2 },
      { x: '0%', y: -20, rotate: 0, scale: 1.02, opacity: 1, zIndex: 3 },
      { x: '29%', y: -10, rotate: 10, scale: 0.99, opacity: 1, zIndex: 2 },
    ],
  };

  return layouts[stage][index];
}

function getCardMode(
  spreadType: 'single' | 'three',
  stage: RitualVisualStage,
  index: number,
): 'back' | 'partial' {
  if (stage === 'descent') {
    return 'back';
  }

  if (spreadType === 'single') {
    return stage === 'seal' && index === 1 ? 'partial' : 'back';
  }

  return stage === 'seal' || index === 1 ? 'partial' : 'back';
}

function getCaption(
  spreadType: 'single' | 'three',
  stage: RitualVisualStage,
  index: number,
) {
  if (stage === 'descent') {
    return 'Hold the question gently.';
  }

  if (spreadType === 'single') {
    return index === 1
      ? 'A single card is approaching the surface.'
      : 'The surrounding currents are still yielding space.';
  }

  return stage === 'seal'
    ? 'The position is ready to be turned.'
    : index === 1
      ? 'The spread is beginning to align itself.'
      : 'The position is almost ready.';
}

export function CardBackStack({
  spreadType,
  stage,
  questionReady,
  canConfirm,
  readingReady,
  onCardSelect,
  interactionState = 'idle',
}: CardBackStackProps) {
  const prefersReducedMotion = useReducedMotion();
  const cards = spreadType === 'single' ? singleBacks : threeBacks;
  const currentStage = readingReady ? 'seal' : stage;
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.54, ease: [0.22, 1, 0.36, 1] as const };
  const interactive =
    interactionState !== 'idle' && questionReady && !readingReady && Boolean(onCardSelect);
  const interactionLabel =
    interactionState === 'draw'
      ? 'Click this card to draw'
      : interactionState === 'advance'
        ? 'Click this card to continue the ritual'
        : 'Tarot card';

  return (
    <div className="relative h-[20rem] w-full max-w-[34rem] sm:h-[23rem] lg:h-[27rem]">
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(200,169,94,0.18),_transparent_72%)] blur-2xl"
        animate={{
          opacity: currentStage === 'descent' ? 0.22 : currentStage === 'shuffle' ? 0.34 : 0.48,
          scale: currentStage === 'descent' ? 0.84 : currentStage === 'shuffle' ? 0.98 : 1.08,
        }}
        transition={transition}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[12rem] w-[12rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(143,120,214,0.22),_transparent_70%)] blur-2xl"
        animate={{
          opacity: currentStage === 'descent' ? 0.14 : currentStage === 'shuffle' ? 0.28 : 0.4,
          scale: currentStage === 'descent' ? 0.9 : currentStage === 'shuffle' ? 1.04 : 1.14,
        }}
        transition={transition}
      />

      {cards.map((card, index) => {
        const layout = getLayout(spreadType, currentStage, index);
        const cardMode = getCardMode(spreadType, currentStage, index);

        return (
          <motion.div
            key={card.id}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: layout.zIndex }}
            animate={{
              x: layout.x,
              y: layout.y,
              rotate: layout.rotate,
              scale: questionReady ? layout.scale : layout.scale * 0.96,
              opacity: questionReady ? layout.opacity : Math.min(layout.opacity, 0.72),
            }}
            transition={transition}
          >
            {interactive ? (
              <motion.button
                type="button"
                onClick={onCardSelect}
                aria-label={interactionLabel}
                whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.01 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                className="cursor-pointer rounded-[1.85rem] bg-transparent p-0 text-left"
              >
                <TarotCardVisual
                  mode={cardMode}
                  name={card.name}
                  label={card.label}
                  details="compact"
                  caption={getCaption(spreadType, currentStage, index)}
                  className="w-[min(11.2rem,42vw)] sm:w-[12.5rem] lg:w-[14rem]"
                />
              </motion.button>
            ) : (
              <TarotCardVisual
                mode={cardMode}
                name={card.name}
                label={card.label}
                details="compact"
                caption={getCaption(spreadType, currentStage, index)}
                className="w-[min(11.2rem,42vw)] sm:w-[12.5rem] lg:w-[14rem]"
              />
            )}
          </motion.div>
        );
      })}

      <AnimatePresence>
        {spreadType === 'three' && currentStage !== 'descent' ? (
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-2 px-2"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: currentStage === 'seal' ? 1 : 0.72, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
            transition={transition}
          >
            {['Past', 'Present', 'Future'].map((position) => (
              <span
                key={position}
                className={`text-center text-[10px] uppercase tracking-[0.35em] ${
                  canConfirm
                    ? 'text-[var(--color-accent-soft)]'
                    : 'text-[rgba(217,200,161,0.72)]'
                }`}
              >
                {position}
              </span>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
