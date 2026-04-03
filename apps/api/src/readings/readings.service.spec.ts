import { BadRequestException } from '@nestjs/common';
import { Reading, TarotCard } from '@prisma/client';
import { ReadingsService } from './readings.service';

function createTarotCard(overrides: Partial<TarotCard>): TarotCard {
  return {
    id: 'card-default',
    slug: 'default-card',
    name: 'Default Card',
    arcana: 'major',
    suit: null,
    number: 0,
    imageUrl: '/default.jpg',
    keywords: ['clarity'],
    uprightMeaning: 'Stay with the truth that is emerging.',
    reversedMeaning: 'Pause before naming what is not settled yet.',
    emotionalMeaning: 'Emotional meaning',
    relationshipMeaning: 'Relationship meaning',
    careerMeaning: 'Career meaning',
    description: 'A seeded test card.',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  };
}

describe('ReadingsService', () => {
  const deck = [
    createTarotCard({
      id: 'card-1',
      slug: 'the-fool',
      name: 'The Fool',
      number: 0,
    }),
    createTarotCard({
      id: 'card-2',
      slug: 'the-magician',
      name: 'The Magician',
      number: 1,
    }),
    createTarotCard({
      id: 'card-3',
      slug: 'the-star',
      name: 'The Star',
      number: 17,
    }),
    createTarotCard({
      id: 'card-4',
      slug: 'temperance',
      name: 'Temperance',
      number: 14,
    }),
  ];

  const prisma = {
    reading: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  const tarotCardsService = {
    getDrawPool: jest.fn(),
  };

  let service: ReadingsService;

  beforeEach(() => {
    prisma.reading.create.mockReset();
    prisma.reading.findUnique.mockReset();
    tarotCardsService.getDrawPool.mockReset();
    tarotCardsService.getDrawPool.mockResolvedValue(deck);
    prisma.reading.create.mockImplementation(
      async ({
        data,
      }: {
        data: {
          question: string;
          spreadType: 'single' | 'three';
          cardsJson: unknown;
          interpretationJson: unknown;
        };
      }) =>
        ({
          id: 'reading-1',
          question: data.question,
          spreadType: data.spreadType,
          cardsJson: data.cardsJson,
          interpretationJson: data.interpretationJson,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
        }) as Reading,
    );

    service = new ReadingsService(prisma as never, tarotCardsService as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps single-card creation working without selectedCardIds', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const reading = await service.createSingle(
      { question: 'What needs my attention?' },
      'en',
    );

    expect(reading.cards).toHaveLength(1);
    expect(reading.cards[0].cardId).toBe('card-2');
    expect(reading.cards[0].position).toBe('single');
  });

  it('keeps three-card creation working without selectedCardIds', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    const reading = await service.createThree(
      { question: 'What arc is unfolding?' },
      'en',
    );

    expect(reading.cards).toHaveLength(3);
    expect(reading.cards.map((card) => card.position)).toEqual([
      'past',
      'present',
      'future',
    ]);
  });

  it('uses the selected single card when selectedCardIds is provided', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);

    const reading = await service.createSingle(
      {
        question: 'What needs my attention?',
        selectedCardIds: ['card-3'],
      },
      'en',
    );

    expect(reading.cards.map((card) => card.cardId)).toEqual(['card-3']);
    expect(reading.cards[0].position).toBe('single');
  });

  it('uses selected three-card order for past, present, and future', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9);

    const reading = await service.createThree(
      {
        question: 'What arc is unfolding?',
        selectedCardIds: ['card-4', 'card-2', 'card-1'],
      },
      'en',
    );

    expect(reading.cards.map((card) => card.cardId)).toEqual([
      'card-4',
      'card-2',
      'card-1',
    ]);
    expect(reading.cards.map((card) => card.position)).toEqual([
      'past',
      'present',
      'future',
    ]);
  });

  it('rejects invalid single-card counts', async () => {
    await expect(
      service.createSingle(
        {
          question: 'What needs my attention?',
          selectedCardIds: [],
        },
        'en',
      ),
    ).rejects.toThrow(BadRequestException);

    await expect(
      service.createSingle(
        {
          question: 'What needs my attention?',
          selectedCardIds: ['card-1', 'card-2'],
        },
        'en',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects duplicate or unknown ids for three-card readings', async () => {
    await expect(
      service.createThree(
        {
          question: 'What arc is unfolding?',
          selectedCardIds: ['card-1', 'card-1', 'card-3'],
        },
        'en',
      ),
    ).rejects.toThrow(BadRequestException);

    await expect(
      service.createThree(
        {
          question: 'What arc is unfolding?',
          selectedCardIds: ['card-1', 'missing-card', 'card-3'],
        },
        'en',
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
