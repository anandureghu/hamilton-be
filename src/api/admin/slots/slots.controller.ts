import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CurrentuserDto } from 'src/auth/dto/current-user.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-response.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../auth/enums/role.enum';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { DateParamDto } from '../../../common/dto/date-param.dto';
import { bookSlotForCustomerDto } from './dto/book-slot-for-customer.dto';
import { BookSlotResponseDto } from './dto/book-slot-response.dto';
import { BookingDto } from './dto/booking-response.dto';
import { GetAllSlotResponseDto } from './dto/get-all-slots-responsedto';
import { SlotTimingDto } from './dto/get-all-slots.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SlotsAdminService } from './slots.service';

@ApiTags('Admin/Slots')
@ApiBearerAuth('JWT-auth')
@Controller('admin/slots')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
export class SlotsAdminController {
  constructor(private readonly slotsAdminService: SlotsAdminService) {}

  @ApiOperation({ summary: 'Get all booked slots (Admin)' })
  @ApiPaginatedResponse(BookingDto, true)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get('bookings')
  async getAllBookings(@Query() param: DateParamDto): Promise<BookingDto[]> {
    return this.slotsAdminService.getAllBookings(param.date);
  }

  @Post('booking')
  @ApiOperation({ summary: 'Book slot for user (Admin)' })
  @ApiPaginatedResponse(BookSlotResponseDto, true)
  @Roles(Role.ADMIN, Role.STAFF)
  async bookSlotForUser(
    @Body() body: bookSlotForCustomerDto,
    @CurrentUser() currentUser: CurrentuserDto,
  ): Promise<BookSlotResponseDto[]> {
    return this.slotsAdminService.bookSlotForUser(body, currentUser.id);
  }

  @ApiOperation({ summary: 'Update booked slot' })
  @ApiPaginatedResponse(BookSlotResponseDto)
  @Roles(Role.ADMIN, Role.STAFF)
  @Patch('booking/:id')
  async updateBookedSlot(
    @Param('id') param: string,
    @CurrentUser() user: CurrentuserDto,
    @Body() data: Partial<UpdateBookingDto>,
  ): Promise<BookSlotResponseDto> {
    return this.slotsAdminService.updateBookedSlot(param, data, user.id);
  }

  @ApiOperation({ summary: 'Get all available slots' })
  @ApiPaginatedResponse(SlotTimingDto, true)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllBrand(
    @Query() params: GetAllSlotResponseDto,
  ): Promise<GetAllSlotResponseDto[]> {
    return this.slotsAdminService.getAllAvailableSlots(params.date);
  }
}
