import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class bookSlotForCustomerDto {
  @ApiProperty({
    example: '2026-06-30',
    description: 'The date to fetch slots for (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  booking_date!: string;

  @ApiProperty({
    description: 'Slot ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  slot!: string;

  @ApiPropertyOptional({
    description: 'Additional booking notes',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Vehicle ID (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  vehicle!: string;

  @ApiProperty({
    description: 'Array of Service Type IDs (UUIDs)',
    type: [String],
    example: ['0f47ac5e-40ba-4783-9d48-34b1f36da12a'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  service_type!: string[];

  @ApiProperty({
    description: 'User ID (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  user!: string;
}
