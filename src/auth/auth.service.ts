import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { GoogleUser } from './strategies/google.strategy';

interface UserEntity {
  id: string;
  email: string;
  role_id: number;
  firstname: string;
  lastname: string;
  google_id: string;
  image_url: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(googleUser: GoogleUser): Promise<LoginResponseDto> {
    const users = await this.db.query<UserEntity>(
      'SELECT * FROM t_user WHERE email = $1',
      [googleUser.email],
    );

    let user = users[0];

    if (!user) {
      const newUsers = await this.db.query<UserEntity>(
        `INSERT INTO t_user (google_id, email, firstname, lastname, image_url, username) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
          googleUser.googleId,
          googleUser.email,
          googleUser.firstName,
          googleUser.lastName,
          googleUser.picture,
          googleUser.email.split('@')[0],
        ],
      );
      user = newUsers[0];
    }

    if (!user) {
      throw new Error('Failed to retrieve or create user');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role_id,
      name: user.firstname,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
