import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { WinstonLoggerService } from '../../../logger/logger.service';
import { bookSlotForCustomerDto } from './dto/book-slot-for-customer.dto';
import { BookSlotResponseDto } from './dto/book-slot-response.dto';
import { BookingDto } from './dto/booking-response.dto';
import { GetAllSlotResponseDto } from './dto/get-all-slots-responsedto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { getAllAvailableSlotsQuery } from './query/get-all-available-slots.query';
import { getAllBookingQuery } from './query/get-all-booking.query';
import { insertBookingSlotQuery } from './query/insert-booking-slot.query';
import { updateBookingSlotQuery } from './query/update-booking-slot.query';

@Injectable()
export class SlotsAdminService {
  constructor(
    private readonly db: DatabaseService,
    private readonly logger: WinstonLoggerService,
  ) {
    if (typeof this.logger.setContext === 'function') {
      this.logger.setContext(SlotsAdminService.name);
    }
  }

  async getAllBookings(date: string): Promise<BookingDto[]> {
    try {
      const data = await this.db.query(getAllBookingQuery, [date]);
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

  async bookSlotForUser(
    body: bookSlotForCustomerDto,
    currentUser: string,
  ): Promise<BookSlotResponseDto[]> {
    try {
      const data = await this.db.query(insertBookingSlotQuery, [
        body.booking_date,
        body.slot,
        body.description || null,
        body.user,
        body.vehicle,
        body.service_type,
        currentUser,
        currentUser,
      ]);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error booking slot for user: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async updateBookedSlot(
    bookingId: string,
    data: Partial<UpdateBookingDto>,
    current: string,
  ): Promise<BookSlotResponseDto> {
    try {
      const [result] = await this.db.query(updateBookingSlotQuery, [
        data.booking_date || null,
        data.slot || null,
        data.description || null,
        data.vehicle || null,
        data.service_type || null,
        data.status || null,
        current,
        bookingId,
        data.user,
      ]);
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error updating booked slot: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async getAllAvailableSlots(date: string): Promise<GetAllSlotResponseDto[]> {
    try {
      const data = await this.db.query<GetAllSlotResponseDto>(
        getAllAvailableSlotsQuery,
        [date],
      );

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error: ${error.message}`, error.stack);
      } else {
        this.logger.error('An unknown error occurred in findById');
      }
      throw error;
    }
  }
}
