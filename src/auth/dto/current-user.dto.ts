import { IsEmail, IsNumber, IsUUID } from 'class-validator';

export class CurrentuserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsNumber()
  role: number;
}
