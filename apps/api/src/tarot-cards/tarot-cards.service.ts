import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma, TarotCard } from '@prisma/client';
import { AppLocale } from '../common/locale';
import { PrismaService } from '../prisma/prisma.service';
import {
  getTarotCardCatalog,
  TAROT_CARD_CATALOG,
  TarotCatalogCard,
} from './tarot-catalog';

const CARD_FILTERS: Record<AppLocale, Array<{ id: string; label: string }>> = {
  en: [
    { id: 'all', label: 'All Cards' },
    { id: 'major', label: 'Major Arcana' },
    { id: 'cups', label: 'Cups' },
    { id: 'swords', label: 'Swords' },
    { id: 'wands', label: 'Wands' },
    { id: 'pentacles', label: 'Pentacles' },
  ],
  zh: [
    { id: 'all', label: '全部卡牌' },
    { id: 'major', label: '大阿尔卡那' },
    { id: 'cups', label: '圣杯' },
    { id: 'swords', label: '宝剑' },
    { id: 'wands', label: '权杖' },
    { id: 'pentacles', label: '星币' },
  ],
};

const FILTER_SORT_ORDER = new Map<string, number>([
  ['major', 0],
  ['cups', 1],
  ['wands', 2],
  ['swords', 3],
  ['pentacles', 4],
]);

@Injectable()
export class TarotCardsService implements OnModuleInit {
  private readonly logger = new Logger(TarotCardsService.name);
  private readonly migrationMessage =
    'Tarot tables are not ready yet. Run the Prisma migrations before using tarot endpoints.';
  private readonly localizedCatalog = {
    en: new Map(
      getTarotCardCatalog('en').map((card) => [card.slug, card] as const),
    ),
    zh: new Map(
      getTarotCardCatalog('zh').map((card) => [card.slug, card] as const),
    ),
  } satisfies Record<AppLocale, Map<string, TarotCatalogCard>>;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    await this.ensureCatalogSeeded();
  }

  async listCards(locale: AppLocale = 'en') {
    const cards = await this.getCatalogRecords();

    return {
      items: cards.map((card) => this.toCardSummary(card, locale)),
      total: cards.length,
      filters: CARD_FILTERS[locale],
    };
  }

  async getCardBySlug(slug: string, locale: AppLocale = 'en') {
    let card: TarotCard | null;

    try {
      card = await this.prisma.tarotCard.findUnique({
        where: { slug },
      });
    } catch (error) {
      this.rethrowIfMigrationMissing(error);
      throw error;
    }

    if (!card) {
      throw new NotFoundException(`Card "${slug}" was not found`);
    }

    return this.toCardDetail(card, locale);
  }

  async getDrawPool() {
    return this.getCatalogRecords();
  }

  private async ensureCatalogSeeded() {
    try {
      const existingCards = await this.prisma.tarotCard.findMany({
        select: { slug: true },
      });
      const existingSlugs = new Set(existingCards.map((card) => card.slug));
      const missingCards = TAROT_CARD_CATALOG.filter(
        (card) => !existingSlugs.has(card.slug),
      );

      if (missingCards.length === 0) {
        return;
      }

      await this.prisma.tarotCard.createMany({
        data: missingCards.map((card) => this.toCreateInput(card)),
      });

      this.logger.log(`Seeded ${missingCards.length} tarot cards`);
    } catch (error) {
      if (this.isMissingTableError(error)) {
        this.logger.warn(this.migrationMessage);
        return;
      }

      throw error;
    }
  }

  private async getCatalogRecords() {
    let cards: TarotCard[];

    try {
      cards = await this.prisma.tarotCard.findMany();
    } catch (error) {
      this.rethrowIfMigrationMissing(error);
      throw error;
    }

    return cards.sort((left, right) => this.sortCards(left, right));
  }

  private sortCards(left: TarotCard, right: TarotCard) {
    const leftKey =
      left.arcana === 'major' ? 'major' : (left.suit ?? 'pentacles');
    const rightKey =
      right.arcana === 'major' ? 'major' : (right.suit ?? 'pentacles');
    const byFilter =
      (FILTER_SORT_ORDER.get(leftKey) ?? 99) -
      (FILTER_SORT_ORDER.get(rightKey) ?? 99);

    if (byFilter !== 0) {
      return byFilter;
    }

    const byNumber = (left.number ?? 999) - (right.number ?? 999);

    if (byNumber !== 0) {
      return byNumber;
    }

    return left.name.localeCompare(right.name);
  }

  private toCreateInput(card: (typeof TAROT_CARD_CATALOG)[number]) {
    return {
      slug: card.slug,
      name: card.name,
      arcana: card.arcana,
      suit: card.suit,
      number: card.number,
      imageUrl: card.imageUrl,
      keywords: card.keywords,
      uprightMeaning: card.uprightMeaning,
      reversedMeaning: card.reversedMeaning,
      emotionalMeaning: card.emotionalMeaning,
      relationshipMeaning: card.relationshipMeaning,
      careerMeaning: card.careerMeaning,
      description: card.description,
    } satisfies Prisma.TarotCardCreateManyInput;
  }

  private getLocalizedCard(card: TarotCard, locale: AppLocale) {
    return this.localizedCatalog[locale].get(card.slug);
  }

  private toCardSummary(card: TarotCard, locale: AppLocale) {
    const localizedCard = this.getLocalizedCard(card, locale);

    return {
      id: card.id,
      slug: card.slug,
      name: localizedCard?.name ?? card.name,
      arcana: card.arcana,
      suit: card.suit,
      number: card.number,
      imageUrl: localizedCard?.imageUrl ?? card.imageUrl,
      keywords: localizedCard?.keywords ?? card.keywords,
      description: localizedCard?.description ?? card.description,
      filterKey: card.arcana === 'major' ? 'major' : card.suit,
    };
  }

  private toCardDetail(card: TarotCard, locale: AppLocale) {
    const localizedCard = this.getLocalizedCard(card, locale);

    return {
      id: card.id,
      slug: card.slug,
      name: localizedCard?.name ?? card.name,
      arcana: card.arcana,
      suit: card.suit,
      number: card.number,
      imageUrl: localizedCard?.imageUrl ?? card.imageUrl,
      keywords: localizedCard?.keywords ?? card.keywords,
      uprightMeaning: localizedCard?.uprightMeaning ?? card.uprightMeaning,
      reversedMeaning: localizedCard?.reversedMeaning ?? card.reversedMeaning,
      emotionalMeaning:
        localizedCard?.emotionalMeaning ?? card.emotionalMeaning,
      relationshipMeaning:
        localizedCard?.relationshipMeaning ?? card.relationshipMeaning,
      careerMeaning: localizedCard?.careerMeaning ?? card.careerMeaning,
      description: localizedCard?.description ?? card.description,
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
