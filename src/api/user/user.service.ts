import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile.dto';
import { userUpdateQuery } from './query/user-update-query';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseService,
    private readonly logger: WinstonLoggerService,
  ) {
    if (typeof this.logger.setContext === 'function') {
      this.logger.setContext(UserService.name);
    }
  }

  async findById(id: string): Promise<UserProfileResponseDto> {
    try {
      const [user] = await this.db.query<UserProfileResponseDto>(
        `SELECT id, username, firstname, lastname, email, 
        gender, image_url, role_id, is_active, created_at, 
        updated_at
        FROM t_user WHERE id = $1 AND is_active = true`,
        [id],
      );

      if (!user) {
        throw new NotFoundException('User profile not found');
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`FindById Error: ${error.message}`, error.stack);
      } else {
        this.logger.error('An unknown error occurred in findById');
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    try {
      const { query, values } = userUpdateQuery(id, updateData);

      const [updatedUser] = await this.db.query<UserProfileResponseDto>(
        query,
        values,
      );

      if (!updatedUser) {
        throw new NotFoundException('User profile not found or update failed');
      }

      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Update Error: ${error.message}`, error.stack);
      } else {
        this.logger.error('An unknown error occurred in update');
      }
      throw error;
    }
  }
}
