import { Module } from '@nestjs/common';
import { TarotCardsModule } from '../tarot-cards/tarot-cards.module';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';

@Module({
  imports: [TarotCardsModule],
  controllers: [ReadingsController],
  providers: [ReadingsService],
})
export class ReadingsModule {}
