import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateThreeReadingDto {
  @IsString()
  @MinLength(3)
  @MaxLength(240)
  question: string;
}
