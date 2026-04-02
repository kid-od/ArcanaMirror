import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSingleReadingDto {
  @IsString()
  @MinLength(3)
  @MaxLength(240)
  question: string;
}
