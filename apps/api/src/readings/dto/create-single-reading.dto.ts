import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSingleReadingDto {
  @IsString()
  @MinLength(3)
  @MaxLength(240)
  question: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  selectedCardIds?: string[];
}
