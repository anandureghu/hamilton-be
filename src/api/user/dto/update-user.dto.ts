import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { AtLeastOne } from 'src/common/decorators/at-least-one.decorator';

@AtLeastOne()
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Hamilton' })
  @IsOptional()
  @IsString()
  firstname?: string;

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
}
