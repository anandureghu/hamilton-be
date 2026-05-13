import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddUserDto {
  @ApiPropertyOptional({ example: 'Hamilton' })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiPropertyOptional({ example: 'Hamilton' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'abc@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Dev' })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female', 'others'] })
  @IsOptional()
  @IsEnum(['male', 'female', 'others'])
  gender?: string;

  @ApiPropertyOptional({ example: '1998-01-01' })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiPropertyOptional({ example: 'https://avatar.url/image.png' })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiPropertyOptional({ example: '973642687687' })
  @IsNotEmpty()
  @MaxLength(12)
  @MinLength(10)
  @IsString()
  mobile_no!: string;

  @ApiPropertyOptional({ example: '973642687687' })
  @IsOptional()
  @MaxLength(12)
  @MinLength(10)
  @IsString()
  whatsapp_no?: string;

  @ApiPropertyOptional({ example: 'admin', enum: ['admin', 'staff', 'user'] })
  @IsOptional()
  @IsEnum(['admin', 'staff', 'user'])
  role_id?: string;

  @ApiPropertyOptional({ example: 'any specific details' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    example: '123, MG Road, Thrissur, Kerala, 680001, India',
    description: 'Full address of the user',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'KL-36-AB-1234' })
  @IsOptional()
  @IsString()
  license_plate?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Vehicle id from m_vehicle table',
  })
  @IsOptional()
  @IsUUID()
  vehicle: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsNumber()
  odo_reading: number;
}
