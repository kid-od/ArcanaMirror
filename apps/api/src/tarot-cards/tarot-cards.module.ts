import { Module } from '@nestjs/common';
import { TarotCardsController } from './tarot-cards.controller';
import { TarotCardsService } from './tarot-cards.service';

@Module({
  controllers: [TarotCardsController],
  providers: [TarotCardsService],
  exports: [TarotCardsService],
})
export class TarotCardsModule {}
