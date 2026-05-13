import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { WinstonLoggerService } from '../../../logger/logger.service';
import { AddUserDto } from './dto/add-customer.dto';
import { CreateUserVehicleDto } from './dto/add-vehicle-user.dto';
import { UserVehicleResponseDto } from './dto/get-users-vehicle-response.dto';
import { UserVehicleDetailsResponseDto } from './dto/mobile-no.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserVehicleDto } from './dto/update-vehicle-user.dto';
import { UserProfileResponseDto } from './dto/user-profile.dto';
import { addCustomerQuery } from './query/add-customer.query';
import { addUserVehicleQuery } from './query/add-user-vehicle.query';
import { getVehicleListByUserId } from './query/get-vehicle-list-by-user-id.query';
import { searchUserByMobNoQuery } from './query/serch-user-by-mob.query';
import { userSoftDeleteQuery } from './query/user-soft-delete.query';
import { userUpdateQuery } from './query/user-update.query';
import { userVehicleUpdateQuery } from './query/user-vehicle-update.query';

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
        gender, address, image_url, role_id, is_active, created_at, 
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
        throw new NotFoundException('data not found or update failed');
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

  async softDeleteUserById(updateUserId: string, currentUserId: string) {
    try {
      const [updatedUser] = await this.db.query<UserProfileResponseDto>(
        userSoftDeleteQuery,
        [updateUserId, currentUserId],
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

  async getUserVehicleDetails(id: string): Promise<UserVehicleResponseDto[]> {
    try {
      const data = await this.db.query<UserVehicleResponseDto>(
        getVehicleListByUserId,
        [id],
      );

      return data.length ? data : [];
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`FindById Error: ${error.message}`, error.stack);
      } else {
        this.logger.error('An unknown error occurred in findById');
      }
      throw error;
    }
  }

  async addVehicleToUserProfile(
    customerId: string,
    body: CreateUserVehicleDto,
    userId: string,
  ): Promise<null> {
    try {
      await this.db.query<UserVehicleResponseDto>(addUserVehicleQuery, [
        body.name,
        body.note,
        body.license_plate,
        body.manufactured_year,
        body.odo_reading,
        body.vehicle_id,
        customerId,
        userId,
        userId,
      ]);

      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`FindById Error: ${error.message}`, error.stack);
      } else {
        this.logger.error('An unknown error occurred in findById');
      }
      throw error;
    }
  }

  async addCustomer(
    body: AddUserDto,
    userId: string,
  ): Promise<UserProfileResponseDto> {
    try {
      await this.db.query(`BEGIN;`);
      const [data] = await this.db.query<UserProfileResponseDto>(
        addCustomerQuery,
        [
          body.firstname,
          body.username,
          body.lastname,
          body.email,
          body.mobile_no,
          body.whatsapp_no,
          body.image_url,
          body.gender,
          body.dob,
          body.role_id,
          body.note,
          body.address,
          userId,
          userId,
        ],
      );
      if (!data.id) {
        await this.db.query(`ROLLBACK;`);
        throw new NotFoundException('data not found or update failed');
      }
      const [vehicleData] = await this.db.query<UserVehicleResponseDto>(
        addUserVehicleQuery,
        [
          body.license_plate || null,
          body.odo_reading || null,
          body.vehicle || null,
          data.id,
          userId,
        ],
      );
      if (!vehicleData.id) {
        await this.db.query(`ROLLBACK;`);
        throw new NotFoundException('data not found or update failed');
      }
      await this.db.query(`COMMIT;`);

      return data;
    } catch (error: unknown) {
      await this.db.query(`ROLLBACK;`);
      if (error instanceof Error) {
        this.logger.error(`FindById Error: ${error.message}`, error.stack);
      } else {
        this.logger.error('An unknown error occurred in findById');
      }
      throw error;
    }
  }

  async findUserDetailByMobNo(
    mob: string,
  ): Promise<UserVehicleDetailsResponseDto> {
    try {
      const [data] = await this.db.query<UserVehicleDetailsResponseDto>(
        searchUserByMobNoQuery,
        [mob],
      );

      if (!data) {
        throw new NotFoundException('User profile not found');
      }

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`FindById Error: ${error.message}`, error.stack);
      } else {
        this.logger.error('An unknown error occurred in findById');
      }
      throw error;
    }
  }

  async updateUsersVehicleDetails(
    vehicleId: string,
    body: UpdateUserVehicleDto,
    userId: string,
  ): Promise<any> {
    try {
      const { query, values } = userVehicleUpdateQuery(vehicleId, body, userId);
      const [data] = await this.db.query<UserVehicleResponseDto>(query, values);

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`FindById Error: ${error.message}`, error.stack);
      } else {
        this.logger.error('An unknown error occurred in findById');
      }
      throw error;
    }
  }
}
