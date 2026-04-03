import { CardSummary } from '@/src/lib/tarot-api';

export type RitualDeckCard = CardSummary & {
  deckId: string;
  tilt: number;
  lift: number;
  accent: 'gold' | 'violet' | 'mist';
};

function hashString(value: string) {
  let hash = 1779033703 ^ value.length;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return (hash >>> 0) || 1;
}

export function createSeededRandom(seed: string) {
  let state = hashString(seed);

  return () => {
    state += 0x6d2b79f5;

    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);

    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleCards<T>(items: readonly T[], random: () => number) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

export function createRitualDeck(cards: readonly CardSummary[], seed: string) {
  const random = createSeededRandom(seed);
  const shuffledCards = shuffleCards(cards, random);

  return shuffledCards.map((card, index) => ({
    ...card,
    deckId: `${card.id}-${index}`,
    tilt: Math.round((random() * 16 - 8) * 10) / 10,
    lift: Math.round((random() * 12 - 6) * 10) / 10,
    accent: index % 3 === 0 ? 'gold' : index % 3 === 1 ? 'violet' : 'mist',
  })) satisfies RitualDeckCard[];
}

export function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function getRibbonWindow<T>(
  deck: readonly T[],
  centerIndex: number,
  span: number,
) {
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
