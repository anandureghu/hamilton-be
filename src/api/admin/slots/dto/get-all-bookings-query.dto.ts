import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsUUID,
  Matches,
} from 'class-validator';

export class GetAllBookingsQueryDto {
  @ApiPropertyOptional({
    example: '2026-06-30',
    description: 'Filter by booking date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  date?: string;

  @ApiPropertyOptional({
    description: 'Filter by User ID (UUID)',
    example: '02301bd5-ccfa-4fe5-b65c-3bee16a87962',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;
}
