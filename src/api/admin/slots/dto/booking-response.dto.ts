import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsISO8601,
  IsNumber,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SlotDto {
  @ApiProperty({ example: 'f7d3e709-ca28-4e19-b7ba-1b77322256b0' })
  @IsUUID()
  slot_id: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  slot_timing: string;
}

class UserDto {
  @ApiProperty({ example: '02301bd5-ccfa-4fe5-b65c-3bee16a87962' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'Ajay' })
  @IsString()
  firstname: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  lastname: string;
}

class VehicleDto {
  @ApiProperty({ example: '3828650b-ce35-4a1c-b85a-d7d11ce64c57' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'KL-08Masd' })
  @IsString()
  license_plate: string;

  @ApiProperty({ example: 10001 })
  @IsNumber()
  odo_reading: number;

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  nickname: string | null;

  @ApiProperty({ example: 'camry' })
  @IsString()
  name: string;
}

class ServiceDto {
  @ApiProperty({ example: '95c493fc-1e62-41cb-9d00-600d4019c083' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'tyre work' })
  @IsString()
  name: string;
}

export class BookingDto {
  @ApiProperty({ example: '3c3389cc-9663-4350-9fc5-53cc55cb6b70' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: '2026-05-09T18:30:00.000Z' })
  @IsISO8601()
  booking_date: string;

  @ApiProperty({ type: () => SlotDto })
  @ValidateNested()
  @Type(() => SlotDto)
  slot_id: SlotDto;

  @ApiProperty({ example: 'just normal service' })
  @IsString()
  description: string;

  @ApiProperty({ type: () => UserDto })
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({ type: () => VehicleDto })
  @ValidateNested()
  @Type(() => VehicleDto)
  vehicle: VehicleDto;

  @ApiProperty({ type: () => ServiceDto })
  @ValidateNested()
  @Type(() => ServiceDto)
  service: ServiceDto;

  @ApiProperty({ example: 'confirmed' })
  @IsString()
  status: string;

  @ApiProperty({ example: '02301bd5-ccfa-4fe5-b65c-3bee16a87962' })
  @IsUUID()
  created_by: string;

  @ApiProperty({ example: '02301bd5-ccfa-4fe5-b65c-3bee16a87962' })
  @IsUUID()
  updated_by: string;

  @ApiProperty({ example: '2026-05-08T06:31:21.945Z' })
  @IsISO8601()
  created_at: string;

  @ApiProperty({ example: '2026-05-08T06:31:21.945Z' })
  @IsISO8601()
  updated_at: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  is_active: boolean;
}
