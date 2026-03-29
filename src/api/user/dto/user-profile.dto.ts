import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'hamilton_dev' })
  username: string;

  @ApiProperty({ example: 'Hamilton' })
  firstname: string;

  @ApiProperty({ example: 'Engineer', required: false })
  lastname?: string;

  @ApiProperty({ example: 'hamilton@example.com' })
  email: string;

  @ApiProperty({ example: 'male', enum: ['male', 'female', 'others'] })
  gender: string;

  @ApiProperty({ example: 'https://api.dicebear.com/...' })
  image_url: string;

  @ApiProperty({ example: 1, description: 'Role ID from m_role table' })
  role_id: number;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: '2026-03-25T10:00:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-03-25T10:00:00Z' })
  updated_at: Date;
}
