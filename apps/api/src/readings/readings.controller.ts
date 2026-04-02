import {
  Body,
  Controller,
  Get,
  MethodNotAllowedException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { normalizeLocale } from '../common/locale';
import { CreateSingleReadingDto } from './dto/create-single-reading.dto';
import { CreateThreeReadingDto } from './dto/create-three-reading.dto';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Get('single')
  singleGetNotAllowed() {
    throw new MethodNotAllowedException(
      'Use POST /readings/single with a JSON body to create a reading.',
    );
  }

  @Get('three')
  threeGetNotAllowed() {
    throw new MethodNotAllowedException(
      'Use POST /readings/three with a JSON body to create a reading.',
    );
  }

  @Post('single')
  createSingle(
    @Body() dto: CreateSingleReadingDto,
    @Query('locale') locale?: string,
  ) {
    return this.readingsService.createSingle(dto, normalizeLocale(locale));
  }

  @Post('three')
  createThree(
    @Body() dto: CreateThreeReadingDto,
    @Query('locale') locale?: string,
  ) {
    return this.readingsService.createThree(dto, normalizeLocale(locale));
  }

  @Get(':id')
  getReadingById(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.readingsService.getReadingById(id, normalizeLocale(locale));
  }
}
