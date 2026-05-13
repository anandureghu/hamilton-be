import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { WinstonLoggerService } from '../../../logger/logger.service';

@Injectable()
export class VehicleServiceAdminService {
  constructor(
    private readonly db: DatabaseService,
    private readonly logger: WinstonLoggerService,
  ) {
    if (typeof this.logger.setContext === 'function') {
      this.logger.setContext(VehicleServiceAdminService.name);
    }
  }

  async getAllBookings(date: string): Promise<any> {
    try {
      const data = await this.db.query('getAllBookingQuery', [date]);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error fetching all bookings: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }
}
