import { Controller, Get, Param, Query } from '@nestjs/common';
import { normalizeLocale } from '../common/locale';
import { TarotCardsService } from './tarot-cards.service';

@Controller('cards')
export class TarotCardsController {
  constructor(private readonly tarotCardsService: TarotCardsService) {}

  @Get()
  listCards(@Query('locale') locale?: string) {
    return this.tarotCardsService.listCards(normalizeLocale(locale));
  }

  @Get(':slug')
  getCardBySlug(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.tarotCardsService.getCardBySlug(slug, normalizeLocale(locale));
  }
}
