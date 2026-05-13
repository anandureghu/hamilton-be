import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, Matches } from 'class-validator';

export class GetAllSlotResponseDto {
  @ApiProperty({
    example: '2026-06-30',
    description: 'The date to fetch slots for (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date!: string;
}
