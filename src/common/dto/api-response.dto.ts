import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<TData> {
  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty({ example: null, nullable: true })
  error: string | null;

  @ApiProperty({ example: 200 })
  statusCode: number;

  data: TData;
}
