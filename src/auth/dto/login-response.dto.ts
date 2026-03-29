import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'hamilton@example.com' })
  email: string;

  @ApiProperty({ example: 'hamilton_dev', required: false })
  username?: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1Ni...',
    description: 'JWT Access Token used for Bearer Authentication',
  })
  access_token: string;
}
