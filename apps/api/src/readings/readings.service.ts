import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma, Reading, TarotCard } from '@prisma/client';
import { AppLocale } from '../common/locale';
import { PrismaService } from '../prisma/prisma.service';
import {
  getTarotCardCatalog,
  TarotCatalogCard,
} from '../tarot-cards/tarot-catalog';
import { TarotCardsService } from '../tarot-cards/tarot-cards.service';
import { CreateSingleReadingDto } from './dto/create-single-reading.dto';
import { CreateThreeReadingDto } from './dto/create-three-reading.dto';

type Orientation = 'upright' | 'reversed';
type SpreadType = 'single' | 'three';
type Position = 'single' | 'past' | 'present' | 'future';

type DrawnCard = {
  cardId: string;
  slug: string;
  name: string;
  arcana: string;
  suit: string | null;
  number: number | null;
  imageUrl: string;
  keywords: string[];
  orientation: Orientation;
  position: Position;
  positionLabel: string;
  meaning: string;
  context: string;
};

type SingleInterpretation = {
  firstImpression: string;
  whatIsEmerging: string;
  deeperReading: string;
  guidance: string;
  reflectionPrompt: string;
};

type ThreeCardInterpretation = {
  firstImpression: string;
  whatIsEmerging: string;
  deeperReading: string;
  tensionOrTransition: string;
  guidance: string;
  reflectionPrompt: string;
  positionInsights: Array<{
    position: Position;
    title: string;
    summary: string;
  }>;
};

const POSITION_CONTENT: Record<
  AppLocale,
  Record<Exclude<Position, 'single'>, { label: string; context: string }>
> = {
  en: {
    past: {
      label: 'Past',
      context: 'This position reflects what has shaped the question so far.',
    },
    present: {
      label: 'Present',
      context: 'This position speaks to what is most alive right now.',
    },
    future: {
      label: 'Future',
      context: 'This position suggests the energy that may unfold next.',
    },
  },
  zh: {
    past: {
      label: '过去',
      context: '这个位置映照的是，到目前为止是什么塑造了你的问题。',
    },
    present: {
      label: '现在',
      context: '这个位置描述的是，此刻最鲜活、最需要被看见的部分。',
    },
    future: {
      label: '未来',
      context: '这个位置提示的是，接下来可能展开的能量或趋势。',
    },
  },
};

const SINGLE_POSITION_CONTENT: Record<
  AppLocale,
  { label: string; context: string }
> = {
  en: {
    label: 'The Card',
    context:
      'This single card reflects the clearest symbolic energy around your question.',
  },
  zh: {
    label: '这张牌',
    context: '这张单牌映照的是，围绕你问题最清晰、最核心的象征性能量。',
  },
};

const SUIT_THEMES: Record<AppLocale, Record<string, string>> = {
  en: {
    major: 'a larger cycle of inner growth and meaningful transition',
    cups: 'emotional honesty, intuition, and relationship to feeling',
    swords: 'clarity, discernment, and the courage to name truth',
    wands: 'creative momentum, desire, and brave forward movement',
    pentacles: 'grounding, practical care, and sustainable support',
  },
  zh: {
    major: '一段更大的内在成长周期，以及带有意义的过渡',
    cups: '对感受的诚实、直觉，以及你与情绪之间的关系',
    swords: '清晰、辨明，以及说出真相的勇气',
    wands: '创造性的动能、欲望，以及勇敢向前的推进',
    pentacles: '落地感、实际照料，以及可持续的支持',
  },
};

const SINGLE_PROMPTS: Record<AppLocale, string[]> = {
  en: [
    'What feeling needs a calmer name before you decide what comes next?',
    'Where might softness be more useful than urgency right now?',
    'What truth keeps returning, even when you try to move past it quickly?',
    'What would support you in trusting your own pace a little more?',
  ],
  zh: [
    '在决定下一步之前，哪种感受需要先被你更平静地命名？',
    '此刻，哪里可能更需要柔软，而不是着急？',
    '即使你想快点越过去，哪个真相仍在反复回来？',
    '什么会帮助你更信任自己的节奏一点？',
  ],
};

const THREE_CARD_PROMPTS: Record<AppLocale, string[]> = {
  en: [
    'How is the past still speaking through the choices you make today?',
    'What would it mean to meet the present without arguing with it?',
    'Which future possibility feels steady rather than merely dramatic?',
    'What pattern is ready to be understood before it is repeated?',
  ],
  zh: [
    '过去正如何透过你今天的选择继续发声？',
    '如果不再和当下对抗，而是去遇见它，会是什么样？',
    '哪一种未来的可能更稳，而不只是更戏剧化？',
    '哪个模式准备好在被重复之前，先被你好好理解？',
  ],
};

@Injectable()
export class ReadingsService {
  private readonly migrationMessage =
    'Reading tables are not ready yet. Run the Prisma migrations before using reading endpoints.';
  private readonly localizedCatalog = {
    en: new Map(
      getTarotCardCatalog('en').map((card) => [card.slug, card] as const),
    ),
    zh: new Map(
      getTarotCardCatalog('zh').map((card) => [card.slug, card] as const),
    ),
  } satisfies Record<AppLocale, Map<string, TarotCatalogCard>>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly tarotCardsService: TarotCardsService,
  ) {}

  async createSingle(dto: CreateSingleReadingDto, locale: AppLocale = 'en') {
    const [drawnCard] = await this.drawCards(1);
    const card = this.toDrawnCard(drawnCard, 'single', 'en');
    const interpretation = this.buildSingleInterpretation(
      dto.question,
      card,
      'en',
    );

    let reading: Reading;

    try {
      reading = await this.prisma.reading.create({
        data: {
          question: dto.question.trim(),
          spreadType: 'single',
          cardsJson: [card] as Prisma.InputJsonValue,
          interpretationJson: interpretation as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      this.rethrowIfMigrationMissing(error);
      throw error;
    }

    return this.serializeReading(reading, locale);
  }

  async createThree(dto: CreateThreeReadingDto, locale: AppLocale = 'en') {
    const positions: Array<Exclude<Position, 'single'>> = [
      'past',
      'present',
      'future',
    ];
    const drawnCards = await this.drawCards(3);
    const cards = drawnCards.map((card, index) =>
      this.toDrawnCard(card, positions[index], 'en'),
    );
    const interpretation = this.buildThreeCardInterpretation(
      dto.question,
      cards,
      'en',
    );

    let reading: Reading;

    try {
      reading = await this.prisma.reading.create({
        data: {
          question: dto.question.trim(),
          spreadType: 'three',
          cardsJson: cards as Prisma.InputJsonValue,
          interpretationJson: interpretation as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      this.rethrowIfMigrationMissing(error);
      throw error;
    }

    return this.serializeReading(reading, locale);
  }

  async getReadingById(id: string, locale: AppLocale = 'en') {
    let reading: Reading | null;

    try {
      reading = await this.prisma.reading.findUnique({
        where: { id },
      });
    } catch (error) {
      this.rethrowIfMigrationMissing(error);
      throw error;
    }

    if (!reading) {
      throw new NotFoundException(`Reading "${id}" was not found`);
    }

    return this.serializeReading(reading, locale);
  }

  private async drawCards(count: number) {
    const pool = [...(await this.tarotCardsService.getDrawPool())];

    if (pool.length < count) {
      throw new InternalServerErrorException(
        'The tarot catalog is not ready for drawing yet.',
      );
    }

    for (let index = pool.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
    }

    return pool.slice(0, count).map((card) => ({
      card,
      orientation:
        Math.random() < 0.3 ? 'reversed' : ('upright' as Orientation),
    }));
  }

  private toDrawnCard(
    selection: { card: TarotCard; orientation: Orientation },
    position: Position,
    locale: AppLocale,
  ): DrawnCard {
    const positionMeta =
      position === 'single'
        ? SINGLE_POSITION_CONTENT[locale]
        : POSITION_CONTENT[locale][position];

    return {
      cardId: selection.card.id,
      slug: selection.card.slug,
      name: selection.card.name,
      arcana: selection.card.arcana,
      suit: selection.card.suit,
      number: selection.card.number,
      imageUrl: selection.card.imageUrl,
      keywords: selection.card.keywords,
      orientation: selection.orientation,
      position,
      positionLabel: positionMeta.label,
      meaning:
        selection.orientation === 'upright'
          ? selection.card.uprightMeaning
          : selection.card.reversedMeaning,
      context: positionMeta.context,
    };
  }

  private buildSingleInterpretation(
    question: string,
    card: DrawnCard,
    locale: AppLocale,
  ): SingleInterpretation {
    const theme = this.getThemeLabel(card, locale);

    if (locale === 'zh') {
      return {
        firstImpression: `最先浮现的是：${card.name}把你的问题带回${theme}。`,
        whatIsEmerging: `这张牌先带出来的，是关于${theme}的底色。它不急着替你下结论，而是邀请你先停留在此刻真正需要被看见的部分。`,
        deeperReading: `围绕“${question.trim()}”这个问题，${card.name}像是在说：${card.meaning} 如果把它再往深处听，这次阅读关心的不是立刻得到答案，而是你能否更诚实地看见自己正在如何回应这件事。`,
        guidance:
          card.orientation === 'upright'
            ? '一个有帮助的下一步，也许是靠近那个安静却真实的感觉，而不是急着把它解释完整。'
            : '一个有帮助的下一步，也许是先放慢节奏，看看还有什么需要被更温柔地照看，再决定怎么行动。',
        reflectionPrompt: this.pickPrompt(
          question,
          [card],
          SINGLE_PROMPTS[locale],
        ),
      };
    }

    return {
      firstImpression: `The first thing that surfaces is ${card.name} drawing your question back toward ${theme}.`,
      whatIsEmerging: `What arrives first is an atmosphere shaped by ${theme}. The card does not rush to hand you a conclusion; it asks you to stay with what most needs to be seen before you decide what it means.`,
      deeperReading: `Around the question "${question.trim()}", ${card.name} seems to say: ${card.meaning} Heard more deeply, this reading is less interested in a quick answer than in how honestly you can notice your own response to the situation.`,
      guidance:
        card.orientation === 'upright'
          ? 'A useful next step may be to stay close to what feels quietly true rather than over-explaining it.'
          : 'A useful next step may be to slow the pace and notice what still needs gentler attention before you act.',
      reflectionPrompt: this.pickPrompt(
        question,
        [card],
        SINGLE_PROMPTS[locale],
      ),
    };
  }

  private buildThreeCardInterpretation(
    question: string,
    cards: DrawnCard[],
    locale: AppLocale,
  ): ThreeCardInterpretation {
    const dominantTheme = this.getDominantTheme(cards, locale);
    const reversedCount = cards.filter(
      (card) => card.orientation === 'reversed',
    ).length;

    if (locale === 'zh') {
      return {
        firstImpression: `最先浮现的是，这组三张牌正把问题从${cards[0].positionLabel}一路带到${cards[2].positionLabel}，整体落在${dominantTheme}上。`,
        whatIsEmerging:
          reversedCount > 0
            ? '这不是一条笔直向前的线，而是一段边看见、边消化的过程。此刻更重要的，是先认出节奏与阻力，而不是急着锁定答案。'
            : '这组牌的流动相对连贯，像是在把一条已经成形的脉络慢慢递到你眼前。此刻更重要的，是看见它如何自然地一张张相接。',
        deeperReading: `围绕“${question.trim()}”这个问题，过去的位置让你看见是什么把你带到这里；现在的位置指出此刻真正活着的课题；未来的位置并不是结论，而是下一股可能展开的能量。整组牌把你带向${dominantTheme}，提醒你这次阅读更关心模式如何被理解，而不是结果如何被抢先定义。`,
        tensionOrTransition:
          reversedCount > 0
            ? '这段流动里仍有一部分在内在层面被慢慢消化，所以耐心和行动同样重要。'
            : '这组模式相对连贯，意味着只要你继续留在当下，洞见就有机会转成实际的推进。',
        guidance:
          '这组牌更倾向于邀请你先反思、再反应：尊重那些塑造过你的东西，听见此刻真实的部分，让下一步保持合乎比例。',
        reflectionPrompt: this.pickPrompt(
          question,
          cards,
          THREE_CARD_PROMPTS[locale],
        ),
        positionInsights: cards.map((card) => ({
          position: card.position,
          title: card.positionLabel,
          summary: `${card.context}${card.name}提示：${card.meaning}`,
        })),
      };
    }

    return {
      firstImpression: `The first thing that surfaces is this spread carrying the question from ${cards[0].positionLabel.toLowerCase()} toward ${cards[2].positionLabel.toLowerCase()}, with an overall tone of ${dominantTheme}.`,
      whatIsEmerging:
        reversedCount > 0
          ? 'This is not a perfectly straight line forward. It feels more like a process of seeing and digesting at once, where rhythm matters more than forcing an answer.'
          : 'The movement across the spread feels coherent, as if an existing pattern is slowly being placed in front of you. The invitation is to notice how naturally one card leads into the next.',
      deeperReading: `Around the question "${question.trim()}", the past position shows what brought you here, the present names what is most alive now, and the future does not offer a verdict so much as the next energy beginning to gather. The spread leans toward ${dominantTheme}, reminding you that this reading is interested in understanding the pattern before defining the outcome.`,
      tensionOrTransition:
        reversedCount > 0
          ? 'Some of this movement is still being processed internally, so patience matters as much as action.'
          : 'The pattern feels coherent, suggesting that insight can become movement if you stay grounded in the present.',
      guidance:
        'This spread points toward reflection before reaction: honor what has shaped you, listen to what is true now, and let the next step stay proportionate.',
      reflectionPrompt: this.pickPrompt(
        question,
        cards,
        THREE_CARD_PROMPTS[locale],
      ),
      positionInsights: cards.map((card) => ({
        position: card.position,
        title: card.positionLabel,
        summary: `${card.context} ${card.name} suggests ${this.lowercaseMeaning(
          card.meaning,
          locale,
        )}`,
      })),
    };
  }

  private getThemeLabel(card: DrawnCard, locale: AppLocale) {
    if (card.arcana === 'major') {
      return SUIT_THEMES[locale].major;
    }

    return SUIT_THEMES[locale][card.suit ?? 'pentacles'];
  }

  private getDominantTheme(cards: DrawnCard[], locale: AppLocale) {
    const counts = new Map<string, number>();

    for (const card of cards) {
      const key =
        card.arcana === 'major' ? 'major' : (card.suit ?? 'pentacles');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const dominantKey =
      [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ??
      'major';

    return SUIT_THEMES[locale][dominantKey];
  }

  private pickPrompt(question: string, cards: DrawnCard[], prompts: string[]) {
    const seed = `${question}:${cards.map((card) => card.slug).join(':')}`;
    let hash = 0;

    for (const character of seed) {
      hash = (hash << 5) - hash + character.charCodeAt(0);
      hash |= 0;
    }

    return prompts[Math.abs(hash) % prompts.length];
  }

  private lowercaseMeaning(value: string, locale: AppLocale) {
    if (locale === 'zh') {
      return value;
    }

    return value.charAt(0).toLowerCase() + value.slice(1);
  }

  private getLocalizedCatalogCard(slug: string, locale: AppLocale) {
    return this.localizedCatalog[locale].get(slug);
  }

  private localizeDrawnCard(card: DrawnCard, locale: AppLocale): DrawnCard {
    const localizedCard = this.getLocalizedCatalogCard(card.slug, locale);
    const positionMeta =
      card.position === 'single'
        ? SINGLE_POSITION_CONTENT[locale]
        : POSITION_CONTENT[locale][card.position];

    return {
      ...card,
      name: localizedCard?.name ?? card.name,
      imageUrl: localizedCard?.imageUrl ?? card.imageUrl,
      keywords: localizedCard?.keywords ?? card.keywords,
      positionLabel: positionMeta.label,
      context: positionMeta.context,
      meaning:
        card.orientation === 'upright'
          ? (localizedCard?.uprightMeaning ?? card.meaning)
          : (localizedCard?.reversedMeaning ?? card.meaning),
    };
  }

  private rebuildInterpretation(
    question: string,
    spreadType: SpreadType,
    cards: DrawnCard[],
    locale: AppLocale,
  ) {
    if (spreadType === 'single') {
      return this.buildSingleInterpretation(question, cards[0], locale);
    }

    return this.buildThreeCardInterpretation(question, cards, locale);
  }

  private serializeReading(reading: Reading, locale: AppLocale) {
    const rawCards = reading.cardsJson as DrawnCard[];
    const localizedCards = rawCards.map((card) =>
      this.localizeDrawnCard(card, locale),
    );
    const spreadType = reading.spreadType as SpreadType;

    return {
      id: reading.id,
      question: reading.question,
      spreadType,
      createdAt: reading.createdAt,
      cards: localizedCards,
      interpretation: this.rebuildInterpretation(
        reading.question,
        spreadType,
        localizedCards,
        locale,
      ),
    };
  }

  private isMissingTableError(error: unknown) {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2021'
    );
  }

  private rethrowIfMigrationMissing(error: unknown): asserts error is never {
    if (this.isMissingTableError(error)) {
      throw new ServiceUnavailableException(this.migrationMessage);
    }
  }
}
