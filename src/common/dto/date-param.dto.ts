import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DateParamDto {
  @ApiProperty({
    example: '2022-01-01',
    description: 'Date in YYYY-MM-DD format',
    required: true,
  })
  @IsNotEmpty()
  date: string;
}
