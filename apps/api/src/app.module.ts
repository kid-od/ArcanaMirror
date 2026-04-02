import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TarotCardsModule } from './tarot-cards/tarot-cards.module';
import { ReadingsModule } from './readings/readings.module';

@Module({
  imports: [PrismaModule, AuthModule, TarotCardsModule, ReadingsModule],
  controllers: [AppController],
})
export class AppModule {}
