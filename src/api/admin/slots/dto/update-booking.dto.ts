import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { AtLeastOne } from '../../../../common/decorators/at-least-one.decorator';

@AtLeastOne()
export class UpdateBookingDto {
  @ApiPropertyOptional({
    example: '2026-06-30',
    description: 'The date for the booking (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  booking_date?: string;

  @ApiPropertyOptional({
    description: 'Slot ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  slot?: string;

  @ApiPropertyOptional({
    description: 'User ID (UUID)',
  })
  @IsNotEmpty()
  @IsUUID()
  user!: string;

  @ApiPropertyOptional({
    description: 'Additional booking notes',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Vehicle ID (UUID)',
  })
  @IsOptional()
  @IsUUID()
  vehicle?: string;

  @ApiPropertyOptional({
    description: 'Service Type ID (UUID)',
  })
  @IsOptional()
  @IsUUID()
  service_type?: string;

  @ApiPropertyOptional({
    description: 'Status of the booking',
    example: 'cancelled',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
